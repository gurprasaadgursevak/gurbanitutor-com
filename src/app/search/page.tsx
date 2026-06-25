"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GurmukhiKeyboard from "../GurmukhiKeyboard";
import SocialLinks from "../SocialLinks";

type Granth = "sggs" | "dasam" | "bhaiGurdas" | "bhaiNandlal";
type Lang = "gurmukhi" | "english";
type Mode = "exactly" | "contains" | "firstLetters" | "anywhere";
type Scope = "all" | "sggs" | "dasam" | "bhaiGurdas" | "bhaiNandlal";

const GRANTH_LABEL: Record<Granth, string> = {
  sggs: "SGGS Ji",
  dasam: "Sri Dasam",
  bhaiGurdas: "Bhai Gurdas Sahib Ji",
  bhaiNandlal: "Bhai Nand Lal Sahib Ji",
};

type Line = {
  granth: Granth;
  ang: number;
  gurmukhi: string;
  ssk?: string;
  bms?: string;
  arth?: string;
  extendedArth?: string;
  romanized?: string;
};

const MATRAS = new Set([
  "ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ",
  "ੰ", "ਂ", "ਃ", "ੱ", "਼", "੍", "ੑ", "ੵ",
]);

// Composed-vowel → bearer-letter normalization. The on-screen keyboard's
// top row gives Sangat precomposed `ਉ ਊ ਓ ਆ ਐ ਔ ਇ ਈ ਏ` keys, but our
// consonant-skeleton matcher works at the bearer level. Without this map a
// query of `ਉਪਦੇਸ਼` wouldn't match a corpus line that contains `ੳ + ੁ +
// ਪ + …` — the two visually identical strings have different first
// codepoints. Normalizing both query and corpus to bearers fixes that.
const COMPOSED_VOWEL_TO_BEARER: Record<string, string> = {
  "ਉ": "ੳ", "ਊ": "ੳ", "ਓ": "ੳ",
  "ਆ": "ਅ", "ਐ": "ਅ", "ਔ": "ਅ",
  "ਇ": "ੲ", "ਈ": "ੲ", "ਏ": "ੲ",
};

const QUOTES = new Set(['"', "“", "”", "‘", "’", "'", "`"]);

function strip(s: string): string {
  return s
    .split("")
    .filter((c) => !QUOTES.has(c))
    .join("")
    .trim();
}

function consonantSkeleton(text: string): string {
  let out = "";
  for (const c of text) {
    if (MATRAS.has(c)) continue;
    if (/\s/.test(c)) continue;
    out += COMPOSED_VOWEL_TO_BEARER[c] ?? c;
  }
  return out;
}

function firstLetterTokens(query: string): string[] {
  const out: string[] = [];
  for (const c of query) {
    if (/\s/.test(c)) continue;
    if (MATRAS.has(c)) continue;
    out.push(COMPOSED_VOWEL_TO_BEARER[c] ?? c);
  }
  return out;
}

function firstConsonant(word: string): string | undefined {
  // Normalize composed standalone vowels to their bearer letter so a
  // search using either `ੳ` (bearer) or `ਉ` (precomposed) matches lines
  // that begin with the other form.
  const c = Array.from(word)[0];
  if (c === undefined) return undefined;
  return COMPOSED_VOWEL_TO_BEARER[c] ?? c;
}

// Parsers — column layouts match iOS SGGSReaderView / DasamReaderView.
function parseSGGS(text: string): Line[] {
  const out: Line[] = [];
  const rows = text.split("\n");
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split("\t");
    if (cols.length < 9) continue;
    const ang = parseInt(cols[0], 10);
    if (Number.isNaN(ang)) continue;
    const gurmukhi = strip(cols[2] || "");
    if (!gurmukhi) continue;
    out.push({
      granth: "sggs",
      ang,
      gurmukhi,
      ssk: (cols[3] || "").trim(),
      bms: (cols[4] || "").trim(),
      arth: (cols[7] || "").trim(),
      extendedArth: (cols[8] || "").trim(),
      romanized: (cols[9] || "").trim().replace(/\r$/, ""),
    });
  }
  return out;
}

// Parses our 9-column auxiliary-granth schema (col 1 gurmukhi, col 2 ucharan,
// col 3 ext_tip, col 4 ssk_english, col 5 bms_english, col 7 arth, col 8 ext_arth).
// Used for Sri Dasam (post-merge with gursevakdb steeks), Bhai Gurdas, and
// Bhai Nand Lal. The TSVs have no header row, so start at i = 0.
function parseAuxiliary(text: string, granth: Granth, startRow = 0): Line[] {
  const out: Line[] = [];
  const rows = text.split("\n");
  for (let i = startRow; i < rows.length; i++) {
    const cols = rows[i].split("\t");
    if (cols.length < 2) continue;
    const ang = parseInt(cols[0], 10);
    if (Number.isNaN(ang)) continue;
    const gurmukhi = strip(cols[1] || "");
    if (!gurmukhi) continue;
    out.push({
      granth,
      ang,
      gurmukhi,
      ssk: (cols[4] || "").trim(),
      bms: (cols[5] || "").trim(),
      romanized: (cols[6] || "").trim(),
      arth: (cols[7] || "").trim(),
      extendedArth: (cols[8] || "").trim(),
    });
  }
  return out;
}

