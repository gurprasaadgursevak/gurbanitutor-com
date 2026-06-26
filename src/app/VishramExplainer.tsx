"use client";

import { useEffect, useState } from "react";
import LarivaarText from "./LarivaarText";

const SEEN_KEY = "vishram_explainer_seen";

const DEMO_LINE = "ਦੇਹੁ ਦਰਸੁ. ਸੁਖ ਦਾਤਿਆ; ਮੈ. ਗਲ ਵਿਚਿ, ਲੈਹੁ ਮਿਲਾਇ ਜੀਉ॥੧੫॥";

/// First-visit explainer for the three inline pause marks (vishrams). Pops
/// once per browser per device; the user dismisses with "Got it". Mirrors
/// the iOS sheet in `VishramExplainerView.swift` so the explanation matches
/// what Sangat sees on both platforms.
export default function VishramExplainerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY) !== "1") setOpen(true);
    } catch {}
  }, []);

  if (!open) return null;

  function dismiss() {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <h2 className="text-lg font-bold text-amber-800">Reading Vishrams (Pauses)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Gurbani is rendered with three pause marks. Each tells you how long to pause before the next word.
          </p>

          <div className="mt-4 space-y-3">
            <PauseRow symbol="." color="#dc2626" name="Small pause" detail="Brief breath. Painted red in Larivaar mode." />
            <PauseRow symbol="," color="#ea580c" name="Medium pause" detail="Slightly longer. Painted orange in Larivaar mode." />
            <PauseRow symbol=";" color="#16a34a" name="Long pause" detail="Full pause before the next phrase. Painted green in Larivaar mode." />
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Example</p>
            <p
              lang="pa"
              className="mt-1 rounded-2xl bg-slate-100 p-4 text-xl leading-9 text-slate-900"
            >
              <LarivaarText text={DEMO_LINE} enabled={true} />
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Watch how the word before each pause mark takes on its colour: red before &ldquo;.&rdquo;, orange before &ldquo;,&rdquo;, green before &ldquo;;&rdquo;.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-sm font-semibold text-amber-800">Bhai Nand Lal Ji</p>
            <p className="mt-1 text-xs text-amber-900/80">
              Bhai Nand Lal Ji&apos;s bani in our database currently uses &ldquo;,&rdquo; for all three pause lengths as a placeholder. We&apos;ll update those marks with the correct small / medium / long distinctions in a future release.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={dismiss}
            className="w-full rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function PauseRow({ symbol, color, name, detail }: { symbol: string; color: string; name: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl font-bold"
        style={{ color, backgroundColor: `${color}22` }}
      >
        {symbol}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-600">{detail}</p>
      </div>
    </div>
  );
}
