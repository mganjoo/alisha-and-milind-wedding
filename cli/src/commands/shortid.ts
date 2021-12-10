import { Command, Flags } from "@oclif/core"
import shortid from "shortid"
import { cli } from "cli-ux"

export default class Shortid extends Command {
  static description = "Generate a set of shortids"

  static flags = {
    help: Flags.help({ char: "h" }),
    number: Flags.integer({
      char: "n",
      description: "number of IDs to generate",
      default: 1,
    }),
  }

  static args = [{ name: "file" }]

  async run() {
    const { flags } = await this.parse(Shortid)

    const number = flags.number

    if (number <= 0) {
      cli.error("--number must be greater than 0", { exit: 1 })
    } else {
      for (let i = 0; i < number; i++) {
        cli.log(shortid.generate())
      }
    }
  }
}