function parseDasam(text: string): Line[] {
  return parseAuxiliary(text, "dasam", 0);
}

// Punctuation we strip from a token before comparing in "Exactly" mode so an
// attached visram or dandi (`;`, `,`, `.`, `॥`) doesn't prevent an otherwise
// exact word match.
const EXACT_BOUNDARY_PUNCT = new Set([
  ";", ",", ".", ":", "?", "!", "(", ")", "[", "]", "{", "}",
  "\"", "'", "‘", "’", "“", "”",
  "।", "॥",
]);
function stripBoundaryPunctuation(s: string): string {
  return s
    .trim()
    .split("")
    .filter((c) => !EXACT_BOUNDARY_PUNCT.has(c))
    .join("");
}

function matchGurmukhi(line: string, query: string, mode: Mode): boolean {
  if (mode === "exactly") {
    // Match the query as a standalone word. e.g. ਨਾਮ matches the word ਨਾਮ
    // but skips ਨਾਮੁ or ਨਾਮਾ.
    const cleanedQuery = stripBoundaryPunctuation(query);
    if (!cleanedQuery) return false;
    for (const raw of line.split(" ")) {
      if (stripBoundaryPunctuation(raw) === cleanedQuery) return true;
    }
    return false;
  }
  if (mode === "contains") {
    if (line.includes(query)) return true;
    const lineSkel = consonantSkeleton(line);
    const querySkel = consonantSkeleton(query.split(" ").join(""));
    if (!querySkel) return false;
    return lineSkel.includes(querySkel);
  }
  const tokens = firstLetterTokens(query);
  if (tokens.length === 0) return false;
  const words = line.split(" ").filter(Boolean);
  if (tokens.length > words.length) return false;
  if (mode === "firstLetters") {
    for (let i = 0; i < tokens.length; i++) {
      if (firstConsonant(words[i]) !== tokens[i]) return false;
    }
    return true;
  }
  // anywhere
  const firsts = words.map((w) => firstConsonant(w) || "");
  outer: for (let start = 0; start <= firsts.length - tokens.length; start++) {
    for (let i = 0; i < tokens.length; i++) {
      if (firsts[start + i] !== tokens[i]) continue outer;
    }
    return true;
  }
  return false;
}

function matchEnglish(line: Line, qLower: string): boolean {
  if (line.ssk && line.ssk.toLowerCase().includes(qLower)) return true;
  if (line.bms && line.bms.toLowerCase().includes(qLower)) return true;
  if (line.arth && line.arth.toLowerCase().includes(qLower)) return true;
  if (line.extendedArth && line.extendedArth.toLowerCase().includes(qLower)) return true;
  return false;
}

const RESULT_CAP = 200;

