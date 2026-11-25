#!/usr/bin/env bash
#
# Deploy the demo site (Cloudflare Worker + static assets + D1 database) by
# verifying, then promoting: upload the build as a version that serves no
# traffic, reset and reseed the demo database through the token-guarded test
# API, run the FULL Playwright suite against that version's preview URL, and
# only if it passes switch 100% of traffic to that exact version. A failure
# leaves the live version untouched. (The demo data is fake and shared by all
# versions, so resetting it during the run is fine.)
#
# Credentials come from the environment (CI secrets) or, locally, from
# .secrets/deploy.env (written by scripts/deploy-setup.sh; this script adds
# TEST_API_TOKEN there if missing). Everything runs in the project's Docker
# toolbox; nothing is installed on the host.
#
#   scripts/deploy.sh       # migrate, upload candidate, reset + reseed, e2e on it, promote
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

echo "▸ Is a version live yet?"
# It is a first deploy only if Cloudflare says the Worker does not exist
# (wrangler: "This Worker does not exist on your account. [code: 10007]") or
# the Worker has no versions. ANY other failure (expired token, network, rate
# limit, a changed wrangler output format) aborts.
status_err=$(mktemp)
out_file=apps/web/.wrangler/deploy-output.ndjson
trap 'rm -f "$status_err"' EXIT
live=""
if status_json=$(run npx wrangler deployments status --json 2>"$status_err"); then
  if ! live=$(python3 -c '
import json, sys
versions = json.load(sys.stdin)["versions"]
print(max(versions, key=lambda v: v["percentage"])["version_id"] if versions else "")' <<<"$status_json"); then
    echo "Cannot read the live Worker version from 'wrangler deployments status --json'; refusing to deploy." >&2
    exit 1
  fi
elif ! grep -q 'code: 10007' "$status_err"; then
  cat "$status_err" >&2
  echo "Cannot determine the live Worker version ('wrangler deployments status' failed, and not because the Worker is missing); refusing to deploy." >&2
  exit 1
fi
message="${DEPLOY_MESSAGE:-$(git rev-parse --short HEAD)}"

if [[ -z "$live" ]]; then
  # Nothing is serving yet, so there is nothing to protect: deploy directly.
  # (`wrangler versions upload` can't create a Worker; the first one needs
  # `wrangler deploy`.)
  echo "  none: first deploy, straight to live"
  run npx wrangler deploy --message "$message" >/dev/null
  # A Worker secret, never in wrangler.jsonc or the build; the value goes in on
  # stdin. Here it deploys immediately as a new version of the same code.
  printf '%s' "$TEST_API_TOKEN" | run npx wrangler secret put TEST_API_TOKEN >/dev/null
  target="https://$SITE_HOST"
else
  echo "  live version $live"
  echo "▸ Stage the test API secret (new version, not deployed)"
  printf '%s' "$TEST_API_TOKEN" |
    run npx wrangler versions secret put TEST_API_TOKEN --message "$message (secret)" >/dev/null
  echo "▸ Upload the candidate version (serves no traffic)"
  rm -f "$out_file"
  run env WRANGLER_OUTPUT_FILE_PATH="/repo/$out_file" \
    npx wrangler versions upload --preview-alias candidate --message "$message" >/dev/null
  read -r candidate target < <(python3 - "$out_file" <<'PY'
import json, sys
version, url = "", ""
for line in open(sys.argv[1]):
    entry = json.loads(line)
    if entry.get("type") == "version-upload":
        version = entry.get("version_id") or version
        url = entry.get("preview_alias_url") or entry.get("preview_url") or url
print(version, url)
PY
)
  [[ -n "${candidate:-}" && -n "${target:-}" ]] || {
    echo "Couldn't read the candidate version id / preview URL from wrangler." >&2
    exit 1
  }
  echo "  candidate $candidate at $target"
fi

echo "▸ Wait for $target to accept the test API token"
# A freshly set secret / uploaded version takes a few seconds to reach the
# edge; resetting succeeds (204) once it has. The suite resets again anyway.
for attempt in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
    -H "x-test-token: $TEST_API_TOKEN" -H 'content-type: application/json' \
    -d '{}' "$target/api/test/reset" || true)
  [[ "$code" == 204 ]] && break
  [[ $attempt == 30 ]] && {
    echo "$target never accepted the test API token (last status $code)" >&2
    exit 1
  }
  sleep 3
done
echo "  ready"

echo "▸ Wait for $target to serve the build's static assets"
assets=$(cd apps/web/dist/client 2>/dev/null || cd apps/web/dist; find _astro -type f \( -name '*.css' -o -name '*.js' \) | sort)
[[ -n "$assets" ]] || { echo "No CSS/JS assets found in the build output" >&2; exit 1; }
for attempt in $(seq 1 40); do
  missing=0
  while read -r asset; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$target/$asset" || true)
    [[ "$code" == 200 ]] || { missing=$((missing + 1)); last="$asset ($code)"; }
  done <<<"$assets"
  [[ $missing == 0 ]] && break
  [[ $attempt == 40 ]] && {
    echo "$target is still missing $missing asset(s), e.g. $last" >&2
    exit 1
  }
  sleep 3
done
echo "  $(wc -l <<<"$assets" | tr -d ' ') assets served"

echo "▸ Reset and reseed the demo database, then run the full e2e suite on $target"
if ! "${COMPOSE[@]}" run --rm -T --no-deps \
  -e BASE_URL="$target" -e TEST_API_TOKEN -e E2E_RESET=1 \
  -e PUBLIC_CF_ANALYTICS_TOKEN="${PUBLIC_CF_ANALYTICS_TOKEN:-}" \
  -w /repo/e2e e2e npx playwright test; then
  if [[ -z "$live" ]]; then
    echo "▸ The e2e suite failed on the first deploy (it is live; nothing to fall back to)" >&2
  else
    echo "▸ The e2e suite failed: candidate $candidate NOT promoted; $live keeps serving" >&2
  fi
  exit 1
fi

if [[ -n "$live" ]]; then
  echo "▸ Promote $candidate to 100%"
  run npx wrangler versions deploy "$candidate@100%" --yes --message "$message" >/dev/null
  serving=$(run npx wrangler deployments status --json | python3 -c '
import json, sys
print(max(json.load(sys.stdin)["versions"], key=lambda v: v["percentage"])["version_id"])')
  [[ "$serving" == "$candidate" ]] || {
    echo "Promotion check failed: serving $serving, expected $candidate" >&2
    exit 1
  }
fi
echo "Done: https://$SITE_HOST"
