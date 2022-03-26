import BaseCommand from "../../util/base-command"
import { Flags } from "@oclif/core"
import fs from "fs-extra"
import Papa from "papaparse"
import _ from "lodash"
import { cli } from "cli-ux"
import { getApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { object, string, number, array, InferType } from "yup"
import shortid from "shortid"
import Mailchimp from "mailchimp-api-v3"

const emailCsvSchema = object()
  .required()
  .shape({
    name: string().trim().required(),
    email: string().trim().email().required(),
    cleanedName: string().notRequired().trim(),
    skip: string().notRequired().oneOf(["y", ""]),
    uniquePartyName: string().notRequired().trim(),
  })

type EmailCsv = InferType<typeof emailCsvSchema>

interface Email {
  name: string
  email: string
  uniquePartyName?: string
}

const MaxNumGuests = 11
const FirestoreChunkSize = 200

const partySchema = object()
  .required()
  .transform((current) => ({
    ...current,
    knownGuests: _.range(MaxNumGuests)
      .map((i) => (current[`knownGuest${i + 1}`] || "").trim())
      .filter((guest) => !!guest),
  }))
  .shape({
    code: string()
      .trim()
      .required()
      .test("is-shortid", "${path} is not a shortid", (value) =>
        shortid.isValid(value)
      ),
    uniquePartyName: string().trim().required(),
    partyName: string().required().trim(),
    preEvents: string().required().oneOf(["y", "n"]),
    ceremony: string().required().oneOf(["y", "n"]),
    sangeet: string().required().oneOf(["y", "n"]),
    numGuests: number().required().integer(),
    knownGuests: array().of(string().required()),
  })

type Itype = "a" | "pr" | "psr" | "w" | "ow" | "sr" | "r"

interface Invitation {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  itype: Itype
}

interface Party extends Invitation {
  uniquePartyName: string
  emails: Email[]
}

type SegmentIdKey =
  | "preEventsSegmentId"
  | "sangeetSegmentId"
  | "ceremonySegmentId"
  | "receptionSegmentId"

function yn(value: string | undefined) {
  if (value === undefined) {
    return false
  } else if (/^(?:y|yes)$/i.test(value)) {
    return true
  } else {
    return false
  }
}

export default class InviteUpdate extends BaseCommand {
  static description =
    "Update invitation and invitee records in Firestore and Mailchimp using CSV exports from Google Sheets."

  static examples = [
    `$ wedding-manager invite:update --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv --listId fs92kghse --haldiSegmentId 29671`,
    `$ wedding-manager invite:update --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv --listId fs92kghse --haldiSegmentId 29671 --dryRun`,
  ]

  static flags = {
    ...BaseCommand.flags,
    parties: Flags.string({
      description:
        "CSV containing party information from A+M wedding spreadsheet",
      required: true,
    }),
    emails: Flags.string({
      description:
        "CSV containing email information from A+M wedding spreadsheet",
      required: true,
    }),
    listId: Flags.string({
      description: "Mailchimp list ID for invitees",
    }),
    preEventsSegmentId: Flags.string({
      description: "Mailchimp segment ID for Pre-Events tag",
    }),
    sangeetSegmentId: Flags.string({
      description: "Mailchimp segment ID for Sangeet tag",
    }),
    ceremonySegmentId: Flags.string({
      description: "Mailchimp segment ID for Ceremony tag",
    }),
    receptionSegmentId: Flags.string({
      description: "Mailchimp segment ID for Reception tag",
    }),
    dryRun: Flags.boolean({
      description: "Do not write records to any services",
    }),
  }

  parseItype(
    preEvents: boolean,
    sangeet: boolean,
    ceremony: boolean
  ): Itype | undefined {
    if (preEvents && sangeet && ceremony) {
      return "a"
    } else if (preEvents && sangeet && !ceremony) {
      return "psr"
    } else if (preEvents && !sangeet && !ceremony) {
      return "pr"
    } else if (!preEvents && sangeet && ceremony) {
      return "w"
    } else if (!preEvents && !sangeet && ceremony) {
      return "ow"
    } else if (!preEvents && sangeet && !ceremony) {
      return "sr"
    } else if (!preEvents && !sangeet && !ceremony) {
      return "r"
    } else {
      return undefined
    }
  }

  async run() {
    const { flags } = await this.parse(InviteUpdate)
    const config = await this.loadConfig()

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
      .map((obj) => emailCsvSchema.validateSync(obj) as EmailCsv)
      // Skip emails manually marked for skipping (duplicates)
      .filter((email) => !yn(email.skip))
      .map((email) => ({
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
      (key) => emailCounts[key] > 1
    )
    if (duplicateEmails.length > 0) {
      this.error(`duplicate emails detected: ${duplicateEmails}`)
    }

    const emailsByUniquePartyName = _.groupBy(emails, "uniquePartyName")

    // Read parties information
    cli.action.start("reading parties information")
    const partiesContent = await fs.readFile(flags.parties, "utf-8")
    cli.action.stop()
    const parties: Party[] = _.chain(
      Papa.parse(partiesContent, {
        header: true,
        skipEmptyLines: true,
      }).data
    )
      .map((obj) => partySchema.validateSync(obj))
      .map(
        ({
          code,
          uniquePartyName,
          partyName,
          numGuests,
          knownGuests,
          ...rest
        }) => {
          const preEvents = yn(rest.preEvents)
          const sangeet = yn(rest.sangeet)
          const ceremony = yn(rest.ceremony)
          const itype = this.parseItype(preEvents, sangeet, ceremony)
          if (!itype) {
            this.error(
              `Could not generate itype for invitation: preEvents = ${preEvents},` +
                ` sangeet = ${sangeet}, ceremony = ${ceremony}`
            )
          }
          return {
            code,
            uniquePartyName,
            partyName,
            numGuests,
            knownGuests: knownGuests || [],
            itype,
            emails: emailsByUniquePartyName[uniquePartyName] || [],
          }
        }
      )
      .value()

    const partyByUniqueName = _.keyBy(parties, "uniquePartyName")

    // Validation for parties: known guest count is valid
    const invalidParties = parties.filter(
      (guest) => guest.numGuests < guest.knownGuests.length
    )
    if (invalidParties.length > 0) {
      this.error(
        `Invalid guest records (known guests exceed numGuests): ${invalidParties.map(
          (party) => party.uniquePartyName
        )}`
      )
    }

    const partyForEmail = (email: Email) =>
      email.uniquePartyName
        ? partyByUniqueName[email.uniquePartyName]
        : undefined

    const mailchimpRecords = emails.map((email) => {
      const party = partyForEmail(email)
      return party
        ? {
            email_address: email.email,
            email_type: "html",
            status: "subscribed",
            merge_fields: email.uniquePartyName
              ? {
                  NAME: email.name,
                  WCODE: party.code,
                  PARTY: party.partyName,
                }
              : {},
          }
        : { email_address: email.email, status: "unsubscribed" }
    })

    cli.action.start(
      `uploading ${mailchimpRecords.length} records to Mailchimp`
    )
    const listId = flags.listId || (config && config.listId)
    const result = await (flags.dryRun
      ? Promise.resolve({ total_updated: 0, total_created: 0, error_count: 0 })
      : this.mailchimp.post(
          {
            path: "/lists/{listId}",
            path_params: { listId },
          },
          {
            members: mailchimpRecords,
            update_existing: true,
          }
        ))
    cli.action.stop()
    this.log(
      `${result.total_created} records created, ${result.total_updated} records updated, ${result.error_count} errors`
    )
    if (result.error_count > 0) {
      this.log(result.errors)
    }

    const writeTags = async (
      mailchimp: Mailchimp,
      matchesTag: (party: Party) => boolean,
      segmentIdKey: SegmentIdKey
    ) => {
      const [toAdd, toRemove] = _.chain(emails)
        .filter((email) => !!partyForEmail(email))
        .partition((email) => {
          const party = partyForEmail(email)
          return party && matchesTag(party)
        })
        .value()
      cli.action.start(
        `writing tag for ${segmentIdKey}: ${toAdd.length} to add, ${toRemove.length} to remove`
      )
      const tagResult = await (flags.dryRun
        ? Promise.resolve({ total_added: 0, total_removed: 0, error_count: 0 })
        : mailchimp.post(
            {
              path: "/lists/{listId}/segments/{segmentId}",
              path_params: {
                listId,
                segmentId:
                  flags[segmentIdKey] || (config && config[segmentIdKey]),
              },
            },
            {
              members_to_add: toAdd.map((email) => email.email),
              members_to_remove: toRemove.map((email) => email.email),
            }
          ))
      cli.action.stop()
      this.log(
        `${tagResult.total_added} records added, ${tagResult.total_removed} records removed`
      )
    }

    await writeTags(
      this.mailchimp,
      (party) => ["a", "psr", "pr"].includes(party.itype),
      "preEventsSegmentId"
    )
    await writeTags(
      this.mailchimp,
      (party) =>
        party.itype !== undefined &&
        ["a", "w", "psr", "sr"].includes(party.itype),
      "sangeetSegmentId"
    )
    await writeTags(
      this.mailchimp,
      (party) =>
        party.itype !== undefined && ["a", "w", "ow"].includes(party.itype),
      "ceremonySegmentId"
    )
    await writeTags(this.mailchimp, () => true, "receptionSegmentId")

    if (flags.dryRun) {
      this.log("skipping firestore writes")
    } else {
      const invitationsRef = getFirestore(getApp()).collection("invitations")
      const firestoreInvitationBatches = _.chain(parties)
        .map(({ code, partyName, numGuests, knownGuests, itype }) => ({
          code,
          partyName,
          numGuests,
          knownGuests,
          itype,
        }))
        .chunk(FirestoreChunkSize)
        .value()

      cli.action.start(`writing ${parties.length} invitations to firestore`)
      await Promise.all(
        firestoreInvitationBatches.map((records) => {
          const batch = getFirestore(getApp()).batch()
          records.forEach((invitation) =>
            batch.set(invitationsRef.doc(invitation.code), invitation, {
              merge: true,
            })
          )
          return batch.commit()
        })
      )
      cli.action.stop()

      const firestoreInviteeRecords = parties.flatMap((party) =>
        party.emails.map((email) => ({
          id: email.email.toLowerCase(),
          data: { name: email.name, code: party.code },
        }))
      )
      const firestoreInviteeBatches = _.chunk(
        firestoreInviteeRecords,
        FirestoreChunkSize
      )
      const inviteesRef = getFirestore(getApp()).collection("invitees")
      cli.action.start(
        `writing ${firestoreInviteeRecords.length} invitees to firestore`
      )
      await Promise.all(
        firestoreInviteeBatches.map((records) => {
          const batch = getFirestore(getApp()).batch()
          records.forEach((invitee) =>
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
