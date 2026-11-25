import type { D1Database } from "@cloudflare/workers-types"
import { getDb, isConstraintError } from "./db"
import { contacts } from "./db/schema"
import type { ApiResult } from "./env"

/**
 * Contacts (the old save-the-date form): write-only, exactly `name` and
 * `email` strings; the server sets the timestamp. The `__reject_submission__`
 * test sentinel is a CHECK constraint (src/server/db/schema.ts).
 */
export async function createContact(
  db: D1Database,
  body: unknown,
  now: number = Date.now()
): Promise<ApiResult<{ ok: true }>> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { status: 400, error: "body must be an object" }
  }
  const keys = Object.keys(body).sort()
  if (keys.length !== 2 || keys[0] !== "email" || keys[1] !== "name") {
    return { status: 400, error: "expected exactly name and email" }
  }
  const { name, email } = body as Record<string, unknown>
  if (typeof name !== "string" || typeof email !== "string") {
    return { status: 400, error: "name and email must be strings" }
  }
  try {
    await getDb(db)
      .insert(contacts)
      .values({ name, email, createdAt: now })
      .run()
  } catch (error) {
    if (isConstraintError(error)) {
      return { status: 400, error: "invalid contact" }
    }
    throw error
  }
  return { status: 201, body: { ok: true } }
}
