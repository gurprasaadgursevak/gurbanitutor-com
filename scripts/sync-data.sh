#!/usr/bin/env bash
# Pulls the latest Granth + Vocabulary TSVs from the shared
# `gurbani-data` repo into `public/` so Next.js + Vercel can serve them.
#
# Single source of truth: ~/Documents/Code/gurbani-data/data/
#   Core:        sggs.tsv, dasam.tsv, arths.tsv
#   Aux granth:  bhai_gurdas.tsv, bhai_nandlal.tsv
#   Compiled:    aarti.tsv, svaiye_deenan.tsv, mool_mantar.tsv,
#                rakhia_de_shabad.tsv
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

# Auxiliary granths.
cp "$SRC/bhai_gurdas.tsv"  "$DEST/bhai_gurdas.tsv"
cp "$SRC/bhai_nandlal.tsv" "$DEST/bhai_nandlal.tsv"

# Punjabi Steek (Faridkot Wala Teeka, extracted from shabados/database).
# Used by the SGGS reader to offer an alternate Punjabi arth view.
# Symlinked into data/ from the larger shabados/ dir.
cp -L "$SRC/nkft.tsv" "$DEST/nkft.tsv"

# Compiled banis (verses pre-selected across Granths, in reading order).
cp "$SRC/aarti.tsv"            "$DEST/aarti.tsv"
cp "$SRC/svaiye_deenan.tsv"    "$DEST/svaiye_deenan.tsv"
cp "$SRC/mool_mantar.tsv"      "$DEST/mool_mantar.tsv"
cp "$SRC/rakhia_de_shabad.tsv" "$DEST/rakhia_de_shabad.tsv"

# Gareebi Pothi shabad index (used by /gareebi-pothi page).
cp "$SRC/gareebi_pothi_shabads.tsv" "$DEST/gareebi-pothi-shabads.tsv"

# Bani manifest (precomputed segments for all 124 additional Amrit Banis
# across 10 categories: Beant Bani, Bhagat Bani, Baee Vara, Beant Dasam
# Bani, Panj Granthi, Das Granthi, Ardas, Astotar, Kavach, Gurbani Pothi).
cp "$SRC/banis_manifest.json" "$DEST/banis_manifest.json"

echo "Synced TSVs into $DEST"
ls -lh "$DEST"/{sggs,dasam,arths,bhai_gurdas,bhai_nandlal,aarti,svaiye_deenan,mool_mantar,rakhia_de_shabad}.tsv
