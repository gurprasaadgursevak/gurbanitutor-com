"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type T = { pa: string; en: string };
type Q = {
  id: string;
  type: "mcq" | "tf" | "fill";
  q: T;
  options?: T[];
  answer?: number | boolean;
  accept?: string[];
  explain: T;
};
type Stream = { label: T; questions: Q[] };
type Quiz = { title: T; source: string; streams: Record<string, Stream> };

const ORDER = ["beginner", "intermediate", "advanced"];

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export default function BalupdeshQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [failed, setFailed] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/balupdesh_quiz.json")
      .then((r) => r.json())
      .then(setQuiz)
      .catch(() => setFailed(true));
  }, []);

  const orderedStreams = useMemo(() => {
    if (!quiz) return [];
    return ORDER.filter((k) => quiz.streams[k]).map((k) => ({ key: k, stream: quiz.streams[k] }));
  }, [quiz]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Santhiya 101</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Balupdesh Quiz
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-700">
            Please take this quiz after reading the Balupdesh Pothi. Three levels, in Punjabi and English,
            from Sri Damdami Taksal.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-2">
        {failed && (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            The quiz could not be loaded. Please try again later.
          </p>
        )}

        {!quiz && !failed && <p className="text-center text-sm text-slate-500">Loading…</p>}

        {quiz && !streamKey && (
          <div className="space-y-3">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              Choose a level
            </p>
            {orderedStreams.map(({ key, stream }) => (
              <button
                key={key}
                onClick={() => setStreamKey(key)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white p-5 text-left shadow-sm transition hover:border-amber-400 hover:bg-amber-50"
              >
                <span>
                  <span lang="pa" className="block text-lg font-semibold text-slate-900">
                    {stream.label.pa}
                  </span>
                  <span className="text-xs text-slate-600">
                    {stream.label.en} · {stream.questions.length} questions
                  </span>
                </span>
                <span aria-hidden className="text-xl text-amber-600">
                  →
                </span>
              </button>
            ))}
            <p className="pt-2 text-center text-xs text-slate-500">{quiz.source}</p>
          </div>
        )}

        {quiz && streamKey && (
          <QuizRunner stream={quiz.streams[streamKey]} onExit={() => setStreamKey(null)} />
        )}

        <p className="mt-12 text-center text-sm text-slate-500">
          <Link href="/muharni" className="font-medium text-amber-700 hover:underline">
            Back to Santhiya 101
          </Link>
        </p>
      </main>
    </div>
  );
}

function QuizRunner({ stream, onExit }: { stream: Stream; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [tf, setTf] = useState<boolean | null>(null);
  const [fill, setFill] = useState("");
  const [done, setDone] = useState(false);

  const q = stream.questions[Math.min(index, stream.questions.length - 1)];
  const total = stream.questions.length;

  function register(ok: boolean) {
    setCorrect(ok);
    if (ok) setScore((s) => s + 1);
    setAnswered(true);
  }
  function next() {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setAnswered(false);
      setCorrect(false);
      setPicked(null);
      setTf(null);
      setFill("");
    } else {
      setDone(true);
    }
  }
  function restart() {
    setIndex(0);
    setScore(0);
    setAnswered(false);
    setCorrect(false);
    setPicked(null);
    setTf(null);
    setFill("");
    setDone(false);
  }

  if (done) {
    const pct = score / total;
    const msg =
      pct >= 0.9
        ? "Shabaash! Excellent knowledge of Balupdesh."
        : pct >= 0.7
        ? "Well done. Keep practising the Balupdesh."
        : "Good effort. Read the Balupdesh and try again.";
    return (
      <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <p className="text-5xl font-bold tracking-tight text-amber-600">
          {score} / {total}
        </p>
        <p className="mt-3 text-base text-slate-600">{msg}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            Try again
          </button>
          <button
            onClick={onExit}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-300"
          >
            Choose another level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        Question {index + 1} of {total}
      </p>

      <p lang="pa" className="mt-2 text-xl font-semibold leading-relaxed text-slate-900">
        {q.q.pa}
      </p>
      <p className="mt-1 text-sm text-slate-600">{q.q.en}</p>

      <div className="mt-5">
        {q.type === "mcq" && (
          <div className="space-y-2.5">
            {(q.options ?? []).map((opt, i) => {
              const isCorrect = answered && i === q.answer;
              const isWrong = answered && i === picked && i !== q.answer;
              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => {
                    setPicked(i);
                    register(i === q.answer);
                  }}
                  className={[
                    "block w-full rounded-xl border p-3.5 text-left transition",
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : isWrong
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-slate-50 hover:border-amber-300",
                  ].join(" ")}
                >
                  <span lang="pa" className="block text-base text-slate-900">
                    {opt.pa}
                  </span>
                  {opt.en !== opt.pa && <span className="block text-xs text-slate-600">{opt.en}</span>}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "tf" && (
          <div className="flex gap-3">
            {[true, false].map((v) => {
              const isCorrect = answered && v === q.answer;
              const isWrong = answered && v === tf && v !== q.answer;
              return (
                <button
                  key={String(v)}
                  disabled={answered}
                  onClick={() => {
                    setTf(v);
                    register(v === q.answer);
                  }}
                  className={[
                    "flex-1 rounded-xl border p-4 text-center text-base font-semibold transition",
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : isWrong
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-slate-50 hover:border-amber-300",
                  ].join(" ")}
                >
                  {v ? "True" : "False"}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "fill" && (
          <div className="flex flex-wrap gap-2">
            <input
              value={fill}
              disabled={answered}
              onChange={(e) => setFill(e.target.value)}
              placeholder="Type your answer"
              className="min-w-[180px] flex-1 rounded-xl border border-slate-300 p-3 text-base"
            />
            {!answered && (
              <button
                disabled={!fill.trim()}
                onClick={() => register((q.accept ?? []).some((a) => norm(a) === norm(fill)))}
                className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Check
              </button>
            )}
          </div>
        )}
      </div>

      {answered && (
        <div
          className={[
            "mt-5 rounded-xl p-4",
            correct ? "bg-emerald-50" : "bg-red-50",
          ].join(" ")}
        >
          <p className={correct ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>
            {correct ? "Correct" : "Not quite"}
          </p>
          <p lang="pa" className="mt-1 text-base text-slate-900">
            {q.explain.pa}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">{q.explain.en}</p>
          <button
            onClick={next}
            className="mt-4 w-full rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            {index + 1 < total ? "Next" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
