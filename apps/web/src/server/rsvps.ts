import { eq, sql } from "drizzle-orm"
import type { Invitation, Rsvp } from "../interfaces/Invitation"
import { type Db, errorText, getDb, isConstraintError } from "./db"
import { invitations } from "./db/schema"
import type { ApiResult, ServerEnv, WaitUntil } from "./env"
import { findInvitationRow, toInvitation } from "./invitations"
import { runRsvpSideEffects, type StoredRsvp } from "./side-effects"

/**
 * RSVP creation. The request's shape (allowed and required keys, JSON types)
 * is checked here, as firestore.rules' `keys().hasOnly/hasAll` and `is`
 * checks did. Everything that depends on the invitation or on the guests'
 * contents is enforced by SQL (constraints in src/server/db/schema.ts and
 * the `rsvps_validate` trigger in migrations/0001_rsvp_rules.sql).
 */

const allowedKeys = new Set(["attending", "guests", "comments"])

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

export function parseRsvpRequest(
  body: unknown
): { ok: true; rsvp: Rsvp } | { ok: false; error: string } {
  if (!isObject(body)) return { ok: false, error: "body must be an object" }
  const extra = Object.keys(body).filter((k) => !allowedKeys.has(k))
  if (extra.length) return { ok: false, error: `unexpected keys: ${extra}` }
  const { attending, guests, comments } = body
  if (typeof attending !== "boolean") {
    return { ok: false, error: "attending must be a boolean" }
  }
  if (comments !== undefined && typeof comments !== "string") {
    return { ok: false, error: "comments must be a string" }
  }
  if (!Array.isArray(guests) || guests.length === 0) {
    return { ok: false, error: "guests must be a non-empty list" }
  }
  const parsedGuests: Rsvp["guests"] = []
  for (const guest of guests) {
    if (
      !isObject(guest) ||
      typeof guest.name !== "string" ||
      !Array.isArray(guest.events) ||
      !guest.events.every((e) => typeof e === "string")
    ) {
      return {
        ok: false,
        error: "each guest needs a name and a list of events",
      }
    }
    parsedGuests.push({ name: guest.name, events: guest.events as string[] })
  }
  return {
    ok: true,
    rsvp: {
      attending,
      guests: parsedGuests,
      ...(comments !== undefined ? { comments } : {}),
    },
  }
}

/** Maps a constraint/trigger failure to a client error; rethrows others. */
function constraintError(error: unknown): ApiResult<never> {
  const message = errorText(error)
  if (message.includes("rsvp: unknown invitation")) {
    return { status: 404, error: "not found" }
  }
  const rsvpError = message.match(/rsvp: [^:|]+/)
  if (rsvpError) return { status: 400, error: rsvpError[0].trim() }
  if (isConstraintError(error)) return { status: 400, error: "invalid rsvp" }
  throw error
}

/** Looks the invitation up: the refusal GET would give, or null if active. */
async function refusal(db: Db, code: string): Promise<ApiResult<never> | null> {
  const target = await db
    .select({ inactive: invitations.inactive })
    .from(invitations)
    .where(eq(invitations.code, code))
    .get()
  if (!target) return { status: 404, error: "not found" }
  if (target.inactive) return { status: 403, error: "forbidden" }
  return null
}

/**
 * Inserts the RSVP only if its invitation exists and is active, in ONE
 * statement, so an invitation deactivated concurrently cannot slip an RSVP
 * in. Returns whether a row was inserted (RETURNING id gave a row back). (An unknown code inserts nothing
 * either; the rsvps_validate trigger only runs for rows that are inserted.)
 */
export async function insertRsvpIfActive(
  db: Db,
  stored: StoredRsvp
): Promise<boolean> {
  const inserted = await db.all<{ id: string }>(sql`
    INSERT INTO rsvps (id, code, attending, guests, comments, created_at)
    SELECT ${stored.id}, ${stored.code}, ${stored.attending ? 1 : 0},
           ${JSON.stringify(stored.guests)}, ${stored.comments ?? null},
           ${stored.createdAt}
    FROM invitations
    WHERE code = ${stored.code} AND inactive = 0
    RETURNING id`)
  // Positive detection: a row came back. (Not result metadata, which may be
  // missing.)
  return inserted.length > 0
}

/**
 * Responds like GET for an unknown (404) or inactive (403) invitation, before
 * the body is looked at; then inserts the RSVP (one atomic statement that
 * re-checks the invitation; the invitation's latest RSVP is derived from the
 * rsvps table when it is read), then queues the notification email in the
 * background. Responds with the updated invitation, so the client can cache
 * it as is.
 */
export async function createRsvp(
  env: ServerEnv,
  code: string,
  body: unknown,
  waitUntil: WaitUntil,
  options: {
    now?: number
    id?: string
    /** Test seam: replaces the conditional insert. */
    insert?: typeof insertRsvpIfActive
  } = {}
): Promise<ApiResult<Invitation>> {
  const db = getDb(env.DB)
  const early = await refusal(db, code)
  if (early) return early
  const parsed = parseRsvpRequest(body)
  if (!parsed.ok) return { status: 400, error: parsed.error }
  const { rsvp } = parsed
  const stored: StoredRsvp = {
    ...rsvp,
    id: options.id ?? crypto.randomUUID(),
    code,
    createdAt: options.now ?? Date.now(),
  }
  try {
    const insert = options.insert ?? insertRsvpIfActive
    // Nothing inserted: the invitation was deactivated or deleted since the
    // check above (refuse like GET), or deactivated and then reactivated
    // meanwhile (retry once, then ask the client to retry).
    for (let attempt = 0; !(await insert(db, stored)); attempt++) {
      const late = await refusal(db, code)
      if (late) return late
      if (attempt > 0) return { status: 409, error: "conflict, retry" }
    }
  } catch (error) {
    return constraintError(error)
  }
  const row = await findInvitationRow(env.DB, code)
  if (!row) throw new Error(`invitation ${code} vanished after RSVP`)
  waitUntil(runRsvpSideEffects(env, stored, row.invitation.partyName))
  return { status: 201, body: toInvitation(row) }
}
