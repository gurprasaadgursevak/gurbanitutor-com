"use client";

import { useEffect, useRef, useState } from "react";
import {
  muharniLags,
  isValidCombo,
  glyphFor,
  clipUrlFor,
  vowelForms,
  type MuharniLetter,
} from "./muharniLetters";

/// Primer sheet for a single Painti Akhari letter. Shows all 12 lag forms
/// in a 3×4 grid. Tapping a tile plays the individual lag clip. Greyed
/// tiles are linguistically invalid for the carrier letters (ੳ ਅ ੲ).
///
/// Mirrors iOS `MuharniPrimerSheet.swift`.

interface Props {
  letter: MuharniLetter | null;
  /// When non-null, the sheet shows the combined Vowels primer card
  /// (10 standalone vowel forms across ੳ ਅ ੲ). Mutually exclusive with `letter`.
  vowels?: boolean;
  onClose: () => void;
}

export default function MuharniPrimerSheet({ letter, vowels, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingKey, setNowPlayingKey] = useState<string | null>(null);

  function stop() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingKey(null);
  }

  function playClip(letterId: string, lagId: string) {
    const el = audioRef.current;
    if (!el) return;
    el.src = clipUrlFor(letterId, lagId as Parameters<typeof clipUrlFor>[1]);
    el.currentTime = 0;
    void el.play();
    setNowPlayingKey(`${lagId}_${letterId}`);
  }

  useEffect(() => () => stop(), []);

  const visible = vowels || letter !== null;
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            {vowels ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Vowels primer
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  ੳ ਅ ੲ · Standalone vowel forms
                </h2>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  {letter?.transliteration}
                </p>
                <h2 className="mt-1 text-3xl font-semibold text-slate-900">
                  <span className="font-bold text-amber-700">{letter?.baseGlyph}</span>{" "}
                  <span className="text-base font-normal text-slate-600">{letter?.punjabiName}</span>
                </h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Done
          </button>
        </div>

        {/* Grid */}
        {vowels ? (
          <VowelsGrid
            nowPlayingKey={nowPlayingKey}
            onPlay={(letterId, lagId) => playClip(letterId, lagId)}
          />
        ) : (
          <LagGrid
            letter={letter!}
            nowPlayingKey={nowPlayingKey}
            onPlay={(lagId) => playClip(letter!.id, lagId)}
          />
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          Tap any tile to hear that sound. {vowels ? "" : "Greyed tiles aren't used for this letter."}
        </p>

        <audio ref={audioRef} preload="none" onEnded={() => stop()} />
      </div>
    </div>
  );
}

function LagGrid({
  letter,
  nowPlayingKey,
  onPlay,
}: {
  letter: MuharniLetter;
  nowPlayingKey: string | null;
  onPlay: (lagId: string) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
      {muharniLags.map((lag) => {
        const isValid = isValidCombo(lag.id, letter.id);
        const glyph = glyphFor(letter.id, lag.id);
        const key = `${lag.id}_${letter.id}`;
        const playing = nowPlayingKey === key;
        const baseClasses = "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition";
        const stateClasses = !isValid
          ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
          : playing
            ? "border-amber-500 bg-amber-500 text-white shadow"
            : "border-amber-200 bg-amber-50 hover:bg-amber-100";
        return (
          <button
            key={lag.id}
            type="button"
            disabled={!isValid}
            onClick={() => isValid && onPlay(lag.id)}
            className={[baseClasses, stateClasses].join(" ")}
          >
            <span
              className={[
                "text-3xl font-bold leading-none",
                playing ? "text-white" : isValid ? "text-amber-900" : "text-slate-400",
              ].join(" ")}
            >
              {glyph}
            </span>
            <span
              className={[
                "text-xs font-medium",
                playing ? "text-white/90" : isValid ? "text-amber-900/70" : "text-slate-400",
              ].join(" ")}
            >
              {lag.englishName}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function VowelsGrid({
  nowPlayingKey,
  onPlay,
}: {
  nowPlayingKey: string | null;
  onPlay: (carrierId: string, lagId: string) => void;
}) {
  const groups = [
    { id: "oora", title: "ੳ Oora forms" },
    { id: "aira", title: "ਅ Aira forms" },
    { id: "eeri", title: "ੲ Eeri forms" },
  ];
  return (
    <div className="mt-5 space-y-4">
      {groups.map((g) => {
        const items = vowelForms.filter((f) => f.carrierId === g.id);
        return (
          <div key={g.id}>
            <p className="text-sm font-semibold text-slate-600">{g.title}</p>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((form) => {
                const key = `${form.lag}_${form.carrierId}`;
                const playing = nowPlayingKey === key;
                const glyph = glyphFor(form.carrierId, form.lag);
                const lagName = muharniLags.find((l) => l.id === form.lag)?.englishName ?? "";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onPlay(form.carrierId, form.lag)}
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
                      {lagName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
