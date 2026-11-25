#!/usr/bin/env bash
#
# Deploy the demo site (Cloudflare Worker + static assets + D1 database): ship
# the build, reset and reseed the demo database through the token-guarded test
# API, run the FULL Playwright suite against the live site, and roll back to
# the previously deployed version if it fails. The data is fake, so there is no
# canary and no production traffic to protect.
#
# Credentials come from the environment (CI secrets) or, locally, from
# .secrets/deploy.env (written by scripts/deploy-setup.sh; this script adds
# TEST_API_TOKEN there if missing). Everything runs in the project's Docker
# toolbox; nothing is installed on the host.
#
#   scripts/deploy.sh       # migrate, deploy, reset + reseed, e2e, rollback on failure
#
set -euo pipefail
cd "$(dirname "$0")/.."

[[ $# -eq 0 ]] || { echo "usage: scripts/deploy.sh (no options)" >&2; exit 2; }

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -f .secrets/deploy.env ]]; then
  set -a
  # shellcheck source=/dev/null
  source .secrets/deploy.env
  set +a
fi
for v in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID SITE_HOST; do
  [[ -n "${!v:-}" ]] || {
    echo "$v is not set (CI secret, or run scripts/deploy-setup.sh locally)" >&2
    exit 1
  }
done
if [[ -z "${TEST_API_TOKEN:-}" ]]; then
  [[ -z "${CI:-}" ]] || { echo "TEST_API_TOKEN is not set (CI secret)" >&2; exit 1; }
  TEST_API_TOKEN=$(openssl rand -hex 32)
  mkdir -p .secrets && chmod 700 .secrets
  printf 'TEST_API_TOKEN=%s\n' "$TEST_API_TOKEN" >> .secrets/deploy.env
  chmod 600 .secrets/deploy.env
  echo "Generated TEST_API_TOKEN (saved in .secrets/deploy.env)"
fi
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID TEST_API_TOKEN
COMPOSE=(docker compose -f docker/compose.yml)

run() { # run COMMAND... inside the toolbox, in apps/web, with deploy credentials
  "${COMPOSE[@]}" run --rm -T --no-deps \
    -e CLOUDFLARE_API_TOKEN -e CLOUDFLARE_ACCOUNT_ID \
    -e PUBLIC_CF_ANALYTICS_TOKEN="${PUBLIC_CF_ANALYTICS_TOKEN:-}" \
    -e CLOUDFLARE_ENV= -e WRANGLER_SEND_METRICS=false \
    -w /repo/apps/web e2e "$@"
}

echo "▸ Install (frozen lockfile)"
"${COMPOSE[@]}" run --rm -T --no-deps e2e pnpm install --frozen-lockfile >/dev/null

echo "▸ D1 database"
db_id=$(run npx wrangler d1 list --json | python3 -c '
import json, sys
for db in json.load(sys.stdin):
    if db.get("name") == "am-wedding":
        print(db.get("uuid", ""))
')
if [[ -z "$db_id" ]]; then
  echo "  creating am-wedding"
  run npx wrangler d1 create am-wedding >/dev/null
  db_id=$(run npx wrangler d1 list --json | python3 -c '
import json, sys
print(next(db["uuid"] for db in json.load(sys.stdin) if db.get("name") == "am-wedding"))')
fi
echo "  id $db_id"
python3 - "$db_id" <<'PY'
import re, sys
p = "apps/web/wrangler.jsonc"
s = open(p).read()
s2 = re.sub(r'("database_name": "am-wedding",\s*(?://[^\n]*\n\s*)?"database_id": ")[^"]+(")',
            lambda m: m.group(1) + sys.argv[1] + m.group(2), s, count=1)
if s2 != s:
    open(p, "w").write(s2)
    print("  wrote database_id to apps/web/wrangler.jsonc (commit it)")
PY

echo "▸ Migrations (remote)"
run npx wrangler d1 migrations apply DB --remote

echo "▸ Build (production config)"
run pnpm build
if grep -rqFf <(printf '%s' "$TEST_API_TOKEN") apps/web/dist; then
  echo "Refusing to deploy: the build output contains the test API token." >&2
  exit 1
fi

echo "▸ Record the live version (rollback target)"
# It is a first deploy only if Cloudflare says the Worker does not exist
# (wrangler: "This Worker does not exist on your account. [code: 10007]") or
# the Worker has no versions. ANY other failure (expired token, network, rate
# limit, a changed wrangler output format) aborts: carrying on would deploy
# with no rollback target.
status_err=$(mktemp)
trap 'rm -f "$status_err"' EXIT
previous=""
if status_json=$(run npx wrangler deployments status --json 2>"$status_err"); then
  if ! previous=$(python3 -c '
import json, sys
versions = json.load(sys.stdin)["versions"]
print(max(versions, key=lambda v: v["percentage"])["version_id"] if versions else "")' <<<"$status_json"); then
    echo "Cannot read the live Worker version from 'wrangler deployments status --json'; refusing to deploy without a rollback target." >&2
    exit 1
  fi
elif grep -q 'code: 10007' "$status_err"; then
  previous=""
else
  cat "$status_err" >&2
  echo "Cannot determine the live Worker version ('wrangler deployments status' failed, and not because the Worker is missing); refusing to deploy without a rollback target." >&2
  exit 1
fi
if [[ -n "$previous" ]]; then
  echo "  live version $previous"
else
  echo "  no live version: this is the first deploy (nothing to roll back to)"
fi

echo "▸ Deploy"
run npx wrangler deploy --message "${DEPLOY_MESSAGE:-$(git rev-parse --short HEAD)}" >/dev/null

echo "▸ Test API secret"
# A Worker secret, never in wrangler.jsonc or the build. The value goes in on
# stdin, not on a command line. It has to follow the deploy: wrangler refuses
# secret changes while the latest version isn't the deployed one (which is the
# case after a rollback), and it takes effect as a new version of this code.
printf '%s' "$TEST_API_TOKEN" | run npx wrangler secret put TEST_API_TOKEN >/dev/null

echo "▸ Reset and reseed the demo database, then run the full e2e suite on https://$SITE_HOST"
if ! "${COMPOSE[@]}" run --rm -T --no-deps \
  -e BASE_URL="https://$SITE_HOST" -e TEST_API_TOKEN -e E2E_RESET=1 \
  -e PUBLIC_CF_ANALYTICS_TOKEN="${PUBLIC_CF_ANALYTICS_TOKEN:-}" \
  -w /repo/e2e e2e npx playwright test; then
  if [[ -z "$previous" ]]; then
    echo "▸ The e2e suite failed; no previous version to roll back to" >&2
    exit 1
  fi
  echo "▸ The e2e suite failed: rolling back to $previous" >&2
  run npx wrangler rollback "$previous" --yes \
    --message "Rollback: e2e failed after ${DEPLOY_MESSAGE:-$(git rev-parse --short HEAD)}" >/dev/null
  run npx wrangler deployments status >&2
  exit 1
fi
echo "Done: https://$SITE_HOST"
