import BaseCommand from "../../util/base-command"
import { flags } from "@oclif/command"
import fs from "fs-extra"
import Papa from "papaparse"
import _ from "lodash"
import { cli } from "cli-ux"
import yn from "yn"
import admin from "firebase-admin"
import { object, string, number, array, InferType } from "yup"
import shortid from "shortid"

const emailCsvSchema = object()
  .shape({
    name: string()
      .trim()
      .required(),
    email: string()
      .trim()
      .email(),
    cleanedName: string()
      .notRequired()
      .trim(),
    skip: string()
      .notRequired()
      .oneOf(["y", ""]),
    uniquePartyName: string()
      .notRequired()
      .trim(),
  })
  .strict(true)

type EmailCsv = InferType<typeof emailCsvSchema>

interface Email {
  name: string
  email: string
  uniquePartyName?: string
}

const MaxNumGuests = 11
const FirestoreChunkSize = 200

const partySchema = object()
  .transform(current => ({
    ...current,
    knownGuests: _.range(MaxNumGuests)
      .map(i => (current[`knownGuest${i + 1}`] || "").trim())
      .filter(guest => !!guest),
  }))
  .shape({
    code: string()
      .trim()
      .required()
      .test("is-shortid", "${path} is not a shortid", value =>
        shortid.isValid(value)
      ),
    uniquePartyName: string()
      .trim()
      .required(),
    partyName: string()
      .required()
      .trim(),
    preEvents: string()
      .notRequired()
      .oneOf(["y", ""]),
    numGuests: number()
      .required()
      .integer(),
    knownGuests: array().of(string().required()),
  })

interface Invitation {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  preEvents: boolean
}

interface Party extends Invitation {
  uniquePartyName: string
  emails: Email[]
}

export default class InviteUpdate extends BaseCommand {
  static description =
    "Generate invitation codes for a table of guest parties in Google Sheets."

  static examples = [
    `$ wedding-manager invite:update --spreadsheetId 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms --range 'Guest Parties!A:B'`,
  ]

  static flags = {
    ...BaseCommand.flags,
    parties: flags.string({
      description:
        "CSV containing party information from A+M wedding spreadsheet",
      required: true,
    }),
    emails: flags.string({
      description:
        "CSV containing email information from A+M wedding spreadsheet",
      required: true,
    }),
    listId: flags.string({
      description: "Mailchimp list ID for invitees",
      required: true,
    }),
    dryRun: flags.boolean({
      description: "Do not write records to any services",
    }),
  }

