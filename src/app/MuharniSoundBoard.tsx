"use client";

import { useEffect, useRef, useState } from "react";
import { muharniRows, muharniAudioURL, type MuharniRow } from "./gurmukhiData";
import { muharniLetters, type MuharniLetter } from "./muharniLetters";
import MuharniPrimerSheet from "./MuharniPrimerSheet";

/// Tap-to-play Muharni board. Mirrors the iOS MuharniSoundBoardView.
///
/// - Tap the tile → plays the full ~18s row chant (legacy gursevak.com CDN).
/// - Tap the small "12 forms" chip in the corner → opens the per-letter primer
///   (3×4 grid of lag forms, each tile playing a per-form clip from the DVD).
/// - On the `ੳ ਅ ੲ` tile, the primer chip opens the combined vowels card.
export default function MuharniSoundBoard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);
  const [primerLetter, setPrimerLetter] = useState<MuharniLetter | null>(null);
  const [primerVowels, setPrimerVowels] = useState(false);

  function stop() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingId(null);
  }

  function playFullChant(row: MuharniRow) {
    const el = audioRef.current;
    if (!el) return;
    el.src = muharniAudioURL(row);
    el.currentTime = 0;
    void el.play();
    setNowPlayingId(row.id);
  }

  function openPrimer(row: MuharniRow) {
    if (row.transliteration.toLowerCase() === "vowels") {
      setPrimerVowels(true);
      return;
    }
    const letter = muharniLetters.find((l) => l.baseGlyph === row.consonant);
    if (letter) setPrimerLetter(letter);
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Muharni</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Tap a letter to hear it chanted through all 12 lagaan (~18s). Tap the
        small <span className="font-semibold">12 forms</span> chip to open the
        primer card and play each lag form individually. Repeat each letter 25
        times before your first class.
      </p>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
        {muharniRows.map((row) => {
          const playing = nowPlayingId === row.id;
          return (
            <div key={row.id} className="relative">
              <button
                type="button"
                onClick={() => playFullChant(row)}
                className={[
                  "flex aspect-square w-full flex-col items-center justify-center rounded-xl border transition",
                  playing
                    ? "border-amber-400 bg-amber-500 text-white shadow"
                    : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
                ].join(" ")}
              >
                <span className="text-xl font-bold leading-none sm:text-2xl">
                  {row.consonant}
                </span>
                <span className="mt-1 text-[10px] leading-tight opacity-80 sm:text-xs">
                  {row.name}
                </span>
                <span className="text-[10px] font-medium opacity-70 sm:text-xs">
                  {row.transliteration}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPrimer(row);
                }}
                aria-label={`Open ${row.transliteration} primer card`}
                className="absolute bottom-1 right-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100 sm:text-[10px]"
              >
                12 forms ›
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-amber-900/60">
        Chant audio courtesy of Learn Shudh Gurbani by gursevak.com. Per-form
        primer audio cut from a Muharni DVD.
      </p>

      <audio ref={audioRef} preload="none" onEnded={() => stop()} />

      <MuharniPrimerSheet
        letter={primerLetter}
        vowels={primerVowels}
        onClose={() => {
          setPrimerLetter(null);
          setPrimerVowels(false);
        }}
      />
    </div>
  );
}
