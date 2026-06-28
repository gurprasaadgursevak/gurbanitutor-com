"use client";

import { useEffect, useRef, useState } from "react";
import {
  pentiAkhar,
  letterAudioURL,
  DEFAULT_LETTER_CAP_SECONDS,
  type PentiAkharCell,
} from "./gurmukhiData";

/// Tap-to-play Painti Akhari board. Mirrors the iOS GurmukhiSoundBoardView,
/// including the Play All / Pause / Restart controls and the "tap a tile to
/// bookmark resume" flow.
///
/// `lessonMode={true}` plays the full teacher recording from the gursevak
/// CDN; otherwise each tap is capped at one utterance so it feels game-like.
export default function LetterSoundBoard({
  lessonMode = false,
}: {
  lessonMode?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);
  /// Index of the cell the auto-play loop is on. `null` when paused/stopped.
  const [playAllIndex, setPlayAllIndex] = useState<number | null>(null);
  /// Where the next Play press should resume from. Set on Pause or on a
  /// manual tile tap so resume picks up at that letter.
  const [playAllResumeIndex, setPlayAllResumeIndex] = useState<number | null>(null);
  /// Captured in a ref so the `onEnded` callback can read the latest index
  /// without re-binding the listener on every render.
  const playAllIndexRef = useRef<number | null>(null);
  useEffect(() => {
    playAllIndexRef.current = playAllIndex;
  }, [playAllIndex]);

  function clearStopTimer() {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }

  function stopPlayback() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    clearStopTimer();
    setNowPlayingId(null);
  }

  /// Play the given cell. Advances the autoplay loop automatically (the
  /// onEnded handler reads `playAllIndexRef` and moves on) but otherwise
  /// behaves like a one-shot.
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
      stopTimerRef.current = window.setTimeout(() => {
        stopPlayback();
        advancePlayAll();
      }, cap);
    }
  }

  function advancePlayAll() {
    const idx = playAllIndexRef.current;
    if (idx === null) return;
    const next = idx + 1;
    if (next < pentiAkhar.length) {
      setPlayAllIndex(next);
      play(pentiAkhar[next]);
    } else {
      setPlayAllIndex(null);
    }
  }

  function handleTileTap(idx: number, cell: PentiAkharCell) {
    // A manual tap pauses Play All and bookmarks this tile as the resume
    // point so the next Play press picks up here.
    setPlayAllIndex(null);
    setPlayAllResumeIndex(idx);
    play(cell);
  }

  function togglePlayAll() {
    if (playAllIndex !== null) {
      // Pause — keep the current position as the resume point.
      setPlayAllResumeIndex(playAllIndex);
      setPlayAllIndex(null);
      stopPlayback();
    } else {
      const startIdx = playAllResumeIndex ?? 0;
      setPlayAllResumeIndex(null);
      setPlayAllIndex(startIdx);
      play(pentiAkhar[startIdx]);
    }
  }

  function restartPlayAll() {
    setPlayAllResumeIndex(null);
    setPlayAllIndex(0);
    play(pentiAkhar[0]);
  }

  useEffect(() => {
    return () => stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurb = lessonMode
    ? "Tap a letter to hear the full pronunciation lesson from Learn Shudh Gurbani."
    : "Tap any letter to hear the proper Gurmukhi pronunciation.";

  const active = playAllIndex !== null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">
        Gurmukhi Letters
      </h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">{blurb}</p>

      <p className="mt-3 rounded-lg bg-amber-100/60 px-3 py-2 text-center text-xs text-amber-900/80">
        Each letter is spoken several times so it settles in. Repeat after the
        sound to practise your ucharan.
      </p>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
        {pentiAkhar.map((cell, idx) => {
          const playing = nowPlayingId === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => handleTileTap(idx, cell)}
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

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePlayAll}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          <span aria-hidden>{active ? "❚❚" : "▶"}</span>
          {active ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={restartPlayAll}
          aria-label="Restart from the beginning"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
        >
          <span aria-hidden>⏮</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-amber-900/60">
        Audio courtesy of Learn Shudh Gurbani by gursevak.com.
      </p>

      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => {
          stopPlayback();
          advancePlayAll();
        }}
      />
    </div>
  );
}
