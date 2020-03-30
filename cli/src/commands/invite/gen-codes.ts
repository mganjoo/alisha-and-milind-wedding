import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import { flags } from "@oclif/command"
import shortid from "shortid"

export default class InviteGenCodes extends BaseCommand {
  static description =
    "Generate invitation codes for a table of guest parties in Google Sheets."

  static examples = [
    `$ wedding-manager invite:gen-codes --spreadsheetId 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms --range 'Guest Parties!A:B'`,
  ]

  static flags = {
    ...BaseCommand.flags,
    spreadsheetId: flags.string({
      description: "ID of Google Spreadsheet for existing contacts",
      required: true,
    }),
    range: flags.string({
      description:
        "Range of existing table spanning 2 columns. The first column is where IDs will be written; the second column is used to determine how many IDs to write (e.g. 'Guest Parties!A:B')",
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(InviteGenCodes)

    await this.initializeServices({ sheets: true })

    if (!this.sheets) {
      this.error("could not initialize sheets")
    }

    // Get existing parties from Sheets
    cli.action.start("downloading existing parties from Google Sheets")
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: flags.spreadsheetId,
      range: flags.range,
      valueRenderOption: "UNFORMATTED_VALUE",
    })
    cli.action.stop()

    const rows = response.data.values
    if (!rows || !rows.length) {
      this.error("No rows in range; nothing to do")
    } else {
      if (rows[0].length < 2) {
        this.error(
          "Expecting at least 2 columns, where the first corresponds to Generated Party Code"
        )
      }
      const newRows = rows.map(([code, ...rest]: (string | undefined)[]) => [
        // Generate if the code is empty, and the rest of the row contains data
        (!code || code.length === 0) &&
        rest.some((v) => v && v.trim().length > 0)
          ? shortid.generate()
          : code,
        ...rest,
      ])
      const updatedCount = newRows
        .map((row, i) => row[0] !== rows[i][0])
        .filter(Boolean).length
      if (updatedCount > 0) {
        cli.action.start(`updating ${updatedCount} codes`)
        const writeResponse = await this.sheets.spreadsheets.values.update({
          spreadsheetId: flags.spreadsheetId,
          range: flags.range,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: newRows,
          },
        })
        cli.action.stop()
        if (writeResponse.data) {
          this.log(`range ${writeResponse.data.updatedRange} updated`)
        }
      } else {
        this.log("no updates")
      }
    }
  }
}
