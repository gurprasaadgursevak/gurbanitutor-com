"use client";

import { useEffect, useRef, useState } from "react";
import {
  pentiAkhar,
  letterAudioURL,
  DEFAULT_LETTER_CAP_SECONDS,
  type PentiAkharCell,
} from "./gurmukhiData";

const BEST_STREAK_KEY = "letter_quiz_best_streak";

type Feedback =
  | { kind: "none" }
  | { kind: "correct" }
  | { kind: "wrong"; pickedId: number };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeRound(): { correct: PentiAkharCell; options: PentiAkharCell[] } {
  const correct = pentiAkhar[Math.floor(Math.random() * pentiAkhar.length)];
  const distractors = shuffle(pentiAkhar.filter((c) => c.id !== correct.id)).slice(0, 3);
  const options = shuffle([...distractors, correct]);
  return { correct, options };
}

/// "Hear the sound, pick the letter" mini-game. Mirrors LetterQuizView.swift.
export default function LetterQuiz() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [round, setRound] = useState(() => makeRound());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "none" });
  const [seen, setSeen] = useState<Set<number>>(() => new Set([round.correct.id]));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_STREAK_KEY);
      const n = saved ? parseInt(saved, 10) : 0;
      if (!Number.isNaN(n) && n > 0) setBestStreak(n);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BEST_STREAK_KEY, String(bestStreak));
    } catch {
      // ignore
    }
  }, [bestStreak]);

  function clearStopTimer() {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }

  function playCorrect(cell: PentiAkharCell) {
    const el = audioRef.current;
    if (!el) return;
    clearStopTimer();
    el.src = letterAudioURL(cell);
    el.currentTime = 0;
    void el.play();
    const cap = (cell.playbackSeconds ?? DEFAULT_LETTER_CAP_SECONDS) * 1000;
    stopTimerRef.current = window.setTimeout(() => {
      el.pause();
      el.currentTime = 0;
    }, cap);
  }

  // Auto-play whenever a new round is dealt.
  useEffect(() => {
    playCorrect(round.correct);
    return () => clearStopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function answer(cell: PentiAkharCell) {
    if (feedback.kind !== "none") return;
    setAttempts((a) => a + 1);
    if (cell.id === round.correct.id) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => (next > b ? next : b));
        return next;
      });
      setFeedback({ kind: "correct" });
    } else {
      setStreak(0);
      setFeedback({ kind: "wrong", pickedId: cell.id });
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

  function borderFor(cell: PentiAkharCell): string {
    if (feedback.kind === "correct" && cell.id === round.correct.id)
      return "border-green-500 border-2";
    if (feedback.kind === "wrong" && cell.id === feedback.pickedId)
      return "border-red-500 border-2";
    if (feedback.kind === "wrong" && cell.id === round.correct.id)
      return "border-green-500 border-2";
    return "border-amber-200";
  }

  const disabled = feedback.kind !== "none";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Letter Quiz</h1>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat label="Score" value={`${score} / ${attempts}`} />
        <Stat label="Streak" value={String(streak)} />
        <Stat label="Best" value={String(bestStreak)} />
      </div>

      <button
        type="button"
        onClick={() => playCorrect(round.correct)}
        className="mt-5 flex w-full flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 py-6 transition hover:bg-amber-100"
      >
        <span className="text-5xl">🔊</span>
        <span className="mt-2 text-sm font-semibold text-amber-900">
          Tap to hear the letter
        </span>
        <span className="text-xs text-amber-900/70">
          Then choose the matching letter below
        </span>
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {round.options.map((cell) => (
          <button
            key={cell.id}
            type="button"
            disabled={disabled}
            onClick={() => answer(cell)}
            className={[
              "flex flex-col items-center justify-center rounded-2xl bg-amber-50 py-6 transition",
              borderFor(cell),
              disabled ? "cursor-default" : "hover:bg-amber-100",
            ].join(" ")}
          >
            <span className="text-5xl font-bold text-amber-900">{cell.letter}</span>
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

      <p className="mt-6 text-center text-xs text-amber-900/60">
        Audio courtesy of Learn Shudh Gurbani by gursevak.com.
      </p>

      <audio ref={audioRef} preload="none" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
      <div className="text-lg font-bold text-amber-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-amber-900/60">
        {label}
      </div>
    </div>
  );
}
