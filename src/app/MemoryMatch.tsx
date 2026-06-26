"use client";

import { useEffect, useRef, useState } from "react";
import { memoryPairs } from "./gamesData";

const BEST_KEY = "memory_match_best_moves";
const BEST_TIME_KEY = "memory_match_best_seconds";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

type Card = {
  id: string;
  pairId: number;
  text: string;
  isWord: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(): Card[] {
  const chosen = shuffle(memoryPairs).slice(0, 6);
  const cards: Card[] = [];
  chosen.forEach((p, i) => {
    cards.push({ id: `w-${i}`, pairId: i, text: p.word, isWord: true });
    cards.push({ id: `m-${i}`, pairId: i, text: p.meaning, isWord: false });
  });
  return shuffle(cards);
}

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(() => buildCards());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(0);
  const [bestSeconds, setBestSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_KEY);
      const n = saved ? parseInt(saved, 10) : 0;
      if (!Number.isNaN(n) && n > 0) setBest(n);
      const savedT = localStorage.getItem(BEST_TIME_KEY);
      const t = savedT ? parseInt(savedT, 10) : 0;
      if (!Number.isNaN(t) && t > 0) setBestSeconds(t);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BEST_KEY, String(best));
      localStorage.setItem(BEST_TIME_KEY, String(bestSeconds));
    } catch {}
  }, [best, bestSeconds]);

  const won = cards.length > 0 && matched.size === cards.length;
  const pairsFound = matched.size / 2;
  const totalPairs = cards.length / 2;

  useEffect(() => {
    if (startedAt === null || won) return;
    const tick = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [startedAt, won]);

  function reset() {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setCards(buildCards());
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setStartedAt(null);
    setElapsed(0);
  }

  function flip(card: Card) {
    if (matched.has(card.id) || flipped.has(card.id) || flipped.size >= 2) return;
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (startedAt === null) setStartedAt(Date.now());
    const next = new Set(flipped);
    next.add(card.id);
    setFlipped(next);
    if (next.size === 2) {
      setMoves((m) => m + 1);
      const ids = Array.from(next);
      const pair = ids.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
      if (pair.length === 2 && pair[0].pairId === pair[1].pairId) {
        const m = new Set(matched);
        ids.forEach((id) => m.add(id));
        setMatched(m);
        setFlipped(new Set());
        if (m.size === cards.length) {
          const nextMoves = moves + 1;
          if (best === 0 || nextMoves < best) setBest(nextMoves);
          const finalSeconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : elapsed;
          setElapsed(finalSeconds);
          if (bestSeconds === 0 || finalSeconds < bestSeconds) setBestSeconds(finalSeconds);
        }
      } else {
        timeoutRef.current = window.setTimeout(() => setFlipped(new Set()), 900);
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Memory Match</h1>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <Stat label="Time" value={formatTime(elapsed)} />
        <Stat label="Moves" value={String(moves)} />
        <Stat label="Best" value={best === 0 ? "—" : String(best)} />
        <Stat label="Matched" value={`${pairsFound} / ${totalPairs}`} />
      </div>

      {won && (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-100 px-5 py-4 text-center">
          <p className="text-base font-semibold text-amber-900">
            Waheguru! All pairs in {moves} moves · {formatTime(elapsed)}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Play again
          </button>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        {cards.map((card) => {
          const revealed = flipped.has(card.id) || matched.has(card.id);
          const isMatched = matched.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              disabled={isMatched}
              className={[
                "flex h-20 items-center justify-center rounded-xl border px-2 transition",
                revealed
                  ? isMatched
                    ? "border-green-500 bg-green-50 text-amber-900"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-amber-200 bg-amber-400/20 text-amber-700 hover:bg-amber-400/30",
              ].join(" ")}
            >
              {revealed ? (
                <span
                  className={
                    card.isWord ? "text-lg font-bold" : "text-xs font-semibold text-center"
                  }
                >
                  {card.text}
                </span>
              ) : (
                <span className="text-xl">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
      <div className="text-lg font-bold text-amber-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-amber-900/60">{label}</div>
    </div>
  );
}
