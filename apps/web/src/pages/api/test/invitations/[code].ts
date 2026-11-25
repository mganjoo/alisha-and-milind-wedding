import type { APIRoute } from "astro"
import { decodePathParam } from "../../../../server/env"
import { findInvitationRow, toInvitation } from "../../../../server/invitations"
import { env } from "../../../../server/runtime"
import { testApiEnabled } from "../../../../server/test-support"

export const prerender = false

/**
 * Test env only: an invitation ignoring visibility rules (with its derived
 * latestRsvp), plus its internal fields (inactive, view timestamps). Not recorded as a view.
 */
export const GET: APIRoute = async ({ params, request }) => {
  if (!testApiEnabled(env, request)) return new Response(null, { status: 404 })
  const code = decodePathParam(params.code)
  if (code === undefined) return new Response(null, { status: 404 })
  const row = await findInvitationRow(env.DB, code)
  if (!row) return new Response(null, { status: 404 })
  return Response.json({
    ...toInvitation(row),
    inactive: row.invitation.inactive,
    firstViewedAt: row.invitation.firstViewedAt,
    lastViewedAt: row.invitation.lastViewedAt,
  })
}
