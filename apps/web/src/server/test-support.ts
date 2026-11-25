import type { D1Database } from "@cloudflare/workers-types"
import { eq, inArray } from "drizzle-orm"
import { ITypeSchema } from "../interfaces/Invitation"
import { getDb, isConstraintError } from "./db"
import {
  contacts,
  invitations,
  invitees,
  mail,
  type NewInvitation,
  type NewInvitee,
  rsvps,
} from "./db/schema"
import { jsonResponse, type ServerEnv } from "./env"

/**
 * Backing for /api/test/*: seeding, resetting and backend assertions for the
 * e2e suite (what the Admin SDK did against the Firestore emulator). Only
 * enabled when TEST_API_TOKEN is configured (the wrangler `test` env locally,
 * a Worker secret on the demo) and the request carries it in `x-test-token`.
 */

export function testApiEnabled(env: ServerEnv, request: Request): boolean {
  const token = env.TEST_API_TOKEN
  const given = request.headers.get("x-test-token")
  return !!token && given !== null && timingSafeEqual(given, token)
}

/** Compares in time that depends only on the longer string's length. */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  }
  return diff === 0
}

/** Fixture shapes: the schema's insert types, minus server-managed columns. */
const invitationFixtureKeys = [
  "code",
  "partyName",
  "numGuests",
  "knownGuests",
  "itype",
  "inactive",
] as const satisfies readonly (keyof NewInvitation)[]
const inviteeFixtureKeys = [
  "email",
  "code",
  "name",
  "inactive",
] as const satisfies readonly (keyof NewInvitee)[]

export type InvitationFixture = Pick<
  NewInvitation,
  (typeof invitationFixtureKeys)[number]
>
export type InviteeFixture = Pick<
  NewInvitee,
  (typeof inviteeFixtureKeys)[number]
>

/**
 * Validates the body of /api/test/seed and /api/test/reset. With
 * `optionalArrays`, a missing `invitations`/`invitees` defaults to `[]`.
 */
export function parseFixtures(
  body: unknown,
  optionalArrays: boolean
):
  | { ok: true; invitations: InvitationFixture[]; invitees: InviteeFixture[] }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "body must be a JSON object" }
  }
  const b = body as Record<string, unknown>
  const isString = (v: unknown) => typeof v === "string"
  const optional = (v: unknown, ok: (v: unknown) => boolean) =>
    v === undefined || ok(v)
  const rules: Record<
    string,
    [string, (o: Record<string, unknown>) => boolean][]
  > = {
    invitations: [
      ["string code", (o) => isString(o.code)],
      ["string partyName", (o) => isString(o.partyName)],
      [
        "integer numGuests from 1 to 14",
        (o) =>
          Number.isInteger(o.numGuests) &&
          (o.numGuests as number) >= 1 &&
          (o.numGuests as number) <= 14,
      ],
      [
        `itype, one of ${ITypeSchema.options.join(", ")}`,
        (o) => ITypeSchema.safeParse(o.itype).success,
      ],
      [
        "boolean inactive (optional)",
        (o) => optional(o.inactive, (v) => typeof v === "boolean"),
      ],
      [
        "knownGuests as a list of strings (optional)",
        (o) =>
          optional(o.knownGuests, (v) => Array.isArray(v) && v.every(isString)),
      ],
    ],
    invitees: [
      ["string email", (o) => isString(o.email)],
      ["string code", (o) => isString(o.code)],
      ["string name", (o) => isString(o.name)],
      [
        "boolean inactive (optional)",
        (o) => optional(o.inactive, (v) => typeof v === "boolean"),
      ],
    ],
  }
  const allowed: Record<string, readonly string[]> = {
    invitations: invitationFixtureKeys,
    invitees: inviteeFixtureKeys,
  }
  const lists: Record<string, unknown[]> = {}
  for (const [key, checks] of Object.entries(rules)) {
    const value = b[key] ?? (optionalArrays ? [] : undefined)
    if (!Array.isArray(value)) {
      return { ok: false, error: `${key} must be a list` }
    }
    for (const item of value) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return { ok: false, error: `each of ${key} must be an object` }
      }
      const extra = Object.keys(item).filter((k) => !allowed[key]?.includes(k))
      if (extra.length) {
        return { ok: false, error: `each of ${key}: unexpected keys: ${extra}` }
      }
      const bad = checks.find(([, ok]) => !ok(item as Record<string, unknown>))
      if (bad) return { ok: false, error: `each of ${key} needs ${bad[0]}` }
    }
    lists[key] = value
  }
  return {
    ok: true,
    invitations: lists.invitations as InvitationFixture[],
    invitees: lists.invitees as InviteeFixture[],
  }
}

