"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

// MARK: - Bani definitions
//
// Row ranges are 1-based indices into the SGGS / Dasam TSVs. They mirror the iOS
// app's verified `BaniID.rowRanges` so the quiz pool for each bani is provably
// drawn from that bani's actual lines.

type BaniDef = {
  id: string;
  name: string;
  subtitle: string;
  sggsRanges?: [number, number][];
  dasamRanges?: [number, number][];
};

const NITNEM_BANIS: BaniDef[] = [
  {
    id: "japji",
    name: "Sri Japji Sahib",
    subtitle: "Opening bani of Sri Guru Granth Sahib Ji.",
    sggsRanges: [[2, 386]],
  },
  {
    id: "jaap",
    name: "Sri Jaap Sahib",
    subtitle: "Composed by Sri Guru Gobind Singh Ji.",
    dasamRanges: [[1, 791]],
  },
  {
    id: "tvaPrasaad",
    name: "Sri Tav Prasaad Savaiye",
    subtitle: "From Akal Ustat in Sri Dasam Guru Granth Sahib Ji.",
    dasamRanges: [[881, 921]],
  },
  {
    id: "chaupai",
    name: "Sri Chaupai Sahib",
    subtitle: "From the close of Charitropakhyan.",
    dasamRanges: [
      [67078, 67197],
      [13377, 13384],
    ],
  },
  {
    id: "anand",
    name: "Sri Anand Sahib",
    subtitle: "Ramkali Mahalla 3.",
    sggsRanges: [[39307, 39516]],
  },
  {
    id: "rehras",
    name: "Sri Rehrass Sahib",
    subtitle: "Evening Nitnem, composite from SGGS and Sri Dasam.",
    sggsRanges: [
      [20473, 20476],
      [21206, 21213],
      [387, 534],
      [39307, 39334],
      [39511, 39516],
      [60539, 60549],
      [41288, 41296],
      [23125, 23138],
    ],
    dasamRanges: [
      [67070, 67198],
      [15391, 15422],
      [3041, 3043],
      [3057, 3059],
      [2918, 2920],
      [5874, 5875],
      [9331, 9332],
      [13358, 13360],
      [13363, 13384],
    ],
  },
  {
    id: "kirtanSohila",
    name: "Sri Kirtan Sohila Sahib",
    subtitle: "Bedtime Nitnem.",
    sggsRanges: [[535, 590]],
  },
];

const SUKHMANI: BaniDef = {
  id: "sukhmani",
  name: "Sri Sukhmani Sahib Ji",
  subtitle: "Gauri M5 · the treasury of peace.",
  sggsRanges: [[11588, 13614]],
};

const ALL_NITNEM: BaniDef = {
  id: "all-nitnem",
  name: "All Nitnem Banis",
  subtitle: "Mixed pool across all seven Nitnem banis.",
  sggsRanges: NITNEM_BANIS.flatMap((b) => b.sggsRanges ?? []),
  dasamRanges: NITNEM_BANIS.flatMap((b) => b.dasamRanges ?? []),
};

const ALL_BANIS: BaniDef[] = [...NITNEM_BANIS, ALL_NITNEM, SUKHMANI];

// MARK: - Vocabulary

type VocabEntry = {
  word: string;
  meaningPa: string;
  meaningEn: string;
  line: string;
  ang: number;
};

const QUOTES = new Set(['"', "“", "”", "‘", "’", "'", "`"]);

function stripQuotes(s: string): string {
  return s
    .split("")
    .filter((c) => !QUOTES.has(c))
    .join("")
    .trim();
}

function normalizeLine(s: string): string {
  return stripQuotes(s);
}

function stripCR(s: string): string {
  return s.endsWith("\r") ? s.slice(0, -1) : s;
}

function parseVocab(text: string): VocabEntry[] {
  const out: VocabEntry[] = [];
  const lines = text.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const r = stripCR(lines[i]);
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 10) continue;
    const word = (cols[6] || "").trim();
    if (!word) continue;
    const angNum = parseInt((cols[0] || "").trim(), 10);
    out.push({
      word,
      meaningPa: stripQuotes(cols[8] || ""),
      meaningEn: stripQuotes(cols[9] || ""),
      line: (cols[1] || "").trim(),
      ang: Number.isNaN(angNum) ? 0 : angNum,
    });
  }
  return out;
}

