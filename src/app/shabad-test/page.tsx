"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import GurmukhiKeyboard from "../GurmukhiKeyboard";
import SocialLinks from "../SocialLinks";

type Shabad = {
  id: string;
  marker: string;
  gurmukhi: string;
};

type Phase = "select" | "study" | "test" | "result";

// Default-mode normalization: strip everything except Gurmukhi letters,
// matras, and digits. Spaces and punctuation (including ॥, ;, :, , .)
// are forgiven by default, so learners aren't penalized for typing rhythm.
function normalizeLoose(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[^਀-੿ੴ]/g, "");
}

// Strict-mode normalization: collapse whitespace runs to a single space and
// trim, but every printable character including punctuation must match.
function normalizeStrict(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function normalize(s: string, strict: boolean): string {
  return strict ? normalizeStrict(s) : normalizeLoose(s);
}

type WordStatus = "ok" | "wrong" | "missing" | "extra";
type CharStatus = "ok" | "wrong" | "missing" | "extra";
type DiffChar = { ch: string; status: CharStatus };
type DiffWord = {
  expected: string; // original Gurmukhi word from the shabad
  actual: string;   // what the user typed at this position (may be "")
  status: WordStatus;
  chars: DiffChar[]; // character-level (matra-level) diff inside the word
};

// Split a shabad/attempt into "words". In strict mode only whitespace and
// dandis (॥) are separators, so attached punctuation (e.g. `ਏ;ਨਮਹ`) stays
// part of the token and must match. In loose mode we also split on `;`, `,`,
// `.`, `:`, `।`, `?`, `!` so the Gareebi Pothi source's attached semicolons
// don't penalize learners who type the same words separated only by spaces.
function tokenize(s: string, strict: boolean): string[] {
  const sep = strict ? /[\s॥]+/u : /[\s॥।;,.:?!]+/u;
  return s.split(sep).filter((w) => w.length > 0);
}

function diff(
  reference: string,
  attempt: string,
  strict: boolean
): { words: DiffWord[]; allCorrect: boolean; charsAlongside: DiffChar[] } {
  const refWords = tokenize(reference, strict);
  const usrWords = tokenize(attempt, strict);
  const max = Math.max(refWords.length, usrWords.length);
  const words: DiffWord[] = [];
  let allCorrect = refWords.length === usrWords.length;

  for (let i = 0; i < max; i++) {
    const r = refWords[i];
    const u = usrWords[i];
    if (r === undefined) {
      words.push({
        expected: "",
        actual: u ?? "",
        status: "extra",
        chars: (u ?? "").split("").map((ch) => ({ ch, status: "extra" as CharStatus })),
      });
      allCorrect = false;
      continue;
    }
    if (u === undefined) {
      words.push({
        expected: r,
        actual: "",
        status: "missing",
        chars: r.split("").map((ch) => ({ ch, status: "missing" as CharStatus })),
      });
      allCorrect = false;
      continue;
    }
    const rNorm = normalize(r, strict);
    const uNorm = normalize(u, strict);
    const ok = rNorm === uNorm;
    if (!ok) allCorrect = false;
    // Build matra-level char diff between the original-cased r and u so the
    // user can see which lag is wrong.
    const charsLen = Math.max(r.length, u.length);
    const chars: DiffChar[] = [];
    for (let j = 0; j < charsLen; j++) {
      const cr = r[j];
      const cu = u[j];
      if (cr === undefined) chars.push({ ch: cu, status: "extra" });
      else if (cu === undefined) chars.push({ ch: cr, status: "missing" });
      else if (cr === cu) chars.push({ ch: cr, status: "ok" });
      else chars.push({ ch: cr, status: "wrong" });
    }
    words.push({ expected: r, actual: u, status: ok ? "ok" : "wrong", chars });
  }

  // Also build a flat char-diff over the normalized reference so the
  // legend/overview can show overall char accuracy if we ever want it.
  const ref = normalize(reference, strict);
  const usr = normalize(attempt, strict);
  const charsAlongside: DiffChar[] = [];
  const cmax = Math.max(ref.length, usr.length);
  for (let i = 0; i < cmax; i++) {
    const r = ref[i];
    const u = usr[i];
    if (r === undefined) charsAlongside.push({ ch: u, status: "extra" });
    else if (u === undefined) charsAlongside.push({ ch: r, status: "missing" });
    else if (r === u) charsAlongside.push({ ch: r, status: "ok" });
    else charsAlongside.push({ ch: r, status: "wrong" });
  }

  return { words, allCorrect, charsAlongside };
}

// Pick a "Shabad of the Day" deterministically from a list, rotating once
// per local-calendar day. Same shabad for everyone on the same date.
function dailyIndex(total: number): number {
  if (total <= 0) return 0;
  const now = new Date();
  const dayStamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  let h = 2166136261;
  for (let i = 0; i < dayStamp.length; i++) {
    h ^= dayStamp.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % total;
}

function parseTSV(text: string): Shabad[] {
  const lines = text.split("\n");
  const out: Shabad[] = [];
  // Header row at index 0; skip it.
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (cols.length < 2) continue;
    const marker = (cols[0] || "").trim();
    const gurmukhi = (cols[1] || "").trim();
    if (!gurmukhi) continue;
    out.push({ id: `gareebi-${i}`, marker, gurmukhi });
  }
  return out;
}

export default function ShabadTestPage() {
  const [shabads, setShabads] = useState<Shabad[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [strictPunct, setStrictPunct] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load the Gareebi Pothi shabad bank at mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/gareebi-pothi-shabads.tsv?v=5", {
          cache: "no-cache",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        setShabads(parseTSV(text));
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

  const selected = useMemo(
    () => shabads.find((s) => s.id === selectedId) ?? null,
    [shabads, selectedId]
  );

  const filteredShabads = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return shabads;
    return shabads.filter(
      (s) => s.gurmukhi.includes(q) || s.marker.includes(q)
    );
  }, [shabads, searchQuery]);

  const dailyShabad = useMemo(() => {
    if (shabads.length === 0) return null;
    return shabads[dailyIndex(shabads.length)] ?? null;
  }, [shabads]);

  const endsWithDandi = useMemo(() => /॥\s*$/.test(attempt.trim()), [attempt]);

  const diffResult = useMemo(() => {
    if (!selected || phase !== "result") return null;
    return diff(selected.gurmukhi, attempt, strictPunct);
  }, [selected, attempt, phase, strictPunct]);

  useEffect(() => {
    if (phase === "test") {
      const t = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function pickShabad(id: string) {
    setSelectedId(id);
    setAttempt("");
    setPhase("study");
  }

  function startTest() {
    setAttempt("");
    setShowKeyboard(true);
    setPhase("test");
  }

  function submit() {
    setPhase("result");
  }

  function retry() {
    setAttempt("");
    setShowKeyboard(true);
    setPhase("test");
  }

  function backToList() {
    setSelectedId(null);
    setAttempt("");
    setShowKeyboard(false);
    setPhase("select");
  }

  function insertChar(ch: string) {
    const el = textareaRef.current;
    if (!el) {
      setAttempt((a) => a + ch);
      return;
    }
    const start = el.selectionStart ?? attempt.length;
    const end = el.selectionEnd ?? attempt.length;
    const next = attempt.slice(0, start) + ch + attempt.slice(end);
    setAttempt(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + ch.length;
      el.setSelectionRange(caret, caret);
    });
  }

  function backspace() {
    const el = textareaRef.current;
    if (!el) {
      setAttempt((a) => a.slice(0, -1));
      return;
    }
    const start = el.selectionStart ?? attempt.length;
    const end = el.selectionEnd ?? attempt.length;
    if (start === end && start > 0) {
      const next = attempt.slice(0, start - 1) + attempt.slice(end);
      setAttempt(next);
      requestAnimationFrame(() => {
        el.focus();
        const caret = start - 1;
        el.setSelectionRange(caret, caret);
      });
    } else if (start !== end) {
      const next = attempt.slice(0, start) + attempt.slice(end);
      setAttempt(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start);
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Shabad Test</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        {phase === "select" && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Memorize, then test
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Pick a shabad to memorize.
            </h1>
            <div className="mt-4 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-base leading-7 text-slate-800">
              <p className="font-semibold text-amber-900">
                The easiest way to memorize a shabad
              </p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                <li>
                  Sing the shabad with the sangat in Shudh Ucharan at least 101
                  times — let your tongue learn the line before your mind does.
                </li>
                <li>
                  As you sing, pay attention to every lag, sihari, and bihari so
                  each matra settles where it belongs.
                </li>
                <li>
                  When the shabad feels steady in your heart, come back here for
                  the written test to confirm every letter and matra is right.
                </li>
              </ol>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {shabads.length > 0 ? `${shabads.length} ` : ""}shabads to choose from,
              selected from Gareebi Pothi Sahib. Spaces and punctuation are forgiven by
              default; every shabad must end with ॥.
            </p>

            {loading && (
              <p className="mt-8 text-center text-slate-600">Loading shabads...</p>
            )}
            {loadError && (
              <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                Could not load shabad bank: {loadError}
              </p>
            )}

            {!loading && !loadError && (
              <>
                {dailyShabad && (
                  <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                      Today's Shabad · #{dailyShabad.marker}
                    </p>
                    <p
                      lang="pa"
                      className="mt-2 text-lg leading-relaxed text-slate-900"
                    >
                      {dailyShabad.gurmukhi}
                    </p>
                    <button
                      type="button"
                      onClick={() => pickShabad(dailyShabad.id)}
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                    >
                      Memorize today's shabad
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Gurmukhi text or marker..."
                    lang="pa"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Showing {filteredShabads.length} of {shabads.length}
                  </p>
                </div>

                <ul className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  {filteredShabads.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => pickShabad(s.id)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-amber-50"
                      >
                        <span className="flex-1">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-amber-700">
                            #{s.marker}
                          </span>
                          <span
                            lang="pa"
                            className="mt-1 block truncate text-base text-slate-900"
                          >
                            {s.gurmukhi}
                          </span>
                        </span>
                        <span className="text-amber-700" aria-hidden>
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                  {filteredShabads.length === 0 && (
                    <li className="px-4 py-6 text-center text-sm text-slate-500">
                      No shabads match your search.
                    </li>
                  )}
                </ul>
              </>
            )}
          </section>
        )}

        {phase === "study" && selected && (
          <section>
            <button
              type="button"
              onClick={backToList}
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              ← All shabads
            </button>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-700">
              Study · #{selected.marker}
            </p>
            <div className="mt-3 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <p
                lang="pa"
                className="whitespace-pre-wrap text-2xl leading-relaxed text-slate-900 sm:text-3xl"
              >
                {selected.gurmukhi}
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-700">
              When you can recite it from memory, begin the test. The shabad
              will disappear. Type it out and submit. Every shabad must end with{" "}
              <span lang="pa" className="font-semibold">
                ॥
              </span>
              .
            </p>

            <label className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={strictPunct}
                onChange={(e) => setStrictPunct(e.target.checked)}
                className="h-4 w-4"
              />
              <span>
                <span className="font-semibold">Strict punctuation</span> (bonus): include
                every <span lang="pa">॥</span>, <span lang="pa">;</span>, <span lang="pa">.</span>{" "}
                exactly. Off by default.
              </span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startTest}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                Begin test
              </button>
              <button
                type="button"
                onClick={backToList}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Pick another
              </button>
            </div>
          </section>
        )}

        {phase === "test" && selected && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Test · #{selected.marker}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Type the shabad from memory. Spaces and punctuation are forgiven{" "}
              {strictPunct
                ? "but you have Strict punctuation enabled, so every mark must match."
                : "by default, focus on the letters and matras."}{" "}
              End with{" "}
              <span lang="pa" className="font-semibold">
                ॥
              </span>
              .
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Use the on-screen Gurmukhi keyboard below, or tap the box to type
              with your device's own keyboard, your choice.
            </p>

            <textarea
              ref={textareaRef}
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              placeholder="Begin typing..."
              lang="pa"
              rows={6}
              className="mt-5 w-full rounded-2xl border border-amber-200 bg-white p-4 text-xl leading-relaxed text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 sm:text-2xl"
            />

            {attempt.trim().length > 0 && !endsWithDandi && (
              <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Reminder: a shabad must end with{" "}
                <span lang="pa" className="font-semibold">
                  ॥
                </span>
                . Add it before you submit.
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={attempt.trim().length === 0}
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowKeyboard((v) => !v)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
              >
                {showKeyboard ? "Hide" : "Show"} Gurmukhi keyboard
              </button>
              <button
                type="button"
                onClick={() => setPhase("study")}
                className="text-sm font-medium text-slate-600 hover:underline"
              >
                Back to study
              </button>
            </div>

            {showKeyboard && (
              <div className="mt-4">
                <GurmukhiKeyboard
                  onInsert={insertChar}
                  onBackspace={backspace}
                  onClose={() => setShowKeyboard(false)}
                />
              </div>
            )}
          </section>
        )}

        {phase === "result" && selected && diffResult && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Result · #{selected.marker}
            </p>

            {diffResult.allCorrect ? (
              <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                <p className="text-base font-semibold text-emerald-900">
                  Pass · every {strictPunct ? "character" : "letter"} matched.
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  Dhan Guru, dhan Sangat. You have this shabad by heart.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <p className="text-base font-semibold text-amber-900">
                  Close, but not yet. Look at the words below and try once more.
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  Bhul-chuk maaf — every gursikh stumbles before the words settle in
                  the heart. Studying daily and retrying is how it sticks. Take a
                  breath, re-read the shabad, and try again.
                </p>
                <p className="mt-2 text-xs text-amber-700">
                  Mode: {strictPunct ? "Strict punctuation" : "Letters only"}
                </p>
              </div>
            )}

            {(() => {
              const wrongWords = diffResult.words.filter((w) => w.status !== "ok");
              if (wrongWords.length === 0) return null;
              return (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Words you missed
                  </p>
                  <ul className="mt-2 space-y-2">
                    {wrongWords.map((w, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="text-slate-500">Expected:</span>
                          <span
                            lang="pa"
                            className="text-lg font-semibold text-emerald-800"
                          >
                            {w.expected || "(nothing — extra word typed)"}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="text-slate-500">You typed:</span>
                          <span
                            lang="pa"
                            className="text-lg font-semibold text-red-700"
                          >
                            {w.actual || "(nothing — word missing)"}
                          </span>
                        </div>
                        {w.expected && w.actual && (
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="text-slate-500">Which lag was off:</span>
                            <span lang="pa" className="text-xl">
                              {w.chars.map((c, j) => {
                                const cls =
                                  c.status === "ok"
                                    ? "text-slate-900"
                                    : c.status === "wrong"
                                      ? "bg-red-100 text-red-800 underline decoration-red-500 decoration-2 underline-offset-4"
                                      : c.status === "missing"
                                        ? "bg-amber-100 text-amber-800 underline decoration-amber-500 decoration-2 underline-offset-4"
                                        : "bg-red-100 text-red-800 line-through decoration-red-500";
                                return (
                                  <span key={j} className={cls}>
                                    {c.ch}
                                  </span>
                                );
                              })}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()}

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Full shabad, word by word
            </p>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p lang="pa" className="text-xl leading-relaxed sm:text-2xl">
                {diffResult.words.map((w, i) => {
                  const cls =
                    w.status === "ok"
                      ? "text-slate-900"
                      : w.status === "wrong"
                        ? "bg-red-100 text-red-800 px-1 rounded"
                        : w.status === "missing"
                          ? "bg-amber-100 text-amber-800 px-1 rounded"
                          : "bg-red-100 text-red-800 line-through px-1 rounded";
                  return (
                    <span key={i}>
                      <span className={cls}>{w.expected || w.actual}</span>{" "}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-slate-900" />
                Correct
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-red-200" />
                Wrong word/lag
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-200" />
                Missing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-red-200 line-through" />
                Extra
              </span>
            </div>

            <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                Show what you typed
              </summary>
              <p
                lang="pa"
                className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-slate-700"
              >
                {attempt}
              </p>
            </details>

            <div className="mt-6 flex flex-wrap gap-3">
              {!diffResult.allCorrect && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Retry from scratch
                </button>
              )}
              <button
                type="button"
                onClick={() => setPhase("study")}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
              >
                Study again
              </button>
              <button
                type="button"
                onClick={backToList}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
              >
                Pick another shabad
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/quiz" className="font-medium text-amber-700 hover:underline">
              Gurbani Quiz
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
