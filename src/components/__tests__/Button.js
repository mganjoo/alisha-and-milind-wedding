const puppeteer = require("puppeteer")
const iPhone = puppeteer.devices["iPhone 6"]

describe("Button", () => {
  it("visually looks correct on iphone", async () => {
    await page.emulate(iPhone)
    await page.goto(
      "http://localhost:9009/iframe.html?selectedKind=Button&selectedStory=with+text"
    )
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()
  })
})
