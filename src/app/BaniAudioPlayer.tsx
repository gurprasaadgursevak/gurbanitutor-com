"use client";

import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3] as const;
const STORAGE_KEY = "bani_audio_speed";

function formatSpeed(s: number): string {
  return Number.isInteger(s) ? `${s}` : `${s}`;
}

/// Bani audio player for /granth. Wraps the native HTML5 audio element with
/// a persisted playback-speed picker so Sangat can match the iOS app's
/// 0.5x–3x range. Speed lives in localStorage under `bani_audio_speed` so it
/// follows them across visits.
export default function BaniAudioPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState<number>(1);

  // Restore the persisted speed once on mount, then keep the audio element in
  // sync whenever it changes.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? Number(raw) : NaN;
      if (!Number.isNaN(parsed) && SPEEDS.includes(parsed as (typeof SPEEDS)[number])) {
        setSpeed(parsed);
      }
    } catch {
      // Private mode / disabled storage; default 1x stays.
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
    try {
      localStorage.setItem(STORAGE_KEY, String(speed));
    } catch {
      // ignore
    }
  }, [speed]);

  return (
    <div className="mt-3 rounded-2xl border border-amber-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
          Audio · {title}
        </p>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
          <span className="sr-only">Playback speed</span>
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900 focus:border-amber-500 focus:outline-none"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {formatSpeed(s)}x
              </option>
            ))}
          </select>
        </label>
      </div>
      <audio
        ref={audioRef}
        controls
        preload="none"
        className="w-full"
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
