const yn = require("yn")
let percyHealthCheck = require("@percy/cypress/task")

module.exports = (on, config) => {
  on("task", percyHealthCheck)

  if (yn(config.env.ENABLE_FULL_SITE)) {
    // Run full test suite when full site is enabled (default is to run "small-site" tests only)
    config.ignoreTestFiles = []
    return config
  }
}
