"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Granth = "sggs" | "dasam";

type Line = {
  ang: number;
  gurmukhi: string;
  steek1?: string; // formerly SSK
  steek2?: string; // formerly BMS
  ucharanTip?: string;
  extendedUcharanTip?: string;
  arth?: string;
};

const QUOTES = new Set(['"', "“", "”", "‘", "’", "'", "`"]);

function strip(s: string): string {
  return s
    .split("")
    .filter((c) => !QUOTES.has(c))
    .join("")
    .trim();
}

// IMPORTANT: do not use String.prototype.trim() on the row — \t is whitespace,
// and trim() would silently strip trailing tab-separated empty columns, dropping
// rows below the 9-column threshold. Only strip the trailing \r from CRLF lines.
function stripCR(s: string): string {
  return s.endsWith("\r") ? s.slice(0, -1) : s;
}

function parseSGGS(text: string): Line[] {
  const rows = text.split("\n");
  const out: Line[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = stripCR(rows[i]);
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 9) continue;
    const ang = parseInt((cols[0] || "").trim(), 10);
    if (Number.isNaN(ang)) continue;
    out.push({
      ang,
      gurmukhi: strip(cols[2] || ""),
      steek1: (cols[3] || "").trim(),
      steek2: (cols[4] || "").trim(),
      ucharanTip: (cols[5] || "").trim(),
      extendedUcharanTip: (cols[6] || "").trim(),
      arth: (cols[7] || "").trim(),
    });
  }
  return out;
}

function parseDasam(text: string): Line[] {
  const rows = text.split("\n");
  const out: Line[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = stripCR(rows[i]);
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 2) continue;
    const ang = parseInt((cols[0] || "").trim(), 10);
    if (Number.isNaN(ang)) continue;
    out.push({ ang, gurmukhi: strip(cols[1] || "") });
  }
  return out;
}

export default function GranthReaderPage() {
  return (
    <Suspense fallback={null}>
      <GranthReader />
    </Suspense>
  );
}

