"use client";

import { useEffect, useState } from "react";
import { tukhBank, SOURCES, sourceFor, type TukhItem, type Source } from "./gamesData";
import QuizScoreBar from "./QuizScoreBar";

const BEST_KEY = "tukh_completion_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Difficulty = "easy" | "medium" | "hard";

function poolFor(diff: Difficulty, sources: Set<Source>): TukhItem[] {
  const sourceFiltered = tukhBank.filter((t) => sources.has(sourceFor(t.bani)));
  switch (diff) {
    case "easy":   return sourceFiltered.filter((t) => (t.prefix + t.suffix).length <= 25 && !t.oddOneOut);
    case "medium": return sourceFiltered.filter((t) => { const n = (t.prefix + t.suffix).length; return n > 25 && n <= 45 && !t.oddOneOut; });
    case "hard":   return sourceFiltered.filter((t) => (t.prefix + t.suffix).length > 45 || t.oddOneOut);
  }
}

function makeRound(diff: Difficulty = "medium", sources: Set<Source> = new Set(SOURCES)): { item: TukhItem; options: string[] } {
  const pool = poolFor(diff, sources);
  const src = pool.length > 0 ? pool : tukhBank;
  const item = src[Math.floor(Math.random() * src.length)];
  const options = shuffle([item.answer, ...item.distractors]);
  return { item, options };
}

type Feedback = { kind: "none" } | { kind: "correct" } | { kind: "wrong"; picked: string };

export default function TukhCompletion() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [enabledSources, setEnabledSources] = useState<Set<Source>>(() => new Set(SOURCES));
  const [showSources, setShowSources] = useState(false);
  const [roundCap, setRoundCap] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [round, setRound] = useState(() => makeRound("medium"));
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "none" });
  const [seen, setSeen] = useState<Set<string>>(() => new Set([round.item.prefix + round.item.answer]));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_KEY);
      const n = saved ? parseInt(saved, 10) : 0;
      if (!Number.isNaN(n) && n > 0) setBest(n);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch {}
  }, [best]);

  function answer(opt: string) {
    if (feedback.kind !== "none") return;
    setAttempts((a) => a + 1);
    if (opt === round.item.answer) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => (next > b ? next : b));
        return next;
      });
      setFeedback({ kind: "correct" });
    } else {
      setStreak(0);
      setFeedback({ kind: "wrong", picked: opt });
    }
  }

  function nextRound() {
    setRoundsPlayed((n) => n + 1);
    const pool = poolFor(difficulty, enabledSources);
    const source = pool.length > 0 ? pool : tukhBank;
    let available = source.filter((t) => !seen.has(t.prefix + t.answer));
    let used = seen;
    if (available.length === 0) {
      available = source;
      used = new Set();
    }
    const item = available[Math.floor(Math.random() * available.length)];
    const options = shuffle([item.answer, ...item.distractors]);
    const nextSeen = new Set(used);
    nextSeen.add(item.prefix + item.answer);
    setSeen(nextSeen);
    setFeedback({ kind: "none" });
    setRound({ item, options });
  }

  function resetSession() {
    setRoundsPlayed(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setSeen(new Set());
    const r = makeRound(difficulty, enabledSources);
    setSeen(new Set([r.item.prefix + r.item.answer]));
    setRound(r);
    setFeedback({ kind: "none" });
  }

  function changeDifficulty(d: Difficulty) {
    setDifficulty(d);
    const r = makeRound(d, enabledSources);
    setSeen(new Set([r.item.prefix + r.item.answer]));
    setRound(r);
    setFeedback({ kind: "none" });
    setRoundsPlayed(0);
  }

  function toggleSource(s: Source) {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        if (next.size > 1) next.delete(s);
      } else next.add(s);
      return next;
    });
  }

  function borderFor(opt: string): string {
    if (feedback.kind === "correct" && opt === round.item.answer) return "border-green-500 border-2";
    if (feedback.kind === "wrong" && opt === feedback.picked) return "border-red-500 border-2";
    if (feedback.kind === "wrong" && opt === round.item.answer) return "border-green-500 border-2";
    return "border-amber-200";
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Tukh Completion</h1>
      <div className="mt-4">
        <QuizScoreBar score={score} attempts={attempts} streak={streak} best={best} />
      </div>

      <div className="mt-3 inline-flex w-full overflow-hidden rounded-full border border-amber-300">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => changeDifficulty(d)}
            className={[
              "flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider transition",
              difficulty === d ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100",
            ].join(" ")}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
        <button type="button" onClick={() => setShowSources((v) => !v)} className="rounded-full border border-amber-300 px-3 py-1 font-semibold text-amber-700 hover:bg-amber-100">
          Sources: {enabledSources.size === SOURCES.length ? "All" : `${enabledSources.size}/${SOURCES.length}`}
        </button>
        <div className="flex items-center gap-1">
          <span className="text-amber-900/70">Rounds:</span>
          {[0, 5, 10, 20].map((n) => (
            <button key={n} type="button" onClick={() => { setRoundCap(n); resetSession(); }} className={["rounded-full px-2 py-1 font-semibold transition", roundCap === n ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"].join(" ")}>
              {n === 0 ? "∞" : n}
            </button>
          ))}
        </div>
        {roundCap > 0 && (<span className="text-amber-900/70">{Math.min(roundsPlayed, roundCap)}/{roundCap}</span>)}
      </div>

      {showSources && (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
          {SOURCES.map((s) => {
            const count = tukhBank.filter((b) => sourceFor(b.bani) === s).length;
            return (
              <label key={s} className="flex cursor-pointer items-center gap-2 py-1">
                <input type="checkbox" checked={enabledSources.has(s)} onChange={() => toggleSource(s)} className="h-4 w-4 accent-amber-600" />
                <span className="flex-1 text-sm font-semibold text-amber-900">{s}</span>
                <span className="text-xs text-amber-900/60">{count} tukhs</span>
              </label>
            );
          })}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-6 text-center">
        <p className="text-sm text-amber-900/70">
          {round.item.oddOneOut ? "Which word does NOT belong after" : "Fill in the blank"}
        </p>
        <p className="mt-2 text-2xl font-bold text-amber-900">
          {round.item.oddOneOut
            ? round.item.prefix.trim()
            : `${round.item.prefix}____${round.item.suffix}`}
        </p>
        <p className="mt-2 text-xs text-amber-900/60">{round.item.bani}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {round.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={feedback.kind !== "none"}
            onClick={() => answer(opt)}
            className={[
              "flex items-center justify-center rounded-xl bg-amber-50 px-3 py-4 text-2xl font-bold text-amber-900 transition",
              borderFor(opt),
              feedback.kind !== "none" ? "cursor-default" : "hover:bg-amber-100",
            ].join(" ")}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback.kind !== "none" && (
        <button
          type="button"
          onClick={nextRound}
          className="mt-5 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Next tukh
        </button>
      )}
    </div>
  );
}
