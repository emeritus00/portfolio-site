#!/usr/bin/env bash
# Renders scripts/og/og.html to public/og-image.png with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/../.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/public/og-image.png" "file://$PWD/scripts/og/og.html" 2>/dev/null
echo "Wrote public/og-image.png"
