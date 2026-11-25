import type { APIRoute } from "astro"
import { jsonResponse } from "../../../server/env"
import { env, readJson } from "../../../server/runtime"
import {
  fixtureResponse,
  parseFixtures,
  seed,
  testApiEnabled,
} from "../../../server/test-support"

export const prerender = false

/** Test env only: (over)write fixture invitations and invitees. */
export const POST: APIRoute = async ({ request }) => {
  if (!testApiEnabled(env, request)) return new Response(null, { status: 404 })
  const parsed = parseFixtures(await readJson(request), false)
  if (!parsed.ok) return jsonResponse({ status: 400, error: parsed.error })
  return fixtureResponse(() =>
    seed(env.DB, parsed.invitations, parsed.invitees)
  )
}