type BaniMatcher = {
  /** Normalized Gurmukhi lines that appear in this bani. */
  lines: Set<string>;
  /** SGGS Angs that this bani spans (used for line-exact mismatches). */
  sggsAngs: Set<number>;
};

function buildBaniMatcher(
  bani: BaniDef,
  sggsRows: string[],
  dasamRows: string[]
): BaniMatcher {
  const lines = new Set<string>();
  const sggsAngs = new Set<number>();
  function addFrom(
    rows: string[],
    ranges: [number, number][] | undefined,
    gurmukhiCol: number,
    isSGGS: boolean
  ) {
    if (!ranges) return;
    for (const [lo, hi] of ranges) {
      for (let n = lo; n <= hi; n++) {
        const row = rows[n - 1];
        if (!row) continue;
        const cleaned = stripCR(row);
        if (!cleaned) continue;
        const cols = cleaned.split("\t");
        if (cols.length <= gurmukhiCol) continue;
        const gurmukhi = normalizeLine(cols[gurmukhiCol] || "");
        if (gurmukhi) lines.add(gurmukhi);
        if (isSGGS) {
          const ang = parseInt((cols[0] || "").trim(), 10);
          if (!Number.isNaN(ang)) sggsAngs.add(ang);
        }
      }
    }
  }
  addFrom(sggsRows, bani.sggsRanges, 2, true);
  addFrom(dasamRows, bani.dasamRanges, 1, false);
  return { lines, sggsAngs };
}

// MARK: - Quiz session

type QuizQuestion = {
  entry: VocabEntry;
  options: string[];
  correctIndex: number;
};

type Language = "english" | "punjabi";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// MARK: - Daily Quiz (deterministic by date)
//
// Same 10 questions for everyone on Earth on a given UTC date, picked from the
// full Vocabulary. No server, no leaderboard — the "vs everyone" feeling comes
// from knowing the Sangat is solving the same set.

const DAILY_BANI_ID = "daily";
const DAILY_LAST_DATE_KEY = "gt_daily_last_completed_date";
const DAILY_LAST_SCORE_KEY = "gt_daily_last_score";
const DAILY_STREAK_KEY = "gt_daily_streak";

function todayKey(): string {
  // UTC YYYY-MM-DD so the daily roll is consistent regardless of timezone.
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// xfnv1a hash → mulberry32 PRNG. Deterministic, tiny, good enough.
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDailyQuestions(vocab: VocabEntry[], dateKey: string): QuizQuestion[] {
  const rand = mulberry32(hashSeed(dateKey));
  const valid = vocab.filter((e) => e.meaningEn.trim().length > 0);
  const picked = seededShuffle(valid, rand).slice(0, 10);
  return picked.map((entry) => {
    const correct = entry.meaningEn;
    const distractors: string[] = [];
    const used = new Set<string>([correct]);
    const pool = seededShuffle(valid, rand);
    for (const d of pool) {
      if (distractors.length === 3) break;
      const m = d.meaningEn;
      if (used.has(m)) continue;
      used.add(m);
      distractors.push(m);
    }
    while (distractors.length < 3) distractors.push("—");
    const options = seededShuffle([correct, ...distractors], rand);
    return { entry, options, correctIndex: options.indexOf(correct) };
  });
}

type DailyState = {
  completedToday: boolean;
  lastScore: number | null;
  streak: number;
};

function readDailyState(): DailyState {
  if (typeof window === "undefined") {
    return { completedToday: false, lastScore: null, streak: 0 };
  }
  try {
    const lastDate = localStorage.getItem(DAILY_LAST_DATE_KEY);
    const lastScoreRaw = localStorage.getItem(DAILY_LAST_SCORE_KEY);
    const streakRaw = localStorage.getItem(DAILY_STREAK_KEY);
    const completedToday = lastDate === todayKey();
    const lastScore = lastScoreRaw ? parseInt(lastScoreRaw, 10) : null;
    let streak = streakRaw ? parseInt(streakRaw, 10) : 0;
    if (Number.isNaN(streak)) streak = 0;
    // If the last completion is older than yesterday, the streak has lapsed.
    if (lastDate && lastDate !== todayKey() && lastDate !== yesterdayKey()) {
      streak = 0;
    }
    return {
      completedToday,
      lastScore: lastScore !== null && !Number.isNaN(lastScore) ? lastScore : null,
      streak,
    };
  } catch {
    return { completedToday: false, lastScore: null, streak: 0 };
  }
}

// MARK: - Per-bani mastery + review queue
//
// We track, per bani, every word the Sangat has been quizzed on. From that we
// compute three Apple-Health-style rings on each row:
//   - Coverage:  unique words seen / pool size
//   - Accuracy:  rolling % over last 50 answers in that bani
//   - Mastery:   words answered correctly 3+ times in a row / pool size
// Words the user got wrong also land in a per-bani Review queue so the next
// quiz can offer to start with the missed ones.

type WordStat = { seen: number; correctStreak: number };
type BaniStats = {
  wordStats: Record<string, WordStat>;
  recentAnswers: boolean[]; // cap 50, FIFO
  reviewQueue: string[];
};
type AllStats = Record<string, BaniStats>;

const STATS_KEY = "gt_quiz_stats";
const RECENT_WINDOW = 50;
const MASTERY_THRESHOLD = 3;

function emptyBaniStats(): BaniStats {
  return { wordStats: {}, recentAnswers: [], reviewQueue: [] };
}

function loadAllStats(): AllStats {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as AllStats;
    return {};
  } catch {
    return {};
  }
}

