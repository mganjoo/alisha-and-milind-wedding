# Alisha and Milind's Wedding Website

Built in 2019–2022 with Gatsby; rewritten in 2026 on Astro. A Playwright suite
covers function, accessibility and visual regressions.

## Layout

| Path         | What                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| `apps/web`   | The site: Astro 7, React 19 islands, Tailwind 4, React Hook Form + Zod, on a Cloudflare Worker with D1 |
| `e2e`        | Playwright functional, accessibility and visual-parity tests                               |
| `docker`     | Test harness: toolbox image and the site containers                                        |

All pages are prerendered (static assets). Only `apps/web/src/pages/api/**`
(and the `/s/*` and `/load` link routes) run on demand in the Worker. The
server code uses Drizzle ORM on D1.

## Everything runs in containers

Nothing needs installing on the host except Docker (OrbStack works). From the
repo root:

```sh
alias dc="docker compose -f docker/compose.yml"

dc build e2e                            # toolbox image
dc run --rm -T --no-deps e2e pnpm install   # install the workspace (Linux binaries)

dc up -d web                            # dev server (astro dev in workerd, local D1): http://localhost:4321
dc run --rm -T --no-deps e2e pnpm check     # Biome + type checks
dc run --rm -T --no-deps e2e pnpm test:unit # Vitest: web units (jsdom), import script; API + SQL tests (workerd, local D1)

dc up -d --wait web-preview             # production build run by `wrangler dev`, fresh local D1
dc run --rm -T e2e pnpm test:e2e        # seeds fixtures through /api/test/seed
```

To open the dev server from the host, add `ports: ["4321:4321"]` to the `web`
service. The `web` service applies migrations to its local D1
(`apps/web/.wrangler/state`) on start; seed it by running the e2e global
setup or `POST /api/test/seed` with the `x-test-token` header.

### Configuration

Build-time variables for `apps/web`:

- `CLOUDFLARE_ENV=test`: build with the `test` environment from
  `wrangler.jsonc` (test-only endpoints). Never deploy it.
- `DISABLE_FULL_SITE=1`: build only the "guard" home page (the 2020 cancellation notice).
- `DISABLE_DEMO_PAGES=1`: omit `/demo-card`.

Worker vars (`wrangler.jsonc`): `RSVP_NOTIFY_EMAIL`. There are no secrets.

## Database (D1 + Drizzle)

`apps/web/src/server/db/schema.ts` is the source of truth: tables, foreign
keys, CHECK constraints, defaults, indexes and the inferred row types.
drizzle-kit generates the migrations in `apps/web/migrations/` from it, and
wrangler applies them (drizzle-kit never connects to D1):

```sh
dc run --rm -T --no-deps -w /repo/apps/web e2e pnpm db:generate    # after editing schema.ts
dc run --rm -T --no-deps -w /repo/apps/web e2e pnpm db:migrate:local
```

Where each rule lives:

- **Schema (SQL constraints):** column types (Drizzle can't declare STRICT
  tables, so each column has a `typeof()` CHECK), required columns, foreign
  keys, guest count bounds, lower-cased invitee emails, the contacts test
  sentinel.
- **Custom migration** (`migrations/0001_rsvp_rules.sql`, made with
  `drizzle-kit generate --custom`): the events/itypes reference data and the
  `rsvps_validate` trigger (guest count vs. the invitation, non-blank names,
  per-itype events, no events when not attending).
- **API** (`apps/web/src/server/`): request shape (allowed/required keys,
  JSON types), read visibility (inactive rows, test sentinels), get-by-id
  only, server-set timestamps.

## Schema changes

Migrations are applied before the new code ships, so for a while the **old
code runs against the new schema**. Change the schema in two releases
(expand/contract):

1. **Expand**: add what the new code needs, additively (new nullable or
   defaulted columns, new tables). Old code keeps working. Deploy.
2. **Contract**: once nothing running uses the old column/table, drop or
   rename it in a later PR.

CI enforces this on pull requests:

- **Merged migrations are immutable.** `scripts/check-migrations.sh BASE_REF`
  (in the `test` job; tests in `scripts/check-migrations.test.sh`) fails if a
  migration (`*.sql`) or drizzle snapshot (`meta/*_snapshot.json`) already on
  the base branch is modified, deleted or renamed; `meta/_journal.json` is
  exempt because drizzle-kit updates it with every new migration. It
  does not read the SQL, and exits 2 if `BASE_REF` doesn't resolve or has no
  merge base with `HEAD`.
