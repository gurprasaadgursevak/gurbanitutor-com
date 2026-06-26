"use client";

import { useEffect, useState } from "react";
import { baniBank, SOURCES, sourceFor, type BaniItem, type Source } from "./gamesData";
import QuizScoreBar from "./QuizScoreBar";
import { useSGGSPool, poolLabel, type PoolLine } from "./sggsPool";
import { BANI_FILTERS, BANI_CATEGORIES, findBani, inAngRange, type BaniFilter } from "./baniFilters";

const BEST_KEY = "sentence_unscramble_best_streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Curated non-SGGS lines (3-7 words, ending ॥, has inline pause). SGGS lines
// come from the runtime pool.
const CURATED: BaniItem[] = baniBank.filter((b) => {
  const n = b.tukh.split(" ").length;
  const hasPunct = b.tukh.includes(";") || b.tukh.includes(".") || b.tukh.includes(",");
  return n >= 3 && n <= 7 && hasPunct && b.tukh.endsWith("॥");
});

type Difficulty = "easy" | "medium" | "hard";

function matchesDifficulty(tukh: string, d: Difficulty): boolean {
  const n = tukh.split(" ").length;
  if (d === "easy") return n <= 4;
  if (d === "medium") return n === 5;
  return n >= 6;
}

type GameItem = {
  tukh: string;
  label: string;
  source: Source;
};

function fromCurated(b: BaniItem): GameItem {
  return { tukh: b.tukh, label: b.bani, source: sourceFor(b.bani) };
}

function fromPool(line: PoolLine): GameItem {
  return { tukh: line.tukh, label: poolLabel(line), source: "Sri Guru Granth Sahib Ji" };
}

const SEEN_CAP = 500;

function pickSGGS(pool: PoolLine[], difficulty: Difficulty, seen: Set<string>): GameItem | null {
  if (pool.length === 0) return null;
  for (let i = 0; i < 25; i++) {
    const line = pool[Math.floor(Math.random() * pool.length)];
    if (matchesDifficulty(line.tukh, difficulty) && !seen.has(line.tukh)) {
      return fromPool(line);
    }
  }
  // Drop difficulty within source.
  for (let i = 0; i < 10; i++) {
    const line = pool[Math.floor(Math.random() * pool.length)];
    if (!seen.has(line.tukh)) return fromPool(line);
  }
  return fromPool(pool[Math.floor(Math.random() * pool.length)]);
}

function pickCurated(sources: Source[], difficulty: Difficulty, seen: Set<string>): GameItem | null {
  const items = CURATED.filter((b) => sources.includes(sourceFor(b.bani)));
  if (items.length === 0) return null;
  const byDiff = items.filter((b) => matchesDifficulty(b.tukh, difficulty));
  const arr = byDiff.length > 0 ? byDiff : items;
  const unseen = arr.filter((b) => !seen.has(b.tukh));
  const pick = unseen.length > 0 ? unseen : arr;
  return fromCurated(pick[Math.floor(Math.random() * pick.length)]);
}

function pickSGGSFiltered(pool: PoolLine[], range: [number, number], difficulty: Difficulty, seen: Set<string>): GameItem | null {
  const scoped = pool.filter((l) => inAngRange(l.ang, range));
  if (scoped.length === 0) return null;
  for (let i = 0; i < 25; i++) {
    const line = scoped[Math.floor(Math.random() * scoped.length)];
    if (matchesDifficulty(line.tukh, difficulty) && !seen.has(line.tukh)) return fromPool(line);
  }
  for (let i = 0; i < 10; i++) {
    const line = scoped[Math.floor(Math.random() * scoped.length)];
    if (!seen.has(line.tukh)) return fromPool(line);
  }
  return fromPool(scoped[Math.floor(Math.random() * scoped.length)]);
}

function pickCuratedByBani(name: string, difficulty: Difficulty, seen: Set<string>): GameItem | null {
  const items = CURATED.filter((b) => b.bani === name);
  if (items.length === 0) return null;
  const byDiff = items.filter((b) => matchesDifficulty(b.tukh, difficulty));
  const arr = byDiff.length > 0 ? byDiff : items;
  const unseen = arr.filter((b) => !seen.has(b.tukh));
  const pick = unseen.length > 0 ? unseen : arr;
  return fromCurated(pick[Math.floor(Math.random() * pick.length)]);
}

