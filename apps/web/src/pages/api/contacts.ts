import type { APIRoute } from "astro"
import { createContact } from "../../server/contacts"
import { jsonResponse } from "../../server/env"
import { env, readJson } from "../../server/runtime"

export const prerender = false

export const POST: APIRoute = async ({ request }) =>
  jsonResponse(await createContact(env.DB, await readJson(request)))
