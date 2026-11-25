import { expect, test } from "@playwright/test"

/**
 * Checks that only make sense against a deployed build (skipped on the local
 * harness): the production config, not the `test` environment.
 */
test.describe("deployed build", () => {
  test.skip(
    !!process.env.BASE_URL?.match(/web-preview|web:|localhost/),
    "deployed builds only"
  )

  test("email lookups are POST-only and uncached", async ({ request }) => {
    const get = await request.get("/api/invitations?email=nobody@example.com")
    expect(get.status()).toBe(404)
    const post = await request.post("/api/invitations/lookup", {
      data: { email: "nobody@example.com" },
    })
    expect(post.status()).toBe(404)
    expect(post.headers()["cache-control"]).toContain("no-store")
  })

  test("analytics beacon is built in", async ({ request }) => {
    test.skip(
      !process.env.PUBLIC_CF_ANALYTICS_TOKEN,
      "PUBLIC_CF_ANALYTICS_TOKEN not set"
    )
    const html = await (await request.get("/")).text()
    expect(html).toContain("static.cloudflareinsights.com/beacon.min.js")
  })
})
