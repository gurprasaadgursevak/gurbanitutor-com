"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Shabad = { id: string; marker: string; gurmukhi: string };

// Same deterministic daily index as the Shabad Test page so both screens
// surface the same shabad on the same calendar day.
function dailyIndex(total: number): number {
  if (total <= 0) return 0;
  const now = new Date();
  const dayStamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  let h = 2166136261;
  for (let i = 0; i < dayStamp.length; i++) {
    h ^= dayStamp.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % total;
}

function parseTSV(text: string): Shabad[] {
  const lines = text.split("\n");
  const out: Shabad[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (cols.length < 2) continue;
    const marker = (cols[0] || "").trim();
    const gurmukhi = (cols[1] || "").trim();
    if (!gurmukhi) continue;
    out.push({ id: `gareebi-${i}`, marker, gurmukhi });
  }
  return out;
}

export default function TodayShabad() {
  const [shabad, setShabad] = useState<Shabad | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/gareebi-pothi-shabads.tsv");
        if (!res.ok) return;
        const text = await res.text();
        if (cancelled) return;
        const list = parseTSV(text);
        if (list.length === 0) return;
        setShabad(list[dailyIndex(list.length)] ?? null);
      } catch {
        // Silently no-op; homepage stays clean if the bank can't load.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!shabad) return null;

  return (
    <section className="mx-auto mt-6 max-w-3xl px-6">
      <div className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Today's Shabad to Memorize
          </p>
          <span className="text-xs text-amber-700">#{shabad.marker}</span>
        </div>
        <p
          lang="pa"
          className="mt-3 text-xl leading-relaxed text-slate-900 sm:text-2xl"
        >
          {shabad.gurmukhi}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/shabad-test"
            className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            Take the Shabad Test
          </Link>
          <Link
            href="/gareebi-pothi"
            className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:border-amber-500"
          >
            Read with arth
          </Link>
        </div>
      </div>
    </section>
  );
}
