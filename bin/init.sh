#!/usr/bin/env bash

# One-time project setup: replaces the "Acme" placeholder name throughout the repo, then deletes itself.

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
script_path="$project_root/bin/init.sh"

read -rp "Application name (e.g. My App): " app_name
if [[ -z "$app_name" ]]; then
  echo "Application name is required." >&2
  exit 1
fi

read -rp "Application slug (e.g. my-app): " app_slug
if [[ ! "$app_slug" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Slug must contain only lowercase letters, numbers, and hyphens." >&2
  exit 1
fi

cd "$project_root"

if [[ -f README.md ]]; then
  perl -0pi -e 's/<!-- init:start -->.*?<!-- init:end -->\n//s' README.md
fi

mapfile -d '' files < <(git grep -lzI --untracked -e Acme -e acme -- ':!bin/init.sh' || true)

if ((${#files[@]} > 0)); then
  APP_NAME="$app_name" APP_SLUG="$app_slug" \
    perl -pi -e 's/Acme/$ENV{APP_NAME}/g; s/acme/$ENV{APP_SLUG}/g' "${files[@]}"
  printf 'Updated %s\n' "${files[@]}"
else
  echo "No occurrences of Acme/acme found."
fi

rm -- "$script_path"
echo "Done. Removed bin/init.sh."
