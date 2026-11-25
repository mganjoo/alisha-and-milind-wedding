import { defineConfig } from "drizzle-kit"

// `pnpm db:generate` diffs src/server/db/schema.ts against the snapshots in
// migrations/meta and writes the next migration; wrangler applies them
// (`wrangler d1 migrations apply`), so drizzle-kit never connects to D1.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
})
