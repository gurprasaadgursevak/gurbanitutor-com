"use client";

import { useEffect, useState } from "react";

type FontFamily = "notoSans" | "guruGranthUni";

const LS_KEY = "gurmukhi_font";

/**
 * Small two-state toggle to switch the Gurmukhi face used for any element
 * tagged `lang="pa"`. Mirrors the iOS app's About → Gurbani Typeface picker.
 *
 * The selection is persisted in `localStorage` and applied as
 * `<html data-gurmukhi-font="…">`. globals.css reads that attribute to swap
 * the primary face; Noto stays as the cascade fallback so any glyph
 * GuruGranthUni doesn't cover still renders.
 */
export default function GurmukhiFontToggle() {
  const [family, setFamily] = useState<FontFamily>("notoSans");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY) as FontFamily | null;
      if (stored === "guruGranthUni" || stored === "notoSans") {
        setFamily(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.gurmukhiFont = family;
    try { localStorage.setItem(LS_KEY, family); } catch {}
  }, [family]);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white p-1 text-xs">
      <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Font
      </span>
      <button
        type="button"
        onClick={() => setFamily("notoSans")}
        className={`rounded-full px-3 py-1 font-semibold transition ${
          family === "notoSans"
            ? "bg-amber-600 text-white"
            : "text-slate-700 hover:text-amber-700"
        }`}
        aria-pressed={family === "notoSans"}
      >
        Noto
      </button>
      <button
        type="button"
        onClick={() => setFamily("guruGranthUni")}
        className={`rounded-full px-3 py-1 font-semibold transition ${
          family === "guruGranthUni"
            ? "bg-amber-600 text-white"
            : "text-slate-700 hover:text-amber-700"
        }`}
        aria-pressed={family === "guruGranthUni"}
      >
        Guru Granth Uni
      </button>
    </div>
  );
}
