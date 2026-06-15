"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GurmukhiKeyboard from "../GurmukhiKeyboard";

type Granth = "sggs" | "dasam";
type Lang = "gurmukhi" | "english";
type Mode = "contains" | "firstLetters" | "anywhere";
type Scope = "all" | "sggs" | "dasam";

type Line = {
  granth: Granth;
  ang: number;
  gurmukhi: string;
  ssk?: string;
  bms?: string;
  arth?: string;
  extendedArth?: string;
};

const MATRAS = new Set([
  "ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ",
  "ੰ", "ਂ", "ਃ", "ੱ", "਼", "੍", "ੑ", "ੵ",
]);

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
    out += c;
  }
  return out;
}

function firstLetterTokens(query: string): string[] {
  const out: string[] = [];
  for (const c of query) {
    if (/\s/.test(c)) continue;
    if (MATRAS.has(c)) continue;
    out.push(c);
  }
  return out;
}

function firstConsonant(word: string): string | undefined {
  return Array.from(word)[0];
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
    });
  }
  return out;
}

function parseDasam(text: string): Line[] {
  const out: Line[] = [];
  const rows = text.split("\n");
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split("\t");
    if (cols.length < 2) continue;
    const ang = parseInt(cols[0], 10);
    if (Number.isNaN(ang)) continue;
    const gurmukhi = strip(cols[1] || "");
    if (!gurmukhi) continue;
    out.push({ granth: "dasam", ang, gurmukhi });
  }
  return out;
}

function matchGurmukhi(line: string, query: string, mode: Mode): boolean {
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
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<Lang>("gurmukhi");
  const [scope, setScope] = useState<Scope>("all");
  const [mode, setMode] = useState<Mode>("contains");
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sggsRes, dasamRes] = await Promise.all([
          fetch("/sggs.tsv"),
          fetch("/dasam.tsv"),
        ]);
        if (!sggsRes.ok || !dasamRes.ok) {
          throw new Error("Failed to load Granth Sahib data.");
        }
        const [sggsText, dasamText] = await Promise.all([
          sggsRes.text(),
          dasamRes.text(),
        ]);
        if (cancelled) return;
        // Defer to next tick so the loading UI renders.
        setTimeout(() => {
          if (cancelled) return;
          setSggs(parseSGGS(sggsText));
          setDasam(parseDasam(dasamText));
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

  const loading = sggs === null || dasam === null;
  const totalLines = (sggs?.length ?? 0) + (dasam?.length ?? 0);

  const results = useMemo<Line[]>(() => {
    if (loading) return [];
    const q = query.trim();
    if (!q) return [];

    const corpus: Line[] = [];
    if (lang === "english") {
      // English only exists for SGGS.
      if (sggs) corpus.push(...sggs);
    } else {
      if (scope !== "dasam" && sggs) corpus.push(...sggs);
      if (scope !== "sggs" && dasam) corpus.push(...dasam);
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
  }, [loading, sggs, dasam, query, lang, scope, mode]);

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
            Sri Guru Granth Sahib Ji + Sri Dasam Granth Sahib Ji
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Find any line, in Gurmukhi or English.
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            {loading
              ? "Loading Sri Guru Granth Sahib Ji and Sri Dasam Granth Sahib Ji..."
              : "Search by Gurmukhi (Contains, First Letters, Anywhere) or by English meaning."}
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
                { value: "dasam", label: "Dasam" },
              ]}
            />
          )}
          {lang === "english" && (
            <div className="sm:col-span-2 self-end text-sm text-slate-500">
              English meanings are available for Sri Guru Granth Sahib Ji only.
            </div>
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
                      Read Ang {r.ang} <span aria-hidden className="ml-0.5 transition group-hover:translate-x-0.5 inline-block">→</span>
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-semibold ${
                        r.granth === "sggs"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.granth === "sggs" ? "SGGS Ji" : "Dasam"}
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
            {" · "}
            <a
              href="https://instagram.com/gurbanitutor"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 hover:underline"
            >
              Instagram @GurbaniTutor
            </a>
          </p>
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
