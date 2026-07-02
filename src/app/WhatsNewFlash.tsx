"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Bump this key whenever a new batch of highlights ships — a new value means
// Sangat who dismissed the previous flash will see the fresh one once.
const FLASH_KEY = "gt_whatsnew_2026_07_santhiya";

type Item = { href: string; label: string; note: string };

const ITEMS: Item[] = [
  {
    href: "/muharni/trace",
    label: "Gurmukhi Trace",
    note: "Trace all 35 letters with your finger, on any device.",
  },
  {
    href: "/muharni/writing-guide",
    label: "How to Write the Letters",
    note: "A step-by-step guide, in Punjabi and English.",
  },
  {
    href: "/muharni/balupdesh-quiz",
    label: "Balupdesh Quiz",
    note: "Three levels to test your Santhiya, bilingual.",
  },
];

export default function WhatsNewFlash() {
  // Start hidden; reveal only after we confirm this flash hasn't been dismissed.
  // This avoids a flash-of-content on every load for Sangat who already saw it.
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(FLASH_KEY) !== "seen") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(FLASH_KEY, "seen");
    } catch {
      /* ignore — worst case it shows again next visit */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-2">
      <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm sm:p-6">
        <button
          onClick={dismiss}
          aria-label="Dismiss what's new"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-amber-100 hover:text-slate-700"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex animate-pulse items-center rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            New
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            New in Santhiya 101
          </p>
        </div>

        <h2 className="mt-2 pr-8 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          Three new ways to learn your Painti Akhari.
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group flex flex-col rounded-xl border border-amber-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
            >
              <span className="text-sm font-semibold text-slate-900">
                {it.label}
                <span
                  aria-hidden
                  className="ml-1 inline-block text-amber-600 transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
              <span className="mt-1 text-xs leading-5 text-slate-600">{it.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
