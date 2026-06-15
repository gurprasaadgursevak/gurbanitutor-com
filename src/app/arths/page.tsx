"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Painti Akhari order, mirroring the iOS app's VocabStore.quickSearchAlphabets.
const ALPHABETS: string[] = [
  "ੳ", "ਅ", "ੲ", "ਸ", "ਹ",
  "ਕ", "ਖ", "ਗ", "ਘ", "ਙ",
  "ਚ", "ਛ", "ਜ", "ਝ", "ਞ",
  "ਟ", "ਠ", "ਡ", "ਢ", "ਣ",
  "ਤ", "ਥ", "ਦ", "ਧ", "ਨ",
  "ਪ", "ਫ", "ਬ", "ਭ", "ਮ",
  "ਯ", "ਰ", "ਲ", "ਵ", "ਸ਼",
  "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼",
];

const I_GROUP = new Set(["ੲ", "ਇ", "ਈ", "ਏ"]);
const U_GROUP = new Set(["ੳ", "ਉ", "ਊ", "ਓ"]);

const MARKS = new Set([
  "ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ",
  "ੰ", "ਂ", "ੱ", "਼", "੍", "ੵ",
]);

type Record = {
  rank: number;
  word: string;
  ang: string;
  meaningPa: string;
  meaningEn: string;
  romanized: string;
  line: string;
  ucharanTip: string;
};

function bucketFor(word: string): string {
  if (!word) return "";
  const first = Array.from(word)[0];
  if (I_GROUP.has(first)) return "ੲ";
  if (U_GROUP.has(first)) return "ੳ";
  return first;
}

function consonantSkeleton(text: string): string {
  let out = "";
  for (const ch of text) {
    if (MARKS.has(ch)) continue;
    if (/\s/.test(ch)) continue;
    if (/[.,;:!?'"()\-]/.test(ch)) continue;
    out += ch;
  }
  return out;
}

const PAGE_SIZE = 200;

export default function ArthsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [angFilter, setAngFilter] = useState("");
  const [shownCount, setShownCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch("/arths.tsv")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load arths.tsv (${r.status})`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const lines = text.split("\n");
        const recs: Record[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line) continue;
          const cols = line.split("\t");
          if (cols.length < 10) continue;
          const word = (cols[6] || "").trim();
          if (!word) continue;
          recs.push({
            rank: i,
            word,
            ang: (cols[0] || "").trim(),
            meaningPa: (cols[8] || "").trim(),
            meaningEn: (cols[9] || "").trim(),
            romanized: cols.length > 12 ? (cols[12] || "").trim() : "",
            line: (cols[1] || "").trim(),
            ucharanTip: (cols[4] || "").trim(),
          });
        }
        setRecords(recs);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset the visible page size whenever filters change.
  useEffect(() => {
    setShownCount(PAGE_SIZE);
  }, [query, selectedLetter, angFilter]);

  const filtered = useMemo(() => {
    let out = records;
    const qTrimmed = query.trim();
    if (qTrimmed) {
      const qLower = qTrimmed.toLowerCase();
      const qSkel = consonantSkeleton(qLower);
      out = out.filter((r) => {
        if (r.meaningEn.toLowerCase().includes(qLower)) return true;
        if (r.meaningPa.toLowerCase().includes(qLower)) return true;
        if (r.word.toLowerCase().includes(qLower)) return true;
        if (r.romanized.toLowerCase().includes(qLower)) return true;
        if (qSkel && consonantSkeleton(r.word.toLowerCase()).includes(qSkel)) return true;
        return false;
      });
    }
    if (selectedLetter) {
      out = out.filter((r) => bucketFor(r.word) === selectedLetter);
    }
    const angTrimmed = angFilter.trim();
    if (angTrimmed) {
      out = out.filter((r) => r.ang === angTrimmed);
    }
    return out;
  }, [records, query, selectedLetter, angFilter]);

  const display = filtered.slice(0, shownCount);
  const canLoadMore = shownCount < filtered.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">
            Arths · Gurbani Dictionary
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Sri Guru Granth Sahib Ji
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Arths · Browse Gurbani words and meanings
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            {records.length > 0 ? "" : "Loading dictionary... "}
            Search by Gurmukhi or English meaning, scroll by Painti Akhari letter, or filter by Ang.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Gurmukhi or English..."
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <input
            value={angFilter}
            onChange={(e) => setAngFilter(e.target.value)}
            placeholder="Ang number"
            inputMode="numeric"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 sm:w-40"
          />
          {(query || selectedLetter || angFilter) && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedLetter(null);
                setAngFilter("");
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Clear
            </button>
          )}
        </div>

        {/* Painti Akhari pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selectedLetter === null
                ? "border-amber-600 bg-amber-100 font-semibold text-amber-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            All
          </button>
          {ALPHABETS.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setSelectedLetter(selectedLetter === letter ? null : letter)
              }
              className={`rounded-full border px-3 py-1.5 text-lg leading-none transition ${
                selectedLetter === letter
                  ? "border-amber-600 bg-amber-100 font-semibold text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="mt-5 text-sm text-slate-500">
          {loading
            ? "Loading dictionary..."
            : error
              ? `Error: ${error}`
              : `Showing ${display.length.toLocaleString()} of ${filtered.length.toLocaleString()} matches.`}
        </div>

        {/* Results */}
        {!loading && !error && (
          <>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {display.map((r) => (
                <li
                  key={`${r.rank}-${r.word}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {r.word}
                    </h2>
                    {r.ang && (
                      <button
                        onClick={() => setAngFilter(r.ang)}
                        className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-200"
                        title={`Show only Ang ${r.ang}`}
                      >
                        Ang {r.ang}
                      </button>
                    )}
                  </div>
                  {r.romanized && (
                    <p className="mt-1 text-sm italic text-slate-600">
                      {r.romanized}
                    </p>
                  )}
                  {r.ucharanTip && (
                    <p className="mt-1 text-xs text-amber-700">
                      Ucharan: {r.ucharanTip}
                    </p>
                  )}
                  {r.meaningPa && (
                    <p className="mt-2 text-sm leading-6 text-slate-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        ਅਰਥ
                      </span>{" "}
                      {r.meaningPa}
                    </p>
                  )}
                  {r.meaningEn && (
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        EN
                      </span>{" "}
                      {r.meaningEn}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {canLoadMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShownCount((c) => c + PAGE_SIZE)}
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Load more
                </button>
              </div>
            )}

            {!canLoadMore && filtered.length === 0 && (
              <p className="mt-12 text-center text-slate-500">
                No matches. Try a different word, a partial spelling, or clear the filters.
              </p>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            Same dictionary that powers the Gurbani Tutor iPhone app.{" "}
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
