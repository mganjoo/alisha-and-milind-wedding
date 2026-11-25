import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { errorText, getDb, isConstraintError } from "../src/server/db/index.ts"
import type { ServerEnv } from "../src/server/env.ts"
import { getInvitationByCode } from "../src/server/invitations.ts"
import { createRsvp, insertRsvpIfActive } from "../src/server/rsvps.ts"

const serverEnv = env as unknown as ServerEnv
const db = env.DB

async function submit(
  body: unknown,
  options: {
    env?: Partial<ServerEnv>
    now?: number
  } = {}
) {
  const pending: Promise<unknown>[] = []
  const result = await createRsvp(
    { ...serverEnv, ...options.env },
    "abc",
    body,
    (p) => pending.push(p),
    { now: options.now }
  )
  await Promise.all(pending)
  return result
}

const yes = {
  attending: true,
  guests: [
    { name: "Terry Gordon", events: ["puja", "reception"] },
    { name: "Allison Little", events: ["reception"] },
  ],
  comments: "See you there",
}

const mailCount = async () =>
  (await db.prepare("SELECT count(*) AS n FROM mail").first<{ n: number }>())?.n

describe("RSVP API", () => {
  beforeEach(async () => {
    await db.batch([
      db.prepare("DELETE FROM mail"),
      db.prepare("DELETE FROM rsvps"),
      db.prepare("DELETE FROM invitees"),
      db.prepare("DELETE FROM invitations"),
      db.prepare(
        `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype)
         VALUES ('abc', 'Terry Gordon & Family', 3, '["Terry Gordon"]', 'a')`
      ),
    ])
  })

  it("rejects events when not attending (SQL trigger)", async () => {
    const result = await submit({
      attending: false,
      guests: [{ name: "Terry Gordon", events: ["reception"] }],
    })
    expect(result).toEqual({
      status: 400,
      error: "rsvp: events given when not attending",
    })
  })

  it("refuses an RSVP to an inactive invitation (403, like GET), storing and queueing nothing", async () => {
    await db.prepare("UPDATE invitations SET inactive = 1").run()
    const result = await submit(yes)
    expect(result).toEqual({ status: 403, error: "forbidden" })
    expect(
      (
        await db
          .prepare("SELECT count(*) AS n FROM rsvps")
          .first<{ n: number }>()
      )?.n
    ).toBe(0)
    expect(await mailCount()).toBe(0)
    const get = await getInvitationByCode(db, "abc")
    expect(get).toEqual(result)
  })

  it("answers 403/404 before body validation (an empty body on an inactive code is 403)", async () => {
    await db.prepare("UPDATE invitations SET inactive = 1").run()
    expect(await submit({})).toEqual({ status: 403, error: "forbidden" })
    expect(await submit(null)).toEqual({ status: 403, error: "forbidden" })
    expect(await createRsvp(serverEnv, "nope", {}, () => {})).toEqual({
      status: 404,
      error: "not found",
    })
    await db.prepare("UPDATE invitations SET inactive = 0").run()
    expect((await submit({})).status).toBe(400)
  })

  it("the insert itself refuses an invitation deactivated after the pre-check", async () => {
    const stored = {
      id: "race1",
      code: "abc",
      attending: true,
      guests: yes.guests,
      comments: null,
      createdAt: 5000,
    }
    // The pre-check saw an active invitation; then it was deactivated.
    await db.prepare("UPDATE invitations SET inactive = 1").run()
    expect(await insertRsvpIfActive(getDb(db), stored)).toBe(false)
    expect(
      (
        await db
          .prepare("SELECT count(*) AS n FROM rsvps")
          .first<{ n: number }>()
      )?.n
    ).toBe(0)
    expect(
      await insertRsvpIfActive(getDb(db), { ...stored, code: "nope" })
    ).toBe(false)
    await db.prepare("UPDATE invitations SET inactive = 0").run()
    expect(await insertRsvpIfActive(getDb(db), stored)).toBe(true)
    const row = await db
      .prepare("SELECT id, attending, comments, created_at AS t FROM rsvps")
      .first()
    expect(row).toEqual({ id: "race1", attending: 1, comments: null, t: 5000 })
    // Trigger validation still applies to the conditional insert.
    await expect(
      insertRsvpIfActive(getDb(db), { ...stored, id: "r2", guests: [] })
    ).rejects.toThrow()
  })

  it("retries the conditional insert once when nothing was inserted but the invitation is active again", async () => {
    let calls = 0
    const flaky: typeof insertRsvpIfActive = (d, stored) => {
      calls++
      return calls === 1
        ? Promise.resolve(false)
        : insertRsvpIfActive(d, stored)
    }
    const pending: Promise<unknown>[] = []
    const result = await createRsvp(
      serverEnv,
      "abc",
      yes,
      (p) => pending.push(p),
      { insert: flaky }
    )
    await Promise.all(pending)
    expect(result.status).toBe(201)
    expect(calls).toBe(2)
  })

  it("answers 409 (not a 500) when the retry also inserts nothing on an active invitation", async () => {
    let calls = 0
    const never: typeof insertRsvpIfActive = () => {
      calls++
      return Promise.resolve(false)
    }
    const result = await createRsvp(serverEnv, "abc", yes, () => {}, {
      insert: never,
    })
    expect(result).toEqual({ status: 409, error: "conflict, retry" })
    expect(calls).toBe(2)
    expect(await mailCount()).toBe(0)
  })

  it("still accepts an RSVP to an active invitation, and 404s an unknown one", async () => {
    expect((await submit(yes)).status).toBe(201)
    const unknown = await createRsvp(serverEnv, "nope", yes, () => {})
    expect(unknown).toEqual({ status: 404, error: "not found" })
  })

  it("classifies errors on the SQLite message, not on echoed user text", async () => {
    const result = await submit({
      attending: true,
      guests: [{ name: " ", events: [] }],
      comments: "rsvp: unknown invitation; constraint failed",
    })
    expect(result).toEqual({ status: 400, error: "rsvp: invalid guest" })
    const named = await submit({
      attending: true,
      guests: [
        {
          name: "rsvp: unknown invitation constraint failed",
          events: ["nope"],
        },
      ],
    })
    expect(named).toEqual({
      status: 400,
      error: "rsvp: event not open to this invitation",
    })
  })

  it("rethrows a non-constraint failure whose params say 'constraint failed'", async () => {
    const outage = new Error(
      "Failed query: insert ... params: constraint failed, rsvp: unknown invitation",
      { cause: new Error("D1_ERROR: network connection lost") }
    )
    expect(isConstraintError(outage)).toBe(false)
    expect(errorText(outage)).toBe("D1_ERROR: network connection lost")
    const real = new Error("Failed query: x", {
      cause: new Error("D1_ERROR: constraint failed: SQLITE_CONSTRAINT"),
    })
    expect(isConstraintError(real)).toBe(true)
  })

  it("leaves no trace when an RSVP is rejected", async () => {
    await submit({ attending: true, guests: [{ name: " ", events: [] }] })
    const count = await db
      .prepare("SELECT count(*) AS n FROM rsvps")
      .first<{ n: number }>()
    expect(count?.n).toBe(0)
    const invitation = await getInvitationByCode(db, "abc")
    expect("body" in invitation && invitation.body.latestRsvp).toBeFalsy()
    expect(await mailCount()).toBe(0)
  })

  it("returns the invitation with the newest RSVP as latestRsvp", async () => {
    await submit(yes, { now: 1_000 })
    const second = await submit(
      { attending: false, guests: [{ name: "Terry Gordon", events: [] }] },
      { now: 2_000 }
    )
    expect(second.status).toBe(201)
    const expected = {
      attending: false,
      guests: [{ name: "Terry Gordon", events: [] }],
      timestampMillis: 2_000,
    }
    expect("body" in second && second.body.latestRsvp).toEqual(expected)
    const read = await getInvitationByCode(db, "abc")
    expect("body" in read && read.body.latestRsvp).toEqual(expected)
  })

  describe("latest RSVP (derived from the rsvps table)", () => {
    const latestOf = async () => {
      const result = await getInvitationByCode(db, "abc")
      return "body" in result ? result.body.latestRsvp : undefined
    }
    const insertRsvp = (id: string, createdAt: number, comments: string) =>
      db
        .prepare(
          `INSERT INTO rsvps (id, code, attending, guests, comments, created_at)
           VALUES (?, 'abc', 1, '[{"name":"Terry Gordon","events":["reception"]}]', ?, ?)`
        )
        .bind(id, comments, createdAt)
        .run()

    it("is absent for an invitation without RSVPs", async () => {
      const result = await getInvitationByCode(db, "abc")
      expect(result.status).toBe(200)
      expect("body" in result && "latestRsvp" in result.body).toBe(false)
    })

    it("is the newest by created_at, whatever the insert order", async () => {
      await insertRsvp("b", 2_000, "newest")
      await insertRsvp("a", 1_000, "older")
      await insertRsvp("c", 500, "oldest")
      expect((await latestOf())?.comments).toBe("newest")
      expect((await latestOf())?.timestampMillis).toBe(2_000)
    })

    it("breaks created_at ties deterministically (last inserted wins)", async () => {
      // Ids sort against insertion order on purpose.
      await insertRsvp("z", 1_000, "first")
      await insertRsvp("m", 1_000, "second")
      await insertRsvp("a", 1_000, "third")
      for (let i = 0; i < 3; i++) {
        expect((await latestOf())?.comments).toBe("third")
      }
    })

    it("sees a new RSVP immediately", async () => {
      await submit(yes, { now: 1_000 })
      expect((await latestOf())?.timestampMillis).toBe(1_000)
      await submit(
        { attending: false, guests: [{ name: "Terry Gordon", events: [] }] },
        { now: 1_001 }
      )
      expect(await latestOf()).toMatchObject({
        attending: false,
        timestampMillis: 1_001,
      })
    })

    it("ignores other invitations' RSVPs", async () => {
      await db
        .prepare(
          `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype)
           VALUES ('other', 'Other', 1, '[]', 'r')`
        )
        .run()
      await db
        .prepare(
          `INSERT INTO rsvps (id, code, attending, guests, created_at)
           VALUES ('o', 'other', 1, '[{"name":"X","events":["reception"]}]', 9000)`
        )
        .run()
      expect(await latestOf()).toBeUndefined()
    })

    it("has no stored copy on the invitation row", async () => {
      const columns = await db
        .prepare("SELECT name FROM pragma_table_info('invitations')")
        .all<{ name: string }>()
      expect(columns.results.map((c) => c.name)).not.toContain("latest_rsvp_id")
    })
  })

  it("queues the notification email", async () => {
    await submit(yes)
    const mail = await db
      .prepare("SELECT recipient, subject, html FROM mail")
      .first<{ recipient: string; subject: string; html: string }>()
    expect(mail?.recipient).toBe("rsvps@example.com")
    expect(mail?.subject).toBe("New RSVP received: Terry Gordon & Family")
    expect(mail?.html).toContain("<li>Terry Gordon: puja, reception</li>")
  })

  it("still stores the RSVP when queueing the email fails", async () => {
    // Point the mail step at a table that doesn't exist.
    const broken = {
      ...serverEnv.DB,
      prepare: (sql: string) =>
        /^insert into "mail"/i.test(sql)
          ? serverEnv.DB.prepare("INSERT INTO no_such_table VALUES (1)")
          : serverEnv.DB.prepare(sql),
      batch: serverEnv.DB.batch.bind(serverEnv.DB),
    } as ServerEnv["DB"]
    const result = await submit(yes, { env: { DB: broken } })
    expect(result.status).toBe(201)
    expect("body" in result && result.body.latestRsvp?.comments).toBe(
      "See you there"
    )
    expect(await mailCount()).toBe(0)
  })
})
