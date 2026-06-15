"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const TOTAL = 35;
const STORAGE_KEY = "paintee_last_index";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default function PaintiViewer() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n) && n >= 0 && n < TOTAL) setIndex(n);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(index));
    } catch {
      // ignore
    }
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(TOTAL - 1, i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(TOTAL - 1, i + 1));

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={index <= 0}
          aria-label="Previous letter"
          className="rounded-full p-2 text-2xl text-amber-600 transition hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-amber-700">
          Letter {index + 1} of {TOTAL}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={index >= TOTAL - 1}
          aria-label="Next letter"
          className="rounded-full p-2 text-2xl text-amber-600 transition hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ›
        </button>
      </div>

      {/* Image */}
      <div className="mt-4 flex justify-center">
        <div className="relative h-64 w-full max-w-md sm:h-80">
          <Image
            src={`/santhiya101/painti/painti_${pad(index + 1)}.png`}
            alt={`Painti Akhari letter ${index + 1} of ${TOTAL}`}
            fill
            sizes="(max-width: 640px) 90vw, 28rem"
            className="object-contain"
            priority={index === 0}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to letter ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 w-1.5 rounded-full transition ${
              i === index ? "bg-amber-600" : "bg-slate-300 hover:bg-amber-400"
            }`}
          />
        ))}
      </div>

      {/* Video CTA */}
      <a
        href="https://www.youtube-nocookie.com/embed/Q9rmNdAcZ_E"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition hover:border-amber-300"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Hear the Sounds of Letters
            </p>
            <p className="text-xs text-slate-600">
              Watch the video to learn pronunciation
            </p>
          </div>
        </div>
        <span aria-hidden className="text-slate-500">
          →
        </span>
      </a>
    </div>
  );
}
