#!/usr/bin/env bash
#
# Merged D1 migrations are immutable: fail if a migration that exists on
# BASE_REF was modified, deleted or renamed. New migrations are fine; whether
# they are backward compatible is proven by the `migration-compat` CI job
# (the previous code's e2e suite against the new schema), not parsed here.
#
#   scripts/check-migrations.sh BASE_REF     # e.g. origin/main
#
# Exit codes: 0 ok, 1 an existing migration changed, 2 usage or git error.
set -euo pipefail

[[ $# -eq 1 ]] || { echo "usage: scripts/check-migrations.sh BASE_REF" >&2; exit 2; }
base=$1
dir=apps/web/migrations

# safe.directory: the toolbox container runs as a different user than the checkout's owner.
git() { command git -c safe.directory='*' "$@"; }
cd "$(git rev-parse --show-toplevel)"

# An unknown or misspelled ref must not pass as "first schema".
if ! git rev-parse --verify --quiet "$base^{commit}" >/dev/null; then
  echo "check-migrations: base ref '$base' does not resolve to a commit (misspelled, or not fetched?)" >&2
  exit 2
fi

# No merge base (unrelated histories, or a shallow clone that lacks it) must
# fail loudly, not look like "no changes".
if ! merge_base=$(git merge-base "$base" HEAD 2>/dev/null) || [[ -z $merge_base ]]; then
  echo "check-migrations: no merge base between '$base' and HEAD (unrelated histories, or a shallow clone: fetch more history)" >&2
  exit 2
fi

# First schema: the base has no migrations at all (e.g. the PR that introduces
# the database), so there is nothing to keep immutable.
if [[ -z "$(git ls-tree -d "$base" -- "$dir" 2>/dev/null)" ]]; then
  echo "No $dir in $base: first schema, nothing to stay immutable."
  exit 0
fi

# Captured first, so a git failure is an error (exit 2), not an empty diff.
# Merged .sql files and their meta/ snapshots are immutable. drizzle-kit
# rewrites meta/_journal.json with every new migration (and adds a snapshot,
# which shows as "A" and is fine), so only the journal is exempt.
if ! changes=$(git diff --name-status -M "$merge_base" HEAD -- "$dir" ":(exclude)$dir/meta/_journal.json"); then
  echo "check-migrations: git diff failed" >&2
  exit 2
fi

problems=0
while IFS=$'\t' read -r status path new; do
  case "$status" in
    M) echo "$path: existing migration was modified; add a new migration instead" >&2; problems=$((problems + 1)) ;;
    D) echo "$path: existing migration was deleted" >&2; problems=$((problems + 1)) ;;
    R*) echo "$path: existing migration was renamed to $new" >&2; problems=$((problems + 1)) ;;
  esac
done <<<"$changes"

if ((problems > 0)); then
  echo "check-migrations: $problems existing migration(s) changed. Merged migrations are immutable." >&2
  exit 1
fi
echo "check-migrations: OK (no existing migration changed)"
