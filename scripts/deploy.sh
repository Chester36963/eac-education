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

python3 -m json.tool src/data/catalog.json >/dev/null
python3 -m json.tool src/data/questions.json >/dev/null
git diff --check
git add src docs scripts .github
git commit -m "$1"
git push origin main
