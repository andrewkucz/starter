#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

exec docker compose \
  --project-name "$(basename "$project_root")" \
  --file "$project_root/docker-compose.dev.yml" \
  up --detach --wait