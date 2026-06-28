"use client";

import { useEffect, useRef, useState } from "react";
import {
  muharniLetters,
  isValidCombo,
  glyphFor,
  clipUrlFor,
  type MuharniLag,
  type MuharniLetter,
} from "./muharniLetters";
import type { PlayAllControlState } from "./MuharniPrimerSheet";

/// Primer sheet for a single lag (e.g. Sihari). Lists every Painti Akhari
/// letter that has a valid form for this lag (33 consonants plus the one
/// vowel carrier that produces a real standalone vowel for this lag, e.g.
/// ਇ for sihari). Tapping a tile plays that letter+lag clip.
///
/// Mirrors iOS `MuharniLagFamilyPrimerSheet.swift`.

interface Props {
  lag: MuharniLag | null;
  onClose: () => void;
  /// When non-null, this overrides the sheet's internal highlight so the
  /// parent Play All loop can drive which tile lights up. Encoded as the
  /// letter id (e.g. "sassa").
  externalHighlightLetterId?: string | null;
  /// Fires when the user taps a tile inside this sheet.
  onTapTile?: (letter: MuharniLetter) => void;
  /// Floating bottom Play/Pause control. When omitted the button isn't shown.
  playAllState?: PlayAllControlState | null;
  onTogglePlayAll?: () => void;
  onRestartPlayAll?: () => void;
  /// Fires when the user taps Done.
  onDone?: () => void;
}

export default function MuharniLagFamilyPrimerSheet({
  lag,
  onClose,
  externalHighlightLetterId = null,
  onTapTile,
  playAllState,
  onTogglePlayAll,
  onRestartPlayAll,
  onDone,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingLetterId, setNowPlayingLetterId] = useState<string | null>(null);

  function stop() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingLetterId(null);
  }

  function playClip(letter: MuharniLetter) {
    if (!lag) return;
    const el = audioRef.current;
    if (!el) return;
    el.src = clipUrlFor(letter.id, lag.id);
    el.currentTime = 0;
    void el.play();
    setNowPlayingLetterId(letter.id);
  }

  function handleTileTap(letter: MuharniLetter) {
    onTapTile?.(letter);
    playClip(letter);
  }

  function handleDone() {
    onDone?.();
    onClose();
  }

  useEffect(() => () => stop(), []);

  if (!lag) return null;

  const highlight = externalHighlightLetterId ?? nowPlayingLetterId;
  const letters = muharniLetters.filter((l) => isValidCombo(lag.id, l.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleDone}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Lag primer
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                <span className="font-bold text-amber-700">{lag.punjabiName}</span>{" "}
                <span className="text-base font-normal text-slate-600">{lag.englishName}</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleDone}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Done
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {letters.map((letter) => {
              const glyph = glyphFor(letter.id, lag.id);
              const playing = highlight === letter.id;
              return (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => handleTileTap(letter)}
                  className={[
                    "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition",
                    playing
                      ? "border-amber-500 bg-amber-500 text-white shadow"
                      : "border-amber-200 bg-amber-50 hover:bg-amber-100",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-3xl font-bold leading-none",
                      playing ? "text-white" : "text-amber-900",
                    ].join(" ")}
                  >
                    {glyph}
                  </span>
                  <span
                    className={[
                      "text-xs font-medium",
                      playing ? "text-white/90" : "text-amber-900/70",
                    ].join(" ")}
                  >
                    {letter.transliteration}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Tap any tile to hear that letter with the {lag.englishName} lag.
          </p>

          <audio ref={audioRef} preload="none" onEnded={() => stop()} />
        </div>

        {playAllState && onTogglePlayAll && (
          <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
            <button
              type="button"
              onClick={onTogglePlayAll}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <span aria-hidden>{playAllState.isActive ? "❚❚" : "▶"}</span>
              {playAllState.label}
            </button>
            {onRestartPlayAll && (
              <button
                type="button"
                onClick={onRestartPlayAll}
                aria-label="Restart from the beginning"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
              >
                <span aria-hidden>⏮</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
