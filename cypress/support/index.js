import "./commands"
import "cypress-axe"
import "@testing-library/cypress/add-commands"

import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command"
addMatchImageSnapshotCommand({ capture: "viewport" })
