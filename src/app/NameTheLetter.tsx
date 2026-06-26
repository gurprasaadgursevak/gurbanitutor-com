"use client";

import { useEffect, useState } from "react";
import { pentiAkhar, type PentiAkharCell } from "./gurmukhiData";
import QuizScoreBar from "./QuizScoreBar";

const BEST_KEY = "name_the_letter_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(): { correct: PentiAkharCell; options: PentiAkharCell[] } {
  const correct = pentiAkhar[Math.floor(Math.random() * pentiAkhar.length)];
  const distractors = shuffle(pentiAkhar.filter((c) => c.id !== correct.id)).slice(0, 3);
  const options = shuffle([...distractors, correct]);
  return { correct, options };
}

type Feedback = { kind: "none" } | { kind: "correct" } | { kind: "wrong"; picked: number };

export default function NameTheLetter() {
  const [round, setRound] = useState(() => makeRound());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "none" });
  const [seen, setSeen] = useState<Set<number>>(() => new Set([round.correct.id]));

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

  function answer(c: PentiAkharCell) {
    if (feedback.kind !== "none") return;
    setAttempts((a) => a + 1);
    if (c.id === round.correct.id) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => (next > b ? next : b));
        return next;
      });
      setFeedback({ kind: "correct" });
    } else {
      setStreak(0);
      setFeedback({ kind: "wrong", picked: c.id });
    }
  }

  function nextRound() {
    let available = pentiAkhar.filter((c) => !seen.has(c.id));
    let used = seen;
    if (available.length === 0) {
      available = pentiAkhar;
      used = new Set();
    }
    const correct = available[Math.floor(Math.random() * available.length)];
    const distractors = shuffle(pentiAkhar.filter((c) => c.id !== correct.id)).slice(0, 3);
    const options = shuffle([...distractors, correct]);
    const nextSeen = new Set(used);
    nextSeen.add(correct.id);
    setSeen(nextSeen);
    setFeedback({ kind: "none" });
    setRound({ correct, options });
  }

  function borderFor(c: PentiAkharCell): string {
    if (feedback.kind === "correct" && c.id === round.correct.id) return "border-green-500 border-2";
    if (feedback.kind === "wrong" && c.id === feedback.picked) return "border-red-500 border-2";
    if (feedback.kind === "wrong" && c.id === round.correct.id) return "border-green-500 border-2";
    return "border-amber-200";
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Name the Letter</h1>
      <div className="mt-4">
        <QuizScoreBar score={score} attempts={attempts} streak={streak} best={best} />
      </div>

      <div className="mt-5 flex flex-col items-center rounded-2xl border border-amber-300 bg-amber-50 py-8">
        <span className="text-7xl font-bold text-amber-900">{round.correct.letter}</span>
        <span className="mt-2 text-xs text-amber-900/70">What is this letter called?</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {round.options.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={feedback.kind !== "none"}
            onClick={() => answer(c)}
            className={[
              "flex flex-col items-center rounded-2xl bg-amber-50 py-5 transition",
              borderFor(c),
              feedback.kind !== "none" ? "cursor-default" : "hover:bg-amber-100",
            ].join(" ")}
          >
            <span className="text-xl font-bold text-amber-900">{c.transliteration}</span>
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
