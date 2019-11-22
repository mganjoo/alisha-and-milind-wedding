import BaseCommand from "../util/base-command"
import admin from "firebase-admin"
import cli from "cli-ux"
import dayjs from "dayjs"
import { Contact } from "@alisha-and-milind-wedding/shared-types"
import { HasTimestamp } from "../interfaces/HasTimestamp"

type ContactWithTimestamp = Contact & HasTimestamp

export default class ExportContacts extends BaseCommand {
  static description = "Export contacts stored in Firestore"

  static examples = [
    `$ wedding-manager export-contacts -c path/to/service-account.json`,
    `$ wedding-manager export-contacts -c path/to/service-account.json -x --filter=name=John --sort=-created`,
  ]

  static flags = {
    ...BaseCommand.defaultFlags,
    ...cli.table.flags(),
  }

  async run() {
    const { flags } = this.parse(ExportContacts)

    this.initializeCredentials(flags.credentials)

    cli.action.start("downloading")
    return admin
      .firestore()
      .collection("contacts")
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const data = doc.data()
          return { id: doc.ref.id, ...data } as (ContactWithTimestamp & {
            id: string
          })
        })
      )
      .then(contacts =>
        contacts.map(contact => ({
          ...contact,
          createdAt: contact.createdAt.toDate(),
        }))
      )
      .then(contacts => {
        cli.action.stop()
        cli.table(
          contacts,
          {
            id: { extended: true },
            name: {},
            email: {},
            created: {
              get: row => dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            },
          },
          { ...flags, sort: flags.sort || "created" }
        )
      })
      .catch(err => {
        this.log("Error getting documents", err)
        this.exit(1)
      })
  }
}
