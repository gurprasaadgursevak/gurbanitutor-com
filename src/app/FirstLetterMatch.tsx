"use client";

import { useEffect, useState } from "react";
import { wordBank, type WordEntry } from "./gamesData";
import { pentiAkhar } from "./gurmukhiData";
import QuizScoreBar from "./QuizScoreBar";

function transliterationFor(letter: string): string {
  return pentiAkhar.find((p) => p.letter === letter)?.transliteration ?? letter;
}

const BEST_KEY = "first_letter_match_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(): { target: string; correct: WordEntry; options: WordEntry[] } {
  const targets = Array.from(new Set(wordBank.map((w) => w.firstLetter)));
  const target = targets[Math.floor(Math.random() * targets.length)];
  const pool = wordBank.filter((w) => w.firstLetter === target);
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const distractors = shuffle(wordBank.filter((w) => w.firstLetter !== target)).slice(0, 3);
  const options = shuffle([...distractors, correct]);
  return { target, correct, options };
}

type Feedback = { kind: "none" } | { kind: "correct" } | { kind: "wrong"; pickedWord: string };

export default function FirstLetterMatch() {
  const [round, setRound] = useState(() => makeRound());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "none" });
  const [seen, setSeen] = useState<Set<string>>(() => new Set([round.correct.word]));

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

  function answer(w: WordEntry) {
    if (feedback.kind !== "none") return;
    setAttempts((a) => a + 1);
    if (w.word === round.correct.word) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => (next > b ? next : b));
        return next;
      });
      setFeedback({ kind: "correct" });
    } else {
      setStreak(0);
      setFeedback({ kind: "wrong", pickedWord: w.word });
    }
  }

  function nextRound() {
    let availableCorrects = wordBank.filter((w) => !seen.has(w.word));
    let used = seen;
    if (availableCorrects.length === 0) {
      availableCorrects = wordBank;
      used = new Set();
    }
    const correct = availableCorrects[Math.floor(Math.random() * availableCorrects.length)];
    const target = correct.firstLetter;
    const distractors = shuffle(wordBank.filter((w) => w.firstLetter !== target)).slice(0, 3);
    const options = shuffle([...distractors, correct]);
    const nextSeen = new Set(used);
    nextSeen.add(correct.word);
    setSeen(nextSeen);
    setFeedback({ kind: "none" });
    setRound({ target, correct, options });
  }

  function borderFor(w: WordEntry): string {
    if (feedback.kind === "correct" && w.word === round.correct.word) return "border-green-500 border-2";
    if (feedback.kind === "wrong" && w.word === feedback.pickedWord) return "border-red-500 border-2";
    if (feedback.kind === "wrong" && w.word === round.correct.word) return "border-green-500 border-2";
    return "border-amber-200";
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">First Letter Match</h1>
      <div className="mt-4">
        <QuizScoreBar score={score} attempts={attempts} streak={streak} best={best} />
      </div>

      <div className="mt-5 flex flex-col items-center rounded-2xl border border-amber-300 bg-amber-50 py-6">
        <span className="text-sm text-amber-900/70">Which word starts with</span>
        <span className="text-5xl font-bold text-amber-900">
          {transliterationFor(round.target)}
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        {round.options.map((w) => (
          <button
            key={w.word}
            type="button"
            disabled={feedback.kind !== "none"}
            onClick={() => answer(w)}
            className={[
              "flex w-full items-center justify-between rounded-xl bg-amber-50 px-4 py-3 transition",
              borderFor(w),
              feedback.kind !== "none" ? "cursor-default" : "hover:bg-amber-100",
            ].join(" ")}
          >
            <span className="text-2xl font-bold text-amber-900">{w.word}</span>
            <span className="text-xs text-amber-900/60">{w.english}</span>
          </button>
        ))}
      </div>

      {feedback.kind !== "none" && (
        <button
          type="button"
          onClick={nextRound}
          className="mt-5 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Next letter
        </button>
      )}
    </div>
  );
}