function saveAllStats(stats: AllStats) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage may be full or disabled — accept the loss and move on.
  }
}

function recordAnswerInStats(
  all: AllStats,
  baniId: string,
  word: string,
  correct: boolean
): AllStats {
  const next: AllStats = { ...all };
  const bani = { ...(next[baniId] ?? emptyBaniStats()) };
  // Per-word counter.
  const w: WordStat = bani.wordStats[word]
    ? { ...bani.wordStats[word] }
    : { seen: 0, correctStreak: 0 };
  w.seen += 1;
  w.correctStreak = correct ? w.correctStreak + 1 : 0;
  bani.wordStats = { ...bani.wordStats, [word]: w };
  // Rolling accuracy buffer.
  const recent = [...bani.recentAnswers, correct];
  while (recent.length > RECENT_WINDOW) recent.shift();
  bani.recentAnswers = recent;
  // Review queue: add on wrong, remove on right.
  if (correct) {
    bani.reviewQueue = bani.reviewQueue.filter((w) => w !== word);
  } else if (!bani.reviewQueue.includes(word)) {
    bani.reviewQueue = [...bani.reviewQueue, word];
  }
  next[baniId] = bani;
  return next;
}

type MasteryView = {
  coverage: number; // 0..1
  accuracy: number; // 0..1
  mastery: number; // 0..1
  seenCount: number;
  masteredCount: number;
  poolSize: number;
  hasData: boolean;
};

function computeMastery(stats: BaniStats | undefined, pool: VocabEntry[]): MasteryView {
  const poolSize = pool.length;
  if (!stats || poolSize === 0) {
    return {
      coverage: 0,
      accuracy: 0,
      mastery: 0,
      seenCount: 0,
      masteredCount: 0,
      poolSize,
      hasData: false,
    };
  }
  let seen = 0;
  let mastered = 0;
  for (const e of pool) {
    const w = stats.wordStats[e.word];
    if (!w) continue;
    if (w.seen > 0) seen += 1;
    if (w.correctStreak >= MASTERY_THRESHOLD) mastered += 1;
  }
  const totalRecent = stats.recentAnswers.length;
  const correctRecent = stats.recentAnswers.filter((b) => b).length;
  const accuracy = totalRecent > 0 ? correctRecent / totalRecent : 0;
  return {
    coverage: seen / poolSize,
    accuracy,
    mastery: mastered / poolSize,
    seenCount: seen,
    masteredCount: mastered,
    poolSize,
    hasData: totalRecent > 0 || seen > 0,
  };
}

