import Command, { flags } from "@oclif/command"
import chalk from "chalk"
import admin from "firebase-admin"
import fs from "fs-extra"
import path from "path"
import { OAuth2Client } from "google-auth-library"
import { cli } from "cli-ux"
import { getAuthClient } from "./google-auth"

interface Config {
  firebase?: string
  google?: string
  scopes?: string[]
}

export default abstract class BaseCommand extends Command {
  // Flags shareable by all Firebase commands
  static flags = {
    help: flags.help({ char: "h" }),
    firebase: flags.string({
      char: "f",
      description: "path to Firebase service account credentials",
    }),
    google: flags.string({
      char: "g",
      description: "path to Google API credentials JSON",
    }),
  }

  protected configPath = path.join(this.config.configDir, "config.json")

  /**
   * OAuth Client for accessing Google APIs.
   */
  protected authClient: OAuth2Client | undefined = undefined

  /**
   * Load configuration for command, which is stored in a
   * subdirectory of ~/.config.
   */
  protected async loadConfig() {
    try {
      const config = (await fs.readJSON(this.configPath)) as Config
      return config
    } catch (err) {
      // Ignore configuration if it is not loadable
      return undefined
    }
  }

  /**
   * Initializes admin Firebase with explicit credentials path passed in from args,
   * or from other sources (environment variables or CLI config).
   *
   * Initialize Google Sheets API access, using path to credentials file
   * (from https://developers.google.com/sheets/api/quickstart/nodejs).
   */
  protected async initializeServices(options: {
    google?: boolean
    firebase?: boolean
  }) {
    const { flags } = this.parse(this.constructor as any)

    if (options.firebase) {
      cli.action.start("initializing Firebase")
      await this.initializeFirebase(flags.firebase)
      cli.action.stop()
    }
    if (options.google) {
      cli.action.start("initializing Google Sheets")
      this.authClient = await this.initializeGoogle(flags.google)
      cli.action.stop()
    }
  }

  private async initializeFirebase(credentialsPath?: string) {
    if (credentialsPath) {
      admin.initializeApp({
        credential: admin.credential.cert(credentialsPath),
      })
    } else if (
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIRESTORE_EMULATOR_HOST
    ) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      })
    } else {
      const config = await this.loadConfig()
      if (config && config.firebase) {
        admin.initializeApp({
          credential: admin.credential.cert(config.firebase),
        })
      } else {
        this.error(
          `path to Firebase credentials file must be passed via (a) a "firebase" key in ${this.optionColor(
            this.configPath
          )}, (b) the ${this.optionColor(
            "GOOGLE_APPLICATION_CREDENTIALS"
          )} environment variable, or (c) ${this.optionColor(
            "--firebase"
          )} flag. See ${this.optionColor("--help")} for more details.`,
          { exit: 1 }
        )
      }
    }
  }

  private async initializeGoogle(credentialsPath?: string) {
    let finalCredentialsPath
    if (credentialsPath) {
      finalCredentialsPath = credentialsPath
    } else {
      const config = await this.loadConfig()
      if (config && config.google) {
        finalCredentialsPath = config.google
      } else {
        this.error(
          `path to Google API credentials must be passed via ${this.optionColor(
            "--google"
          )} flag or a "google" key in ${this.optionColor(this.configPath)}`
        )
      }
    }
    return getAuthClient(finalCredentialsPath, this.config.configDir)
  }

  // Color for options and flags in help messages
  private optionColor = (option: string) => chalk.blue(option)
}
