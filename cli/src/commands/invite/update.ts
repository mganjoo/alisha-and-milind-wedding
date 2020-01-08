import BaseCommand from "../../util/base-command"
import { flags } from "@oclif/command"
import fs from "fs-extra"
import Papa from "papaparse"
import _ from "lodash"
import { cli } from "cli-ux"
import yn from "yn"
import admin from "firebase-admin"

interface Email {
  name: string
  email: string
  uniquePartyName: string
}

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

const MaxNumGuests = 11

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
      Papa.parse(emailsContents, { header: true }).data
    )
      .filter(email => !yn(email.skip) && email.email)
      .map(email => ({
        name: (email.cleanedName || email.name).trim(),
        email: email.email.trim(),
        uniquePartyName: email.uniquePartyName.trim(),
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
      }).data
    )
      .filter(guest => !!guest.code)
      .map(guest => ({
        code: guest.code.trim(),
        uniquePartyName: guest.uniquePartyName.trim(),
        partyName: guest.partyName.trim(),
        preEvents: !!yn(guest.preEvents),
        numGuests: parseInt(guest.numGuests),
        knownGuests: _.range(MaxNumGuests)
          .map(i => guest[`knownGuest${i + 1}`].trim() as string)
          .filter(guest => !!guest),
        emails: emailsByUniquePartyName[guest.uniquePartyName] || [],
      }))
      .value()

    const guestsByUniquePartyName = _.keyBy(guests, "uniquePartyName")

    // Validation for guests: known guest count is valid, code exists
    const invalidGuests = guests.filter(
      guest =>
        guest.numGuests < guest.knownGuests.length ||
        !guest.code ||
        !guest.uniquePartyName
    )
    if (invalidGuests.length > 0) {
      this.error(
        `Invalid guest records: ${invalidGuests.map(
          guest => guest.uniquePartyName
        )}`
      )
    }

    const emailIsSubscribed = (email: Email) =>
      email.uniquePartyName && email.uniquePartyName in guestsByUniquePartyName

    const mailchimpRecords = emails.map(email => {
      const subscribed = emailIsSubscribed(email)
      return {
        email_address: email.name,
        email_type: "html",
        status: subscribed ? "subscribed" : "unsubscribed",
        merge_fields: {
          NAME: email.name,
          WCODE: guestsByUniquePartyName[email.uniquePartyName]
            ? guestsByUniquePartyName[email.uniquePartyName].code
            : "",
          PARTY: guestsByUniquePartyName[email.uniquePartyName]
            ? guestsByUniquePartyName[email.uniquePartyName].partyName
            : "",
        },
      }
    })

    cli.action.start(
      `uploading ${mailchimpRecords.length} records to Mailchimp`
    )
    const result = await (flags.dryRun
      ? Promise.resolve({ updated_members: [], new_members: [] })
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
    this.log(
      `${result.updated_members.length} records updated, ${result.new_members.length} records created`
    )

    const invitationsRef = admin.firestore().collection("invitations")
    const firestoreInvitationBatches = _.chain(guests)
      .map(({ code, partyName, numGuests, knownGuests, preEvents }) => ({
        code,
        partyName,
        numGuests,
        knownGuests,
        preEvents,
      }))
      .chunk(200)
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
    const firestoreInviteeBatches = _.chunk(firestoreInviteeRecords, 200)
    const inviteesRef = admin.firestore().collection("invitees")
    cli.action.start(
      `writing ${firestoreInviteeRecords.length} invitees to firestore`
    )
    await Promise.all(
      firestoreInviteeBatches.map(records => {
        const batch = admin.firestore().batch()
        records.forEach(invitee =>
          batch.set(inviteesRef.doc(invitee.id), invitee.data, { merge: true })
        )
        return batch.commit()
      })
    )
    cli.action.stop()
  }
}
