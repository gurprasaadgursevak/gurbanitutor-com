// Builds public/sggs-game-pool.json from the bundled SGGS master TSV.
// Run after edits to public/sggs.tsv: `node scripts/build-game-pool.mjs`.
// The JSON is the single source for Punctuation Master and Sentence
// Unscramble — corrections to the TSV flow through both games on rebuild.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const inputPath = path.join(root, "public", "sggs.tsv");
const outputPath = path.join(root, "public", "sggs-game-pool.json");

const raw = fs.readFileSync(inputPath, "utf8");
const rows = raw.split("\n");

const seen = new Set();
const unscramble = [];
const punctuated = [];
const unpunctuated = [];
let counter = 0;

for (let i = 0; i < rows.length; i++) {
  if (i === 0) continue;
  const row = rows[i].replace(/\r$/, "");
  if (!row) continue;
  const cols = row.split("\t");
  if (cols.length < 3) continue;
  const ang = parseInt(cols[0].trim(), 10);
  if (!Number.isFinite(ang)) continue;
  let gurmukhi = cols[2].trim();
  gurmukhi = gurmukhi.replace(/["“”]/g, "").trim();
  if (!gurmukhi || !gurmukhi.endsWith("॥")) continue;
  if (seen.has(gurmukhi)) continue;
  seen.add(gurmukhi);

  const words = gurmukhi.split(" ").filter(Boolean);
  const n = words.length;
  if (n < 3) continue;
  const hasPunct = gurmukhi.includes(";") || gurmukhi.includes(".") || gurmukhi.includes(",");

  counter += 1;
  const entry = { id: counter, tukh: gurmukhi, ang };

  if (hasPunct) {
    punctuated.push(entry);
    if (n <= 7) unscramble.push(entry);
  } else if (n <= 10) {
    unpunctuated.push(entry);
  }
}

// Cap each pool to keep the served JSON small. 6000 random entries per pool
// still gives massive variety vs. the previous ~300 hand-curated lines.
function sample(arr, max) {
  if (arr.length <= max) return arr;
  // Deterministic stride sample so rebuilds produce stable JSON (no spurious diffs).
  const stride = arr.length / max;
  const out = [];
  for (let i = 0; i < max; i++) {
    out.push(arr[Math.floor(i * stride)]);
  }
  return out;
}

const cappedUnscramble = sample(unscramble, 6000);
const cappedPunctuated = sample(punctuated, 6000);
const cappedUnpunctuated = sample(unpunctuated, 3000);

const out = {
  generatedAt: new Date().toISOString(),
  source: "public/sggs.tsv",
  totals: {
    unscramble: unscramble.length,
    punctuated: punctuated.length,
    unpunctuated: unpunctuated.length,
  },
  shipped: {
    unscramble: cappedUnscramble.length,
    punctuated: cappedPunctuated.length,
    unpunctuated: cappedUnpunctuated.length,
  },
  unscramble: cappedUnscramble,
  punctuated: cappedPunctuated,
  unpunctuated: cappedUnpunctuated,
};

fs.writeFileSync(outputPath, JSON.stringify(out));
const size = fs.statSync(outputPath).size;
console.log(
  `Wrote ${outputPath} — ${(size / 1024).toFixed(1)} KB ` +
    `(unscramble=${cappedUnscramble.length}/${unscramble.length}, ` +
    `punctuated=${cappedPunctuated.length}/${punctuated.length}, ` +
    `unpunctuated=${cappedUnpunctuated.length}/${unpunctuated.length})`
);
