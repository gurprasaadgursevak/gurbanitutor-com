"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ang: number;
  maxAng: number;
  onChangeAng: (n: number) => void;
  enabled: boolean;
};

function urlForAng(n: number): string {
  return `https://media.gursevak.com/media/Sehaj_Paath_Pagewise/Sehaj_Paath_16kbps/${String(n).padStart(4, "0")}.mp3`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

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

  useEffect(() => {
    try {
      const s = parseFloat(localStorage.getItem("sehaj_speed") || "1");
      if (!Number.isNaN(s) && SPEEDS.includes(s)) setSpeed(s);
      if (localStorage.getItem("sehaj_autoadvance") === "false") setAutoAdvance(false);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("sehaj_speed", String(speed)); } catch {}
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    try { localStorage.setItem("sehaj_autoadvance", String(autoAdvance)); } catch {}
  }, [autoAdvance]);

  useEffect(() => {
    if (!audioRef.current || !enabled) return;
    const el = audioRef.current;
    // Use either the actual <audio> paused state or our own `playing` state.
    // When auto-advance fires from `onEnded`, the audio element has already
    // ended (paused = true), but `playing` stays true so the next track
    // resumes automatically.
    const intentPlaying = !el.paused || playing;
    el.pause();
    el.src = urlForAng(ang);
    el.playbackRate = speed;
    el.load();
    if (intentPlaying) el.play().catch(() => setPlaying(false));
    // Intentionally exclude `speed` and `playing` from deps — we don't want to
    // reload the file when the user just changes playback rate or pauses.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ang, enabled]);

  if (!enabled) return null;

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function onEnded() {
    if (autoAdvance && ang < maxAng) {
      // Keep `playing` true so the next-Ang load effect resumes audio.
      // Without this, the audio is "paused" (ended), `playing` would flip to
      // false, and the next track would load silent.
      setPlaying(true);
      onChangeAng(ang + 1);
    } else {
      setPlaying(false);
    }
  }

  function jumpAng() {
    const v = window.prompt(`Jump to Ang (1 to ${maxAng}):`, String(ang));
    if (v == null) return;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= maxAng) onChangeAng(n);
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
      />
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={jumpAng}
          className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          aria-label="Jump to Ang"
        >
          Ang {ang}
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm transition hover:bg-amber-700"
        >
          {loading ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          aria-label="Playback speed"
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>{s}x</option>
          ))}
        </select>

        <button
          type="button"
          role="switch"
          aria-checked={autoAdvance}
          onClick={() => setAutoAdvance((v) => !v)}
          aria-label={autoAdvance ? "Auto-advance is on" : "Auto-advance is off"}
          className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            autoAdvance
              ? "border-amber-500 bg-amber-600 text-white shadow-sm"
              : "border-slate-300 bg-white text-slate-700 hover:border-amber-400"
          }`}
        >
          <span
            aria-hidden
            className={`flex h-3.5 w-6 items-center rounded-full p-0.5 transition ${
              autoAdvance ? "bg-white/40" : "bg-slate-300"
            }`}
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full bg-white transition ${
                autoAdvance ? "translate-x-2.5" : "translate-x-0"
              }`}
            />
          </span>
          Auto
        </button>
      </div>
    </div>
  );
}
