"use client";

import { useEffect, useRef, useState } from "react";
import {
  pentiAkhar,
  letterAudioURL,
  DEFAULT_LETTER_CAP_SECONDS,
  type PentiAkharCell,
} from "./gurmukhiData";
import QuizScoreBar from "./QuizScoreBar";

const BEST_KEY = "akhar_sound_race_best_streak";
const SEQUENCE_LENGTH = 3;
const PAD_SIZE = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "ready" | "playing" | "recall" | "correct" | "wrong";

export default function AkharSoundRace() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sequence, setSequence] = useState<PentiAkharCell[]>([]);
  const [pad, setPad] = useState<PentiAkharCell[]>([]);
  const [taps, setTaps] = useState<PentiAkharCell[]>([]);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

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

  function playSequence(seq: PentiAkharCell[], index: number) {
    if (index >= seq.length) {
      setPhase("recall");
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    const cell = seq[index];
    el.src = letterAudioURL(cell);
    el.currentTime = 0;
    void el.play();
    const cap = (cell.playbackSeconds ?? DEFAULT_LETTER_CAP_SECONDS) * 1000;
    window.setTimeout(() => {
      el.pause();
      el.currentTime = 0;
      window.setTimeout(() => playSequence(seq, index + 1), 200);
    }, cap);
  }

  function startRound() {
    const seq = shuffle(pentiAkhar).slice(0, SEQUENCE_LENGTH);
    const distractors = shuffle(
      pentiAkhar.filter((c) => !seq.find((s) => s.id === c.id))
    ).slice(0, PAD_SIZE - SEQUENCE_LENGTH);
    const padArr = shuffle([...distractors, ...seq]);
    setSequence(seq);
    setPad(padArr);
    setTaps([]);
    setPhase("playing");
    window.setTimeout(() => playSequence(seq, 0), 100);
  }

  function tap(cell: PentiAkharCell) {
    if (phase !== "recall") return;
    const expected = sequence[taps.length];
    const newTaps = [...taps, cell];
    setTaps(newTaps);
    if (cell.id !== expected.id) {
      setAttempts((a) => a + 1);
      setStreak(0);
      setPhase("wrong");
      return;
    }
    if (newTaps.length === sequence.length) {
      setAttempts((a) => a + 1);
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => (next > b ? next : b));
        return next;
      });
      setPhase("correct");
    }
  }

  const headline: Record<Phase, string> = {
    ready: "Listen for three letters, then tap them in order",
    playing: "Listening to letters...",
    recall: "Tap the letters in the same order",
    correct: "Correct! Waheguru.",
    wrong: "Not quite, try the next round",
  };

  const progressText = () => {
    if (phase === "recall") return `Tapped: ${taps.length} / ${sequence.length}`;
    if (phase === "correct" || phase === "wrong")
      return `Sequence was ${sequence.map((s) => s.letter).join(" · ")}`;
    return " ";
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Akhar Sound Race</h1>
      <div className="mt-4">
        <QuizScoreBar score={score} attempts={attempts} streak={streak} best={best} />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-6 text-center">
        <p className="text-sm font-semibold text-amber-900">{headline[phase]}</p>
        <p className="mt-2 text-xs text-amber-900/70">{progressText()}</p>
      </div>

      {phase === "ready" && (
        <button
          type="button"
          onClick={startRound}
          className="mt-5 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Start
        </button>
      )}

      {(phase === "recall" || phase === "correct" || phase === "wrong") && (
        <div className="mt-5 grid grid-cols-4 gap-2.5">
          {pad.map((cell) => (
            <button
              key={cell.id}
              type="button"
              disabled={phase !== "recall"}
              onClick={() => tap(cell)}
              className={[
                "flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 py-3 transition",
                phase !== "recall" ? "cursor-default" : "hover:bg-amber-100",
              ].join(" ")}
            >
              <span className="text-2xl font-bold text-amber-900">{cell.letter}</span>
              <span className="mt-1 text-[10px] text-amber-900/70">{cell.transliteration}</span>
            </button>
          ))}
        </div>
      )}

      {(phase === "correct" || phase === "wrong") && (
        <button
          type="button"
          onClick={startRound}
          className="mt-5 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Next round
        </button>
      )}

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
