import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import * as mailRoute from "../src/pages/api/test/mail.ts"
import * as resetRoute from "../src/pages/api/test/reset.ts"
import * as seedRoute from "../src/pages/api/test/seed.ts"
import type { ServerEnv } from "../src/server/env.ts"
import { testApiEnabled } from "../src/server/test-support.ts"

/** /api/test/*: token-guarded fixtures, reset and assertions for the e2e suite. */

const db = env.DB
const token = (env as unknown as ServerEnv).TEST_API_TOKEN as string

const fixtures = {
  invitations: [
    {
      code: "fx1",
      partyName: "Fixture Family",
      numGuests: 2,
      knownGuests: ["Fixture One"],
      itype: "a",
    },
  ],
  invitees: [
    { email: "Fixture@Example.com", code: "fx1", name: "Fixture One" },
  ],
}

const post = (
  route: { POST?: unknown },
  headers: Record<string, string>,
  body: unknown = fixtures
) =>
  (route.POST as (c: never) => Promise<Response>)({
    request: new Request("http://site/api/test/x", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    }),
  } as never)

const count = async (table: string) =>
  (
    await db
      .prepare(`SELECT count(*) AS n FROM ${table}`)
      .first<{ n: number }>()
  )?.n

describe("testApiEnabled", () => {
  const req = (t?: string) =>
    new Request("http://site/", { headers: t ? { "x-test-token": t } : {} })

  it("accepts only the exact token", () => {
    const e = { TEST_API_TOKEN: "s3cret-token" } as ServerEnv
    expect(testApiEnabled(e, req("s3cret-token"))).toBe(true)
    expect(testApiEnabled(e, req("s3cret-tokeN"))).toBe(false)
    expect(testApiEnabled(e, req("s3cret-token-longer"))).toBe(false)
    expect(testApiEnabled(e, req("s3cret"))).toBe(false)
    expect(testApiEnabled(e, req(""))).toBe(false)
    expect(testApiEnabled(e, req())).toBe(false)
  })

  it("is off when no token is configured, even for an empty header", () => {
    expect(testApiEnabled({} as ServerEnv, req(""))).toBe(false)
    expect(testApiEnabled({} as ServerEnv, req("anything"))).toBe(false)
  })
})

describe("POST /api/test/reset", () => {
  beforeEach(async () => {
    await db.batch([
      db.prepare("DELETE FROM mail"),
      db.prepare("DELETE FROM rsvps"),
      db.prepare("DELETE FROM invitees"),
      db.prepare("DELETE FROM invitations"),
      db.prepare("DELETE FROM contacts"),
      db.prepare(
        `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype, inactive)
         VALUES ('old', 'Old Party', 2, '[]', 'a', 0)`
      ),
      db.prepare(
        `INSERT INTO invitees (email, name, code, inactive) VALUES ('old@example.com', 'Old', 'old', 0)`
      ),
      db.prepare(
        `INSERT INTO rsvps (id, code, attending, guests, created_at)
         VALUES ('r1', 'old', 1, '[{"name":"Old","events":["puja"]}]', 1000)`
      ),
      db.prepare(
        `INSERT INTO mail (recipient, subject, html, rsvp_id, created_at) VALUES ('a@example.com', 's', 'h', 'r1', 1000)`
      ),
      db.prepare(
        `INSERT INTO contacts (name, email, created_at) VALUES ('C', 'c@example.com', 1000)`
      ),
    ])
  })

  it("404s without the token, or with a wrong one, and changes nothing", async () => {
    expect((await post(resetRoute, {})).status).toBe(404)
    expect((await post(resetRoute, { "x-test-token": "wrong" })).status).toBe(
      404
    )
    expect(await count("invitations")).toBe(1)
    expect(await count("rsvps")).toBe(1)
  })

  it("deletes everything (FK-safe) and seeds exactly the fixtures", async () => {
    const res = await post(resetRoute, { "x-test-token": token })
    expect(res.status).toBe(204)
    for (const t of ["mail", "rsvps", "contacts"])
      expect(await count(t)).toBe(0)
    const inv = await db.prepare("SELECT code FROM invitations").all()
    expect(inv.results).toEqual([{ code: "fx1" }])
    const people = await db.prepare("SELECT email, code FROM invitees").all()
    expect(people.results).toEqual([
      { email: "fixture@example.com", code: "fx1" },
    ])
  })

  it("is idempotent", async () => {
    for (let i = 0; i < 2; i++) {
      expect((await post(resetRoute, { "x-test-token": token })).status).toBe(
        204
      )
    }
    expect(await count("invitations")).toBe(1)
    expect(await count("invitees")).toBe(1)
  })

  it("answers 400 and rolls back entirely if the database rejects a fixture", async () => {
    const orphan = {
      invitations: fixtures.invitations,
      invitees: [{ email: "x@example.com", code: "no-such-code", name: "X" }],
    }
    for (const route of [resetRoute, seedRoute]) {
      const res = await post(route, { "x-test-token": token }, orphan)
      expect(res.status).toBe(400)
      expect(await res.json()).toHaveProperty("error")
    }
    expect(await count("rsvps")).toBe(1)
    expect(await count("invitations")).toBe(1)
    const upper = {
      ...orphan,
      invitees: [{ email: "", code: "fx1", name: "X" }],
    }
    expect(
      (await post(resetRoute, { "x-test-token": token }, upper)).status
    ).toBe(400)
    expect(await count("rsvps")).toBe(1)
  })
})

