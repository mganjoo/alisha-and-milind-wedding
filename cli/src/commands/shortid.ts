import { Command, flags } from "@oclif/command"
import shortid from "shortid"
import { cli } from "cli-ux"

export default class Shortid extends Command {
  static description = "Generate a set of shortids"

  static flags = {
    help: flags.help({ char: "h" }),
    number: flags.integer({
      char: "n",
      description: "number of IDs to generate",
      default: 1,
    }),
  }

  static args = [{ name: "file" }]

  async run() {
    const { flags } = this.parse(Shortid)

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
