#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

exec docker compose \
  --project-name "$(basename "$project_root")" \
  --file "$project_root/config/dev.compose.yml" \
  up --detach --wait
