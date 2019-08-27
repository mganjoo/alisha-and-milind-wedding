// This code runs after the Jest test environment is set up

// Setup jest-image-snapshot for UI testing
const { toMatchImageSnapshot } = require("jest-image-snapshot")
expect.extend({ toMatchImageSnapshot })
