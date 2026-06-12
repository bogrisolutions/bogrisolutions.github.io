#!/usr/bin/env bash
# add-images.sh — drop a photo into a named slot and (re)generate webp+jpg.
# Usage:  ./add-images.sh <slot-name> <path-to-your-photo>
# Example: ./add-images.sh hero ~/Pictures/port.jpg
# Slots: hero sea-fcl road air air-charter obc customs door-to-door coverage about
set -euo pipefail
SLOT="${1:-}"; SRC="${2:-}"
if [[ -z "$SLOT" || -z "$SRC" ]]; then
  echo "Usage: ./add-images.sh <slot-name> <path-to-photo>"; exit 1
fi
if [[ ! -f "$SRC" ]]; then echo "No such file: $SRC"; exit 1; fi
OUT="assets/img"; mkdir -p "$OUT"
# Prefer ImageMagick if available; else cwebp; else just copy.
if command -v magick >/dev/null 2>&1; then
  magick "$SRC" -resize '1600x1600>' -quality 78 "$OUT/$SLOT.jpg"
  magick "$SRC" -resize '1600x1600>' -quality 72 "$OUT/$SLOT.webp"
elif command -v convert >/dev/null 2>&1; then
  convert "$SRC" -resize '1600x1600>' -quality 78 "$OUT/$SLOT.jpg"
  convert "$SRC" -resize '1600x1600>' -quality 72 "$OUT/$SLOT.webp" 2>/dev/null || cp "$OUT/$SLOT.jpg" "$OUT/$SLOT.webp"
else
  echo "ImageMagick not found — copying as-is (install imagemagick for compression)."
  cp "$SRC" "$OUT/$SLOT.jpg"; cp "$SRC" "$OUT/$SLOT.webp"
fi
echo "Updated slot '$SLOT'. Commit & push to publish."