/**
 * Runs a seed/reset write: 204 on success, 400 if the database rejects the
 * fixtures (a CHECK or foreign key failure, e.g. an invitee whose code has no
 * invitation; the batch is atomic, so nothing was written). Other errors
 * propagate.
 */
export async function fixtureResponse(
  write: () => Promise<void>
): Promise<Response> {
  try {
    await write()
  } catch (error) {
    if (isConstraintError(error)) {
      return jsonResponse({
        status: 400,
        error: "fixtures violate a constraint",
      })
    }
    throw error
  }
  return new Response(null, { status: 204 })
}

/**
 * (Over)write fixtures, like the Admin SDK's `set()`: an invitation that is
 * re-seeded loses its RSVPs (so it has no latest RSVP); queued mail is kept,
 * detached from the deleted RSVPs.
 */
export async function seed(
  d1: D1Database,
  invitationFixtures: InvitationFixture[],
  inviteeFixtures: InviteeFixture[]
): Promise<void> {
  const statements = seedStatements(d1, invitationFixtures, inviteeFixtures)
  const [first, ...rest] = statements
  if (first) await getDb(d1).batch([first, ...rest])
}

/**
 * Delete every row (children before parents, to respect the foreign keys),
 * then seed the fixtures, all in one atomic D1 batch.
 */
export async function reset(
  d1: D1Database,
  invitationFixtures: InvitationFixture[],
  inviteeFixtures: InviteeFixture[]
): Promise<void> {
  const db = getDb(d1)
  await db.batch([
    db.delete(mail),
    db.delete(rsvps),
    db.delete(invitees),
    db.delete(invitations),
    db.delete(contacts),
    ...seedStatements(d1, invitationFixtures, inviteeFixtures),
  ])
}

function seedStatements(
  d1: D1Database,
  invitationFixtures: InvitationFixture[],
  inviteeFixtures: InviteeFixture[]
) {
  const db = getDb(d1)
  const codes = invitationFixtures.map((i) => i.code)
  const statements = [
    ...(codes.length
      ? [
          db
            .update(mail)
            .set({ rsvpId: null })
            .where(
              inArray(
                mail.rsvpId,
                db
                  .select({ id: rsvps.id })
                  .from(rsvps)
                  .where(inArray(rsvps.code, codes))
              )
            ),
          db.delete(rsvps).where(inArray(rsvps.code, codes)),
        ]
      : []),
    ...invitationFixtures.map((i) => {
      // Only validated fields, with defaults: a re-seed without an optional
      // field resets it instead of keeping the old value.
      const row = {
        code: i.code,
        partyName: i.partyName,
        numGuests: i.numGuests,
        knownGuests: i.knownGuests ?? [],
        itype: i.itype,
        inactive: i.inactive ?? false,
      }
      return db
        .insert(invitations)
        .values(row)
        .onConflictDoUpdate({
          target: invitations.code,
          set: {
            partyName: row.partyName,
            numGuests: row.numGuests,
            knownGuests: row.knownGuests,
            itype: row.itype,
            inactive: row.inactive,
            firstViewedAt: null,
            lastViewedAt: null,
          },
        })
    }),
    ...inviteeFixtures.map((i) => {
      const row = {
        email: i.email.toLowerCase(),
        code: i.code,
        name: i.name,
        inactive: i.inactive ?? false,
      }
      return db
        .insert(invitees)
        .values(row)
        .onConflictDoUpdate({
          target: invitees.email,
          set: { name: row.name, code: row.code, inactive: row.inactive },
        })
    }),
  ]
  return statements
}

export async function findMail(d1: D1Database, subject: string) {
  return getDb(d1)
    .select({
      recipient: mail.recipient,
      subject: mail.subject,
      html: mail.html,
      rsvp_id: mail.rsvpId,
    })
    .from(mail)
    .where(eq(mail.subject, subject))
    .orderBy(mail.id)
    .all()
}
