#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-4173}"
echo "EAC Education local server: http://127.0.0.1:${PORT}/"
python3 -m http.server "${PORT}" --directory "${ROOT_DIR}/src"
