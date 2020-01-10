import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import { getRsvps } from "../../util/rsvps"

export default class RsvpExport extends BaseCommand {
  static description = "Export RSVPs stored in Firestore, as a table."

  static examples = [
    `$ wedding-manager rsvp:export`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --after hs83kshdgk82ax`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --filter=code=skhaWhgk2 --sort=-created`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --csv`,
  ]

  static flags = {
    ...BaseCommand.flags,
    ...cli.table.flags(),
  }

  async run() {
    const { flags } = this.parse(RsvpExport)

    await this.initializeServices({ firebase: true })

    cli.action.start("downloading")
    try {
      const rsvps = await getRsvps()
      cli.action.stop()
      cli.table(
        rsvps,
        {
          id: { extended: true },
          code: {},
          partyName: { header: "Party Name" },
          attending: {},
          created: {},
          comments: {},
          haldi: { extended: true },
          mehndi: { extended: true },
          sangeet: { extended: true },
          ceremony: { extended: true },
          reception: { extended: true },
          guest1: { extended: true },
          guest2: { extended: true },
          guest3: { extended: true },
          guest4: { extended: true },
          guest5: { extended: true },
          guest6: { extended: true },
        },
        { ...flags, sort: flags.sort || "created" }
      )
    } catch (err) {
      this.log("Error getting documents", err)
      this.exit(1)
    }
  }
}
