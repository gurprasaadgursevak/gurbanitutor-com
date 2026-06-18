"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GurmukhiKeyboard from "../GurmukhiKeyboard";
import SocialLinks from "../SocialLinks";

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
  const [keyboardOpen, setKeyboardOpen] = useState(false);

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
          const meaningEn = (cols[9] || "").trim();
          if (!meaningEn) continue;
          recs.push({
            rank: i,
            word,
            ang: (cols[0] || "").trim(),
            meaningPa: (cols[8] || "").trim(),
            meaningEn,
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
            Gurbani Vocabulary Builder
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Arths · Build your Gurbani vocabulary
          </h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            {records.length > 0 ? "" : "Loading dictionary... "}
            A curated set of Gurbani words from Sri Guru Granth Sahib Ji with Punjabi and English
            meanings. Search by Gurmukhi or English, scroll by Painti Akhari letter, or filter by Ang.
          </p>
          <div className="mt-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <p className="font-semibold">Sangat Ji, a small note</p>
            <p className="mt-1">
              These words are hand-picked for vocabulary building and Gurmukhi practice. This is
              not the full vocabulary of Sri Guru Granth Sahib Ji. For full Gurbani reading, head
              to <Link href="/search" className="font-semibold underline">Search</Link>.
            </p>
            <p className="mt-2">
              English meanings are in <span className="font-semibold">beta</span> and still being
              verified. If something looks off, tap the <span aria-hidden>🚩</span> flag on any
              card to send us a correction.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Gurmukhi or English..."
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="button"
            onClick={() => setKeyboardOpen((v) => !v)}
            aria-label={keyboardOpen ? "Hide Gurmukhi keyboard" : "Show Gurmukhi keyboard"}
            aria-pressed={keyboardOpen}
            className={`rounded-xl border px-4 py-3 text-base font-semibold shadow-sm transition ${
              keyboardOpen
                ? "border-amber-600 bg-amber-100 text-amber-900"
                : "border-slate-300 bg-white text-slate-700 hover:border-amber-400"
            }`}
          >
            ੳ ਅ ੲ
          </button>
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
        {keyboardOpen && (
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

        {/* Painti Akhari pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`inline-flex min-h-[40px] items-center rounded-full border px-3 py-2 text-sm transition ${
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
              className={`inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border px-3 py-2 text-lg leading-none transition ${
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
                  {r.line && (
                    <p className="mt-2 text-base leading-7 text-slate-800">
                      {r.line}
                    </p>
                  )}
                  {r.romanized && (
                    <p className="mt-1 text-sm italic text-slate-500">
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
                  <div className="mt-3 flex justify-end">
                    <a
                      href={`mailto:gurprasaadgursevak@gmail.com?subject=${encodeURIComponent(
                        `Arths correction: ${r.word}`
                      )}&body=${encodeURIComponent(
                        `Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh!\n\nWord: ${r.word}\nAng: ${r.ang}\nਅਰਥ: ${r.meaningPa}\nEN: ${r.meaningEn}\n\nSuggested correction:\n`
                      )}`}
                      aria-label={`Flag ${r.word} for correction`}
                      title="Flag for correction"
                      className="rounded-full px-2 py-1 text-xs text-slate-500 transition hover:bg-amber-100 hover:text-amber-800"
                    >
                      🚩 Flag
                    </a>
                  </div>
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
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
