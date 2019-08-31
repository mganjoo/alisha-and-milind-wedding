const puppeteer = require("puppeteer")
const mobile = puppeteer.devices["iPhone 6"]

describe("Header", () => {
  it("toggles into and out of view correctly on mobile", async () => {
    await page.emulate(mobile)
    await page.goto(
      "http://localhost:9009/iframe.html?selectedKind=Header&selectedStory=default"
    )
    await page.click("button")
    const imageOpen = await page.screenshot()
    expect(imageOpen).toMatchImageSnapshot()

    await page.click("button")
    const imageClosed = await page.screenshot()
    expect(imageClosed).toMatchImageSnapshot()
  })
})
