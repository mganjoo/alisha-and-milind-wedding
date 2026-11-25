import type { D1Database } from "@cloudflare/workers-types"

/** Worker bindings, vars and secrets (see wrangler.jsonc). */
export interface ServerEnv {
  DB: D1Database
  /** Static assets (the prerendered site). */
  ASSETS: { fetch(input: URL | string): Promise<Response> }
  RSVP_NOTIFY_EMAIL?: string
  /**
   * Enables /api/test/* when set: a plain var in the local `test` env, a
   * Worker secret on the demo. Requests must send it as `x-test-token`.
   */
  TEST_API_TOKEN?: string
}

/** `ctx.waitUntil`, or a stand-in in tests. */
export type WaitUntil = (promise: Promise<unknown>) => void

/** Result of an API operation, independent of the HTTP framework. */
export type ApiResult<T> =
  | { status: 200 | 201; body: T }
  | { status: 400 | 403 | 404 | 409; error: string }

export function jsonResponse(result: ApiResult<unknown>): Response {
  const body = "body" in result ? result.body : { error: result.error }
  return new Response(JSON.stringify(body), {
    status: result.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

/**
 * Decodes a route path segment such as `:code`. Clients encode it with
 * encodeURIComponent (invitation codes may contain reserved characters like
 * `:`), but Astro hands it to the route still percent-encoded. Returns
 * undefined for a malformed escape, which routes treat as "not found".
 */
export function decodePathParam(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined
  try {
    return decodeURIComponent(raw)
  } catch {
    return undefined
  }
}

export const notFound: ApiResult<never> = { status: 404, error: "not found" }
