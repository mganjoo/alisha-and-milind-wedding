#!/usr/bin/env bash
#
# Run the BASE branch's code and e2e suite against THIS checkout's migrations:
# during a deploy the old code runs against the new schema, so it must still
# pass its own tests there.
#
#   scripts/check-migration-compat.sh BASE_REF [WORKTREE_DIR]   # default ../base
#
# Checks BASE_REF out into WORKTREE_DIR (a git worktree, left in place so CI can
# upload its Playwright report), replaces its apps/web/migrations with ours, and
# runs its own `web-preview` service (production build, local D1 with migrations
# applied fresh) and e2e suite. docker/compose.yml mounts `..:/repo`, so running
# compose from the worktree uses the base code; the project name keeps its
# containers and volumes apart from the main stack.
set -euo pipefail

[[ $# -ge 1 && $# -le 2 ]] || { echo "usage: scripts/check-migration-compat.sh BASE_REF [WORKTREE_DIR]" >&2; exit 2; }
cd "$(dirname "$0")/.."
git() { command git -c safe.directory='*' "$@"; }
migrations=$PWD/apps/web/migrations
base=$(mkdir -p "$(dirname "${2:-../base}")" && cd "$(dirname "${2:-../base}")" && pwd)/$(basename "${2:-../base}")

git worktree add --detach "$base" "$1"
rm -rf "$base/apps/web/migrations"
cp -R "$migrations" "$base/apps/web/migrations"
cd "$base"

dc=(docker compose -p am-wedding-compat -f docker/compose.yml)
trap '"${dc[@]}" down -v --remove-orphans >/dev/null 2>&1 || true' EXIT

echo "▸ Base $(git rev-parse --short HEAD) with the new migrations:"
git status --short apps/web/migrations | sed 's/^/    /'
"${dc[@]}" build e2e
"${dc[@]}" run --rm -T --no-deps e2e pnpm install --frozen-lockfile
"${dc[@]}" up -d --wait web-preview
"${dc[@]}" run --rm -T -e BASE_URL=http://web-preview:9000 -w /repo/e2e e2e npx playwright test
