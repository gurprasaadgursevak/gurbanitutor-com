"use client";

import { useEffect, useRef, useState } from "react";
import { muharniRows, muharniAudioURL, type MuharniRow } from "./gurmukhiData";

/// Tap-to-play Muharni board. Mirrors the iOS MuharniSoundBoardView.
/// Each row plays the full ~18s chant (consonant + 12 vowel forms).
export default function MuharniSoundBoard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);

  function stop() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingId(null);
  }

  function play(row: MuharniRow) {
    const el = audioRef.current;
    if (!el) return;
    el.src = muharniAudioURL(row);
    el.currentTime = 0;
    void el.play();
    setNowPlayingId(row.id);
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Muharni</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Practise your Muharni one letter at a time. Tap any consonant to hear it
        chanted through all 12 lagaan, e.g. ਸ ਸਾ ਸਿ ਸੀ ਸੁ ਸੂ ਸੇ ਸੈ ਸੋ ਸੌ ਸੰ ਸਾਂ.
        Repeat each letter 25 times before your first class.
      </p>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
        {muharniRows.map((row) => {
          const playing = nowPlayingId === row.id;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => play(row)}
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
        Audio courtesy of Learn Shudh Gurbani by gursevak.com.
      </p>

      <audio ref={audioRef} preload="none" onEnded={() => stop()} />
    </div>
  );
}