function pickNext(
  enabled: Set<Source>,
  pool: PoolLine[] | null,
  bani: BaniFilter | null,
  difficulty: Difficulty,
  seen: Set<string>
): GameItem | null {
  if (bani) {
    if (bani.granth === "Sri Guru Granth Sahib Ji" && pool && bani.angRange) {
      const item = pickSGGSFiltered(pool, bani.angRange, difficulty, seen);
      if (item) return item;
    }
    if (bani.curatedBaniName) {
      const item = pickCuratedByBani(bani.curatedBaniName, difficulty, seen);
      if (item) return item;
    }
    return null;
  }

  const sggsOn = enabled.has("Sri Guru Granth Sahib Ji") && pool !== null && pool.length > 0;
  const otherSources = SOURCES.filter((s) => s !== "Sri Guru Granth Sahib Ji" && enabled.has(s));

  let drawSGGS: boolean;
  if (sggsOn && otherSources.length === 0) drawSGGS = true;
  else if (!sggsOn && otherSources.length > 0) drawSGGS = false;
  else if (sggsOn && otherSources.length > 0) drawSGGS = Math.random() < 0.7;
  else return pickCurated(SOURCES.filter((s) => s !== "Sri Guru Granth Sahib Ji"), difficulty, seen);

  if (drawSGGS && pool) {
    const item = pickSGGS(pool, difficulty, seen);
    if (item) return item;
  }
  return pickCurated(otherSources, difficulty, seen);
}

type Token = { id: string; word: string; originalIndex: number };

function tokensFor(tukh: string): Token[] {
  return tukh
    .split(" ")
    .map((w, i) => ({ id: `${w}-${i}-${Math.random()}`, word: w, originalIndex: i }));
}

type Feedback = "none" | "correct" | "wrong";

