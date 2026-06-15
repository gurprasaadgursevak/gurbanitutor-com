"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

type Verse = {
  verseId: number;
  gurmukhi: string;
  translit: string;
  punjabi: string;
  english: string;
};

type Hukamnama = {
  dateLabel: string;
  raag?: string;
  writer?: string;
  ang?: number;
  source?: string;
  verses: Verse[];
};

const HUKAMNAMA_URL = "https://api.banidb.com/v2/hukamnamas/today";

function pick<T = unknown>(obj: unknown, path: string[]): T | undefined {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return cur as T;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function formatTodayDate(): string {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function fetchHukamnama(): Promise<Hukamnama> {
  const res = await fetch(HUKAMNAMA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Hukamnama fetch failed (${res.status})`);
  const data = await res.json();

  const shabadIds: number[] = pick<number[]>(data, ["shabadIds"]) ?? [];
  if (shabadIds.length === 0) throw new Error("No Hukamnama returned today.");

  const shabadId = shabadIds[0];
  const sRes = await fetch(`https://api.banidb.com/v2/shabads/${shabadId}`);
  if (!sRes.ok) throw new Error(`Shabad fetch failed (${sRes.status})`);
  const shabad = await sRes.json();

  const versesRaw =
    (pick<unknown[]>(shabad, ["verses"]) as unknown[] | undefined) ?? [];

  const verses: Verse[] = versesRaw.map((row, i) => {
    const verseId = pick<number>(row, ["verseId"]) ?? i;
    const gurmukhi =
      asString(pick(row, ["verse", "unicode"])) ||
      asString(pick(row, ["verse", "gurmukhi"]));
    const translit = asString(pick(row, ["transliteration", "english"]));
    const punjabi =
      asString(pick(row, ["translation", "pu", "bdb", "unicode"])) ||
      asString(pick(row, ["translation", "pu", "ss", "unicode"])) ||
      asString(pick(row, ["translation", "pu", "ms", "unicode"]));
    const english = asString(pick(row, ["translation", "en", "bdb"]));
    return { verseId, gurmukhi, translit, punjabi, english };
  });

  const shabadInfo = pick<Record<string, unknown>>(shabad, ["shabadInfo"]);
  const raag = asString(pick(shabadInfo, ["raag", "raag"]));
  const writer = asString(pick(shabadInfo, ["writer", "english"]));
  const ang = pick<number>(shabadInfo, ["pageNo"]) ?? pick<number>(shabadInfo, ["pageno"]);
  const source = asString(pick(shabadInfo, ["source", "english"]));

  return {
    dateLabel: formatTodayDate(),
    raag,
    writer,
    ang,
    source,
    verses,
  };
}

export default function MukhvakPage() {
  const [data, setData] = useState<Hukamnama | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchHukamnama()
      .then((h) => {
        if (cancelled) return;
        setData(h);
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
          <div className="text-sm font-semibold text-amber-700">Sri Mukhvak</div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Today&apos;s Mukhvak
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Sri Hukamnama Sahib
          </h1>
          <p className="mt-3 text-sm text-slate-700">
            Daily Mukhvak from Sri Darbar Sahib, refreshed automatically each day.
          </p>
          {data?.dateLabel && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              {data.dateLabel}
            </p>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        {loading && (
          <p className="mt-6 text-center text-slate-600">Loading today&apos;s Mukhvak...</p>
        )}

        {error && !loading && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-semibold">Could not load today&apos;s Mukhvak.</p>
            <p className="mt-1">
              {error}. Please check your connection and try again, or visit{" "}
              <a
                className="font-semibold underline"
                href="https://sikhitothemax.org/hukamnama"
                target="_blank"
                rel="noopener noreferrer"
              >
                sikhitothemax.org/hukamnama
              </a>
              .
            </p>
          </div>
        )}

        {data && !loading && !error && (
          <>
            {/* Shabad meta */}
            {(data.raag || data.writer || data.ang) && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {data.raag && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-800">
                    Raag {data.raag}
                  </span>
                )}
                {data.writer && (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                    {data.writer}
                  </span>
                )}
                {data.ang && (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                    Ang {data.ang}
                  </span>
                )}
              </div>
            )}

            {/* Verses */}
            <ol className="mt-6 space-y-5">
              {data.verses.map((v) => (
                <li
                  key={v.verseId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xl leading-9 text-slate-900">{v.gurmukhi}</p>
                  {v.translit && (
                    <p className="mt-2 text-sm italic text-slate-600">{v.translit}</p>
                  )}
                  {v.punjabi && (
                    <p className="mt-3 text-sm leading-7 text-slate-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        ਅਰਥ
                      </span>{" "}
                      {v.punjabi}
                    </p>
                  )}
                  {v.english && (
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        EN
                      </span>{" "}
                      {v.english}
                    </p>
                  )}
                </li>
              ))}
            </ol>

            <p className="mt-8 text-center text-xs text-slate-500">
              Mukhvak data courtesy of BaniDB (banidb.com).
            </p>
          </>
        )}

        {/* Cross-links */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/search"
            className="group rounded-2xl border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Keep reading
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">
              Search Sri Guru Granth Sahib Ji
              <span
                aria-hidden
                className="ml-2 inline-block text-amber-600 transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Look up any line by Gurmukhi or English meaning, across Sri Guru Granth Sahib Ji
              and Sri Dasam Granth Sahib Ji.
            </p>
          </Link>
          <Link
            href="/pothi"
            className="group rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Read offline
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">
              Sri Pothi Sahib library
              <span
                aria-hidden
                className="ml-2 inline-block text-emerald-600 transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Sri Sukhmani Sahib Ji, Bhagat Kabir Sahib Ji&apos;s Sloaks, and more, to read or
              download.
            </p>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/search" className="font-medium text-amber-700 hover:underline">
              Gurbani Search
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
