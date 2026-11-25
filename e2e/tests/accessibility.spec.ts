import { test } from "@playwright/test"
import { expectNoA11yViolations, viewports } from "../support/helpers.js"

const sizes = ["iphone-6", "macbook-15"] as const

test.describe("application", () => {
  for (const size of sizes) {
    test(`has no detectable a11y violations on ${size} load`, async ({
      page,
    }) => {
      await page.setViewportSize(viewports[size])
      await page.goto("/")
      // make the runner wait for the h1 element to load, critical to a11y tests
      await page.locator("h1").waitFor({ state: "visible" })
      await expectNoA11yViolations(page)
    })
  }
})

test.describe("header menu on mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports["iphone-6"])
    await page.goto("/")
  })

  test("has no detectable a11y violations when open", async ({ page }) => {
    await page.getByLabel(/toggle menu/i).click()
    await expectNoA11yViolations(page)
  })
})
