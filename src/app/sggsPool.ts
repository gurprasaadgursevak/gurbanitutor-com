"use client";

// Single source for SGGS lines used by Punctuation Master and Sentence
// Unscramble on the web. The JSON is generated from public/sggs.tsv via
// `node scripts/build-game-pool.mjs`, so any correction to the master TSV
// flows through to both games on rebuild.
import { useEffect, useState } from "react";

export type PoolLine = { id: number; tukh: string; ang: number };

export type SGGSPool = {
  unscramble: PoolLine[];   // 3-7 word, ends ॥, has ; . or ,
  punctuated: PoolLine[];   // ends ॥, has ; . or ,
  unpunctuated: PoolLine[]; // ends ॥, no ; . or , (3-10 words)
};

let cached: SGGSPool | null = null;
let pending: Promise<SGGSPool> | null = null;

export function fetchPool(): Promise<SGGSPool> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = fetch("/sggs-game-pool.json")
    .then((r) => r.json())
    .then((data) => {
      cached = {
        unscramble: data.unscramble ?? [],
        punctuated: data.punctuated ?? [],
        unpunctuated: data.unpunctuated ?? [],
      };
      return cached;
    })
    .catch(() => {
      cached = { unscramble: [], punctuated: [], unpunctuated: [] };
      return cached;
    });
  return pending;
}

export function useSGGSPool(): { pool: SGGSPool | null; ready: boolean } {
  const [pool, setPool] = useState<SGGSPool | null>(cached);
  useEffect(() => {
    if (cached) {
      setPool(cached);
      return;
    }
    let cancelled = false;
    fetchPool().then((p) => {
      if (!cancelled) setPool(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return { pool, ready: pool !== null };
}

export function poolLabel(line: PoolLine): string {
  return `Sri Guru Granth Sahib Ji • Ang ${line.ang}`;
}
