"use client";

import { useEffect, useRef, useState } from "react";
import {
  pentiAkhar,
  letterAudioURL,
  DEFAULT_LETTER_CAP_SECONDS,
  type PentiAkharCell,
} from "./gurmukhiData";

/// Tap-to-play Painti Akhari board. Mirrors the iOS GurmukhiSoundBoardView.
/// `lessonMode={true}` plays the full teacher recording from the gursevak CDN;
/// otherwise each tap is capped at one utterance so it feels game-like.
export default function LetterSoundBoard({
  lessonMode = false,
}: {
  lessonMode?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);

  function clearStopTimer() {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }

  function stop() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    clearStopTimer();
    setNowPlayingId(null);
  }

  function play(cell: PentiAkharCell) {
    const el = audioRef.current;
    if (!el) return;
    clearStopTimer();
    el.src = letterAudioURL(cell);
    el.currentTime = 0;
    void el.play();
    setNowPlayingId(cell.id);
    if (!lessonMode) {
      const cap = (cell.playbackSeconds ?? DEFAULT_LETTER_CAP_SECONDS) * 1000;
      stopTimerRef.current = window.setTimeout(stop, cap);
    }
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurb = lessonMode
    ? "Tap a letter to hear the full pronunciation lesson from Learn Shudh Gurbani."
    : "Tap any letter to hear the proper Gurmukhi pronunciation.";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">
        Gurmukhi Letters
      </h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">{blurb}</p>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
        {pentiAkhar.map((cell) => {
          const playing = nowPlayingId === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => play(cell)}
              className={[
                "flex aspect-square flex-col items-center justify-center rounded-xl border transition",
                playing
                  ? "border-amber-400 bg-amber-500 text-white shadow"
                  : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
              ].join(" ")}
            >
              <span className="text-2xl font-bold leading-none sm:text-3xl">
                {cell.letter}
              </span>
              <span className="mt-1 text-[10px] leading-tight opacity-80 sm:text-xs">
                {cell.name}
              </span>
              <span className="text-[10px] font-medium opacity-70 sm:text-xs">
                {cell.transliteration}
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
