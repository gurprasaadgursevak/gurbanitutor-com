// Lazy-loaded Punjabi steek indices for the granth reader.
//
// Mirrors the iOS app's `SteekStore` Swift class: fetch the bundled TSV
// once, parse into per-ang trigram indices, then fuzzy-match SGGS / Dasam
// lines by ang + Gurmukhi (trigram Jaccard >= 0.3). Differences in
// punctuation, inflection, and word-fusion between source databases mean
// strict text equality misses too much — trigrams catch the same logical
// line even when the textual representation drifts.
//
// Sources surfaced in the UI:
//   - NKFT  ("Classical Steek 1", Faridkot Wala Teeka)   — SGGS lines only
//   - PSST  ("Punjabi Steek", Prof Sahib Singh)          — SGGS lines only
//   - DGDG  ("Punjabi Steek", Das Granthi)               — Dasam Granth lines

export type SteekSource = "nkft" | "psst" | "dgdg";

export interface SteekEntry {
  ang: number;
  sourceGurmukhi: string;
  arth: string; // multiple notes joined with \n\n
}

interface IndexedLine {
  sourceGurmukhi: string;
  trigrams: Set<string>;
  arths: string[];
}

type SteekIndex = Map<number, IndexedLine[]>;

const indexCache = new Map<SteekSource, Promise<SteekIndex>>();

const SOURCE_URLS: Record<SteekSource, string> = {
  nkft: "/nkft.tsv",
  psst: "/psst.tsv",
  dgdg: "/dgdg.tsv",
};

/**
 * Strip whitespace + common punctuation, mirroring the iOS `trigrams()`
 * implementation. Both query and corpus pass through the same function
 * so neither side is biased by spacing or dandi placement.
 */
function trigrams(s: string): Set<string> {
  let stripped = "";
  for (const ch of s) {
    const code = ch.codePointAt(0)!;
    // Whitespace
    if (code === 0x20 || code === 0x09 || code === 0x0a || code === 0x0d) continue;
    // ASCII punctuation
    if (code === 0x2e || code === 0x2c || code === 0x3b || code === 0x3a || code === 0x7c) continue;
    // Devanagari + Gurmukhi dandis
    if (code === 0x0964 || code === 0x0965 || code === 0x0a64 || code === 0x0a65) continue;
    stripped += ch;
  }
  const out = new Set<string>();
  if (stripped.length < 3) {
    if (stripped.length > 0) out.add(stripped);
    return out;
  }
  for (let i = 0; i < stripped.length - 2; i++) {
    out.add(stripped.slice(i, i + 3));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * Parse a TSV in the same shape as our `shabados/*.tsv` exports:
 *   header: line_id \t ang \t line \t source_gurmukhi \t language \t data
 * Multiple rows may share the same `(line_id, source_gurmukhi)` — those
 * are joined into the same IndexedLine.arths array.
 */
function parseSteekTSV(text: string): SteekIndex {
  const byKey = new Map<string, IndexedLine>();
  const rows = text.split("\n");
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 6) continue;
    const lineId = cols[0];
    const angRaw = cols[1];
    const source = cols[3];
    const data = cols[5];
    if (!angRaw || !source || !data) continue;
    const ang = parseInt(angRaw, 10);
    if (Number.isNaN(ang)) continue;
    const key = `${ang}|${lineId}|${source}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.arths.push(data);
    } else {
      byKey.set(key, {
        sourceGurmukhi: source,
        trigrams: trigrams(source),
        arths: [data],
      });
    }
  }
  // Bucket by ang.
  const grouped: SteekIndex = new Map();
  for (const [k, line] of byKey) {
    const ang = parseInt(k.split("|")[0], 10);
    const bucket = grouped.get(ang);
    if (bucket) bucket.push(line);
    else grouped.set(ang, [line]);
  }
  return grouped;
}

/**
 * Fetch + parse a steek source once. Subsequent calls return the cached
 * promise so multiple toggles on / pages reusing the data are cheap.
 */
export function loadSteek(source: SteekSource): Promise<SteekIndex> {
  const cached = indexCache.get(source);
  if (cached) return cached;
  const url = SOURCE_URLS[source];
  const promise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`Steek ${source}: HTTP ${r.status}`);
      return r.text();
    })
    .then(parseSteekTSV)
    .catch((err) => {
      // Bust the cache on failure so a retry can succeed.
      indexCache.delete(source);
      throw err;
    });
  indexCache.set(source, promise);
  return promise;
}

/**
 * Fuzzy-look up a single line. Returns null for section headers and any
 * line with no close match on its ang (trigram Jaccard < 0.3) — the
 * caller should render nothing in that case.
 */
export function lookupSteek(
  index: SteekIndex,
  ang: number,
  gurmukhi: string,
): SteekEntry | null {
  const candidates = index.get(ang);
  if (!candidates || candidates.length === 0) return null;
  const qTri = trigrams(gurmukhi);
  if (qTri.size === 0) return null;
  let best: IndexedLine | null = null;
  let bestScore = 0;
  for (const c of candidates) {
    const score = jaccard(qTri, c.trigrams);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  if (!best || bestScore < 0.3) return null;
  return {
    ang,
    sourceGurmukhi: best.sourceGurmukhi,
    arth: best.arths.join("\n\n"),
  };
}
