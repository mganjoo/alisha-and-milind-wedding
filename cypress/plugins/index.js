const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin")
const yn = require("yn")

module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome" || browser.name === "chromium") {
      // In headless mode, Cypress fixes the scale factor to 1, and this forces
      // screenshots to be taken with an image size matching the viewport size
      // instead of the viewport size multiplied by the scale factor.
      //
      // Since we also want to run the image regression tests in development mode,
      // we need to set the device scale factor to 1 in chrome / chromium.
      //
      // See: https://github.com/cypress-io/cypress/issues/2102#issuecomment-521299946
      // See: https://github.com/cypress-io/cypress/blame/a7dfda986531f9176468de4156e3f1215869c342/packages/server/lib/cypress.coffee#L132-L137
      args.push("--force-device-scale-factor=1")
    } else if (browser.name === "electron" && browser.isHeaded) {
      // eslint-disable-next-line no-console
      console.log(
        "There isn't currently a way of setting the device scale factor in Cypress when running headed electron so we disable the image regression commands."
      )
    }

    return args
  })

  addMatchImageSnapshotPlugin(on, config)

  if (yn(process.env.GUARD_PAGE_ONLY)) {
    // Run special tests for guard page-only environment
    config.integrationFolder = "cypress/guard-page-integration"
    return config
  }
}
