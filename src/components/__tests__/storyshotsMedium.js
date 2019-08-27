import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

// 768x1024 (Tailwind "md" breakpoint)
const puppeteer = require("puppeteer")
const device = puppeteer.devices["iPad"]
function customizePage(page) {
  return page.emulate(device)
}

initStoryshots({
  suite: "Storyshots on medium device",
  test: imageSnapshot({ storybookUrl: "http://localhost:9009", customizePage }),
})