export default function SentenceUnscramble() {
  const { pool } = useSGGSPool();

  const [item, setItem] = useState<GameItem>(() => fromCurated(CURATED[Math.floor(Math.random() * CURATED.length)]));
  const [tokenPool, setTokenPool] = useState<Token[]>(() => shuffle(tokensFor(item.tukh)));
  const [assembled, setAssembled] = useState<Token[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("none");
  const [seen, setSeen] = useState<Set<string>>(() => new Set([item.tukh]));
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [enabledSources, setEnabledSources] = useState<Set<Source>>(() => new Set(SOURCES));
  const [showSources, setShowSources] = useState(false);
  const [selectedBaniID, setSelectedBaniID] = useState<string | null>(null);
  const [roundCap, setRoundCap] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [didInitFromPool, setDidInitFromPool] = useState(false);

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

  useEffect(() => {
    if (!pool || didInitFromPool) return;
    if (score !== 0 || attempts !== 0 || roundsPlayed !== 0) return;
    const next = pickNext(enabledSources, pool.unscramble, findBani(selectedBaniID), difficulty, new Set());
    if (next) {
      setItem(next);
      setTokenPool(shuffle(tokensFor(next.tukh)));
      setAssembled([]);
      setSeen(new Set([next.tukh]));
    }
    setDidInitFromPool(true);
  }, [pool, didInitFromPool, score, attempts, roundsPlayed, enabledSources, difficulty, selectedBaniID]);

  function moveToAssembled(t: Token) {
    if (feedback !== "none") return;
    setTokenPool((p) => p.filter((x) => x.id !== t.id));
    setAssembled((a) => [...a, t]);
  }

  function returnToPool(t: Token) {
    if (feedback !== "none") return;
    setAssembled((a) => a.filter((x) => x.id !== t.id));
    setTokenPool((p) => shuffle([...p, t]));
  }

  function resetCurrent() {
    setTokenPool(shuffle([...tokenPool, ...assembled]));
    setAssembled([]);
  }

  function check() {
    setAttempts((a) => a + 1);
    const user = assembled.map((t) => t.word).join(" ");
    if (user === item.tukh) {
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

  function toggleSource(s: Source) {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) { if (next.size > 1) next.delete(s); } else next.add(s);
      return next;
    });
  }

  function applyNextRound(nextSeen: Set<string>, nextDifficulty: Difficulty = difficulty) {
    const picked = pickNext(enabledSources, pool?.unscramble ?? null, findBani(selectedBaniID), nextDifficulty, nextSeen);
    if (!picked) return;
    const trimmed = new Set(nextSeen);
    trimmed.add(picked.tukh);
    if (trimmed.size > SEEN_CAP) trimmed.clear();
    setSeen(trimmed);
    setItem(picked);
    setTokenPool(shuffle(tokensFor(picked.tukh)));
    setAssembled([]);
    setFeedback("none");
  }

  function resetSession() {
    setRoundsPlayed(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    applyNextRound(new Set());
  }

  function next() {
    setRoundsPlayed((n) => n + 1);
    applyNextRound(seen);
  }

  function changeDifficulty(d: Difficulty) {
    setDifficulty(d);
    setRoundsPlayed(0);
    applyNextRound(new Set(), d);
  }

  function countFor(s: Source): string {
    if (s === "Sri Guru Granth Sahib Ji") {
      if (!pool) return "loading…";
      return `${pool.unscramble.length} lines`;
    }
    const n = CURATED.filter((b) => sourceFor(b.bani) === s).length;
    return `${n} lines`;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Sentence Unscramble</h1>
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
          {findBani(selectedBaniID)?.label ?? `Sources: ${enabledSources.size === SOURCES.length ? "All" : `${enabledSources.size}/${SOURCES.length}`}`}
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
        <div className="mt-3 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-900/60">Granth</p>
            {SOURCES.map((s) => (
              <label key={s} className={["flex items-center gap-2 py-1", selectedBaniID ? "cursor-not-allowed opacity-50" : "cursor-pointer"].join(" ")}>
                <input
                  type="checkbox"
                  disabled={selectedBaniID !== null}
                  checked={enabledSources.has(s)}
                  onChange={() => toggleSource(s)}
                  className="h-4 w-4 accent-amber-600"
                />
                <span className="flex-1 text-sm font-semibold text-amber-900">{s}</span>
                <span className="text-xs text-amber-900/60">{countFor(s)}</span>
              </label>
            ))}
            {selectedBaniID && (
              <p className="mt-1 text-[10px] text-amber-900/60">Disabled while a specific bani is selected below.</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-900/60">Drill into one Bani</p>
            <select
              value={selectedBaniID ?? ""}
              onChange={(e) => {
                const v = e.target.value === "" ? null : e.target.value;
                setSelectedBaniID(v);
                const picked = pickNext(enabledSources, pool?.unscramble ?? null, findBani(v), difficulty, new Set());
                if (picked) {
                  setItem(picked);
                  setTokenPool(shuffle(tokensFor(picked.tukh)));
                  setAssembled([]);
                  setSeen(new Set([picked.tukh]));
                  setFeedback("none");
                }
              }}
              className="w-full rounded border border-amber-300 bg-white px-2 py-1 text-sm font-semibold text-amber-900"
            >
              <option value="">All banis</option>
              {BANI_CATEGORIES.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {BANI_FILTERS.filter((b) => b.category === cat).map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-amber-900/60">When set, the picker pulls lines only from this bani.</p>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-amber-900/70">
        Tap the words in the correct order · {item.label}
      </p>

      <div
        className={[
          "mt-3 flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border bg-amber-50 p-3",
          feedback === "correct"
            ? "border-green-500 border-2"
            : feedback === "wrong"
              ? "border-red-500 border-2"
              : "border-amber-200",
        ].join(" ")}
      >
        {assembled.length === 0 ? (
          <span className="mx-auto text-xs text-amber-900/60">Tap words below…</span>
        ) : (
          assembled.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => returnToPool(t)}
              disabled={feedback !== "none"}
              className="rounded-full bg-amber-600 px-3 py-1 text-lg font-bold text-white"
            >
              {t.word}
            </button>
          ))
        )}
      </div>

      <div className="mt-3 flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
        {tokenPool.length === 0 ? (
          <span className="mx-auto text-xs text-amber-900/60">All words used</span>
        ) : (
          tokenPool.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => moveToAssembled(t)}
              disabled={feedback !== "none"}
              className="rounded-full bg-amber-500 px-3 py-1 text-lg font-bold text-white hover:bg-amber-600"
            >
              {t.word}
            </button>
          ))
        )}
      </div>

      {feedback !== "none" ? (
        <>
          <p className="mt-4 text-center text-sm text-amber-900/80">
            {feedback === "correct" ? "Correct! Waheguru." : `Original: ${item.tukh}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-3 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
          >
            Next line
          </button>
        </>
      ) : tokenPool.length === 0 ? (
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
          onClick={resetCurrent}
          className="mt-3 w-full rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Reset
        </button>
      )}
    </div>
  );
}
