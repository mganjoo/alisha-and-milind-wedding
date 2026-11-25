import type { D1Migration } from "cloudflare:test"
import type { ServerEnv } from "../src/server/env"

declare global {
  namespace Cloudflare {
    interface Env extends Omit<ServerEnv, "DB" | "ASSETS"> {
      DB: D1Database
      TEST_MIGRATIONS: D1Migration[]
    }
  }
}
