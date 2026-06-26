"use client";

import { useEffect, useState } from "react";
import { baniBank, allBanis, SOURCES, sourceFor, type BaniItem, type Source } from "./gamesData";
import QuizScoreBar from "./QuizScoreBar";

const BEST_KEY = "bani_identifier_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Difficulty = "easy" | "medium" | "hard";

function poolFor(diff: Difficulty, sources: Set<Source>): BaniItem[] {
  const sourceFiltered = baniBank.filter((b) => sources.has(sourceFor(b.bani)));
  switch (diff) {
    case "easy":   return sourceFiltered.filter((b) => b.tukh.length <= 30);
    case "medium": return sourceFiltered.filter((b) => b.tukh.length > 30 && b.tukh.length <= 50);
    case "hard":   return sourceFiltered.filter((b) => b.tukh.length > 50);
  }
}

function makeRound(diff: Difficulty = "medium", sources: Set<Source> = new Set(SOURCES)): { current: BaniItem; options: string[] } {
  const pool = poolFor(diff, sources);
  const src = pool.length > 0 ? pool : baniBank;
  const current = src[Math.floor(Math.random() * src.length)];
  const distractors = shuffle(allBanis.filter((b) => b !== current.bani)).slice(0, 3);
  const options = shuffle([...distractors, current.bani]);
  return { current, options };
}

type Feedback = { kind: "none" } | { kind: "correct" } | { kind: "wrong"; picked: string };

export default function BaniIdentifier() {
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
  const [seen, setSeen] = useState<Set<string>>(() => new Set([round.current.tukh]));

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

  function answer(b: string) {
    if (feedback.kind !== "none") return;
    setAttempts((a) => a + 1);
    if (b === round.current.bani) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((bb) => (next > bb ? next : bb));
        return next;
      });
      setFeedback({ kind: "correct" });
    } else {
      setStreak(0);
      setFeedback({ kind: "wrong", picked: b });
    }
  }

  function nextRound() {
    setRoundsPlayed((n) => n + 1);
    const pool = poolFor(difficulty, enabledSources);
    const source = pool.length > 0 ? pool : baniBank;
    let available = source.filter((b) => !seen.has(b.tukh));
    let used = seen;
    if (available.length === 0) {
      available = source;
      used = new Set();
    }
    const current = available[Math.floor(Math.random() * available.length)];
    const banisInPool = new Set(pool.map((p) => p.bani));
    const candidates = allBanis.filter((b) => b !== current.bani && banisInPool.has(b));
    const fallback = allBanis.filter((b) => b !== current.bani);
    const distractorPool = candidates.length >= 3 ? candidates : fallback;
    const distractors = shuffle(distractorPool).slice(0, 3);
    const options = shuffle([...distractors, current.bani]);
    const nextSeen = new Set(used);
    nextSeen.add(current.tukh);
    setSeen(nextSeen);
    setFeedback({ kind: "none" });
    setRound({ current, options });
  }

  function changeDifficulty(d: Difficulty) {
    setDifficulty(d);
    const r = makeRound(d, enabledSources);
    setSeen(new Set([r.current.tukh]));
    setRound(r);
    setFeedback({ kind: "none" });
    setRoundsPlayed(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
  }

  function toggleSource(s: Source) {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        if (next.size > 1) next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });
  }

  function setRounds(n: number) {
    setRoundCap(n);
    setRoundsPlayed(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setSeen(new Set());
    const r = makeRound(difficulty, enabledSources);
    setSeen(new Set([r.current.tukh]));
    setRound(r);
    setFeedback({ kind: "none" });
  }

  function borderFor(b: string): string {
    if (feedback.kind === "correct" && b === round.current.bani) return "border-green-500 border-2";
    if (feedback.kind === "wrong" && b === feedback.picked) return "border-red-500 border-2";
    if (feedback.kind === "wrong" && b === round.current.bani) return "border-green-500 border-2";
    return "border-amber-200";
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Bani Identifier</h1>
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
        <button
          type="button"
          onClick={() => setShowSources((v) => !v)}
          className="rounded-full border border-amber-300 px-3 py-1 font-semibold text-amber-700 hover:bg-amber-100"
        >
          Sources: {enabledSources.size === SOURCES.length ? "All" : `${enabledSources.size}/${SOURCES.length}`}
        </button>
        <div className="flex items-center gap-1">
          <span className="text-amber-900/70">Rounds:</span>
          {[0, 5, 10, 20].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRounds(n)}
              className={[
                "rounded-full px-2 py-1 font-semibold transition",
                roundCap === n ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100",
              ].join(" ")}
            >
              {n === 0 ? "∞" : n}
            </button>
          ))}
        </div>
        {roundCap > 0 && (
          <span className="text-amber-900/70">{Math.min(roundsPlayed, roundCap)}/{roundCap}</span>
        )}
      </div>

      {showSources && (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
          {SOURCES.map((s) => {
            const count = baniBank.filter((b) => sourceFor(b.bani) === s).length;
            const on = enabledSources.has(s);
            return (
              <label key={s} className="flex cursor-pointer items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleSource(s)}
                  className="h-4 w-4 accent-amber-600"
                />
                <span className="flex-1 text-sm font-semibold text-amber-900">{s}</span>
                <span className="text-xs text-amber-900/60">{count} lines</span>
              </label>
            );
          })}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-6 text-center">
        <p className="text-sm text-amber-900/70">Which bani is this from?</p>
        <p className="mt-2 text-2xl font-bold text-amber-900">{round.current.tukh}</p>
      </div>

      <div className="mt-5 space-y-2.5">
        {round.options.map((b) => (
          <button
            key={b}
            type="button"
            disabled={feedback.kind !== "none"}
            onClick={() => answer(b)}
            className={[
              "flex w-full items-center rounded-xl bg-amber-50 px-4 py-3 text-left font-semibold text-amber-900 transition",
              borderFor(b),
              feedback.kind !== "none" ? "cursor-default" : "hover:bg-amber-100",
            ].join(" ")}
          >
            {b}
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