function recordDailyCompletion(score: number): DailyState {
  if (typeof window === "undefined") return { completedToday: true, lastScore: score, streak: 1 };
  try {
    const prev = readDailyState();
    const lastDate = localStorage.getItem(DAILY_LAST_DATE_KEY);
    let nextStreak: number;
    if (lastDate === todayKey()) {
      // Already counted today; replays do not change streak.
      nextStreak = prev.streak;
    } else if (lastDate === yesterdayKey()) {
      nextStreak = prev.streak + 1;
    } else {
      nextStreak = 1;
    }
    localStorage.setItem(DAILY_LAST_DATE_KEY, todayKey());
    localStorage.setItem(DAILY_LAST_SCORE_KEY, String(score));
    localStorage.setItem(DAILY_STREAK_KEY, String(nextStreak));
    return { completedToday: true, lastScore: score, streak: nextStreak };
  } catch {
    return { completedToday: true, lastScore: score, streak: 1 };
  }
}

function buildQuestions(
  pool: VocabEntry[],
  distractorSource: VocabEntry[],
  language: Language,
  count: number,
  opts?: { keepOrder?: boolean }
): QuizQuestion[] {
  const meaningOf = (e: VocabEntry) =>
    language === "english" ? e.meaningEn : e.meaningPa;
  const validPool = pool.filter((e) => meaningOf(e).trim().length > 0);
  const validDistractors = distractorSource.filter(
    (e) => meaningOf(e).trim().length > 0
  );
  const ordered = opts?.keepOrder ? validPool : shuffle(validPool);
  const picked = ordered.slice(0, count);
  return picked.map((entry) => {
    const correct = meaningOf(entry);
    const distractors: string[] = [];
    const usedMeanings = new Set<string>([correct]);
    const shuffledDistractors = shuffle(validDistractors);
    for (const d of shuffledDistractors) {
      if (distractors.length === 3) break;
      const m = meaningOf(d);
      if (usedMeanings.has(m)) continue;
      usedMeanings.add(m);
      distractors.push(m);
    }
    while (distractors.length < 3) distractors.push("—");
    const options = shuffle([correct, ...distractors]);
    return {
      entry,
      options,
      correctIndex: options.indexOf(correct),
    };
  });
}

// MARK: - Page

type View = "hub" | "setup" | "play" | "done";

const BEST_STREAK_KEY = "gt_quiz_best_streak";

