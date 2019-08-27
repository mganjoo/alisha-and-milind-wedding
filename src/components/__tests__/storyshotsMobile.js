import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

// 320x568
const puppeteer = require("puppeteer")
const device = puppeteer.devices["iPhone 5"]
function customizePage(page) {
  return page.emulate(device)
}

initStoryshots({
  suite: "Storyshots on mobile",
  test: imageSnapshot({ storybookUrl: "http://localhost:9009", customizePage }),
})
