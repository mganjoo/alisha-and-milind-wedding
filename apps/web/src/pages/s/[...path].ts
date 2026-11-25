import type { APIRoute } from "astro"
import { env } from "../../server/runtime"

export const prerender = false

/**
 * Code links (/s/<code>, /s/<section>/<code>) are all handled client-side by
 * the single prerendered /s/ page (was a Netlify 200 rewrite).
 */
export const GET: APIRoute = ({ url }) => env.ASSETS.fetch(new URL("/s/", url))
