import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

// 640x360 (Tailwind "sm" breakpoint)
const puppeteer = require("puppeteer")
const device = puppeteer.devices["Galaxy S5 landscape"]
function customizePage(page) {
  return page.emulate(device)
}

initStoryshots({
  suite: "Storyshots on small device",
  test: imageSnapshot({ storybookUrl: "http://localhost:9009", customizePage }),
})