function GranthReader() {
  const searchParams = useSearchParams();
  const [granth, setGranth] = useState<Granth>("sggs");
  const [sggs, setSggs] = useState<Line[] | null>(null);
  const [dasam, setDasam] = useState<Line[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [angSggs, setAngSggs] = useState(1);
  const [angDasam, setAngDasam] = useState(1);
  const [angInput, setAngInput] = useState("1");

  const [showArth, setShowArth] = useState(true);
  const [showSteek1, setShowSteek1] = useState(false);
  const [showSteek2, setShowSteek2] = useState(false);
  const [showUcharan, setShowUcharan] = useState(false);
  const [showExtendedUcharan, setShowExtendedUcharan] = useState(false);

  const [highlightLine, setHighlightLine] = useState<string | null>(null);

  // On mount: read URL params first, fall back to localStorage. URL wins.
  useEffect(() => {
    const g = searchParams.get("g");
    const angStr = searchParams.get("ang");
    const line = searchParams.get("line");

    const urlGranth: Granth | null = g === "sggs" || g === "dasam" ? g : null;
    const urlAng = angStr ? parseInt(angStr, 10) : NaN;

    if (urlGranth) {
      setGranth(urlGranth);
    } else {
      try {
        const savedG = localStorage.getItem("granth_active") as Granth | null;
        if (savedG === "sggs" || savedG === "dasam") setGranth(savedG);
      } catch {}
    }

    if (!Number.isNaN(urlAng) && urlAng > 0) {
      if (urlGranth === "dasam") setAngDasam(urlAng);
      else setAngSggs(urlAng);
    } else {
      try {
        const sa = localStorage.getItem("granth_sggs_ang");
        const da = localStorage.getItem("granth_dasam_ang");
        if (sa) setAngSggs(Math.max(1, parseInt(sa, 10) || 1));
        if (da) setAngDasam(Math.max(1, parseInt(da, 10) || 1));
      } catch {}
    }

    if (line) setHighlightLine(line);
    else setHighlightLine(null);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, dRes] = await Promise.all([fetch("/sggs.tsv"), fetch("/dasam.tsv")]);
        if (!sRes.ok || !dRes.ok) throw new Error("Failed to load Granth data.");
        const [sText, dText] = await Promise.all([sRes.text(), dRes.text()]);
        if (cancelled) return;
        setSggs(parseSGGS(sText));
        setDasam(parseDasam(dText));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  const corpus = granth === "sggs" ? sggs : dasam;
  const maxAng = useMemo(() => {
    if (!corpus) return 1;
    let m = 1;
    for (const line of corpus) if (line.ang > m) m = line.ang;
    return m;
  }, [corpus]);

  const ang = granth === "sggs" ? angSggs : angDasam;
  const setAng = (n: number) => {
    const clamped = Math.max(1, Math.min(maxAng, n));
    if (granth === "sggs") {
      setAngSggs(clamped);
      try {
        localStorage.setItem("granth_sggs_ang", String(clamped));
      } catch {}
    } else {
      setAngDasam(clamped);
      try {
        localStorage.setItem("granth_dasam_ang", String(clamped));
      } catch {}
    }
    // Drop the highlight from a previous /search jump so we don't re-scroll
    // to that line on the new Ang.
    setHighlightLine(null);
    // Take the reader back to the top of the new Ang.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setAngInput(String(clamped));
  };

  useEffect(() => {
    setAngInput(String(ang));
  }, [ang, granth]);

  useEffect(() => {
    try {
      localStorage.setItem("granth_active", granth);
    } catch {}
  }, [granth]);

  const lines = useMemo(() => {
    if (!corpus) return [];
    return corpus.filter((l) => l.ang === ang);
  }, [corpus, ang]);

  const loading = sggs === null || dasam === null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Read Gurbani</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Sri Guru Granth Sahib Ji & Sri Dasam Granth Sahib Ji
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Read Gurbani, Ang by Ang.
          </h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            Choose a Granth and an Ang. The full Gurmukhi text appears below, with optional
            ਅਰਥ, English Steeks, and ucharan tips.
          </p>
        </div>

        {/* Granth picker */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGranth("sggs")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              granth === "sggs"
                ? "border-amber-600 bg-amber-100 text-amber-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
            }`}
          >
            Sri Guru Granth Sahib Ji
          </button>
          <button
            type="button"
            onClick={() => setGranth("dasam")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              granth === "dasam"
                ? "border-amber-600 bg-amber-100 text-amber-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
            }`}
          >
            Sri Dasam Granth Sahib Ji
          </button>
        </div>

        {/* Ang controls */}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={() => setAng(ang - 1)}
            disabled={loading || ang <= 1}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
          >
            ← Prev Ang
          </button>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ang
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(angInput, 10);
                if (!Number.isNaN(n)) setAng(n);
              }}
              className="mt-1 flex items-center gap-2"
            >
              <input
                value={angInput}
                onChange={(e) => setAngInput(e.target.value)}
                onBlur={() => {
                  const n = parseInt(angInput, 10);
                  if (!Number.isNaN(n)) setAng(n);
                  else setAngInput(String(ang));
                }}
                inputMode="numeric"
                disabled={loading}
                className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              <span className="text-sm text-slate-500">of {loading ? "…" : maxAng}</span>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Go
              </button>
            </form>
          </div>
          <button
            type="button"
            onClick={() => setAng(ang + 1)}
            disabled={loading || ang >= maxAng}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
          >
            Next Ang →
          </button>
        </div>

        {/* Show toggles */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Show
          </span>
          <ToggleChip label="ਅਰਥ" on={showArth} onToggle={() => setShowArth((v) => !v)} />
          {granth === "sggs" && (
            <>
              <ToggleChip
                label="Ucharan"
                on={showUcharan}
                onToggle={() => setShowUcharan((v) => !v)}
              />
              <ToggleChip
                label="Extended Ucharan"
                on={showExtendedUcharan}
                onToggle={() => setShowExtendedUcharan((v) => !v)}
              />
              <ToggleChip
                label="English Steek 1"
                on={showSteek1}
                onToggle={() => setShowSteek1((v) => !v)}
              />
              <ToggleChip
                label="English Steek 2"
                on={showSteek2}
                onToggle={() => setShowSteek2((v) => !v)}
              />
            </>
          )}
        </div>

        {/* Lines */}
        {error && (
          <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}
        {loading && !error && (
          <p className="mt-8 text-center text-slate-600">Loading Granth Sahib...</p>
        )}
        {!loading && !error && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lines.length} line{lines.length === 1 ? "" : "s"} on Ang {ang}
            </p>
            <ol className="mt-3 space-y-3">
              {lines.map((l, i) => {
                const isMatch =
                  highlightLine !== null &&
                  l.gurmukhi.startsWith(highlightLine.slice(0, 30));
                return (
                <li
                  key={`${l.ang}-${i}`}
                  ref={(el) => {
                    if (isMatch && el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  className={`rounded-2xl border p-4 shadow-sm transition ${
                    isMatch
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {showUcharan && l.ucharanTip && (
                    <p className="mb-2 text-sm leading-7 text-amber-800">
                      {l.ucharanTip}
                    </p>
                  )}
                  <p className="text-lg leading-9 text-slate-900">{l.gurmukhi}</p>
                  {showExtendedUcharan && l.extendedUcharanTip && (
                    <p className="mt-2 text-sm leading-7 text-amber-800">
                      {l.extendedUcharanTip}
                    </p>
                  )}
                  {showArth && l.arth && (
                    <p className="mt-2 text-sm leading-7 text-slate-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        ਅਰਥ
                      </span>{" "}
                      {l.arth}
                    </p>
                  )}
                  {showSteek1 && l.steek1 && (
                    <p className="mt-1 text-sm leading-7 text-slate-700">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        English Steek 1
                      </span>{" "}
                      {l.steek1}
                    </p>
                  )}
                  {showSteek2 && l.steek2 && (
                    <p className="mt-1 text-sm leading-7 text-slate-700">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        English Steek 2
                      </span>{" "}
                      {l.steek2}
                    </p>
                  )}
                </li>
                );
              })}
            </ol>
            {lines.length === 0 && (
              <p className="mt-8 text-center text-slate-500">
                No lines found on this Ang. Try a different Ang number.
              </p>
            )}

            <div className="mt-10 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setAng(ang - 1)}
                disabled={ang <= 1}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => setAng(ang + 1)}
                disabled={ang >= maxAng}
                className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </>
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
            <Link href="/search" className="font-medium text-amber-700 hover:underline">
              Search Gurbani
            </Link>
            {" · "}
            <Link href="/mukhvak" className="font-medium text-amber-700 hover:underline">
              Sri Mukhvak
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ToggleChip({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        on
          ? "border-amber-600 bg-amber-100 text-amber-900"
          : "border-slate-200 bg-white text-slate-600 hover:border-amber-300"
      }`}
    >
      {label}
    </button>
  );
}
