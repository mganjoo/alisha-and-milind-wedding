/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config"

// Unit tests (jsdom) for utilities and React components, and (node) for
// the guest import script.
export default getViteConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
})
