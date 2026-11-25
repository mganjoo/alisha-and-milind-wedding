import type { APIRoute } from "astro"
import { decodePathParam, jsonResponse, notFound } from "../../../../server/env"
import { createRsvp } from "../../../../server/rsvps"
import { env, readJson, waitUntilFrom } from "../../../../server/runtime"

export const prerender = false

export const POST: APIRoute = async ({ params, request, locals }) => {
  const code = decodePathParam(params.code)
  if (code === undefined) return jsonResponse(notFound)
  return jsonResponse(
    await createRsvp(env, code, await readJson(request), waitUntilFrom(locals))
  )
}