- **Backward compatibility is proven, not parsed.** The `migration-compat`
  job (only when `apps/web/migrations/` changed) runs
  `scripts/check-migration-compat.sh`: it builds the **base** branch, applies
  the PR's migrations, and runs the base branch's e2e suite against it.

What CI can't see, because the compat run uses fresh fixture data with nothing
else writing: changes whose risk depends on real data or timing. Review these
by hand: `CREATE UNIQUE INDEX` (existing duplicates make the migration fail
mid-deploy), `UPDATE`/`DELETE`/upserts that rewrite rows, and drizzle-kit's
table rebuilds (`__new_…` copy, drop, rename): D1 always enforces foreign keys
(drizzle's `PRAGMA foreign_keys=OFF` has no effect there), so the rebuild's
`DROP TABLE` can cascade-delete child rows or fail mid-deploy. On the demo, whose data is fake and reset on every
deploy, these are harmless; on a real deployment they need a plan.

For a deliberate breaking step (the contract step, a trigger change), add the
PR label `breaking-migration`: `migration-compat` is then skipped. D1 Time
Travel is the backstop if a bad migration ships. Locally, from the repo root,
in the toolbox:

```sh
dc run --rm -T --no-deps e2e scripts/check-migrations.sh origin/main
```

## RSVP side effects

`POST /api/invitations/:code/rsvps` inserts the RSVP (one statement) then, in
`ctx.waitUntil`, queues a notification email to `RSVP_NOTIFY_EMAIL` in the
`mail` table (a failure is logged; the RSVP is already stored). Nothing sends
queued mail yet. The 2022 Google Sheets RSVP log is gone: RSVPs live in D1
only. `e2e/tests/rsvp-integrations.spec.ts` checks both from a real browser
RSVP.

An invitation's `latestRsvp` is not stored: it is derived whenever the
invitation is read, as the newest `rsvps` row for its code by `created_at`
(ties go to the row inserted last, by `rowid`), using the `rsvps_code_created`
index.

## Invitation views

`GET /api/invitations/:code` and `POST /api/invitations/lookup` (JSON body
`{"email": "..."}`, so emails stay out of URLs and logs) record a
successful lookup in `invitations.first_viewed_at` / `last_viewed_at` (unix
ms, `NULL` until the first view), in `ctx.waitUntil`; a failed write is
logged and never fails the lookup. The API never returns these columns. To
see who has opened their invitation:

```sh
wrangler d1 execute DB --remote --command \
  "SELECT code, party_name, datetime(last_viewed_at / 1000, 'unixepoch') AS last_viewed
   FROM invitations ORDER BY last_viewed_at DESC"
```

## Deploying (Cloudflare)

The site is one Cloudflare Worker (static assets + `/api/*`) with a D1
database, live at the `workers.dev` address in `SITE_HOST`. It is a **demo**:
the data is fake and gets wiped on every deploy. (A real deployment would need
the old rules back: backward-compatible migrations and a canary, not a reset.
Until then, CI already holds migrations to the expand/contract rules; see
[Schema changes](#schema-changes).)

**Automatically:** every merge to `main` runs the CI tests and, if they pass,
deploys (`.github/workflows/ci.yml`, GitHub environment `demo`). Pull requests
run the tests only.

**What a deploy does** (`scripts/deploy.sh`, the same locally and in CI):

1. Creates the D1 database if needed and applies migrations.
2. Builds with the production config and records the currently live version
   id.
3. Deploys straight to 100% (`wrangler deploy`; there are no preview URLs).
4. Sets the Worker secret `TEST_API_TOKEN` (`wrangler secret put`). It enables
   the token-guarded `/api/test/*` endpoints on the demo; requests must send it
   in `x-test-token`. Locally the script generates one into
   `.secrets/deploy.env` if missing. It is never in `wrangler.jsonc` or the
   build (the script refuses a build whose output contains it).
5. Runs the full Playwright suite against `https://$SITE_HOST` with
   `E2E_RESET=1`: the global setup calls `POST /api/test/reset`, which deletes
   every row and reseeds the fixtures.
6. If the suite fails, runs `wrangler rollback <recorded version id>` and exits
   non-zero. (The data stays reset; the code goes back.) CI uploads the
   Playwright report.

`e2e/tests/deployed.spec.ts` holds the checks that only apply to a deployed
build; it skips itself on local URLs.

**One-time setup:**

- Locally: `scripts/deploy-setup.sh` (interactive) walks through a Cloudflare
  API token (Workers Scripts: Edit, D1: Edit, Account Settings: Read; User
  Details and Memberships: Read), finds the `workers.dev` address, and sets up
  Cloudflare Web Analytics. It writes `.secrets/deploy.env` (gitignored), which
  `scripts/deploy.sh` uses when run by hand.
- For CI: in the GitHub repo, Settings → Environments → **demo**, add secrets
  `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `TEST_API_TOKEN` (any
  long random string, e.g. `openssl rand -hex 32`), and variables `SITE_HOST`
  and `PUBLIC_CF_ANALYTICS_TOKEN` (same values as `.secrets/deploy.env`).

The analytics beacon is only built in when `PUBLIC_CF_ANALYTICS_TOKEN` is set,
so local and test builds never load it.

## Importing guests

`apps/web/scripts/import-guests.ts` loads the guest list into D1. It replaces
the 2022 CLI's `invite gen-codes` + `invite update` and takes the same two CSV
exports of the wedding spreadsheet:

- **parties.csv**: `code` (may be blank), `uniquePartyName`, `partyName`,
  `numGuests`, `knownGuest1`..`knownGuest11`, `preEvents`, `ceremony`,
  `sangeet` (`y`/`n`; the three flags give the invitation type).
- **emails.csv**: `name`, `email`, `cleanedName` (preferred over `name`),
  `skip` (`y` drops the row, for duplicates), `uniquePartyName` (rows without
  a matching party are skipped).

It validates everything first (nothing is written on any error): duplicate
emails, codes or party names, known guests exceeding `numGuests`, an
impossible event combination. Parties with a blank `code` get a new 9-character
code (nanoid, the same alphabet as the 2022 shortid codes, never one already in
D1 or the CSV). The import then:

1. writes `<parties>.with-codes.csv` (or `--out`): the parties CSV with the new
   codes filled in. Import it back into the spreadsheet so the codes stick;
2. upserts invitations, then invitees (lower-cased emails), with
   `wrangler d1 execute --file`. Like the 2022 Firestore merge, only the
   imported columns change: latest RSVPs, view times and `inactive` flags are
   kept, and re-running an import is harmless.

The upserts are built with Drizzle (`onConflictDoUpdate`) and written, with
values inlined, to an SQL file that `wrangler d1 execute --file` applies
(`--sql` keeps it for review). wrangler rather than the D1 HTTP API, so local
and remote imports take the same path and use wrangler's own login or
`CLOUDFLARE_API_TOKEN`.

`--dry-run` prints the plan (new codes, new and updated invitations and
invitees, skipped emails) without writing anything. The target is the local D1
unless `--remote` is given; it needs the migrations applied (`pnpm
db:migrate:local`, which the `web` service runs on start). Run it in the
toolbox container:

```sh
dc run --rm -T --no-deps -w /repo/apps/web e2e pnpm import-guests \
  --parties scripts/fixtures/parties.csv --emails scripts/fixtures/emails.csv --dry-run
```

Other options: `--db` (default `DB`), `--env` (a wrangler environment),
`--persist-to` (local D1 state directory), `--sql` (keep the generated SQL),
`--help`. Sample CSVs, mirroring the e2e fixtures, are in
`apps/web/scripts/fixtures/`. `--remote` needs Cloudflare credentials
(`CLOUDFLARE_API_TOKEN`) in the container.

## Visual regression

`e2e/tests/visual.spec.ts` screenshots every page at 375px and 1280px, in light
and dark mode, logged in and logged out. The tolerance lives in
`e2e/playwright.config.ts`. Baselines in `e2e/tests/__screenshots__` are
captured from the current site. After an intentional visual change, review the
diffs, then update them against web-preview:

```sh
dc up -d --force-recreate --wait web-preview
dc run --rm -T -e BASE_URL=http://web-preview:9000 \
  -w /repo/e2e e2e npx playwright test --update-snapshots
```

For the guard-mode baselines, build the site with `DISABLE_FULL_SITE=1` and
run `tests/visual.spec.ts` with `-e SITE_MODE=guard`.
