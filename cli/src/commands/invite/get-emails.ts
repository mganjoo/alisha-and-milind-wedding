import BaseCommand from "../../util/base-command"
import { Flags } from "@oclif/core"
import cli from "cli-ux"
import fs from "fs-extra"
import Papa from "papaparse"
import _ from "lodash"
import { object, string, InferType } from "yup"

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

const partySchema = object().required().shape({
  uniquePartyName: string().trim().required(),
})

function yn(value: string | undefined) {
  if (value === undefined) {
    return false
  } else if (/^(?:y|yes)$/i.test(value)) {
    return true
  } else {
    return false
  }
}

export default class InviteGetEmails extends BaseCommand {
  static description = "Get emails corresponding to provided list of parties."

  static examples = [
    `$ wedding-manager invite:get-emails --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv`,
    `$ wedding-manager invite:get-emails --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv`,
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
  }

  async run() {
    const { flags } = await this.parse(InviteGetEmails)

    const emailsContents = await fs.readFile(flags.emails, "utf-8")
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

    // Read parties information
    const partiesContent = await fs.readFile(flags.parties, "utf-8")
    const uniquePartyNames: string[] = _.chain(
      Papa.parse(partiesContent, {
        header: true,
        skipEmptyLines: true,
      }).data
    )
      .map((obj) => partySchema.validateSync(obj))
      .map(({ uniquePartyName }) => uniquePartyName)
      .value()

    const filteredEmails = emails
      .filter(
        (email) =>
          email.uniquePartyName &&
          uniquePartyNames.includes(email.uniquePartyName)
      )
      .map((email) => email.email)

    filteredEmails.forEach((email) => cli.log(email))
  }
}
