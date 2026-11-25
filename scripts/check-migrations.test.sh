#!/usr/bin/env bash
#
# Tests for check-migrations.sh. Each case builds a throwaway git repo with a
# base commit holding one migration, applies a change, and runs the lint.
#   scripts/check-migrations.test.sh
set -uo pipefail
script=$(cd "$(dirname "$0")" && pwd)/check-migrations.sh
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

fails=0
# case NAME EXPECTED_EXIT GREP_PATTERN SETUP_FUNCTION
run_case() {
  local name=$1 want=$2 pattern=$3 setup=$4
  local repo=$tmp/$name out got
  mkdir -p "$repo/apps/web/migrations" && cd "$repo" || exit 1
  git init -q -b main .
  printf 'CREATE TABLE `t` (`a` text NOT NULL);\n--> statement-breakpoint\nCREATE INDEX `i` ON `t` (`a`);\n' >apps/web/migrations/0000_init.sql
  mkdir -p apps/web/migrations/meta && echo '{"entries":[0]}' >apps/web/migrations/meta/_journal.json
  echo '{"v":0}' >apps/web/migrations/meta/0000_snapshot.json
  git add -A && git commit -qm base
  git checkout -qb pr
  "$setup"
  git add -A && git commit -qm change
  out=$(bash "$script" main 2>&1); got=$?
  if [[ $got -eq $want ]] && grep -qiE -- "$pattern" <<<"$out"; then
    echo "ok   $name"
  else
    echo "FAIL $name (exit $got, want $want, pattern /$pattern/)"; echo "$out" | sed 's/^/     /'; fails=$((fails + 1))
  fi
}
add() { printf '%s\n' "$2" >"apps/web/migrations/$1"; }

additive()  { add 0001_a.sql 'ALTER TABLE `t` ADD `b` text;'; }
added_any() { add 0001_a.sql 'DROP TABLE `t`;'; }  # content is not analysed
modified()  { echo '-- edited' >>apps/web/migrations/0000_init.sql; }
deleted()   { git rm -q apps/web/migrations/0000_init.sql; }
renamed()   { git mv apps/web/migrations/0000_init.sql apps/web/migrations/0000_start.sql; }
snapshot_edit() { echo '{"v":1}' >apps/web/migrations/meta/0000_snapshot.json; }
# What `drizzle-kit generate` does: a new .sql, a new snapshot, an updated journal.
generated() {
  additive
  echo '{"entries":[0,1]}' >apps/web/migrations/meta/_journal.json
  echo '{}' >apps/web/migrations/meta/0001_snapshot.json
}

run_case added_passes     0 'OK'                        additive
run_case added_not_parsed 0 'OK'                        added_any
run_case modified_fails   1 '0000_init.sql: .*modified' modified
run_case deleted_fails    1 '0000_init.sql: .*deleted'  deleted
run_case renamed_fails    1 'renamed to'                renamed
run_case drizzle_generate 0 'OK'                        generated
run_case snapshot_edited  1 '0000_snapshot.json: .*modified' snapshot_edit

# First schema: the base has no migrations directory at all, so any
# migration in the PR is fine (nothing merged to keep immutable).
first_schema() {
  local repo=$tmp/first_schema out got
  mkdir -p "$repo" && cd "$repo" || exit 1
  git init -q -b main . && echo base >README && git add -A && git commit -qm base
  git checkout -qb pr && mkdir -p apps/web/migrations
  add 0000_init.sql 'create trigger x before insert on t begin select 1; end;'
  git add -A && git commit -qm change
  out=$(bash "$script" main 2>&1); got=$?
  if [[ $got -eq 0 ]] && grep -q 'first schema' <<<"$out"; then
    echo "ok   first_schema_skips"
  else
    echo "FAIL first_schema_skips (exit $got)"; echo "$out" | sed 's/^/     /'; fails=$((fails + 1))
  fi
}
first_schema

# An unresolvable base ref is a usage error, not "first schema".
bad_ref() {
  local repo=$tmp/bad_ref out got
  mkdir -p "$repo/apps/web/migrations" && cd "$repo" || exit 1
  git init -q -b main . && add 0000_init.sql 'CREATE TABLE `t` (`a` text);'
  git add -A && git commit -qm base
  out=$(bash "$script" origin/mian 2>&1); got=$?
  if [[ $got -eq 2 ]] && grep -q "does not resolve" <<<"$out"; then
    echo "ok   unknown_ref_exits_2"
  else
    echo "FAIL unknown_ref_exits_2 (exit $got)"; echo "$out" | sed 's/^/     /'; fails=$((fails + 1))
  fi
}
bad_ref

# No merge base (unrelated histories) must not read as "no changes".
unrelated() {
  local repo=$tmp/unrelated out got
  mkdir -p "$repo/apps/web/migrations" && cd "$repo" || exit 1
  git init -q -b main . && add 0000_init.sql 'CREATE TABLE `t` (`a` text);'
  git add -A && git commit -qm base
  git checkout -q --orphan other && git rm -qrf . >/dev/null
  mkdir -p apps/web/migrations && add 0000_init.sql 'DROP TABLE `t`;'
  git add -A && git commit -qm unrelated
  out=$(bash "$script" main 2>&1); got=$?
  if [[ $got -eq 2 ]] && grep -q "no merge base" <<<"$out"; then
    echo "ok   no_merge_base_exits_2"
  else
    echo "FAIL no_merge_base_exits_2 (exit $got)"; echo "$out" | sed 's/^/     /'; fails=$((fails + 1))
  fi
}
unrelated

((fails == 0)) && echo "all passed" || { echo "$fails failed"; exit 1; }
