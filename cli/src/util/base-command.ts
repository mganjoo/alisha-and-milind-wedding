import { flags } from "@oclif/command"
import { Command } from "@oclif/command"
import chalk from "chalk"
import admin from "firebase-admin"

export default abstract class BaseCommand extends Command {
  // Color for options and flags in help messages
  private static optionColor = (option: string) => chalk.blue(option)

  // Flags shareable by all Firebase commands
  protected static defaultFlags = {
    help: flags.help({ char: "h" }),
    credentials: flags.string({
      char: "c",
      description: "path to service account credentials",
    }),
  }

  protected initializeCredentials(credentials: string | undefined) {
    if (credentials) {
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      })
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    } else {
      this.error(
        `path to credentials file must be passed via ${BaseCommand.optionColor(
          "GOOGLE_APPLICATION_CREDENTIALS"
        )} environment variable or ${BaseCommand.optionColor(
          "--credentials"
        )} flag. See ${BaseCommand.optionColor("--help")} for more details.`,
        { exit: 1 }
      )
    }
  }
}
