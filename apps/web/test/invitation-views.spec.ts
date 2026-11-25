import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import * as byCodeRoute from "../src/pages/api/invitations/[code].ts"
import * as lookupRoute from "../src/pages/api/invitations/lookup.ts"
import type { ServerEnv } from "../src/server/env.ts"
import {
  getInvitationByCode,
  getInvitationByEmail,
  recordInvitationView,
  type ViewTracking,
} from "../src/server/invitations.ts"

/** "Viewed" tracking: first_viewed_at / last_viewed_at on invitations. */

const db = env.DB

async function views(code = "abc") {
  return db
    .prepare(
      "SELECT first_viewed_at AS first, last_viewed_at AS last FROM invitations WHERE code = ?"
    )
    .bind(code)
    .first<{ first: number | null; last: number | null }>()
}

/** Collects waitUntil promises so a test can await them. */
function tracking(now: number) {
  const pending: Promise<unknown>[] = []
  const t: ViewTracking = { waitUntil: (p) => pending.push(p), now }
  return { t, settle: () => Promise.all(pending), pending }
}

/** Minimal Astro API context for calling the route handlers directly. */
function routeContext(
  url: string,
  params: Record<string, string> = {},
  body?: unknown
) {
  const pending: Promise<unknown>[] = []
  const context = {
    url: new URL(url),
    request: new Request(url, {
      method: body === undefined ? "GET" : "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    params,
    locals: {
      cfContext: { waitUntil: (p: Promise<unknown>) => pending.push(p) },
    },
  } as never
  return { context, settle: () => Promise.all(pending) }
}

describe("invitation views", () => {
  beforeEach(async () => {
    await db.batch([
      db.prepare("DELETE FROM mail"),
      db.prepare("DELETE FROM rsvps"),
      db.prepare("DELETE FROM invitees"),
      db.prepare("DELETE FROM invitations"),
      db.prepare(
        `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype, inactive)
         VALUES ('abc', 'Terry Gordon & Family', 3, '["Terry Gordon"]', 'a', 0),
                ('off', 'Inactive', 1, '[]', 'r', 1)`
      ),
      db.prepare(
        `INSERT INTO invitees (email, name, code, inactive)
         VALUES ('terry@example.com', 'Terry Gordon', 'abc', 0),
                ('gone@example.com', 'Gone', 'abc', 1)`
      ),
    ])
  })

  it("start out unset", async () => {
    expect(await views()).toEqual({ first: null, last: null })
  })

  it("set first and last on the first fetch by code", async () => {
    const { t, settle } = tracking(1_000)
    expect((await getInvitationByCode(db, "abc", t)).status).toBe(200)
    await settle()
    expect(await views()).toEqual({ first: 1_000, last: 1_000 })
  })

  it("keep first and advance last on later fetches", async () => {
    const one = tracking(1_000)
    await getInvitationByCode(db, "abc", one.t)
    await one.settle()
    const two = tracking(5_000)
    await getInvitationByEmail(db, "Terry@Example.com", two.t)
    await two.settle()
    expect(await views()).toEqual({ first: 1_000, last: 5_000 })
  })

  it("are set by a fetch by email", async () => {
    const { t, settle } = tracking(2_000)
    expect(
      (await getInvitationByEmail(db, "terry@example.com", t)).status
    ).toBe(200)
    await settle()
    expect(await views()).toEqual({ first: 2_000, last: 2_000 })
  })

  it("are not set by failed lookups", async () => {
    const { t, settle, pending } = tracking(3_000)
    expect((await getInvitationByCode(db, "off", t)).status).toBe(403)
    expect((await getInvitationByCode(db, "nope", t)).status).toBe(404)
    expect((await getInvitationByEmail(db, "gone@example.com", t)).status).toBe(
      403
    )
    expect((await getInvitationByEmail(db, "x@example.com", t)).status).toBe(
      404
    )
    await settle()
    expect(pending).toHaveLength(0)
    expect(await views()).toEqual({ first: null, last: null })
    expect(await views("off")).toEqual({ first: null, last: null })
  })

  it("are not set without tracking (internal reads)", async () => {
    await getInvitationByCode(db, "abc")
    expect(await views()).toEqual({ first: null, last: null })
  })

  it("are not exposed by the API", async () => {
    const { t, settle } = tracking(1_000)
    await getInvitationByCode(db, "abc", t)
    await settle()
    const again = await getInvitationByCode(db, "abc", tracking(2_000).t)
    expect("body" in again && Object.keys(again.body).sort()).toEqual([
      "code",
      "itype",
      "knownGuests",
      "numGuests",
      "partyName",
    ])
    expect(JSON.stringify(again)).not.toMatch(/view/i)
  })

  it("never fail the lookup when the write fails", async () => {
    const broken = {
      ...db,
      prepare: (sql: string) =>
        /^update "invitations"/i.test(sql)
          ? db.prepare("UPDATE no_such_table SET x = 1")
          : db.prepare(sql),
      batch: db.batch.bind(db),
    } as ServerEnv["DB"]
    const { t, settle } = tracking(1_000)
    const result = await getInvitationByCode(broken, "abc", t)
    expect(result.status).toBe(200)
    await expect(settle()).resolves.toBeDefined()
    await expect(recordInvitationView(broken, "abc")).resolves.toBeUndefined()
    expect(await views()).toEqual({ first: null, last: null })
  })

  it("are recorded by GET /api/invitations/:code", async () => {
    const { context, settle } = routeContext(
      "http://site/api/invitations/abc",
      { code: "abc" }
    )
    const res = await byCodeRoute.GET(context)
    expect(res.status).toBe(200)
    expect(Object.keys(await res.json())).not.toContain("first_viewed_at")
    await settle()
    const { first, last } = (await views()) ?? {}
    expect(first).toBeGreaterThan(0)
    expect(last).toBe(first)
  })

  it("are recorded by POST /api/invitations/lookup", async () => {
    const { context, settle } = routeContext(
      "http://site/api/invitations/lookup",
      {},
      { email: "terry@example.com" }
    )
    const res = await lookupRoute.POST(context)
    expect(res.status).toBe(200)
    await settle()
    expect((await views())?.first).toBeGreaterThan(0)
  })
})
