import type { APIRoute } from "astro"

export const prerender = false

/** Old printed links: /load?c=<code> -> /s/invitation/<code>. */
export const GET: APIRoute = ({ url, redirect }) => {
  const code = url.searchParams.get("c")
  return code
    ? redirect(`/s/invitation/${encodeURIComponent(code)}`, 301)
    : redirect("/", 302)
}
