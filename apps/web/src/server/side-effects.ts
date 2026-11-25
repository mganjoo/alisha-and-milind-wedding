import type { D1Database } from "@cloudflare/workers-types"
import { getDb } from "./db"
import { mail, type RsvpRow } from "./db/schema"
import type { ServerEnv } from "./env"

/**
 * What the onCreateRsvp Cloud Function did after an RSVP was written, minus
 * `latestRsvp` (now derived when an invitation is read) and the Google
 * Sheets row (dropped in 2026): queue a notification email. A failure is
 * logged; the RSVP itself has already been stored.
 */

/** An RSVP as stored (`comments` may be absent rather than null). */
export type StoredRsvp = Omit<RsvpRow, "comments"> & {
  comments?: string | null
}

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c
  )

export function rsvpEmail(rsvp: StoredRsvp, partyName: string) {
  return {
    subject: `New RSVP received: ${partyName}`,
    html: `
<p>Attending: ${rsvp.attending ? "yes" : "no"}</p>
<p>Code: ${escapeHtml(rsvp.code)}</p>
<p>Comments: ${rsvp.comments ? escapeHtml(rsvp.comments) : "(none)"}</p>
<ul>
${rsvp.guests
  .map(
    (guest) =>
      `<li>${escapeHtml(guest.name)}: ${guest.events.map(escapeHtml).join(", ")}</li>`
  )
  .join("\n")}
</ul>
`,
  }
}

/** Queue a notification email in `mail`. Nothing sends it yet. */
export async function queueRsvpEmail(
  db: D1Database,
  recipient: string,
  rsvp: StoredRsvp,
  partyName: string
): Promise<void> {
  const { subject, html } = rsvpEmail(rsvp, partyName)
  await getDb(db)
    .insert(mail)
    .values({
      recipient,
      subject,
      html,
      rsvpId: rsvp.id,
      createdAt: Date.now(),
    })
    .run()
}

export async function runRsvpSideEffects(
  env: ServerEnv,
  rsvp: StoredRsvp,
  partyName: string
): Promise<void> {
  try {
    await queueRsvpEmail(
      env.DB,
      env.RSVP_NOTIFY_EMAIL || "alisha.and.milind+rsvps@gmail.com",
      rsvp,
      partyName
    )
    console.log(`RSVP ${rsvp.id} (${rsvp.code}): mail queued`)
  } catch (error) {
    console.error(`RSVP ${rsvp.id} (${rsvp.code}): mail failed`, error)
  }
}
