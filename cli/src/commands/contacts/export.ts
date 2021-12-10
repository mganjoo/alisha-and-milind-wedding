import { Flags } from "@oclif/core"
import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import { getContacts } from "../../util/contacts"

export default class ContactsExport extends BaseCommand {
  static description = "Export contacts stored in Firestore, as a table."

  static examples = [
    `$ wedding-manager contacts:export -f path/to/service-account.json`,
    `$ wedding-manager contacts:export -f path/to/service-account.json --after hs83kshdgk82ax`,
    `$ wedding-manager contacts:export -f path/to/service-account.json --filter=name=John --sort=-created`,
    `$ wedding-manager contacts:export -f path/to/service-account.json --csv`,
  ]

  static flags = {
    ...BaseCommand.flags,
    ...cli.table.flags(),
    after: Flags.string({
      description:
        "ID of document cursor (results will be retrieved after this document)",
    }),
  }

  async run() {
    const { flags } = await this.parse(ContactsExport)

    await this.initializeServices({ firebase: true })

    cli.action.start("downloading")
    try {
      const contacts = await getContacts(flags.after)
      cli.action.stop()
      cli.table(
        contacts,
        {
          id: {},
          name: {},
          email: {},
          created: {},
        },
        { ...flags, sort: flags.sort }
      )
    } catch (err) {
      this.log("Error getting documents", err)
      this.exit(1)
    }
  }
}
