import { env as cloudflareEnv } from "cloudflare:workers"
import type { ServerEnv, WaitUntil } from "./env"

/** Bindings of the running Worker. */
export const env = cloudflareEnv as unknown as ServerEnv

/**
 * `ctx.waitUntil` from the adapter's locals. Typed loosely because the
 * adapter's `App.Locals` augmentation isn't visible to the workerd tests,
 * which call the routes directly.
 */
export function waitUntilFrom(locals: object): WaitUntil {
  const ctx = (
    locals as { cfContext: { waitUntil(promise: Promise<unknown>): void } }
  ).cfContext
  return (promise) => ctx.waitUntil(promise)
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}
