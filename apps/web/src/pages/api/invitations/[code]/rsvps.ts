import type { APIRoute } from "astro"
import { jsonResponse } from "../../../../server/env"
import { createRsvp } from "../../../../server/rsvps"
import { env, readJson, waitUntilFrom } from "../../../../server/runtime"

export const prerender = false

export const POST: APIRoute = async ({ params, request, locals }) =>
  jsonResponse(
    await createRsvp(
      env,
      params.code ?? "",
      await readJson(request),
      waitUntilFrom(locals)
    )
  )
