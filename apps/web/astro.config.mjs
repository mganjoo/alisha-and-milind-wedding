// @ts-check

import cloudflare from "@astrojs/cloudflare"
import { satteri } from "@astrojs/markdown-satteri"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

/**
 * Build-time site modes (replaces Gatsby's gatsby-plugin-page-creator setup):
 * - DISABLE_FULL_SITE=1: serve the "guard" home page (COVID cancellation
 *   notice) instead of the full site.
 * - DISABLE_DEMO_PAGES=1: omit /demo-card.
 * @returns {import("astro").AstroIntegration}
 */
function siteModes() {
  const fullSite = process.env.DISABLE_FULL_SITE !== "1"
  const demoPages = process.env.DISABLE_DEMO_PAGES !== "1"
  const full = [
    "index",
    "story",
    "schedule",
    "travel",
    "faq",
    "registry",
    "video",
    "rsvp",
    "invitation",
  ]
  return {
    name: "am-wedding:site-modes",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        if (fullSite) {
          for (const page of full) {
            injectRoute({
              pattern: page === "index" ? "/" : `/${page}`,
              entrypoint: `./src/routes/full/${page}.astro`,
            })
          }
        } else {
          injectRoute({
            pattern: "/",
            entrypoint: "./src/routes/guard/index.astro",
          })
        }
        if (demoPages) {
          injectRoute({
            pattern: "/demo-card",
            entrypoint: "./src/routes/demo/demo-card.astro",
          })
        }
      },
      // In production /s/* is served the single code-loader page by
      // src/pages/s/[...path].ts; mirror that in the dev server.
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          if (
            req.url &&
            /^\/s(\/|$)/.test(req.url) &&
            !req.url.startsWith("/s/_")
          ) {
            req.url = "/s/"
          }
          next()
        })
      },
    },
  }
}

export default defineConfig({
  site: "https://alishaandmilind.wedding",
  trailingSlash: "ignore",
  build: { format: "directory" },
  // The test harness reaches the dev server by its Docker service name.
  server: { allowedHosts: ["web"] },
  // Pages stay prerendered (static assets); only `src/pages/api/**` runs on
  // demand in the Worker. Images are still optimised with Sharp at build time
  // and pages prerendered in Node, so the static output matches the
  // adapter-less build. The jsdom unit tests (vitest.config.ts, via
  // getViteConfig) must not boot workerd, so they run without the adapter.
  adapter: process.env.VITEST
    ? undefined
    : cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
  session: false,
  integrations: [react(), siteModes()],
  vite: {
    plugins: [tailwindcss()],
  },
  // gatsby-transformer-remark did not apply SmartyPants; keep text identical.
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  // Responsive <Picture layout="..."> defaults (data-attribute CSS, low priority).
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
})