export default function QuizPage() {
  const [vocab, setVocab] = useState<VocabEntry[] | null>(null);
  const [sggsRows, setSggsRows] = useState<string[] | null>(null);
  const [dasamRows, setDasamRows] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>("hub");
  const [activeBaniId, setActiveBaniId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("english");
  const [length, setLength] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [dailyState, setDailyState] = useState<DailyState>({
    completedToday: false,
    lastScore: null,
    streak: 0,
  });
  const [dailyJustRecorded, setDailyJustRecorded] = useState(false);
  const [allStats, setAllStats] = useState<AllStats>({});
  const [reviewModeUsed, setReviewModeUsed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Load data once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, s, d] = await Promise.all([
          fetch("/arths.tsv"),
          fetch("/sggs.tsv"),
          fetch("/dasam.tsv"),
        ]);
        if (!a.ok || !s.ok || !d.ok) throw new Error("Failed to load Gurbani data.");
        const [aText, sText, dText] = await Promise.all([a.text(), s.text(), d.text()]);
        if (cancelled) return;
        setVocab(parseVocab(aText));
        setSggsRows(sText.split("\n"));
        setDasamRows(dText.split("\n"));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Read best streak + daily state from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_STREAK_KEY);
      if (raw) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n > 0) setBestStreak(n);
      }
    } catch {}
    setDailyState(readDailyState());
    setAllStats(loadAllStats());
  }, []);

  // Build line + Ang matchers once data is loaded.
  const matcherByBani = useMemo<Record<string, BaniMatcher>>(() => {
    if (!sggsRows || !dasamRows) return {};
    const map: Record<string, BaniMatcher> = {};
    for (const bani of ALL_BANIS) {
      map[bani.id] = buildBaniMatcher(bani, sggsRows, dasamRows);
    }
    return map;
  }, [sggsRows, dasamRows]);

  // Build vocab pools per bani. A vocab entry counts if its source line
  // matches, OR if its Ang is in the bani's SGGS Ang set. The Ang fallback
  // catches words whose lines differ only by punctuation between TSVs.
  const poolByBani = useMemo<Record<string, VocabEntry[]>>(() => {
    if (!vocab) return {};
    const map: Record<string, VocabEntry[]> = {};
    for (const bani of ALL_BANIS) {
      const matcher = matcherByBani[bani.id];
      if (!matcher) {
        map[bani.id] = [];
        continue;
      }
      map[bani.id] = vocab.filter(
        (e) =>
          matcher.lines.has(normalizeLine(e.line)) ||
          (e.ang > 0 && matcher.sggsAngs.has(e.ang))
      );
    }
    return map;
  }, [vocab, matcherByBani]);

  const loading = !vocab || !sggsRows || !dasamRows;
  const DAILY_BANI: BaniDef = {
    id: DAILY_BANI_ID,
    name: "Daily Gurbani Quiz",
    subtitle: "10 curated words from across the Gurbani Vocabulary.",
  };
  const activeBani =
    activeBaniId === DAILY_BANI_ID
      ? DAILY_BANI
      : ALL_BANIS.find((b) => b.id === activeBaniId) || null;
  const activePool = activeBani ? poolByBani[activeBani.id] || [] : [];

  function startQuiz(opts?: { reviewFirst?: boolean }) {
    if (!vocab || !activeBani) return;
    const total = length === 0 ? activePool.length : Math.min(length, activePool.length);
    let orderedPool = activePool;
    setReviewModeUsed(false);
    if (opts?.reviewFirst) {
      const queue = allStats[activeBani.id]?.reviewQueue ?? [];
      const queued = new Set(queue);
      const inReview = activePool.filter((e) => queued.has(e.word));
      const rest = shuffle(activePool.filter((e) => !queued.has(e.word)));
      orderedPool = [...inReview, ...rest];
      setReviewModeUsed(true);
    }
    const qs = buildQuestions(orderedPool, vocab, language, total, {
      keepOrder: !!opts?.reviewFirst,
    });
    setQuestions(qs);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setDailyJustRecorded(false);
    setView("play");
  }

  function startDailyQuiz() {
    if (!vocab) return;
    const qs = buildDailyQuestions(vocab, todayKey());
    setActiveBaniId(DAILY_BANI_ID);
    setQuestions(qs);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setDailyJustRecorded(false);
    setView("play");
  }

  function answer(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const q = questions[qIndex];
    const correct = idx === q.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next > bestStreak) {
          setBestStreak(next);
          try {
            localStorage.setItem(BEST_STREAK_KEY, String(next));
          } catch {}
        }
        return next;
      });
    } else {
      setStreak(0);
    }
    // Record per-bani mastery + review-queue update.
    if (activeBaniId) {
      setAllStats((prev) => {
        const next = recordAnswerInStats(prev, activeBaniId, q.entry.word, correct);
        saveAllStats(next);
        return next;
      });
    }
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      // Daily quiz: record completion the first time we finish today.
      if (activeBaniId === DAILY_BANI_ID && !dailyJustRecorded) {
        const next = recordDailyCompletion(score);
        setDailyState(next);
        setDailyJustRecorded(true);
      }
      setView("done");
    } else {
      setQIndex((i) => i + 1);
      setPicked(null);
    }
  }

  function backToHub() {
    setView("hub");
    setActiveBaniId(null);
    setQuestions([]);
    setPicked(null);
    setScore(0);
    setStreak(0);
  }

  // MARK: - Render

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Gurbani Quiz</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {view === "hub" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_19rem]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                Gurbani Vocabulary Quiz
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Quiz yourself, bani by bani.
              </h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                Each quiz pool is the intersection of the{" "}
                <Link href="/arths" className="font-semibold text-amber-700 hover:underline">
                  Gurbani Vocabulary
                </Link>{" "}
                with that bani&apos;s actual lines, so the words you study are provably
                drawn from that bani. Open to all, no account, no scores stored beyond your
                browser.
              </p>
              {bestStreak > 0 && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  <span aria-hidden>🔥</span> Your best streak so far: {bestStreak}
                </p>
              )}

            {loading && (
              <p className="mt-8 text-center text-slate-600">
                Aligning the Vocabulary with each bani&apos;s lines…
              </p>
            )}

            {!loading && (() => {
              const nitnemReady = NITNEM_BANIS.filter(
                (b) => (poolByBani[b.id]?.length ?? 0) >= 4
              );
              const allNitnemCount = poolByBani[ALL_NITNEM.id]?.length ?? 0;
              const sukhmaniCount = poolByBani[SUKHMANI.id]?.length ?? 0;
              const sukhmaniReady = sukhmaniCount >= 4;
              const allNitnemReady = allNitnemCount >= 4;
              const anyNitnemSection = nitnemReady.length > 0 || allNitnemReady;
              return (
                <>
                  {anyNitnemSection && (
                    <>
                      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-amber-700">
                        Nitnem Bani Quizzes
                      </h2>
                      <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {nitnemReady.map((bani) => (
                          <BaniRow
                            key={bani.id}
                            bani={bani}
                            count={poolByBani[bani.id]?.length ?? 0}
                            onPick={() => {
                              setActiveBaniId(bani.id);
                              setView("setup");
                            }}
                            mastery={computeMastery(
                              allStats[bani.id],
                              poolByBani[bani.id] ?? []
                            )}
                          />
                        ))}
                        {allNitnemReady && (
                          <BaniRow
                            key={ALL_NITNEM.id}
                            bani={ALL_NITNEM}
                            count={allNitnemCount}
                            onPick={() => {
                              setActiveBaniId(ALL_NITNEM.id);
                              setView("setup");
                            }}
                            accent="emerald"
                            mastery={computeMastery(
                              allStats[ALL_NITNEM.id],
                              poolByBani[ALL_NITNEM.id] ?? []
                            )}
                          />
                        )}
                      </ul>
                    </>
                  )}

                  {sukhmaniReady && (
                    <>
                      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-amber-700">
                        Bani Spotlight
                      </h2>
                      <ul className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <BaniRow
                          key={SUKHMANI.id}
                          bani={SUKHMANI}
                          count={sukhmaniCount}
                          onPick={() => {
                            setActiveBaniId(SUKHMANI.id);
                            setView("setup");
                          }}
                          mastery={computeMastery(
                            allStats[SUKHMANI.id],
                            poolByBani[SUKHMANI.id] ?? []
                          )}
                        />
                      </ul>
                    </>
                  )}

                  {!anyNitnemSection && !sukhmaniReady && (
                    <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-600">
                      No bani quizzes have enough vocabulary yet. Check back as the Vocabulary
                      grows.
                    </p>
                  )}

                  <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    <span className="font-semibold">Want more from the same Vocabulary?</span>{" "}
                    Install the Gurbani Tutor iPhone app to{" "}
                    <span className="font-semibold">star words</span>, build a Favourites
                    pool, and track streaks across sessions.
                  </p>
                </>
              );
            })()}
            </div>

            {/* Right rail: Daily Quiz */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <DailyQuizCard
                state={dailyState}
                loading={loading}
                onStart={startDailyQuiz}
              />
            </aside>
          </div>
        )}

        {view === "setup" && activeBani && (
          <SetupView
            bani={activeBani}
            poolCount={activePool.length}
            language={language}
            setLanguage={setLanguage}
            length={length}
            setLength={setLength}
            onStart={() => startQuiz()}
            onStartReview={() => startQuiz({ reviewFirst: true })}
            reviewCount={
              (allStats[activeBani.id]?.reviewQueue ?? []).filter((w) =>
                activePool.some((e) => e.word === w)
              ).length
            }
            onBack={() => {
              setActiveBaniId(null);
              setView("hub");
            }}
          />
        )}

        {view === "play" && questions.length > 0 && (
          <PlayView
            bani={activeBani!}
            question={questions[qIndex]}
            qIndex={qIndex}
            total={questions.length}
            picked={picked}
            score={score}
            streak={streak}
            onAnswer={answer}
            onNext={nextQuestion}
            onQuit={backToHub}
          />
        )}

        {view === "done" && (
          <DoneView
            bani={activeBani!}
            score={score}
            total={questions.length}
            bestStreak={bestStreak}
            onPlayAgain={() => startQuiz()}
            onBack={backToHub}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/arths" className="font-medium text-amber-700 hover:underline">
              Gurbani Vocabulary
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}

/// Apple-Health-style triple concentric rings. Three arcs in 36×36:
///   outer (slate)   → coverage
///   middle (amber)  → mastery
///   inner (emerald) → accuracy
function MasteryRing({
  view,
  size = 36,
}: {
  view: MasteryView;
  size?: number;
}) {
  if (!view.hasData) return null;
  const stroke = 4;
  const cx = size / 2;
  const cy = size / 2;
  const ringRadii = [(size - stroke) / 2, (size - stroke) / 2 - stroke - 1, (size - stroke) / 2 - 2 * (stroke + 1)];
  const colors = ["#94a3b8", "#d97706", "#059669"]; // slate, amber, emerald
  const progresses = [view.coverage, view.mastery, view.accuracy];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {ringRadii.map((r, i) => {
        const c = 2 * Math.PI * r;
        const p = Math.max(0, Math.min(1, progresses[i]));
        return (
          <g key={i} transform={`rotate(-90 ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors[i]} strokeOpacity={0.15} strokeWidth={stroke} />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={colors[i]}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - p)}
            />
          </g>
        );
      })}
    </svg>
  );
}

function DailyQuizCard({
  state,
  loading,
  onStart,
}: {
  state: DailyState;
  loading: boolean;
  onStart: () => void;
}) {
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Daily Quiz
        </span>
        {state.streak > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
            🔥 {state.streak}-day
          </span>
        )}
      </div>
      <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">{todayLabel}</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        10 questions, same for everyone.
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        One curated quiz a day from across the Gurbani Vocabulary. Take it once to keep the
        streak alive.
      </p>

      {state.completedToday ? (
        <>
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <span className="font-semibold">✓ Done for today.</span>
            {typeof state.lastScore === "number" && (
              <> Score: {state.lastScore}/10.</>
            )}
          </div>
          <button
            type="button"
            onClick={onStart}
            disabled={loading}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Replay (won&apos;t change streak)
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading…" : "Take today's quiz →"}
        </button>
      )}

      <p className="mt-4 text-[11px] leading-5 text-slate-500">
        Deterministic by UTC date, so Sangat worldwide solve the same 10 today. Streak is
        tracked locally in your browser. No account, no submission.
      </p>
    </div>
  );
}

function BaniRow({
  bani,
  count,
  onPick,
  accent,
  mastery,
}: {
  bani: BaniDef;
  count: number;
  onPick: () => void;
  accent?: "emerald";
  mastery?: MasteryView;
}) {
  const disabled = count < 4;
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        disabled={disabled}
        className={`group flex w-full items-center gap-4 px-4 py-3 text-left transition sm:p-4 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : accent === "emerald"
              ? "hover:bg-emerald-50"
              : "hover:bg-amber-50"
        }`}
      >
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-white ${
            accent === "emerald" ? "bg-emerald-600" : "bg-amber-600"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm9 1.5V8h4.5L15 3.5z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 sm:text-base">{bani.name}</p>
          <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{bani.subtitle}</p>
          {mastery && mastery.hasData && (
            <p className="mt-1 text-[11px] text-slate-500">
              <span title="Coverage" className="text-slate-600">
                Cov {Math.round(mastery.coverage * 100)}%
              </span>
              <span aria-hidden> · </span>
              <span title="Mastery" className="text-amber-700">
                Mastery {mastery.masteredCount}/{mastery.poolSize}
              </span>
              <span aria-hidden> · </span>
              <span title="Accuracy" className="text-emerald-700">
                Acc {Math.round(mastery.accuracy * 100)}%
              </span>
            </p>
          )}
        </div>
        {mastery && mastery.hasData && (
          <MasteryRing view={mastery} />
        )}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{poolLabel(count)}</p>
          {!disabled && (
            <span
              aria-hidden
              className="text-xs text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-amber-700"
            >
              Start →
            </span>
          )}
          {disabled && <p className="text-xs text-slate-500">need ≥4 words</p>}
        </div>
      </button>
    </li>
  );
}

function poolLabel(count: number): string {
  if (count === 0) return "no words yet";
  if (count === 1) return "1 word";
  return `${count} words`;
}

function SetupView({
  bani,
  poolCount,
  language,
  setLanguage,
  length,
  setLength,
  onStart,
  onStartReview,
  reviewCount,
  onBack,
}: {
  bani: BaniDef;
  poolCount: number;
  language: Language;
  setLanguage: (l: Language) => void;
  length: number;
  setLength: (n: number) => void;
  onStart: () => void;
  onStartReview: () => void;
  reviewCount: number;
  onBack: () => void;
}) {
  const canStart = poolCount >= 4;
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-amber-700 hover:underline"
      >
        ← All quizzes
      </button>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {bani.name}
      </h1>
      <p className="mt-2 text-slate-700">{bani.subtitle}</p>
      <p className="mt-1 text-sm text-slate-600">
        Vocabulary pool: <span className="font-semibold">{poolLabel(poolCount)}</span>
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Test
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setLanguage("english")}
              className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                language === "english"
                  ? "border-amber-600 bg-amber-100 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
              }`}
            >
              English meaning
            </button>
            <button
              type="button"
              onClick={() => setLanguage("punjabi")}
              className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                language === "punjabi"
                  ? "border-amber-600 bg-amber-100 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
              }`}
            >
              ਪੰਜਾਬੀ ਅਰਥ
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Questions
          </p>
          <div className="mt-3 flex gap-2">
            {[10, 20, 0].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLength(n)}
                className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  length === n
                    ? "border-amber-600 bg-amber-100 text-amber-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
                }`}
              >
                {n === 0 ? "All" : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ▶ Start quiz
        </button>
        {reviewCount >= 4 && (
          <button
            type="button"
            onClick={onStartReview}
            disabled={!canStart}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-400 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900 shadow-sm transition hover:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ↺ Review {reviewCount} missed first
          </button>
        )}
      </div>
      {!canStart && (
        <p className="mt-3 text-sm text-slate-600">
          Pool is too small to build a 4-option quiz yet.
        </p>
      )}
      {reviewCount > 0 && reviewCount < 4 && (
        <p className="mt-3 text-xs text-slate-500">
          You have {reviewCount} word{reviewCount === 1 ? "" : "s"} to review. Need at least 4
          to start a focused review session.
        </p>
      )}
    </div>
  );
}

function PlayView({
  bani,
  question,
  qIndex,
  total,
  picked,
  score,
  streak,
  onAnswer,
  onNext,
  onQuit,
}: {
  bani: BaniDef;
  question: QuizQuestion;
  qIndex: number;
  total: number;
  picked: number | null;
  score: number;
  streak: number;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onQuit: () => void;
}) {
  // Reset the hint visibility for each new question. The qIndex change is what
  // resets it; on the same question the hint stays open.
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    setShowHint(false);
  }, [qIndex]);
  const showResult = picked !== null;
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <button
          type="button"
          onClick={onQuit}
          className="font-semibold text-amber-700 hover:underline"
        >
          ← End quiz
        </button>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            {qIndex + 1} / {total}
          </span>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            Score {score}
          </span>
          {streak > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">{bani.name}</p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Pick the correct meaning
        </p>
        <p className="mt-3 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          {question.entry.word}
        </p>
        {/* Hint: reveal the Gurbani source line on demand, like the iOS app. */}
        {question.entry.line && (
          <div className="mt-5">
            {showHint || showResult ? (
              <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Source line
                </p>
                <p className="mt-1 text-base leading-7 text-slate-800">
                  {question.entry.line}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300"
              >
                💡 Show source line (hint)
              </button>
            )}
          </div>
        )}
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isPicked = picked === i;
          let cls =
            "rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm leading-6 text-slate-800 shadow-sm transition hover:border-amber-300";
          if (showResult && isCorrect) {
            cls =
              "rounded-2xl border border-emerald-400 bg-emerald-50 p-4 text-left text-sm leading-6 text-emerald-900 shadow-sm";
          } else if (showResult && isPicked && !isCorrect) {
            cls =
              "rounded-2xl border border-red-400 bg-red-50 p-4 text-left text-sm leading-6 text-red-900 shadow-sm";
          } else if (showResult) {
            cls =
              "rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm leading-6 text-slate-500 shadow-sm";
          }
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onAnswer(i)}
                disabled={showResult}
                className={`w-full ${cls}`}
              >
                {opt || "—"}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            {qIndex + 1 >= total ? "See results →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}

function DoneView({
  bani,
  score,
  total,
  bestStreak,
  onPlayAgain,
  onBack,
}: {
  bani: BaniDef;
  score: number;
  total: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onBack: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">{bani.name}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {pct >= 80 ? "Vaheguru blesses your seva." : "Keep going, Sangat Ji."}
      </h1>
      <p className="mt-3 text-base text-slate-700">
        You scored <span className="font-semibold">{score}</span> out of {total} ({pct}%).
      </p>
      <p className="mt-1 text-sm text-slate-600">Best streak this device: 🔥 {bestStreak}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
        >
          All quizzes
        </button>
      </div>
    </div>
  );
}
