"use client";

import { useEffect, useState } from "react";
import { scrabbleBank, type ScrabblePair } from "./gamesData";
import QuizScoreBar from "./QuizScoreBar";

const BEST_KEY = "gurbani_scrabble_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function consonantCount(word: string): number {
  let n = 0;
  for (const ch of word) {
    const v = ch.codePointAt(0) ?? 0;
    if (
      (v >= 0x0a05 && v <= 0x0a39) ||
      (v >= 0x0a5a && v <= 0x0a5e) ||
      (v >= 0x0a72 && v <= 0x0a74)
    ) {
      n++;
    }
  }
  return n;
}

const PLAYABLE = scrabbleBank.filter((p) => consonantCount(p.word) >= 3);

type Difficulty = "easy" | "medium" | "hard";

function poolFor(diff: Difficulty): ScrabblePair[] {
  switch (diff) {
    case "easy":   return PLAYABLE.filter((p) => consonantCount(p.word) === 3);
    case "medium": return PLAYABLE.filter((p) => consonantCount(p.word) === 4);
    case "hard":   return PLAYABLE.filter((p) => consonantCount(p.word) >= 5);
  }
}

type Tile = { id: string; char: string };

function tilesFor(word: string): Tile[] {
  return Array.from(word).map((ch, i) => ({ id: `${ch}-${i}-${Math.random()}`, char: ch }));
}

type Feedback = "none" | "correct" | "wrong";

export default function GurbaniScrabble() {
  const [current, setCurrent] = useState<ScrabblePair>(
    () => PLAYABLE[Math.floor(Math.random() * PLAYABLE.length)]
  );
  const [pool, setPool] = useState<Tile[]>(() => shuffle(tilesFor(current.word)));
  const [assembled, setAssembled] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("none");
  const [seen, setSeen] = useState<Set<string>>(() => new Set([current.word]));
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

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

  function place(tile: Tile) {
    if (feedback !== "none") return;
    setPool((p) => p.filter((t) => t.id !== tile.id));
    setAssembled((a) => [...a, tile]);
  }

  function unplace(tile: Tile) {
    if (feedback !== "none") return;
    setAssembled((a) => a.filter((t) => t.id !== tile.id));
    setPool((p) => shuffle([...p, tile]));
  }

  function reset() {
    setPool(shuffle([...pool, ...assembled]));
    setAssembled([]);
  }

  function check() {
    setAttempts((a) => a + 1);
    const user = assembled.map((t) => t.char).join("");
    if (user === current.word) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => (next > b ? next : b));
        return next;
      });
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }
  }

  function next() {
    const wordSource = poolFor(difficulty);
    const source = wordSource.length > 0 ? wordSource : PLAYABLE;
    let available = source.filter((p) => !seen.has(p.word));
    let used = seen;
    if (available.length === 0) {
      available = source;
      used = new Set();
    }
    const pair = available[Math.floor(Math.random() * available.length)];
    const nextSeen = new Set(used);
    nextSeen.add(pair.word);
    setSeen(nextSeen);
    setCurrent(pair);
    setPool(shuffle(tilesFor(pair.word)));
    setAssembled([]);
    setFeedback("none");
  }

  function changeDifficulty(d: Difficulty) {
    setDifficulty(d);
    const src = poolFor(d);
    const real = src.length > 0 ? src : PLAYABLE;
    const pair = real[Math.floor(Math.random() * real.length)];
    setSeen(new Set([pair.word]));
    setCurrent(pair);
    setPool(shuffle(tilesFor(pair.word)));
    setAssembled([]);
    setFeedback("none");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Gurbani Scrabble</h1>
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

      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-6 text-center">
        <p className="text-sm text-amber-900/70">Spell the Gurbani word for</p>
        <p className="mt-2 text-3xl font-bold text-amber-900">{current.meaning}</p>
      </div>

      <div
        className={[
          "mt-4 flex min-h-[68px] flex-wrap items-center justify-center gap-1 rounded-2xl border bg-amber-50 p-3",
          feedback === "correct"
            ? "border-green-500 border-2"
            : feedback === "wrong"
              ? "border-red-500 border-2"
              : "border-amber-200",
        ].join(" ")}
      >
        {assembled.length === 0 ? (
          <span className="text-xs text-amber-900/60">Tap tiles below to build the word</span>
        ) : (
          assembled.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => unplace(t)}
              disabled={feedback !== "none"}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-2xl font-bold text-white"
            >
              {t.char}
            </button>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {pool.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => place(t)}
            disabled={feedback !== "none"}
            className="rounded-md border-2 border-amber-300 bg-white px-3 py-1.5 text-2xl font-bold text-amber-900 hover:bg-amber-100"
          >
            {t.char}
          </button>
        ))}
      </div>

      {feedback !== "none" ? (
        <>
          <p className="mt-4 text-center text-sm text-amber-900/80">
            {feedback === "correct" ? "Correct! Waheguru." : `Original: ${current.word}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-3 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
          >
            Next word
          </button>
        </>
      ) : pool.length === 0 ? (
        <button
          type="button"
          onClick={check}
          className="mt-4 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Check answer
        </button>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="mt-3 w-full rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Reset
        </button>
      )}
    </div>
  );
}
