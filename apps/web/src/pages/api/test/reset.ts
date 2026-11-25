import type { APIRoute } from "astro"
import { jsonResponse } from "../../../server/env"
import { env, readJson } from "../../../server/runtime"
import {
  fixtureResponse,
  parseFixtures,
  reset,
  testApiEnabled,
} from "../../../server/test-support"

export const prerender = false

/**
 * Test API only: delete every row (rsvps, mail, invitees, invitations,
 * contacts), then seed the given fixtures, like /api/test/seed.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!testApiEnabled(env, request)) return new Response(null, { status: 404 })
  const parsed = parseFixtures(await readJson(request), true)
  if (!parsed.ok) return jsonResponse({ status: 400, error: parsed.error })
  return fixtureResponse(() =>
    reset(env.DB, parsed.invitations, parsed.invitees)
  )
}
