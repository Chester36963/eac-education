#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="${EAC_NODE_BIN:-node}"
if ! command -v "$NODE_BIN" >/dev/null 2>&1; then
 NODE_BIN="/Users/chester/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
cd "$ROOT_DIR"
exec "$NODE_BIN" tools/editor/server.cjs
