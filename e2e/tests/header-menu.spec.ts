import { expect, test } from "@playwright/test"
import { viewports } from "../support/helpers.js"

test.describe("header menu on mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports["iphone-6"])
    await page.goto("/")
  })

  test("should not be visible initially", async ({ page }) => {
    await expect(page.locator("nav")).toBeHidden()
  })

  test("toggles correctly when menu button is pressed", async ({ page }) => {
    const menuButton = page.getByLabel(/toggle menu/i)
    await expect(menuButton).toHaveAttribute("aria-controls", "main-nav")
    await expect(menuButton).toHaveAttribute("aria-expanded", "false")
    await menuButton.click()
    await expect(page.getByText(/our story/i)).toBeVisible()
    await expect(menuButton).toHaveAttribute("aria-expanded", "true")
    await menuButton.click()
    await expect(page.locator("nav")).toBeHidden()
    await expect(menuButton).toHaveAttribute("aria-expanded", "false")
  })

  test("closes correctly when clicking outside nav", async ({ page }) => {
    const menuButton = page.getByLabel(/toggle menu/i)
    await menuButton.click()
    await expect(page.locator("nav")).toBeVisible()
    await page.getByText("Las Vegas").first().click()
    await expect(page.locator("nav")).toBeHidden()
    await expect(menuButton).toHaveAttribute("aria-expanded", "false")
  })
})
