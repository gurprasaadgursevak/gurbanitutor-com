"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SocialLinks from "../SocialLinks";
import { shabadHash } from "../lib/shabadHash";

type Entry = {
  id: string;
  marker: string;
  shabad: string;
  meaning: string;
};

function parseTSV(text: string): Entry[] {
  const lines = text.split("\n");
  const out: Entry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (cols.length < 3) continue;
    const marker = (cols[0] || "").trim();
    const shabad = (cols[1] || "").trim();
    const meaning = (cols[2] || "").trim();
    if (!shabad && !meaning) continue;
    out.push({ id: `entry-${i}`, marker, shabad, meaning });
  }
  return out;
}

export default function GareebiPothiPage() {
  return (
    <Suspense fallback={null}>
      <GareebiPothiReader />
    </Suspense>
  );
}

function GareebiPothiReader() {
  const searchParams = useSearchParams();
  const linkedHash = searchParams.get("s");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showArth, setShowArth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/gareebi-pothi.tsv?v=3", {
          cache: "no-cache",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        setEntries(parseTSV(text));
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Deep-link support: if `?s=<hash>` was passed, find the entry whose hashed
  // shabad matches and auto-open it.
  useEffect(() => {
    if (!linkedHash || entries.length === 0 || selectedId) return;
    const match = entries.find((e) => shabadHash(e.shabad) === linkedHash);
    if (match) setSelectedId(match.id);
  }, [linkedHash, entries, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return entries;
    return entries.filter(
      (e) => e.shabad.includes(q) || e.marker.includes(q) || e.meaning.includes(q)
    );
  }, [entries, search]);

  const selected = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? null,
    [entries, selectedId]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Gareebi Pothi</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        {!selected && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Gareebi Pothi
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Hand-picked Gurbani on Gareebi, with full vyakhya.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {entries.length > 0 ? `${entries.length} ` : ""}shabads, each with the full
              Punjabi arth. Tap a shabad to read the full exegesis.
            </p>

            {loading && (
              <p className="mt-8 text-center text-slate-600">Loading shabads...</p>
            )}
            {loadError && (
              <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                Could not load Pothi: {loadError}
              </p>
            )}

            {!loading && !loadError && (
              <>
                <div className="mt-8">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Gurmukhi text, marker, or arth..."
                    lang="pa"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Showing {filtered.length} of {entries.length}
                  </p>
                </div>

                <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {filtered.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(e.id)}
                        className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-amber-50"
                      >
                        <span className="flex h-9 w-12 flex-none items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                          {e.marker}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            lang="pa"
                            className="block text-base text-slate-900"
                          >
                            {e.shabad.length > 220
                              ? `${e.shabad.slice(0, 220)}...`
                              : e.shabad}
                          </span>
                        </span>
                        <span className="mt-1 text-amber-700" aria-hidden>
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                  {filtered.length === 0 && (
                    <li className="px-5 py-8 text-center text-sm text-slate-500">
                      No entries match your search.
                    </li>
                  )}
                </ul>
              </>
            )}
          </section>
        )}

        {selected && (
          <section>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              ← Back to list
            </button>

            <div className="mt-4 flex items-baseline justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Entry · #{selected.marker}
              </p>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={showArth}
                  onChange={(e) => setShowArth(e.target.checked)}
                  className="h-4 w-4"
                />
                Show arth
              </label>
            </div>

            <div className="mt-3 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <p
                lang="pa"
                className="whitespace-pre-wrap text-2xl leading-relaxed text-slate-900 sm:text-3xl"
              >
                {selected.shabad}
              </p>
            </div>

            {showArth && selected.meaning && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  ਅਰਥ · Vyakhya
                </p>
                <p
                  lang="pa"
                  className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-800 sm:text-lg"
                >
                  {selected.meaning}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  const idx = entries.findIndex((e) => e.id === selected.id);
                  if (idx > 0) setSelectedId(entries[idx - 1].id);
                }}
                disabled={entries.findIndex((e) => e.id === selected.id) <= 0}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = entries.findIndex((e) => e.id === selected.id);
                  if (idx >= 0 && idx < entries.length - 1)
                    setSelectedId(entries[idx + 1].id);
                }}
                disabled={
                  entries.findIndex((e) => e.id === selected.id) >=
                  entries.length - 1
                }
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Next →
              </button>
              <Link
                href="/shabad-test"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:border-amber-400"
              >
                Memorize this shabad
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/shabad-test" className="font-medium text-amber-700 hover:underline">
              Shabad Test
            </Link>
            {" · "}
            <Link href="/pothi" className="font-medium text-amber-700 hover:underline">
              Pothi Library
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
