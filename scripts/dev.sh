#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-4173}"
NODE_BIN="${EAC_NODE_BIN:-node}"
"${NODE_BIN}" "${ROOT_DIR}/scripts/build-content.cjs"
"${NODE_BIN}" "${ROOT_DIR}/scripts/watch-content.cjs" &
WATCH_PID=$!
trap 'kill "${WATCH_PID}" 2>/dev/null || true' EXIT
trap 'exit 130' INT TERM
echo "EAC Education local server: http://127.0.0.1:${PORT}/"
python3 -m http.server "${PORT}" --directory "${ROOT_DIR}/src"
