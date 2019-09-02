import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command"

// See: https://github.com/cypress-io/cypress/issues/2102#issuecomment-521299946
if (Cypress.browser.name === "electron" && Cypress.browser.isHeaded) {
  Cypress.Commands.add(
    "matchImageSnapshot",
    {
      prevSubject: ["optional", "element", "window", "document"],
    },
    (_, name) => {
      cy.log(
        "In non-headless electron we can't control the device scale factor so have made `CypressSubject#matchImageSnapshot` a noop."
      )
    }
  )
} else {
  // Allow for relaxed thresholds on CI machines and when Chrome is used (as master snapshots are generated using headless Electron)
  const relaxThresholds =
    Cypress.env("relaxThresholds") ||
    Cypress.browser.name === "chrome" ||
    Cypress.browser.name === "chromium" ||
    false
  addMatchImageSnapshotCommand({
    capture: "viewport",
    customDiffDir: "cypress/diffs",
    customDiffConfig: { threshold: relaxThresholds ? 0.1 : 0.2 }, // reduce sensitivity of comparison from default 0.1
    failureThreshold: relaxThresholds ? 0.02 : 0, // 2% difference triggers failure with relaxed thresholds
    failureThresholdType: "percent",
  })
}
