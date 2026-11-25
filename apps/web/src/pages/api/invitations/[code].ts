import type { APIRoute } from "astro"
import { jsonResponse } from "../../../server/env"
import { getInvitationByCode } from "../../../server/invitations"
import { env, waitUntilFrom } from "../../../server/runtime"

export const prerender = false

/** GET /api/invitations/:code (a successful fetch is recorded as a view). */
export const GET: APIRoute = async ({ params, locals }) =>
  jsonResponse(
    await getInvitationByCode(env.DB, params.code ?? "", {
      waitUntil: waitUntilFrom(locals),
    })
  )
