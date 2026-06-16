#!/usr/bin/env bash
# Pulls the latest Granth + Vocabulary TSVs from the shared
# `gurbani-data` repo into `public/` so Next.js + Vercel can serve them.
#
# Single source of truth: ~/Documents/Code/gurbani-data/data/
#   sggs.tsv, dasam.tsv, arths.tsv
#
# Run this after editing any TSV in the shared repo, then commit the
# updated public/ TSVs in this repo and push. Vercel rebuilds with the
# refreshed bytes on the next deploy.

set -euo pipefail

# Allow override via env var; default to the canonical local path.
DATA_REPO="${GURBANI_DATA_REPO:-$HOME/Documents/Code/gurbani-data}"
SRC="$DATA_REPO/data"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public"

if [[ ! -d "$SRC" ]]; then
  echo "Shared data repo not found at: $SRC" >&2
  echo "Clone gurprasaadgursevak/gurbani-data into ~/Documents/Code/ or" >&2
  echo "set GURBANI_DATA_REPO to its path." >&2
  exit 1
fi

cp "$SRC/sggs.tsv"  "$DEST/sggs.tsv"
cp "$SRC/dasam.tsv" "$DEST/dasam.tsv"
cp "$SRC/arths.tsv" "$DEST/arths.tsv"

echo "Synced TSVs into $DEST"
ls -lh "$DEST"/sggs.tsv "$DEST"/dasam.tsv "$DEST"/arths.tsv
