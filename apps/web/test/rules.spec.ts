import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import * as contactsRoute from "../src/pages/api/contacts.ts"
import * as lookupRoute from "../src/pages/api/invitations/lookup.ts"
import { createContact } from "../src/server/contacts.ts"
import type { ApiResult, ServerEnv } from "../src/server/env.ts"
import {
  getInvitationByCode,
  getInvitationByEmail,
} from "../src/server/invitations.ts"
import { createRsvp } from "../src/server/rsvps.ts"

/**
 * Port of functions/test/firestore-rules.spec.ts (same describe/it titles).
 * The rules now live in two places: the API (request shape, read visibility,
 * get-by-id only) and SQL (constraints and the rsvps_validate trigger), so
 * each test calls whichever layer now owns the rule:
 *
 * - "allow" = 2xx from the API, "reject" = 4xx (Firestore: permission
 *   denied). Reading a missing document was allowed (empty result); that is
 *   now a 404, which the client treats as "not found", not as an error.
 * - `createdAt` is set by the server, so the "missing/wrong timestamp" tests
 *   check that SQL refuses such rows and that clients can't supply one.
 * - "reject queries/reads" tests check that no listing exists: the routes
 *   only look up one exact key.
 */

const serverEnv = env as unknown as ServerEnv
const db = env.DB
const noSideEffects = () => {}
const noLocals = { cfContext: { waitUntil: noSideEffects } }

function rsvp(code: string, body: unknown) {
  return createRsvp(serverEnv, code, body, noSideEffects)
}

async function assertSucceeds(result: Promise<ApiResult<unknown>>) {
  const r = await result
  expect(r.status, JSON.stringify(r)).toBeLessThan(300)
}

async function assertFails(result: Promise<ApiResult<unknown>>) {
  const r = await result
  expect(r.status, JSON.stringify(r)).toBeGreaterThanOrEqual(400)
}

async function assertNotFound(result: Promise<ApiResult<unknown>>) {
  expect((await result).status).toBe(404)
}

