import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

// 1024x1366 (Tailwind "lg" breakpoint)
const puppeteer = require("puppeteer")
const device = puppeteer.devices["iPad Pro"]
function customizePage(page) {
  return page.emulate(device)
}

initStoryshots({
  suite: "Storyshots on large device",
  test: imageSnapshot({ storybookUrl: "http://localhost:9009", customizePage }),
})
