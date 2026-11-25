import type { APIRoute } from "astro"
import { decodePathParam, jsonResponse, notFound } from "../../../server/env"
import { getInvitationByCode } from "../../../server/invitations"
import { env, waitUntilFrom } from "../../../server/runtime"

export const prerender = false

/** GET /api/invitations/:code (a successful fetch is recorded as a view). */
export const GET: APIRoute = async ({ params, locals }) => {
  const code = decodePathParam(params.code)
  if (code === undefined) return jsonResponse(notFound)
  return jsonResponse(
    await getInvitationByCode(env.DB, code, {
      waitUntil: waitUntilFrom(locals),
    })
  )
}
