import BaseCommand from "../util/base-command"
import fs from "fs"
import Fixtures from "../interfaces/Fixtures"
import Ajv from "ajv"
import chalk from "chalk"
import { cli } from "cli-ux"
import admin from "firebase-admin"
const fixturesSchema = require("../../fixture-schema.json")

const MaxFixtures = 20

export default class LoadFixtures extends BaseCommand {
  static description =
    "Load fixtures into Firestore from data in fixtures/ folder"

  static flags = {
    ...BaseCommand.defaultFlags,
  }

  static examples = [
    `$ wedding-manager load-fixtures -c path/to/service-account.json invitations`,
  ]

  static args = [
    {
      name: "path",
      description: "path to fixtures JSON file",
      required: true,
    },
  ]

  async run() {
    const { args, flags } = this.parse(LoadFixtures)

    const contents = fs.readFileSync(args.path as string, "utf-8")
    const fixtures = JSON.parse(contents) as Fixtures

    const ajv = new Ajv()
    const valid = ajv.validate(fixturesSchema, fixtures)

    if (!valid) {
      this.error(
        `Invalid schema for ${args.path}. Details: ${chalk.blue(
          "npm run fixtures:validate"
        )}`
      )
    }

    if (fixtures.fixtures.length > MaxFixtures) {
      this.error(`Too many fixtures: ${fixtures.fixtures.length}`)
    }

    this.initializeCredentials(flags.credentials)
    this.log(`Adding fixtures from ${chalk.magenta(args.path)}`)
    cli.action.start("writing")

    const db = admin.firestore()
    let batch = db.batch()

    fixtures.fixtures.forEach(fixture =>
      batch.set(
        db.collection(fixtures.collection).doc(fixture.id),
        fixture.data
      )
    )

    return batch
      .commit()
      .then(() => {
        cli.action.stop()
        this.log(`${fixtures.fixtures.length} records written`)
      })
      .catch(err => {
        this.error(err, { exit: 1 })
      })
  }
}
