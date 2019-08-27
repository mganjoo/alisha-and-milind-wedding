import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

// 1280x800 (Tailwind "xl" breakpoint)
const puppeteer = require("puppeteer")
const device = puppeteer.devices["Nexus 10 landscape"]
function customizePage(page) {
  return page.emulate(device)
}

initStoryshots({
  suite: "Storyshots on x-large device",
  test: imageSnapshot({ storybookUrl: "http://localhost:9009", customizePage }),
})
