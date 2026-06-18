"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ang: number;
  maxAng: number;
  onChangeAng: (n: number) => void;
  enabled: boolean; // only show for SGGS granth selection
};

// gursevak.com Sehaj Paath audio bank — 16kbps mono, one MP3 per Ang.
function urlForAng(n: number): string {
  const padded = String(n).padStart(4, "0");
  return `https://media.gursevak.com/media/Sehaj_Paath_Pagewise/Sehaj_Paath_16kbps/${padded}.mp3`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export default function SehajPaathPlayer({
  ang,
  maxAng,
  onChangeAng,
  enabled,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore persistent prefs on mount.
  useEffect(() => {
    try {
      const s = parseFloat(localStorage.getItem("sehaj_speed") || "1");
      if (!Number.isNaN(s) && SPEEDS.includes(s)) setSpeed(s);
      const a = localStorage.getItem("sehaj_autoadvance");
      if (a === "false") setAutoAdvance(false);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sehaj_speed", String(speed));
    } catch {}
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    try {
      localStorage.setItem("sehaj_autoadvance", String(autoAdvance));
    } catch {}
  }, [autoAdvance]);

  // When the Ang changes from above, load the new src. Continue playing if the
  // user was already in a paath flow.
  useEffect(() => {
    if (!audioRef.current || !enabled) return;
    const el = audioRef.current;
    const wasPlaying = !el.paused;
    el.src = urlForAng(ang);
    el.playbackRate = speed;
    el.load();
    setError(null);
    if (wasPlaying) {
      el.play().catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setPlaying(false);
      });
    }
  }, [ang, enabled, speed]);

  if (!enabled) return null;

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          setError(err instanceof Error ? err.message : String(err));
          setPlaying(false);
        });
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function onEnded() {
    if (autoAdvance && ang < maxAng) {
      onChangeAng(ang + 1);
    } else {
      setPlaying(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-amber-200 bg-white/95 backdrop-blur">
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={onEnded}
        onError={() => setError("Could not load audio for this Ang.")}
      />
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={() => ang > 1 && onChangeAng(ang - 1)}
          disabled={ang <= 1}
          aria-label="Previous Ang"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm transition hover:bg-amber-700"
        >
          {loading ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : playing ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => ang < maxAng && onChangeAng(ang + 1)}
          disabled={ang >= maxAng}
          aria-label="Next Ang"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="flex-1 truncate">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Sehaj Paath
          </div>
          <div className="text-sm font-semibold text-slate-900">
            Ang {ang}
            {error && (
              <span className="ml-2 text-xs font-normal text-red-700">{error}</span>
            )}
          </div>
        </div>

        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          aria-label="Playback speed"
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>

        <label className="hidden items-center gap-1.5 text-xs text-slate-700 sm:flex">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          Auto-advance
        </label>
      </div>
    </div>
  );
}
