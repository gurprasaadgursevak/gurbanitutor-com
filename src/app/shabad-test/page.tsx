"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import GurmukhiKeyboard from "../GurmukhiKeyboard";
import SocialLinks from "../SocialLinks";

type Shabad = {
  id: string;
  title: string;
  subtitle?: string;
  gurmukhi: string;
};

// Placeholder list. Replace with the full shabad set when ready.
const SHABADS: Shabad[] = [
  {
    id: "mool-mantar",
    title: "Mool Mantar",
    subtitle: "Sri Guru Granth Sahib Ji, Ang 1",
    gurmukhi:
      "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
  },
];

type Phase = "select" | "study" | "test" | "result";

// Normalize internal whitespace runs to a single space and trim ends so a
// learner isn't penalized for an extra space between words, but every other
// character (matras, half-letters, dandis, nuktas) must match exactly.
function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

type CharStatus = "ok" | "wrong" | "missing" | "extra";

type DiffChar = { ch: string; status: CharStatus };

function diff(reference: string, attempt: string): { chars: DiffChar[]; allCorrect: boolean } {
  const ref = normalize(reference);
  const usr = normalize(attempt);
  const max = Math.max(ref.length, usr.length);
  const chars: DiffChar[] = [];
  let allCorrect = ref.length === usr.length;
  for (let i = 0; i < max; i++) {
    const r = ref[i];
    const u = usr[i];
    if (r === undefined) {
      chars.push({ ch: u, status: "extra" });
      allCorrect = false;
    } else if (u === undefined) {
      chars.push({ ch: r, status: "missing" });
      allCorrect = false;
    } else if (r === u) {
      chars.push({ ch: r, status: "ok" });
    } else {
      chars.push({ ch: r, status: "wrong" });
      allCorrect = false;
    }
  }
  return { chars, allCorrect };
}

export default function ShabadTestPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const selected = useMemo(
    () => SHABADS.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  const diffResult = useMemo(() => {
    if (!selected || phase !== "result") return null;
    return diff(selected.gurmukhi, attempt);
  }, [selected, attempt, phase]);

  // When the user lands on the "test" phase, focus the textarea.
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
    setShowKeyboard(false);
    setPhase("test");
  }

  function submit() {
    setPhase("result");
  }

  function retry() {
    setAttempt("");
    setShowKeyboard(false);
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
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Read the shabad until you have it by heart, then type it out
              exactly, matras and all. Pass only when every character matches.
            </p>

            <ul className="mt-8 space-y-3">
              {SHABADS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => pickShabad(s.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-amber-400"
                  >
                    <span>
                      <span className="block text-base font-semibold text-slate-900">
                        {s.title}
                      </span>
                      {s.subtitle && (
                        <span className="block text-xs text-slate-600">{s.subtitle}</span>
                      )}
                    </span>
                    <span className="text-amber-700" aria-hidden>→</span>
                  </button>
                </li>
              ))}
            </ul>
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
              Study
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {selected.title}
            </h1>
            {selected.subtitle && (
              <p className="mt-1 text-sm text-slate-600">{selected.subtitle}</p>
            )}
            <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <p
                lang="pa"
                className="whitespace-pre-wrap text-2xl leading-relaxed text-slate-900 sm:text-3xl"
              >
                {selected.gurmukhi}
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-700">
              When you can recite it from memory, begin the test. The shabad
              will disappear — type it out and submit. Pass only at 100%.
            </p>
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
              Test
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {selected.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Type the shabad exactly. Every matra, nukta, and dandi counts.
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
              Result
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {selected.title}
            </h1>

            {diffResult.allCorrect ? (
              <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                <p className="text-base font-semibold text-emerald-900">
                  Pass · every character matched.
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  Dhan Guru, dhan Sangat. You have this shabad by heart.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-5">
                <p className="text-base font-semibold text-red-900">
                  Not quite. Check the mistakes below and try again.
                </p>
              </div>
            )}

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reference, with your mistakes marked
            </p>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p lang="pa" className="text-2xl leading-relaxed sm:text-3xl">
                {diffResult.chars.map((c, i) => {
                  const cls =
                    c.status === "ok"
                      ? "text-slate-900"
                      : c.status === "wrong"
                        ? "bg-red-100 text-red-800 underline decoration-red-500 decoration-2 underline-offset-4"
                        : c.status === "missing"
                          ? "bg-amber-100 text-amber-800 underline decoration-amber-500 decoration-2 underline-offset-4"
                          : "bg-red-100 text-red-800 line-through decoration-red-500";
                  return (
                    <span key={i} className={cls}>
                      {c.ch === " " ? " " : c.ch}
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
                Wrong character
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-200" />
                Missing character
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-red-200 line-through" />
                Extra character
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
