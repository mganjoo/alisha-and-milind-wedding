import type { APIRoute } from "astro"
import { env } from "../../../server/runtime"
import { findMail, testApiEnabled } from "../../../server/test-support"

export const prerender = false

/** Test env only: queued emails with the given subject. */
export const GET: APIRoute = async ({ url, request }) => {
  if (!testApiEnabled(env, request)) return new Response(null, { status: 404 })
  return Response.json(
    await findMail(env.DB, url.searchParams.get("subject") ?? "")
  )
}
