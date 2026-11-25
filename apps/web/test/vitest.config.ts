import { fileURLToPath } from "node:url"
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin"
import { defineConfig } from "vitest/config"

/**
 * API and SQL tests, run inside workerd (Miniflare) against a local D1 with
 * the real migrations: the successor of functions/test/firestore-rules.spec.ts.
 */
export default defineConfig(async () => {
  const migrations = await readD1Migrations(
    fileURLToPath(new URL("../migrations", import.meta.url))
  )
  return {
    root: fileURLToPath(new URL(".", import.meta.url)),
    plugins: [
      cloudflareTest({
        miniflare: {
          compatibilityDate: "2026-11-01", // as wrangler.jsonc
          d1Databases: ["DB"],
          bindings: {
            TEST_MIGRATIONS: migrations,
            RSVP_NOTIFY_EMAIL: "rsvps@example.com",
            TEST_API_TOKEN: "unit-test-token",
          },
        },
      }),
    ],
    test: {
      include: ["**/*.spec.ts"],
      setupFiles: ["./apply-migrations.ts"],
    },
  }
})
