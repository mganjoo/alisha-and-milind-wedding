import type { D1Database } from "@cloudflare/workers-types"
import { desc, eq, sql } from "drizzle-orm"
import { z } from "zod"
import type { Invitation } from "../interfaces/Invitation"
import { type Db, getDb } from "./db"
import {
  type InvitationRow,
  invitations,
  invitees,
  type RsvpRow,
  rsvps,
} from "./db/schema"
import type { ApiResult, WaitUntil } from "./env"

/**
 * Read side of the API. Mirrors firestore.rules: invitations and invitees can
 * only be fetched one at a time by id (there are no list endpoints), inactive
 * ones are refused (403, which the client treats as an error, as it did a
 * Firestore permission error), and missing ones are 404 (the client's
 * "not found").
 */

/** Test sentinel from firestore.rules: lookups by this email always fail. */
export const REJECT_REQUEST_EMAIL = "__reject_request__@example.com"

/** An invitation joined with its latest RSVP (if any). */
export interface InvitationWithRsvp {
  invitation: InvitationRow
  rsvp: RsvpRow | null
}

/** Same shape as the Firestore document the client used to read. */
export function toInvitation({
  invitation: i,
  rsvp,
}: InvitationWithRsvp): Invitation {
  const invitation: Invitation = {
    code: i.code,
    partyName: i.partyName,
    numGuests: i.numGuests,
    knownGuests: i.knownGuests,
    itype: i.itype,
  }
  if (rsvp) {
    invitation.latestRsvp = {
      attending: rsvp.attending,
      guests: rsvp.guests,
      ...(rsvp.comments !== null ? { comments: rsvp.comments } : {}),
      timestampMillis: rsvp.createdAt,
    }
  }
  return invitation
}

export async function findInvitationRow(
  d1: D1Database,
  code: string
): Promise<InvitationWithRsvp | null> {
  const db = getDb(d1)
  // One batch: a single round trip and a consistent read of both queries.
  const [invitationRows, rsvpRows] = await db.batch([
    db.select().from(invitations).where(eq(invitations.code, code)).limit(1),
    latestRsvpQuery(db, code),
  ])
  const invitation = invitationRows[0]
  return invitation ? { invitation, rsvp: rsvpRows[0] ?? null } : null
}

/**
 * The latest RSVP of an invitation is derived, not stored: the newest by
 * `created_at`, and among equal timestamps the one inserted last (`rowid`).
 * Uses the `rsvps_code_created` index.
 */
function latestRsvpQuery(db: Db, code: string) {
  return db
    .select()
    .from(rsvps)
    .where(eq(rsvps.code, code))
    .orderBy(desc(rsvps.createdAt), sql`rowid desc`)
    .limit(1)
}

/**
 * Records that an invitation was viewed (fetched through the public API).
 * Never throws: a failed write is logged and must not fail the lookup.
 */
export async function recordInvitationView(
  db: D1Database,
  code: string,
  now: number = Date.now()
): Promise<void> {
  try {
    await getDb(db)
      .update(invitations)
      .set({
        firstViewedAt: sql`coalesce(${invitations.firstViewedAt}, ${now})`,
        lastViewedAt: now,
      })
      .where(eq(invitations.code, code))
      .run()
  } catch (error) {
    console.error(`invitation ${code}: recording view failed`, error)
  }
}

/** Public lookups pass this to record a successful fetch as a view. */
export interface ViewTracking {
  waitUntil: WaitUntil
  now?: number
}

export async function getInvitationByCode(
  db: D1Database,
  code: string,
  tracking?: ViewTracking
): Promise<ApiResult<Invitation>> {
  const row = await findInvitationRow(db, code)
  if (!row) return { status: 404, error: "not found" }
  if (row.invitation.inactive) return { status: 403, error: "forbidden" }
  tracking?.waitUntil(
    recordInvitationView(db, row.invitation.code, tracking.now)
  )
  return { status: 200, body: toInvitation(row) }
}

/** Case-insensitive, as before: invitees are keyed by lower-cased email. */
export async function getInvitationByEmail(
  db: D1Database,
  email: string,
  tracking?: ViewTracking
): Promise<ApiResult<Invitation>> {
  const key = email.trim().toLowerCase()
  if (!key) return { status: 400, error: "email required" }
  if (key === REJECT_REQUEST_EMAIL) return { status: 403, error: "forbidden" }
  const invitee = await getDb(db)
    .select({ code: invitees.code, inactive: invitees.inactive })
    .from(invitees)
    .where(eq(invitees.email, key))
    .get()
  if (!invitee) return { status: 404, error: "not found" }
  if (invitee.inactive) return { status: 403, error: "forbidden" }
  return getInvitationByCode(db, invitee.code, tracking)
}

/** Body of POST /api/invitations/lookup: trimmed, case-insensitive email. */
export const EmailLookupSchema = z.strictObject({
  email: z.string().trim().toLowerCase().min(1),
})

/** Validates the lookup request body, then looks the invitation up by email. */
export async function lookupInvitationByEmail(
  db: D1Database,
  body: unknown,
  tracking?: ViewTracking
): Promise<ApiResult<Invitation>> {
  const parsed = EmailLookupSchema.safeParse(body)
  if (!parsed.success) return { status: 400, error: "email required" }
  return getInvitationByEmail(db, parsed.data.email, tracking)
}
