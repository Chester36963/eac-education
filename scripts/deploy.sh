#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

if [[ -z "$(git remote get-url origin 2>/dev/null || true)" ]]; then
  echo "No origin remote is configured. Add the new GitHub repository once:" >&2
  echo "  git remote add origin https://github.com/<account>/<repository>.git" >&2
  exit 1
fi

if [[ "$#" -lt 1 || -z "$1" ]]; then
  echo 'Usage: ./scripts/deploy.sh "Describe the change"' >&2
  exit 1
fi

NODE_BIN="${EAC_NODE_BIN:-node}"
"${NODE_BIN}" scripts/build-content.cjs
"${NODE_BIN}" --test tests/*.cjs
git diff --check
git add src content docs scripts tests .github README.md .gitignore
git commit -m "$1"
git push origin main