describe("re-seeding", () => {
  it("resets an invitation's view timestamps", async () => {
    await post(seedRoute, { "x-test-token": token })
    await db
      .prepare(
        "UPDATE invitations SET first_viewed_at = 5, last_viewed_at = 9 WHERE code = 'fx1'"
      )
      .run()
    expect((await post(seedRoute, { "x-test-token": token })).status).toBe(204)
    const row = await db
      .prepare(
        "SELECT first_viewed_at AS f, last_viewed_at AS l FROM invitations WHERE code = 'fx1'"
      )
      .first()
    expect(row).toEqual({ f: null, l: null })
  })
})

describe("re-seeding without optional fields", () => {
  it("resets knownGuests and inactive to their defaults", async () => {
    const full = {
      invitations: [{ ...fixtures.invitations[0], inactive: true }],
      invitees: [],
    }
    await post(seedRoute, { "x-test-token": token }, full)
    const bare = {
      invitations: [
        { code: "fx1", partyName: "Fixture Family", numGuests: 2, itype: "a" },
      ],
      invitees: [],
    }
    expect(
      (await post(seedRoute, { "x-test-token": token }, bare)).status
    ).toBe(204)
    const row = await db
      .prepare(
        "SELECT known_guests AS k, inactive AS i FROM invitations WHERE code = 'fx1'"
      )
      .first()
    expect(row).toEqual({ k: "[]", i: 0 })
  })
})

describe("malformed bodies", () => {
  const raw = (route: { POST?: unknown }, body: string) =>
    (route.POST as (c: never) => Promise<Response>)({
      request: new Request("http://site/api/test/x", {
        method: "POST",
        headers: { "content-type": "application/json", "x-test-token": token },
        body,
      }),
    } as never)

  it.each([
    ["empty", ""],
    ["invalid JSON", "{nope"],
    ["null", "null"],
    ["an array", "[]"],
    ["a string", '"x"'],
    ["invitations not a list", '{"invitations":{},"invitees":[]}'],
    ["a fixture that is not an object", '{"invitations":[1],"invitees":[]}'],
    [
      "an invitee without an email",
      '{"invitations":[],"invitees":[{"code":"a"}]}',
    ],
  ])("seed and reset answer 400 for %s", async (_, body) => {
    for (const route of [seedRoute, resetRoute]) {
      const res = await raw(route, body)
      expect(res.status).toBe(400)
      expect(await res.json()).toHaveProperty("error")
    }
  })

  const inv = fixtures.invitations[0]
  it.each([
    ["numGuests 0", { ...inv, numGuests: 0 }],
    ["numGuests 15", { ...inv, numGuests: 15 }],
    ["numGuests 1.5", { ...inv, numGuests: 1.5 }],
    ["numGuests as a string", { ...inv, numGuests: "2" }],
    ["a missing numGuests", { ...inv, numGuests: undefined }],
    ["an unknown itype", { ...inv, itype: "zz" }],
    ["a missing itype", { ...inv, itype: undefined }],
    ["a non-boolean inactive", { ...inv, inactive: 1 }],
    ["knownGuests not a list", { ...inv, knownGuests: "Fixture One" }],
    ["knownGuests with a non-string", { ...inv, knownGuests: ["A", 2] }],
    ["a misspelled key (knowGuests)", { ...inv, knowGuests: ["A"] }],
    ["a server-managed column (firstViewedAt)", { ...inv, firstViewedAt: 5 }],
  ])("rejects an invitation fixture with %s (400)", async (_, bad) => {
    for (const route of [seedRoute, resetRoute]) {
      const res = await raw(
        route,
        JSON.stringify({ invitations: [bad], invitees: [] })
      )
      expect(res.status).toBe(400)
    }
  })

  it.each([
    ["a non-string name", { email: "a@example.com", code: "fx1", name: 3 }],
    ["a missing code", { email: "a@example.com", name: "A" }],
    [
      "a non-boolean inactive",
      { email: "a@example.com", code: "fx1", name: "A", inactive: "no" },
    ],
    [
      "an unknown key",
      { email: "a@example.com", code: "fx1", name: "A", x: 1 },
    ],
  ])("rejects an invitee fixture with %s (400)", async (_, bad) => {
    const body = JSON.stringify({ invitations: [inv], invitees: [bad] })
    for (const route of [seedRoute, resetRoute]) {
      expect((await raw(route, body)).status).toBe(400)
    }
  })

  it("seed requires both lists; reset defaults them to []", async () => {
    expect((await raw(seedRoute, "{}")).status).toBe(400)
    expect((await raw(resetRoute, "{}")).status).toBe(204)
    expect(await count("invitations")).toBe(0)
  })

  it("a rejected body changes nothing", async () => {
    await post(seedRoute, { "x-test-token": token })
    expect((await raw(resetRoute, "null")).status).toBe(400)
    expect(await count("invitations")).toBe(1)
  })
})

describe("the other test endpoints", () => {
  it("seed and mail need the token", async () => {
    expect((await post(seedRoute, {})).status).toBe(404)
    expect((await post(seedRoute, { "x-test-token": token })).status).toBe(204)
    const get = (headers: Record<string, string>) =>
      (mailRoute.GET as (c: never) => Promise<Response>)({
        url: new URL("http://site/api/test/mail?subject=s"),
        request: new Request("http://site/api/test/mail?subject=s", {
          headers,
        }),
      } as never)
    expect((await get({})).status).toBe(404)
    expect((await get({ "x-test-token": token })).status).toBe(200)
  })
})
