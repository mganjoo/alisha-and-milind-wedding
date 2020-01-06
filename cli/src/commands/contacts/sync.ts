import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { google } from "googleapis"
import { flags } from "@oclif/command"
import { getContacts } from "../../util/contacts"

dayjs.extend(utc)
dayjs.extend(customParseFormat)

export default class ContactsSync extends BaseCommand {
  static description =
    "Sync contacts stored in Firestore with a table in Google Sheets. Finds the latest ID stored in the Google Sheet and appends new rows to the table for new IDs."

  static examples = [
    `$ wedding-manager contacts:sync --spreadsheetId 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms --range 'Known Emails!A:D'`,
  ]

  static flags = {
    ...BaseCommand.flags,
    spreadsheetId: flags.string({
      description: "ID of Google Spreadsheet for existing contacts",
      required: true,
    }),
    range: flags.string({
      description:
        "Range of existing table containing 4 rows (e.g. 'Known Emails!A:D')",
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(ContactsSync)

    await this.initializeServices({ firebase: true, google: true })

    const auth = this.authClient
    const sheets = google.sheets({ version: "v4", auth })

    // Get existing contacts from Sheets
    cli.action.start("downloading existing contacts from Google Sheets")
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: flags.spreadsheetId,
      range: flags.range,
      valueRenderOption: "UNFORMATTED_VALUE",
    })
    cli.action.stop()
    let lastId: string | undefined

    const rows = response.data.values
    if (!rows || !rows.length) {
      this.error("Must define at least header row in spreadsheet")
    } else {
      if (rows[0].length < 4) {
        this.error(
          "Expecting at least 4 columns, corresponding to Id, Name, Email, Created"
        )
      }
      if (rows.length === 1) {
        this.log("No data in spreadsheet, adding data from start")
      } else {
        const records = rows.slice(1).map(row => ({
          id: row[0] as string,
          date: parseFloat(row[3]) || 0,
        }))
        lastId = records.reduce((a, b) => (a.date > b.date ? a : b)).id
        this.log(`Last entered ID is ${lastId}`)
      }
    }

    // Get new contacts from Firebase
    cli.action.start("downloading existing contacts from Firebase")
    const contacts = await getContacts(lastId)
    cli.action.stop()

    if (contacts.length > 0) {
      // Append new values to spreadsheet
      cli.action.start(
        `uploading ${contacts.length} new contacts to Google Sheets`
      )
      const newValues = contacts.map(contact => [
        contact.id,
        contact.name,
        contact.email,
        contact.created,
      ])
      const writeResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: flags.spreadsheetId,
        range: flags.range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: newValues,
        },
      })
      cli.action.stop()

      if (writeResponse.data.updates) {
        cli.log(
          `range ${writeResponse.data.updates.updatedRange} updated with ${writeResponse.data.updates.updatedRows} rows`
        )
      }
    } else {
      cli.log("no new contacts found")
    }
  }
}
