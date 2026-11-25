import { expect, type Page, test } from "@playwright/test"
import { invitationByCode } from "../support/fixtures.js"
import { settle, waitForOpenedEnvelope } from "../support/helpers.js"

/**
 * Whole-site visual parity. Baselines are captured from the 2022 Gatsby
 * build; the rewritten site must match them within the tolerance set in
 * playwright.config.ts. Unlike the ported Percy snapshots, nothing is masked
 * except third-party iframes (YouTube / Google Maps).
 *
 * Run with SITE_MODE=guard against a DISABLE_FULL_SITE=1 build to check
 * the "guard" (COVID cancellation) home page instead.
 */

const guard = process.env.SITE_MODE === "guard"

const gatedPages = [
  "/story",
  "/schedule",
  "/travel",
  "/faq",
  "/registry",
  "/video",
  "/rsvp",
  "/invitation",
]
const openPages = ["/", "/demo-card", "/this-page-does-not-exist"]

const widths = [375, 1280] as const
const schemes = ["light", "dark"] as const

async function snap(page: Page, name: string) {
  await settle(page)
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    mask: [page.locator("iframe")],
    timeout: 20_000,
  })
}

function name(path: string) {
  return path === "/" ? "home" : path.slice(1).replace(/\//g, "_")
}

for (const scheme of schemes) {
  for (const width of widths) {
    test.describe(`${scheme} @ ${width}px`, () => {
      test.use({ colorScheme: scheme, viewport: { width, height: 900 } })

      if (guard) {
        test("guard home", async ({ page }) => {
          await page.goto("/")
          await snap(page, `guard-home-${scheme}-${width}`)
        })
        return
      }

      test("open /demo-card played", async ({ page }) => {
        await page.goto("/demo-card")
        await page.getByRole("button", { name: /play/i }).click()
        await waitForOpenedEnvelope(page)
        await page.getByRole("button", { name: /pause/i }).click()
        await snap(page, `demo-card-played-${scheme}-${width}`)
      })

      for (const path of openPages) {
        test(`open ${path}`, async ({ page }) => {
          await page.goto(path)
          await snap(page, `${name(path)}-${scheme}-${width}`)
        })
      }

      for (const path of gatedPages) {
        test(`logged out ${path}`, async ({ page }) => {
          await page.goto(path)
          await expect(
            page.getByText("Loading...", { exact: true })
          ).toHaveCount(0)
          await expect(page.getByLabel(/email address/i)).toBeVisible()
          await snap(page, `${name(path)}-loggedout-${scheme}-${width}`)
        })

        test(`logged in ${path}`, async ({ page }) => {
          // Dedicated fixture (same shape as test2) that no other spec RSVPs to.
          const invitation = invitationByCode("testvisual")
          // Code links store the invitation in IndexedDB, then redirect home.
          await page.goto(`/s/home/${invitation.code}`)
          await expect(page).toHaveURL(/\/$/)
          await page.goto(path)
          await expect(
            page.getByText("Loading...", { exact: true })
          ).toHaveCount(0)
          await expect(page.getByLabel(/email address/i)).toHaveCount(0)
          if (path === "/invitation") await waitForOpenedEnvelope(page)
          await snap(page, `${name(path)}-loggedin-${scheme}-${width}`)
        })
      }
    })
  }
}
