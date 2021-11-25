import { flags } from "@oclif/command"
import BaseCommand from "../../util/base-command"
import cli from "cli-ux"
import { getRsvpSummaries, getGuestsByEvent } from "../../util/rsvps"

export default class RsvpExport extends BaseCommand {
  static description = "Export RSVPs stored in Firestore, as a table."

  static examples = [
    `$ wedding-manager rsvp:export`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --after hs83kshdgk82ax`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --filter=code=skhaWhgk2 --sort=-created`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --csv`,
    `$ wedding-manager rsvp:export -f path/to/service-account.json --event haldi`,
  ]

  static flags = {
    ...BaseCommand.flags,
    ...cli.table.flags(),
    event: flags.string({
      description: "Name of event to produce list of names",
    }),
    oldDate: flags.boolean({
      description: "Show RSVPs older than before the event was rescheduled",
    }),
  }

  async run() {
    const { flags } = this.parse(RsvpExport)

    await this.initializeServices({ firebase: true })

    cli.action.start("downloading")
    try {
      if (flags.event) {
        const rsvpsForEvent = await getGuestsByEvent(flags.event, flags.oldDate)
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
        const rsvps = await getRsvpSummaries(flags.oldDate)
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