  async run() {
    const { flags } = this.parse(InviteUpdate)
    await this.initializeServices({ mailchimp: true, firebase: true })

    if (!this.mailchimp) {
      this.error("Mailchimp client not available")
    }

    cli.action.start("reading emails")
    const emailsContents = await fs.readFile(flags.emails, "utf-8")
    cli.action.stop()
    const emails: Email[] = _.chain(
      Papa.parse(emailsContents, { header: true, skipEmptyLines: true }).data
    )
      .map(obj => emailCsvSchema.validateSync(obj) as EmailCsv)
      // Skip emails manually marked for skipping (duplicates)
      .filter(email => !yn(email.skip))
      .map(email => ({
        name: (email.cleanedName || email.name).trim(),
        email: email.email.trim(),
        uniquePartyName: email.uniquePartyName
          ? email.uniquePartyName.trim()
          : undefined,
      }))
      .value()

    // Check for and alert on duplicate emails
    const emailCounts = _.countBy(emails, "email")
    const duplicateEmails = Object.keys(emailCounts).filter(
      key => emailCounts[key] > 1
    )
    if (duplicateEmails.length > 0) {
      this.error(`duplicate emails detected: ${duplicateEmails}`)
    }

    const emailsByUniquePartyName = _.groupBy(emails, "uniquePartyName")

    // Read guest information
    cli.action.start("reading guest information")
    const guestsContents = await fs.readFile(flags.parties, "utf-8")
    cli.action.stop()
    const guests: Party[] = _.chain(
      Papa.parse(guestsContents, {
        header: true,
        skipEmptyLines: true,
      }).data
    )
      .map(obj => partySchema.validateSync(obj))
      .map(
        ({
          code,
          uniquePartyName,
          partyName,
          numGuests,
          knownGuests,
          ...rest
        }) => ({
          code,
          uniquePartyName,
          partyName,
          numGuests,
          knownGuests,
          preEvents: !!yn(rest.preEvents),
          emails: emailsByUniquePartyName[uniquePartyName] || [],
        })
      )
      .value()

    const guestsByUniquePartyName = _.keyBy(guests, "uniquePartyName")

    // Validation for guests: known guest count is valid
    const invalidGuests = guests.filter(
      guest => guest.numGuests < guest.knownGuests.length
    )
    if (invalidGuests.length > 0) {
      this.error(
        `Invalid guest records (known guests exceed numGuests): ${invalidGuests.map(
          guest => guest.uniquePartyName
        )}`
      )
    }

    const emailIsSubscribed = (email: Email) =>
      email.uniquePartyName && email.uniquePartyName in guestsByUniquePartyName

    const mailchimpRecords = emails.map(email => {
      const subscribed = emailIsSubscribed(email)
      return {
        email_address: email.email,
        email_type: "html",
        status: subscribed ? "subscribed" : "unsubscribed",
        merge_fields: {
          NAME: email.name,
          WCODE:
            email.uniquePartyName && subscribed
              ? guestsByUniquePartyName[email.uniquePartyName].code
              : "empty",
          PARTY:
            email.uniquePartyName && subscribed
              ? guestsByUniquePartyName[email.uniquePartyName].partyName
              : "empty",
        },
      }
    })

    cli.action.start(
      `uploading ${mailchimpRecords.length} records to Mailchimp`
    )
    const result = await (flags.dryRun
      ? Promise.resolve({ total_updated: 0, total_created: 0, error_count: 0 })
      : this.mailchimp.post(
          {
            path: "/lists/{listId}",
            path_params: { listId: flags.listId },
          },
          {
            members: mailchimpRecords,
            update_existing: true,
          }
        ))
    cli.action.stop()
    this.log(result)
    this.log(
      `${result.total_created} records updated, ${result.total_updated} records created, ${result.error_count} errors`
    )
    if (result.errors) {
      this.log(result.errors)
    }

    if (flags.dryRun) {
      this.log("skipping firestore writes")
    } else {
      const invitationsRef = admin.firestore().collection("invitations")
      const firestoreInvitationBatches = _.chain(guests)
        .map(({ code, partyName, numGuests, knownGuests, preEvents }) => ({
          code,
          partyName,
          numGuests,
          knownGuests,
          preEvents,
        }))
        .chunk(FirestoreChunkSize)
        .value()

      cli.action.start(`writing ${guests.length} invitations to firestore`)
      await Promise.all(
        firestoreInvitationBatches.map(records => {
          const batch = admin.firestore().batch()
          records.forEach(invitation =>
            batch.set(invitationsRef.doc(invitation.code), invitation, {
              merge: true,
            })
          )
          return batch.commit()
        })
      )
      cli.action.stop()

      const firestoreInviteeRecords = guests.flatMap(guest =>
        guest.emails.map(email => ({
          id: email.email,
          data: { name: email.name, code: guest.code },
        }))
      )
      const firestoreInviteeBatches = _.chunk(
        firestoreInviteeRecords,
        FirestoreChunkSize
      )
      const inviteesRef = admin.firestore().collection("invitees")
      cli.action.start(
        `writing ${firestoreInviteeRecords.length} invitees to firestore`
      )
      await Promise.all(
        firestoreInviteeBatches.map(records => {
          const batch = admin.firestore().batch()
          records.forEach(invitee =>
            batch.set(inviteesRef.doc(invitee.id), invitee.data, {
              merge: true,
            })
          )
          return batch.commit()
        })
      )
      cli.action.stop()
    }
  }
}
