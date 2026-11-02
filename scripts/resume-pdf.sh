#!/usr/bin/env bash
# Print the /resume page to public/Jacob_Proffer_Resume.pdf with headless Chrome.
# Run the dev server (npm run dev) first. Override CHROME or pass a URL if needed.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
URL="${1:-http://localhost:4321/resume/}"
OUT="public/Jacob_Proffer_Resume.pdf"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf="$OUT" "$URL"

echo "Saved $OUT"