async function initializeInvitation(i: {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  itype: string
  inactive?: boolean
}) {
  await db
    .prepare(
      `INSERT INTO invitations (code, party_name, num_guests, known_guests, itype, inactive)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      i.code,
      i.partyName,
      i.numGuests,
      JSON.stringify(i.knownGuests),
      i.itype,
      i.inactive ? 1 : 0
    )
    .run()
}

async function initializeInvitee(
  email: string,
  i: { name: string; code: string; inactive?: boolean }
) {
  await db
    .prepare(
      "INSERT INTO invitees (email, name, code, inactive) VALUES (?, ?, ?, ?)"
    )
    .bind(email, i.name, i.code, i.inactive ? 1 : 0)
    .run()
}

const terry = {
  code: "abc",
  partyName: "Terry Gordon & Family",
  numGuests: 3,
  knownGuests: ["Terry Gordon", "Allison Little", "Arnold James"],
  // Required now (NOT NULL); Firestore allowed invitations without one.
  itype: "a",
}

describe("Firestore rules", () => {
  beforeEach(async () => {
    await db.batch([
      db.prepare("DELETE FROM mail"),
      db.prepare("DELETE FROM contacts"),
      db.prepare("DELETE FROM rsvps"),
      db.prepare("DELETE FROM invitees"),
      db.prepare("DELETE FROM invitations"),
    ])
  })

  describe("for Contacts collection", () => {
    it("should allow writes containing name, email and createdAt timestamp", async () => {
      await assertSucceeds(
        createContact(db, { name: "Lorem Ipsum", email: "lorem@example.com" })
      )
      const row = await db
        .prepare("SELECT created_at FROM contacts")
        .first<{ created_at: number }>()
      expect(row?.created_at).toBeGreaterThan(0)
    })

    it("should reject writes with missing name", async () => {
      await assertFails(createContact(db, { email: "lorem@example.com" }))
    })

    it("should reject writes with missing email", async () => {
      await assertFails(createContact(db, { name: "Jack Jones" }))
    })

    it("should reject writes with missing timestamp", async () => {
      // The API always stamps; SQL refuses a row without one.
      await expect(
        db
          .prepare("INSERT INTO contacts (name, email) VALUES (?, ?)")
          .bind("Jack Jones", "jack.jones@gmail.com")
          .run()
      ).rejects.toThrow(/NOT NULL/)
    })

    it("should reject writes with timestamp of wrong type", async () => {
      await assertFails(
        createContact(db, {
          name: "Jack Jones",
          email: "jack.jones@gmail.com",
          timestamp: "wrong type",
        })
      )
      await expect(
        db
          .prepare(
            "INSERT INTO contacts (name, email, created_at) VALUES (?, ?, ?)"
          )
          .bind("Jack Jones", "jack.jones@gmail.com", "wrong type")
          .run()
      ).rejects.toThrow(/CHECK constraint failed: contacts_created_at_type/)
    })

    it("should reject writes with extra fields", async () => {
      await assertFails(
        createContact(db, {
          name: "Lorem Ipsum",
          email: "lorem@example.com",
          extra: true,
        })
      )
    })

    it("should reject writes with special field", async () => {
      await assertFails(
        createContact(db, {
          name: "__reject_submission__",
          email: "lorem@example.com",
        })
      )
    })

    it("should reject all reads", async () => {
      // Write-only: the route has no GET handler and there is no read API.
      expect(Object.keys(contactsRoute)).not.toContain("GET")
      expect(Object.keys(contactsRoute)).toContain("POST")
    })
  })

  describe("for Invitations collection", () => {
    it("should allow reading a single non-existent code", async () => {
      await assertNotFound(getInvitationByCode(db, "abc"))
    })

    it("should allow reading a single code with 'inactive' unset", async () => {
      await initializeInvitation(terry)
      await assertSucceeds(getInvitationByCode(db, "abc"))
    })

    it("should reject reading a single code with 'inactive' set", async () => {
      await initializeInvitation({ ...terry, inactive: true })
      const result = await getInvitationByCode(db, "abc")
      expect(result.status).toBe(403)
    })

    it("should reject queries for codes", async () => {
      await initializeInvitation(terry)
      // There is no /api/invitations listing route (src/pages/api/invitations/
      // has no index.ts), and the lookup route only accepts POST with an
      // exact email.
      expect(Object.keys(lookupRoute).sort()).toEqual(["POST", "prerender"])
      const res = await lookupRoute.POST({
        request: new Request("http://site/api/invitations/lookup", {
          method: "POST",
          body: "{}",
        }),
        locals: noLocals,
      } as never)
      expect(res.status).toBe(400)
    })
  })

  describe("for Invitees collection", () => {
    it("should allow reading a single non-existent email", async () => {
      await assertNotFound(getInvitationByEmail(db, "abc"))
    })

    it("should allow reading a single email with 'inactive' unset", async () => {
      await initializeInvitation(terry)
      await initializeInvitee("abc@example.com", {
        name: "Jack Jones",
        code: "abc",
      })
      await assertSucceeds(getInvitationByEmail(db, "abc@example.com"))
      // Case-insensitive, as before (the client lower-cased the id).
      await assertSucceeds(getInvitationByEmail(db, "ABC@Example.com"))
    })

    it("should reject reading a single email with 'inactive' set", async () => {
      await initializeInvitation(terry)
      await initializeInvitee("abc@example.com", {
        name: "Jack Jones",
        code: "abc",
        inactive: true,
      })
      const result = await getInvitationByEmail(db, "abc@example.com")
      expect(result.status).toBe(403)
    })

    it("should reject query for special email", async () => {
      const result = await getInvitationByEmail(
        db,
        "__reject_request__@example.com"
      )
      expect(result.status).toBe(403)
    })

    it("should reject queries for emails", async () => {
      await initializeInvitation(terry)
      await initializeInvitee("abc@example.com", {
        name: "Jack Jones",
        code: "abc",
      })
      // Only exact matches: a prefix or pattern finds nothing.
      await assertNotFound(getInvitationByEmail(db, "a"))
      await assertNotFound(getInvitationByEmail(db, "%"))
      const res = await lookupRoute.POST({
        request: new Request("http://site/api/invitations/lookup", {
          method: "POST",
          body: JSON.stringify({ email: "" }),
        }),
        locals: noLocals,
      } as never)
      expect(res.status).toBe(400)
    })
  })

  describe("for Invitations/Rsvps collection", () => {
    beforeEach(async () => {
      await initializeInvitation(terry)
      await initializeInvitation({
        code: "xyz",
        partyName: "John Jacobs",
        numGuests: 3,
        knownGuests: ["JohnJacobs"],
        itype: "w",
      })
      await initializeInvitation({
        code: "efg",
        partyName: "Chandler Bing",
        numGuests: 1,
        itype: "sr",
        knownGuests: ["Chandler Bing"],
      })
      await initializeInvitation({
        code: "ghi",
        partyName: "James Johnson",
        numGuests: 1,
        itype: "r",
        knownGuests: ["James Johnson"],
      })
    })

    it("should allow writes containing attending, guests, and createdAt timestamp", async () => {
      const before = Date.now()
      const result = await rsvp("abc", {
        attending: true,
        guests: [
          {
            name: "Terry Gordon",
            events: ["sangeet", "haldi", "ceremony"],
          },
          { name: "Allison Little", events: ["sangeet"] },
          {
            name: "Vishal Shekhar",
            events: ["sangeet", "ceremony"],
          },
        ],
      })
      expect(result.status).toBe(201)
      // The server sets the timestamp, and the invitation's latest RSVP.
      const latest = "body" in result ? result.body.latestRsvp : undefined
      expect(latest?.timestampMillis).toBeGreaterThanOrEqual(before)
      expect(latest?.guests).toHaveLength(3)
    })

    it("should allow writes containing attending, guests, comments and createdAt timestamp", async () => {
      await assertSucceeds(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "haldi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
          ],
          comments: "Hope to have a fun time!",
        })
      )
    })

    it("should reject writes containing missing timestamp", async () => {
      // Clients can't set the timestamp at all...
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [{ name: "Terry Gordon", events: ["sangeet"] }],
          createdAt: Date.now(),
        })
      )
      // ...and SQL refuses a row without one.
      await expect(
        db
          .prepare(
            "INSERT INTO rsvps (id, code, attending, guests) VALUES (?, ?, ?, ?)"
          )
          .bind(
            "r1",
            "abc",
            1,
            JSON.stringify([
              { name: "Terry Gordon", events: ["sangeet", "ceremony"] },
              { name: "Allison Little", events: ["sangeet"] },
            ])
          )
          .run()
      ).rejects.toThrow(/NOT NULL/)
    })

    it("should reject writes containing missing attending status", async () => {
      await assertFails(
        rsvp("abc", {
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "haldi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
        })
      )
    })

    it("should reject writes containing missing guest list", async () => {
      await assertFails(rsvp("abc", { attending: true }))
    })

    it("should reject writes containing comments of invalid type", async () => {
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
          comments: 1234,
        })
      )
    })

    it("should reject writes containing empty guest list", async () => {
      await assertFails(rsvp("abc", { attending: true, guests: [] }))
      // Also enforced by SQL.
      await expect(
        db
          .prepare(
            "INSERT INTO rsvps (id, code, attending, guests, created_at) VALUES (?, ?, ?, ?, ?)"
          )
          .bind("r1", "abc", 1, "[]", Date.now())
          .run()
      ).rejects.toThrow(/CHECK constraint failed/)
    })

    it("should reject writes for non-existent code", async () => {
      const result = await rsvp("non_existent", {
        attending: true,
        guests: [
          {
            name: "Terry Gordon",
            events: ["sangeet", "ceremony"],
          },
        ],
      })
      expect(result.status).toBe(404)
    })

    it("should reject writes containing more guests than invited", async () => {
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "haldi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
            { name: "Betsy Crocker", events: ["ceremony"] },
          ],
        })
      )
    })

    it("should reject writes where guest map does not contain name", async () => {
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              events: ["sangeet", "haldi", "ceremony"],
            },
          ],
        })
      )
    })

    it("should reject writes where guest name is empty", async () => {
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              name: "   ",
              events: ["sangeet", "haldi", "ceremony"],
            },
          ],
        })
      )
    })

    it("should reject writes where events list has invalid name", async () => {
      await assertFails(
        rsvp("abc", {
          attending: true,
          guests: [
            {
              name: "John James",
              events: ["sangeet", "whatever", "ceremony"],
            },
          ],
        })
      )
    })

    it("should reject writes when itype != a, RSVP includes pre-events", async () => {
      await assertFails(
        // itype = w
        rsvp("xyz", {
          attending: true,
          guests: [
            {
              name: "John Jacobs",
              events: ["sangeet", "haldi", "ceremony"],
            },
          ],
        })
      )
      // itype = sr
      await assertFails(
        rsvp("efg", {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "haldi", "reception"],
            },
          ],
        })
      )
      // itype = r
      await assertFails(
        rsvp("ghi", {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["haldi", "reception"],
            },
          ],
        })
      )
    })

    it("should accept writes when itype != a, RSVP does not include pre-events", async () => {
      await assertSucceeds(
        // itype = w
        rsvp("xyz", {
          attending: true,
          guests: [
            {
              name: "John Jacobs",
              events: ["sangeet", "ceremony", "reception"],
            },
          ],
        })
      )
    })

    it("should reject writes when itype != a and itype != w, RSVP includes ceremony", async () => {
      await assertFails(
        // itype = sr
        rsvp("efg", {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "ceremony"],
            },
          ],
        })
      )
      await assertFails(
        // itype = r
        rsvp("ghi", {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["ceremony", "reception"],
            },
          ],
        })
      )
    })

    it("should accept writes when itype != a and itype != w, RSVP does not include ceremony", async () => {
      await assertSucceeds(
        // itype = sr
        rsvp("efg", {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "reception"],
            },
          ],
        })
      )
    })

    it("should reject writes when itype = r, RSVP includes sangeet", async () => {
      await assertFails(
        // itype = r
        rsvp("ghi", {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["sangeet", "reception"],
            },
          ],
        })
      )
    })

    it("should accept writes when itype = r, RSVP does not include sangeet", async () => {
      await assertSucceeds(
        // itype = r
        rsvp("ghi", {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["reception"],
            },
          ],
        })
      )
    })
  })
})
