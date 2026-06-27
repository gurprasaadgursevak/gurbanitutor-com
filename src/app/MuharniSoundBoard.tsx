"use client";

import { useEffect, useRef, useState } from "react";
import { muharniRows, muharniAudioURL, type MuharniRow } from "./gurmukhiData";
import { muharniLetters, type MuharniLetter } from "./muharniLetters";
import MuharniPrimerSheet from "./MuharniPrimerSheet";

/// Tap-to-play Muharni board. Mirrors the iOS MuharniSoundBoardView.
///
/// - Tap a consonant → opens the per-letter primer (3×4 grid of 12 lag forms,
///   each playing its own clip cut from the Muharni DVD).
/// - Tap the `ੳ ਅ ੲ` tile → opens the combined vowels primer card.
/// - Long-press → plays the full ~18s row chant (legacy CDN audio from
///   gursevak.com).
export default function MuharniSoundBoard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);
  const [primerLetter, setPrimerLetter] = useState<MuharniLetter | null>(null);
  const [primerVowels, setPrimerVowels] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

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

  function handlePointerDown(row: MuharniRow) {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      playFullChant(row);
    }, 500);
  }

  function handlePointerUp(row: MuharniRow) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!longPressTriggered.current) {
      openPrimer(row);
    }
  }

  function handlePointerCancel() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Muharni</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Tap any letter to open its primer card and play each of the 12 lag forms.
        Long-press to play the full ~18s muharni chant. Repeat each letter 25
        times before your first class.
      </p>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
        {muharniRows.map((row) => {
          const playing = nowPlayingId === row.id;
          return (
            <button
              key={row.id}
              type="button"
              onPointerDown={() => handlePointerDown(row)}
              onPointerUp={() => handlePointerUp(row)}
              onPointerCancel={handlePointerCancel}
              onPointerLeave={handlePointerCancel}
              className={[
                "flex aspect-square flex-col items-center justify-center rounded-xl border transition",
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
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-amber-900/60">
        Per-letter audio cut from a Muharni DVD. Long-press chant audio
        courtesy of Learn Shudh Gurbani by gursevak.com.
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