export default function SearchPage() {
  const [sggs, setSggs] = useState<Line[] | null>(null);
  const [dasam, setDasam] = useState<Line[] | null>(null);
  const [bhaiGurdas, setBhaiGurdas] = useState<Line[] | null>(null);
  const [bhaiNandlal, setBhaiNandlal] = useState<Line[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<Lang>("gurmukhi");
  const [scope, setScope] = useState<Scope>("all");
  const [mode, setMode] = useState<Mode>("anywhere");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  // Persisted search history. Kept in localStorage under
  // `recent_gurbani_searches` (distinct from the iOS keys so the two
  // surfaces stay independent). Capped at 10 most recent entries.
  const [recents, setRecents] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recent_gurbani_searches");
      if (raw) setRecents(JSON.parse(raw));
    } catch {}
  }, []);
  const saveRecents = (next: string[]) => {
    setRecents(next);
    try {
      localStorage.setItem("recent_gurbani_searches", JSON.stringify(next));
    } catch {}
  };
  const recordRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const lower = t.toLowerCase();
    const filtered = recents.filter((r) => r.toLowerCase() !== lower);
    const next = [t, ...filtered].slice(0, 10);
    saveRecents(next);
  };
  const removeRecent = (term: string) => {
    saveRecents(recents.filter((r) => r !== term));
  };
  const clearRecents = () => saveRecents([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sggsRes, dasamRes, bgRes, bnRes] = await Promise.all([
          fetch("/sggs.tsv"),
          fetch("/dasam.tsv"),
          fetch("/bhai_gurdas.tsv"),
          fetch("/bhai_nandlal.tsv"),
        ]);
        if (!sggsRes.ok || !dasamRes.ok) {
          throw new Error("Failed to load Granth Sahib data.");
        }
        const [sggsText, dasamText, bgText, bnText] = await Promise.all([
          sggsRes.text(),
          dasamRes.text(),
          bgRes.ok ? bgRes.text() : Promise.resolve(""),
          bnRes.ok ? bnRes.text() : Promise.resolve(""),
        ]);
        if (cancelled) return;
        // Defer to next tick so the loading UI renders.
        setTimeout(() => {
          if (cancelled) return;
          setSggs(parseSGGS(sggsText));
          setDasam(parseDasam(dasamText));
          setBhaiGurdas(bgText ? parseAuxiliary(bgText, "bhaiGurdas", 0) : []);
          setBhaiNandlal(bnText ? parseAuxiliary(bnText, "bhaiNandlal", 0) : []);
        }, 0);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loading =
    sggs === null || dasam === null || bhaiGurdas === null || bhaiNandlal === null;
  const totalLines =
    (sggs?.length ?? 0) +
    (dasam?.length ?? 0) +
    (bhaiGurdas?.length ?? 0) +
    (bhaiNandlal?.length ?? 0);

  const results = useMemo<Line[]>(() => {
    if (loading) return [];
    const q = query.trim();
    if (!q) return [];

    const corpus: Line[] = [];
    // English now exists across SGGS (full), Sri Dasam (post-merge, ~50%),
    // Bhai Gurdas (~98%), and Bhai Nand Lal (~99%) — search all of them.
    if (lang === "english") {
      if (sggs) corpus.push(...sggs);
      if (dasam) corpus.push(...dasam);
      if (bhaiGurdas) corpus.push(...bhaiGurdas);
      if (bhaiNandlal) corpus.push(...bhaiNandlal);
    } else {
      const include = (g: Granth) => scope === "all" || scope === g;
      if (include("sggs") && sggs) corpus.push(...sggs);
      if (include("dasam") && dasam) corpus.push(...dasam);
      if (include("bhaiGurdas") && bhaiGurdas) corpus.push(...bhaiGurdas);
      if (include("bhaiNandlal") && bhaiNandlal) corpus.push(...bhaiNandlal);
    }

    const out: Line[] = [];
    if (lang === "english") {
      const qLower = q.toLowerCase();
      for (const line of corpus) {
        if (matchEnglish(line, qLower)) {
          out.push(line);
          if (out.length >= RESULT_CAP) break;
        }
      }
    } else {
      for (const line of corpus) {
        if (matchGurmukhi(line.gurmukhi, q, mode)) {
          out.push(line);
          if (out.length >= RESULT_CAP) break;
        }
      }
    }
    return out;
  }, [loading, sggs, dasam, bhaiGurdas, bhaiNandlal, query, lang, scope, mode]);

  // Record the query as a recent search ~1.2s after the user stops typing,
  // but only if the search actually returned matches. Stops misspellings
  // from cluttering the Recent list.
  useEffect(() => {
    const q = query.trim();
    if (!q || results.length === 0) return;
    const id = setTimeout(() => {
      recordRecent(q);
    }, 1200);
    return () => clearTimeout(id);
    // recordRecent intentionally not in deps — it closes over recents,
    // and we don't want the timer to reset every time recents updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results.length]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Gurbani Search</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Sri Guru Granth Sahib Ji · Sri Dasam Guru Granth Sahib Ji · Bhai
            Gurdas Sahib Ji Vaaran · Bhai Nand Lal Sahib Ji
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Find any line, in Gurmukhi or English.
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            {loading
              ? "Loading the four Granths..."
              : "Search by Gurmukhi (Contains, First Letters, Anywhere) or by English meaning across all four Granths."}
          </p>
        </div>

        {/* Search input */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === "gurmukhi"
                  ? "Type in ਗੁਰਮੁਖੀ — try ਸਹਸ ਸਿਆਣਪਾ"
                  : "Type an English word — try mercy"
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
            {lang === "gurmukhi" && (
              <button
                type="button"
                onClick={() => setKeyboardOpen((v) => !v)}
                aria-label={keyboardOpen ? "Hide Gurmukhi keyboard" : "Show Gurmukhi keyboard"}
                aria-pressed={keyboardOpen}
                className={`shrink-0 rounded-xl border px-3 py-3 text-base font-semibold shadow-sm transition ${
                  keyboardOpen
                    ? "border-amber-600 bg-amber-100 text-amber-900"
                    : "border-slate-300 bg-white text-slate-700 hover:border-amber-400"
                }`}
              >
                ੳ ਅ ੲ
              </button>
            )}
          </div>
          {lang === "gurmukhi" && keyboardOpen && (
            <div className="mt-3">
              <GurmukhiKeyboard
                onInsert={(ch) => setQuery((q) => q + ch)}
                onBackspace={() =>
                  setQuery((q) => (q.length > 0 ? Array.from(q).slice(0, -1).join("") : q))
                }
                onClose={() => setKeyboardOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Mode pickers */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <PickerGroup
            label="Language"
            value={lang}
            onChange={(v) => setLang(v as Lang)}
            options={[
              { value: "gurmukhi", label: "ਗੁਰਮੁਖੀ" },
              { value: "english", label: "English" },
            ]}
          />
          {lang === "gurmukhi" && (
            <PickerGroup
              label="Match Mode"
              value={mode}
              onChange={(v) => setMode(v as Mode)}
              options={[
                { value: "contains", label: "Contains" },
                { value: "firstLetters", label: "First Letters" },
                { value: "anywhere", label: "Anywhere" },
              ]}
            />
          )}
          {lang === "gurmukhi" && (
            <PickerGroup
              label="Scope"
              value={scope}
              onChange={(v) => setScope(v as Scope)}
              options={[
                { value: "all", label: "All" },
                { value: "sggs", label: "SGGS Ji" },
                { value: "dasam", label: "Sri Dasam" },
                { value: "bhaiGurdas", label: "Bhai Gurdas Sahib Ji" },
                { value: "bhaiNandlal", label: "Bhai Nand Lal Sahib Ji" },
              ]}
            />
          )}
        </div>

        {/* Hint / Status */}
        <div className="mt-5 text-sm text-slate-500">
          {error && <span className="text-red-600">Error: {error}</span>}
          {!error && loading && "Loading..."}
          {!error && !loading && query.trim() === "" && (
            <span>
              {lang === "gurmukhi" ? (
                <>
                  <strong>Contains</strong> matches the exact text or consonants without
                  vowels. <strong>First Letters</strong> matches first consonants of each word
                  starting from the line's first word. <strong>Anywhere</strong> matches first
                  consonants of a consecutive run of words from any position.
                </>
              ) : (
                <>Searches across English Steek 1, English Steek 2, and ਅਰਥ.</>
              )}
            </span>
          )}
        </div>

        {/* Recent searches: surfaced only when the search field is empty
            so they don't compete with results. Tap a chip to re-run the
            search; tap the × to drop just that term. */}
        {!error && !loading && query.trim() === "" && recents.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Recent
              </span>
              <button
                type="button"
                onClick={clearRecents}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recents.map((term) => (
                <span
                  key={term}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
                >
                  <button
                    type="button"
                    onClick={() => setQuery(term)}
                    className="max-w-[220px] truncate"
                    aria-label={`Search again: ${term}`}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecent(term)}
                    className="text-amber-700 hover:text-amber-900"
                    aria-label={`Remove ${term}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 text-sm text-slate-500">
          {/* Spacer to preserve the original structure below — keeps the
              hint paragraph close-attached to its results status line. */}
          {!error && !loading && query.trim() !== "" && (
            <span>
              {results.length} match{results.length === 1 ? "" : "es"} shown
              {results.length === RESULT_CAP ? " (capped at 200)" : ""}.
            </span>
          )}
        </div>

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <ul className="mt-5 grid gap-3">
            {results.map((r, i) => (
              <li
                key={`${r.granth}-${r.ang}-${i}-${r.gurmukhi.slice(0, 12)}`}
              >
                <Link
                  href={`/granth?g=${r.granth}&ang=${r.ang}&line=${encodeURIComponent(
                    r.gurmukhi.slice(0, 60)
                  )}`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow"
                >
                  <p className="text-lg leading-8 text-slate-900">{r.gurmukhi}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                      Read {r.granth === "bhaiGurdas" ? "Pauri" : r.granth === "bhaiNandlal" ? "Section" : "Ang"} {r.ang} <span aria-hidden className="ml-0.5 transition group-hover:translate-x-0.5 inline-block">→</span>
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-semibold ${
                        r.granth === "sggs"
                          ? "bg-slate-100 text-slate-700"
                          : r.granth === "dasam"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {GRANTH_LABEL[r.granth]}
                    </span>
                    {lang === "english" && r.arth && (
                      <span className="ml-1 text-slate-700">ਅਰਥ: {r.arth}</span>
                    )}
                    {lang === "english" && r.ssk && (
                      <span className="ml-1 text-slate-700">EN: {r.ssk}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && query.trim() !== "" && results.length === 0 && (
          <p className="mt-12 text-center text-slate-500">
            No matches. Try a different word, partial spelling, or switch the match mode.
          </p>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            Same search that powers the Gurbani Tutor iPhone app.{" "}
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}

function PickerGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-slate-100 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              value === opt.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
