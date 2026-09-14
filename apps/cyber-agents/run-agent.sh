#!/usr/bin/env sh
set -u

AGENT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCAN_TARGET=${1:-"$PWD"}

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20 or newer is required: https://nodejs.org/" >&2
  exit 3
fi

echo "Good Steward Cyber Guardian"
echo "Read-only scan target: $SCAN_TARGET"
node "$AGENT_DIR/dist/index.js" \
  --target "$SCAN_TARGET" \
  --output "$SCAN_TARGET/.good-steward/evidence-ledger.json"
STATUS=$?
echo "Report: $SCAN_TARGET/.good-steward/evidence-ledger.json"
exit "$STATUS"
