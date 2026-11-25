import { fileURLToPath } from "node:url"
import AxeBuilder from "@axe-core/playwright"
import { expect, type Page } from "@playwright/test"

export const percyCss = fileURLToPath(new URL("./percy.css", import.meta.url))

/** Viewports matching Cypress presets used by the old suite. */
export const viewports = {
  "iphone-6": { width: 375, height: 667 },
  "macbook-15": { width: 1440, height: 900 },
} as const

/** Equivalent of cypress-axe `cy.checkA11y()`: fail on any violation. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  expect(
    results.violations.map(
      (v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`
    )
  ).toEqual([])
}

/**
 * Equivalent of `cy.percySnapshot(name)`: full-page screenshots at the widths
 * Percy used (375 and 1280), with the Percy masking CSS applied.
 */
export async function percySnapshot(page: Page, name: string) {
  const original = page.viewportSize()
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await settle(page)
    await expect(page).toHaveScreenshot(`${slug(name)}-${width}.png`, {
      fullPage: true,
      stylePath: percyCss,
      mask: [page.locator("iframe")],
    })
  }
  if (original) await page.setViewportSize(original)
}

/**
 * Wait for fonts and all images (including lazy ones) to finish loading, and
 * leave the page scrolled to the top and still. Any in-flight scroll
 * animation (JS-driven or native smooth scrolling, e.g. the RSVP form
 * scrolling to its first error) is allowed to finish first, so the sticky
 * header never lands mid-page in a full-page screenshot.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(r))
    const untilScrollIdle = async () => {
      let last = window.scrollY
      let stableFrames = 0
      for (let i = 0; i < 600 && stableFrames < 20; i++) {
        await frame()
        stableFrames = window.scrollY === last ? stableFrames + 1 : 0
        last = window.scrollY
      }
    }
    const jump = (top: number) =>
      window.scrollTo({ top, left: 0, behavior: "instant" })

    await untilScrollIdle()
    const step = window.innerHeight / 2
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      jump(y)
      await new Promise((r) => setTimeout(r, 50))
    }
    jump(0)
    await untilScrollIdle()
    jump(0)
    await document.fonts.ready
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? null
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true })
              img.addEventListener("error", resolve, { once: true })
            })
      )
    )
  })
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Envelope pages: wait until the opening animation (which starts after a
 * delay) has finished; the link bar fades in last. Makes screenshots of these
 * pages independent of animation timing.
 */
export async function waitForOpenedEnvelope(page: Page) {
  const enter = page.getByRole("link", { name: /enter website/i })
  await expect(enter.locator("..")).toHaveCSS("opacity", "1", {
    timeout: 20_000,
  })
}
