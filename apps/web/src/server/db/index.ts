import type { D1Database } from "@cloudflare/workers-types"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema"

/** Drizzle on a D1 binding. Cheap: create one per request. */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export type Db = ReturnType<typeof getDb>

/**
 * The innermost cause of an error. Drizzle wraps D1 errors ("Failed query:
 * ..."), and its message echoes the query's params (guest names, comments),
 * so only the innermost error (the D1/SQLite one) is safe to classify on.
 */
export function rootCause(error: unknown): unknown {
  let e = error
  for (let i = 0; i < 10; i++) {
    const cause = (e as { cause?: unknown } | null | undefined)?.cause
    if (cause === undefined || cause === null) break
    e = cause
  }
  return e
}

/** Message of the innermost cause (the constraint or trigger message). */
export function errorText(error: unknown): string {
  const e = rootCause(error)
  return String((e as Error | null | undefined)?.message ?? e)
}

/** A constraint, CHECK or trigger failure (as opposed to an outage). */
export const isConstraintError = (error: unknown) =>
  /constraint failed|SQLITE_CONSTRAINT/i.test(errorText(error))
