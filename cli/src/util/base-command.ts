import Command, { flags } from "@oclif/command"
import chalk from "chalk"
import admin from "firebase-admin"
import fs from "fs-extra"
import path from "path"
import { cli } from "cli-ux"
import { getSheets } from "./sheets"
import Mailchimp from "mailchimp-api-v3"
import { sheets_v4 } from "googleapis"

interface Config {
  firebase?: string
  google?: string
  scopes?: string[]
  mailchimp?: string
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
    mailchimp: flags.string({
      char: "m",
      description: "Mailchimp API key",
    }),
  }

  protected configPath = path.join(this.config.configDir, "config.json")

  /**
   * Google Sheets client.
   */
  protected sheets: sheets_v4.Sheets | undefined = undefined

  /**
   * Client for accessing Mailchimp API.
   */
  protected mailchimp: Mailchimp | undefined = undefined

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
   *
   * Initialize Mailchimp with API key.
   */
  protected async initializeServices(options: {
    sheets?: boolean
    firebase?: boolean
    mailchimp?: boolean
  }) {
    const { flags } = this.parse(this.constructor as any)

    if (options.firebase) {
      cli.action.start("initializing Firebase")
      await this.initializeFirebase(flags.firebase)
      cli.action.stop()
    }
    if (options.sheets) {
      cli.action.start("initializing Google Sheets")
      this.sheets = await this.initializeGoogle(flags.google)
      cli.action.stop()
    }
    if (options.mailchimp) {
      cli.action.start("initializing Mailchimp")
      this.mailchimp = await this.initializeMailchimp(flags.mailchimp)
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
    return getSheets(finalCredentialsPath, this.config.configDir)
  }

  private async initializeMailchimp(apiKey?: string) {
    if (apiKey) {
      return new Mailchimp(apiKey)
    } else {
      const config = await this.loadConfig()
      if (config && config.mailchimp) {
        return new Mailchimp(config.mailchimp)
      } else {
        this.error(
          `Mailchimp API key must be passed via ${this.optionColor(
            "--mailchimp"
          )} flag or a "mailchimp" key in ${this.optionColor(this.configPath)}`
        )
      }
    }
  }

  // Color for options and flags in help messages
  private optionColor = (option: string) => chalk.blue(option)
}
