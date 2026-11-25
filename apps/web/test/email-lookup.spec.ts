import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import * as lookupRoute from "../src/pages/api/invitations/lookup.ts"

/** POST /api/invitations/lookup: the email is in the body, never the URL. */

const db = env.DB

async function lookup(body: unknown, raw = false) {
  const pending: Promise<unknown>[] = []
  const request = new Request("http://site/api/invitations/lookup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  })
  const context = {
    request,
    locals: {
      cfContext: { waitUntil: (p: Promise<unknown>) => pending.push(p) },
    },
  } as never
  const res = await lookupRoute.POST(context)
  await Promise.all(pending)
  return res
}

describe("POST /api/invitations/lookup", () => {
  beforeEach(async () => {
    await db.batch([
      db.prepare("DELETE FROM mail"),
      db.prepare("DELETE FROM rsvps"),
      db.prepare("DELETE FROM invitees"),
      db.prepare("DELETE FROM invitations"),
      db.prepare(
        `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype, inactive)
         VALUES ('abc', 'Terry Gordon & Family', 3, '["Terry Gordon"]', 'a', 0)`
      ),
      db.prepare(
        `INSERT INTO invitees (email, name, code, inactive)
         VALUES ('terry@example.com', 'Terry Gordon', 'abc', 0),
                ('gone@example.com', 'Gone', 'abc', 1)`
      ),
    ])
  })

  it("returns the invitation (200), no-store", async () => {
    const res = await lookup({ email: "terry@example.com" })
    expect(res.status).toBe(200)
    expect(res.headers.get("cache-control")).toBe("no-store")
    expect(await res.json()).toMatchObject({ code: "abc", itype: "a" })
  })

  it("trims and ignores case", async () => {
    const res = await lookup({ email: "  Terry@Example.COM " })
    expect(res.status).toBe(200)
  })

  it("404s an unknown email, no-store", async () => {
    const res = await lookup({ email: "nobody@example.com" })
    expect(res.status).toBe(404)
    expect(res.headers.get("cache-control")).toBe("no-store")
  })

  it("403s an inactive invitee and the reject sentinel", async () => {
    expect((await lookup({ email: "gone@example.com" })).status).toBe(403)
    expect(
      (await lookup({ email: "__Reject_Request__@example.com" })).status
    ).toBe(403)
  })

  it("403s an inactive invitation", async () => {
    await db.prepare("UPDATE invitations SET inactive = 1").run()
    expect((await lookup({ email: "terry@example.com" })).status).toBe(403)
  })

  it.each([
    ["missing email", {}],
    ["empty email", { email: "" }],
    ["blank email", { email: "   " }],
    ["non-string email", { email: 5 }],
    ["extra keys", { email: "terry@example.com", code: "abc" }],
    ["a non-object body", ["terry@example.com"]],
  ])("400s %s", async (_name, body) => {
    const res = await lookup(body)
    expect(res.status).toBe(400)
    expect(res.headers.get("cache-control")).toBe("no-store")
  })

  it("400s a body that is not JSON", async () => {
    expect((await lookup("not json", true)).status).toBe(400)
  })

  it("only exports POST (no GET, no listing)", () => {
    expect(Object.keys(lookupRoute).sort()).toEqual(["POST", "prerender"])
  })
})
