import type { APIRoute } from "astro"
import { jsonResponse } from "../../../server/env"
import { lookupInvitationByEmail } from "../../../server/invitations"
import { env, readJson, waitUntilFrom } from "../../../server/runtime"

export const prerender = false

/**
 * POST /api/invitations/lookup with `{ "email": "..." }`. The email travels
 * in the body, not the URL, so it stays out of request logs and browser
 * history (jsonResponse sends `Cache-Control: no-store`). There is no listing:
 * an exact email is required. A successful lookup is recorded as a view.
 */
export const POST: APIRoute = async ({ request, locals }) =>
  jsonResponse(
    await lookupInvitationByEmail(env.DB, await readJson(request), {
      waitUntil: waitUntilFrom(locals),
    })
  )
