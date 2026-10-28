#!/usr/bin/env bash

# Starts the local Postgres service from config/dev.compose.yml and waits until healthy.

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

exec docker compose \
  --project-name "$(basename "$project_root")" \
  --file "$project_root/config/dev.compose.yml" \
  up --detach --wait
