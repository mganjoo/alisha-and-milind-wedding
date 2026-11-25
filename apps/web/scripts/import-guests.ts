/**
 * Imports the guest list (parties and emails CSV exports of the wedding
 * spreadsheet) into D1, generating codes for parties without one. Replaces
 * the 2022 CLI's `invite gen-codes` + `invite update`. See the README.
 *
 *   node --experimental-strip-types scripts/import-guests.ts \
 *     --parties parties.csv --emails emails.csv [--dry-run] [--remote]
 */
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { describePlan, ImportError, planImport, toSql } from "./guests.ts"

const usage = `Usage: node --experimental-strip-types scripts/import-guests.ts \\
  --parties <parties.csv> --emails <emails.csv> [options]

Options:
  --dry-run            Print the planned changes; write nothing
  --remote             Write to the deployed D1 database (default: local)
  --db <name>          D1 binding or database name (default: DB)
  --env <name>         wrangler environment (e.g. test)
  --persist-to <dir>   Local D1 state directory (wrangler --persist-to)
  --out <file>         Where to write the parties CSV with generated codes
                       (default: <parties>.with-codes.csv)
  --sql <file>         Also keep the generated SQL in this file
  -h, --help           Show this help`

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const wranglerBin = join(appDir, "node_modules", ".bin", "wrangler")

function wranglerTarget(values: Record<string, string | boolean | undefined>) {
  return [
    "d1",
    "execute",
    String(values.db ?? "DB"),
    values.remote ? "--remote" : "--local",
    ...(values.env ? ["--env", String(values.env)] : []),
    ...(values["persist-to"]
      ? ["--persist-to", resolve(String(values["persist-to"]))]
      : []),
  ]
}

function wrangler(args: string[], capture: boolean) {
  const result = spawnSync(wranglerBin, args, {
    cwd: appDir,
    encoding: "utf8",
    stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
  })
  if (result.status !== 0) {
    throw new Error(`wrangler ${args.join(" ")} failed (${result.status})`)
  }
  return result.stdout
}

/** Invitation codes and invitee emails already in the database. */
function readExisting(target: string[]) {
  const out = wrangler(
    [
      ...target,
      "--json",
      "--command",
      "SELECT 'code' AS kind, code AS value FROM invitations" +
        " UNION ALL SELECT 'email', email FROM invitees",
    ],
    true
  )
  const [{ results }] = JSON.parse(out) as [
    { results: { kind: string; value: string }[] },
  ]
  const values = (kind: string) =>
    new Set(results.filter((r) => r.kind === kind).map((r) => r.value))
  return { codes: values("code"), emails: values("email") }
}

function main() {
  const { values } = parseArgs({
    options: {
      parties: { type: "string" },
      emails: { type: "string" },
      "dry-run": { type: "boolean" },
      remote: { type: "boolean" },
      db: { type: "string" },
      env: { type: "string" },
      "persist-to": { type: "string" },
      out: { type: "string" },
      sql: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  })
  if (values.help) {
    console.log(usage)
    return
  }
  if (!values.parties || !values.emails) {
    console.error(usage)
    process.exitCode = 2
    return
  }

  const partiesPath = resolve(values.parties)
  const target = wranglerTarget(values)
  const existing = readExisting(target)
  const plan = planImport({
    partiesCsv: readFileSync(partiesPath, "utf8"),
    emailsCsv: readFileSync(resolve(values.emails), "utf8"),
    existingCodes: existing.codes,
  })
  const where = values.remote ? "remote" : "local"
  console.log(`Database: ${values.db ?? "DB"} (${where})`)
  console.log(describePlan(plan, existing))

  if (values["dry-run"]) {
    console.log("\nDry run: nothing written.")
    return
  }

  // Codes first, so they are saved even if the database write fails (the
  // import is idempotent: rerun it with the CSV that has the codes).
  if (plan.parties.some((p) => p.generated)) {
    const out = resolve(
      values.out ??
        join(
          dirname(partiesPath),
          `${basename(partiesPath, extname(partiesPath))}.with-codes.csv`
        )
    )
    writeFileSync(out, plan.partiesCsvWithCodes)
    console.log(
      `\nWrote ${out}: import it into the spreadsheet to keep the new codes.`
    )
  }

  const sqlPath = values.sql
    ? resolve(values.sql)
    : join(mkdtempSync(join(tmpdir(), "import-guests-")), "import.sql")
  writeFileSync(sqlPath, toSql(plan))
  wrangler([...target, "--file", sqlPath], false)
  console.log(
    `Imported ${plan.parties.length} invitations and ${plan.invitees.length} invitees (${where}).`
  )
}

try {
  main()
} catch (error) {
  console.error(error instanceof ImportError ? error.message : error)
  process.exitCode = 1
}
