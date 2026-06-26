"use client";

import { useEffect, useState } from "react";
import { baniBank, SOURCES, sourceFor, type BaniItem, type Source } from "./gamesData";
import QuizScoreBar from "./QuizScoreBar";
import { useSGGSPool, poolLabel, type PoolLine } from "./sggsPool";
import { BANI_FILTERS, BANI_CATEGORIES, findBani, inAngRange, type BaniFilter } from "./baniFilters";

const BEST_KEY = "punctuation_master_best_streak";

const PUNCT = new Set([";", ".", ",", "॥"]);

// Curated non-SGGS lines (Dasam, Bhai Gurdas, Bhai Nand Lal) ending with ॥
// and carrying inline pause marks. SGGS lines come from the runtime pool.
const CURATED: BaniItem[] = baniBank.filter(
  (b) => b.tukh.endsWith("॥") && (b.tukh.includes(";") || b.tukh.includes(".") || b.tukh.includes(","))
);

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

function initialMarks(count: number): (string | null)[] {
  const marks: (string | null)[] = Array(count).fill(null);
  if (count > 0) marks[count - 1] = "॥";
  return marks;
}

function split(tukh: string): { words: string[]; truth: (string | null)[] } {
  const words: string[] = [];
  const truth: (string | null)[] = [];
  const pieces = tukh.split(" ").filter(Boolean);
  for (const piece of pieces) {
    let bare = "";
    let mark: string | null = null;
    for (const ch of piece) {
      if (PUNCT.has(ch)) {
        mark = ch;
        break;
      }
      bare += ch;
    }
    if (bare) {
      words.push(bare);
      truth.push(mark);
    }
  }
  return { words, truth };
}

const SEEN_CAP = 500;

function pickSGGS(
  poolPunctuated: PoolLine[],
  poolUnpunctuated: PoolLine[],
  seen: Set<string>
): GameItem | null {
  // 1-in-4 lines have no vishrams; the player must recognise that and leave the slots empty.
  const pickUnpunctuated = Math.random() < 0.25 && poolUnpunctuated.length > 0;
  const src = pickUnpunctuated ? poolUnpunctuated : poolPunctuated;
  if (src.length === 0) return null;
  for (let i = 0; i < 10; i++) {
    const line = src[Math.floor(Math.random() * src.length)];
    if (!seen.has(line.tukh)) return fromPool(line);
  }
  return fromPool(src[Math.floor(Math.random() * src.length)]);
}

function pickCurated(sources: Source[], seen: Set<string>): GameItem | null {
  const items = CURATED.filter((b) => sources.includes(sourceFor(b.bani)));
  if (items.length === 0) return null;
  const unseen = items.filter((b) => !seen.has(b.tukh));
  const arr = unseen.length > 0 ? unseen : items;
  return fromCurated(arr[Math.floor(Math.random() * arr.length)]);
}

function pickSGGSFiltered(
  pool: { punctuated: PoolLine[]; unpunctuated: PoolLine[] },
  range: [number, number],
  seen: Set<string>
): GameItem | null {
  const pickUnpunct = Math.random() < 0.25;
  const primary = (pickUnpunct ? pool.unpunctuated : pool.punctuated).filter((l) => inAngRange(l.ang, range));
  const fallback = (pickUnpunct ? pool.punctuated : pool.unpunctuated).filter((l) => inAngRange(l.ang, range));
  const src = primary.length > 0 ? primary : fallback;
  if (src.length === 0) return null;
  const unseen = src.filter((l) => !seen.has(l.tukh));
  const arr = unseen.length > 0 ? unseen : src;
  return fromPool(arr[Math.floor(Math.random() * arr.length)]);
}

function pickCuratedByBani(name: string, seen: Set<string>): GameItem | null {
  const items = CURATED.filter((b) => b.bani === name);
  if (items.length === 0) return null;
  const unseen = items.filter((b) => !seen.has(b.tukh));
  const arr = unseen.length > 0 ? unseen : items;
  return fromCurated(arr[Math.floor(Math.random() * arr.length)]);
}

function pickNext(
  enabled: Set<Source>,
  pool: { punctuated: PoolLine[]; unpunctuated: PoolLine[] } | null,
  bani: BaniFilter | null,
  seen: Set<string>
): GameItem | null {
  if (bani) {
    if (bani.granth === "Sri Guru Granth Sahib Ji" && pool && bani.angRange) {
      const item = pickSGGSFiltered(pool, bani.angRange, seen);
      if (item) return item;
    }
    if (bani.curatedBaniName) {
      const item = pickCuratedByBani(bani.curatedBaniName, seen);
      if (item) return item;
    }
    return null;
  }

  const sggsOn = enabled.has("Sri Guru Granth Sahib Ji") && pool !== null;
  const otherSources = SOURCES.filter((s) => s !== "Sri Guru Granth Sahib Ji" && enabled.has(s));

  let drawSGGS: boolean;
  if (sggsOn && otherSources.length === 0) drawSGGS = true;
  else if (!sggsOn && otherSources.length > 0) drawSGGS = false;
  else if (sggsOn && otherSources.length > 0) drawSGGS = Math.random() < 0.7;
  else return pickCurated(SOURCES.filter((s) => s !== "Sri Guru Granth Sahib Ji"), seen);

  if (drawSGGS && pool) {
    const item = pickSGGS(pool.punctuated, pool.unpunctuated, seen);
    if (item) return item;
  }
  return pickCurated(otherSources, seen);
}

