import { Flags } from "@oclif/core"
import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import { getRsvpSummaries, getGuestsByEvent } from "../../util/rsvps"

export default class RsvpExport extends BaseCommand {
  static description = "Export RSVPs stored in Firestore, as a table."

  static examples = [
    `$ wedding-manager rsvp:export`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --filter=code=skhaWhgk2 --sort=-created`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --csv`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --event haldi`,
  ]

  static flags = {
    ...BaseCommand.flags,
    ...cli.table.flags(),
    event: Flags.string({
      description: "Name of event to produce list of names",
    }),
  }

  async run() {
    const { flags } = await this.parse(RsvpExport)

    await this.initializeServices({ firebase: true })

    cli.action.start("downloading")
    try {
      if (flags.event) {
        const rsvpsForEvent = await getGuestsByEvent(flags.event)
        cli.action.stop()
        cli.table(
          rsvpsForEvent,
          {
            guest: {},
            partyName: { header: "Party Name" },
            code: {},
          },
          { ...flags, sort: flags.sort || "guest" }
        )
      } else {
        const rsvps = await getRsvpSummaries()
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
            puja: { extended: true },
            haldi: { extended: true },
            sangeet: { extended: true },
            ceremony: { extended: true },
            reception: { extended: true },
            guest1: { extended: true },
            guest2: { extended: true },
            guest3: { extended: true },
            guest4: { extended: true },
            guest5: { extended: true },
            guest6: { extended: true },
            guest7: { extended: true },
          },
          { ...flags, sort: flags.sort || "created" }
        )
      }
    } catch (err) {
      this.log("Error getting documents", err)
      this.exit(1)
    }
  }
}
