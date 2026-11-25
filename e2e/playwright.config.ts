import { defineConfig, devices } from "@playwright/test"

/**
 * One suite, two targets. BASE_URL picks the site under test (the 2022 Gatsby
 * build or the new Astro build); screenshot baselines are shared between them,
 * so a passing visual run on the new site means pixel parity (within
 * tolerance) with the old one.
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./support/global-setup.ts",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "report" }]],
  outputDir: "test-results",
  // Shared across targets: no project/platform suffix in the path.
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Per-pixel colour tolerance (0-1, YIQ) plus a cap on differing pixels.
      threshold: 0.2,
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },
  use: {
    baseURL: process.env.BASE_URL ?? "http://web-preview:9000",
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
})
