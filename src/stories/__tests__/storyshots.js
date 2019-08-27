import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

const puppeteer = require("puppeteer")
const devices = {
  // 320x568
  mobile: "iPhone 5",
  // 640x360 (Tailwind "sm")
  small: "Galaxy S5 landscape",
  // 768x1024 (Tailwind "md")
  medium: "iPad",
  // 1024x1366 (Tailwind "lg")
  large: "iPad Pro",
  // 1280x800 (Tailwind "xl")
  xlarge: "Nexus 10 landscape",
}

function createCustomizePage(device) {
  return deviceName => page.emulate(device)
}

for (const size in devices) {
  const device = puppeteer.devices[devices[size]]
  const customizePage = createCustomizePage(device)
  initStoryshots({
    suite: `Storyshots on ${size}`,
    test: imageSnapshot({
      storybookUrl: "http://localhost:9009",
      customizePage,
    }),
  })
}