type Feedback = "none" | "correct" | "wrong";

export default function PunctuationMaster() {
  const { pool } = useSGGSPool();

  // Seed with a curated line so the first frame has content while the pool loads.
  const [item, setItem] = useState<GameItem>(() => fromCurated(CURATED[Math.floor(Math.random() * CURATED.length)]));
  const split0 = split(item.tukh);
  const [words, setWords] = useState<string[]>(split0.words);
  const [truth, setTruth] = useState<(string | null)[]>(split0.truth);
  const [userMarks, setUserMarks] = useState<(string | null)[]>(initialMarks(split0.words.length));
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("none");
  const [seen, setSeen] = useState<Set<string>>(() => new Set([item.tukh]));
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

  // When the pool arrives, swap in a pool draw on the user's first round so
  // the first line they see is from the full 6000-line variety.
  useEffect(() => {
    if (!pool || didInitFromPool) return;
    if (score !== 0 || attempts !== 0 || roundsPlayed !== 0) return;
    const next = pickNext(enabledSources, pool, findBani(selectedBaniID), new Set());
    if (next) {
      const { words: w, truth: t } = split(next.tukh);
      setItem(next);
      setWords(w);
      setTruth(t);
      setUserMarks(initialMarks(w.length));
      setSeen(new Set([next.tukh]));
    }
    setDidInitFromPool(true);
  }, [pool, didInitFromPool, score, attempts, roundsPlayed, enabledSources, selectedBaniID]);

  function setMark(idx: number, mark: string | null) {
    if (feedback !== "none") return;
    setUserMarks((arr) => {
      const next = [...arr];
      next[idx] = mark;
      return next;
    });
  }

  function check() {
    setAttempts((a) => a + 1);
    const equal = userMarks.length === truth.length && userMarks.every((m, i) => m === truth[i]);
    if (equal) {
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

  function applyNextRound(nextSeen: Set<string>) {
    const picked = pickNext(enabledSources, pool, findBani(selectedBaniID), nextSeen);
    if (!picked) return;
    const trimmed = new Set(nextSeen);
    trimmed.add(picked.tukh);
    if (trimmed.size > SEEN_CAP) trimmed.clear();
    const { words: w, truth: t } = split(picked.tukh);
    setSeen(trimmed);
    setItem(picked);
    setWords(w);
    setTruth(t);
    setUserMarks(initialMarks(w.length));
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

  function countFor(s: Source): string {
    if (s === "Sri Guru Granth Sahib Ji") {
      if (!pool) return "loading…";
      return `${pool.punctuated.length + pool.unpunctuated.length} lines`;
    }
    const n = CURATED.filter((b) => sourceFor(b.bani) === s).length;
    return `${n} lines`;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Punctuation Master</h1>
      <div className="mt-4">
        <QuizScoreBar score={score} attempts={attempts} streak={streak} best={best} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button type="button" onClick={() => setShowSources((v) => !v)} className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100">
          {findBani(selectedBaniID)?.label ?? `Sources: ${enabledSources.size === SOURCES.length ? "All" : `${enabledSources.size}/${SOURCES.length}`}`}
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-amber-900">Rounds:</span>
          {[0, 5, 10, 20].map((n) => (
            <button key={n} type="button" onClick={() => { setRoundCap(n); resetSession(); }} className={["min-w-[36px] rounded-full px-3 py-1.5 text-sm font-bold transition", roundCap === n ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"].join(" ")}>
              {n === 0 ? "∞" : n}
            </button>
          ))}
        </div>
        {roundCap > 0 && (<span className="text-sm font-semibold text-amber-900">{Math.min(roundsPlayed, roundCap)}/{roundCap}</span>)}
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
                // Re-roll so the user sees a line from the new bani immediately.
                const picked = pickNext(enabledSources, pool, findBani(v), new Set());
                if (picked) {
                  const { words: w, truth: t } = split(picked.tukh);
                  setItem(picked);
                  setWords(w);
                  setTruth(t);
                  setUserMarks(initialMarks(w.length));
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
        Add the right punctuation after each word. Some lines have no vishrams, leave those slots empty.
      </p>
      <p className="mt-1 text-center text-xs text-amber-900/60">{item.label}</p>

      <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-2xl font-bold text-amber-900">
        {words.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <span>{w}</span>
            {i === words.length - 1 ? (
              <span className="text-amber-900">॥</span>
            ) : (
              <select
                disabled={feedback !== "none"}
                value={userMarks[i] ?? ""}
                onChange={(e) => setMark(i, e.target.value === "" ? null : e.target.value)}
                className={[
                  "w-9 rounded border bg-white px-1 py-0.5 text-center text-lg",
                  userMarks[i] ? "border-amber-500 text-amber-700" : "border-slate-300 text-slate-400",
                ].join(" ")}
              >
                <option value="">Clear</option>
                <option value=".">. short pause</option>
                <option value=",">, medium pause</option>
                <option value=";">; long pause</option>
              </select>
            )}
          </span>
        ))}
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
      ) : (
        <button
          type="button"
          onClick={check}
          className="mt-4 w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
        >
          Check answer
        </button>
      )}
    </div>
  );
}
