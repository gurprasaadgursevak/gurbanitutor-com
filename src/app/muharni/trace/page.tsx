"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Letter = { g: string; name: string; tr: string };

const LETTERS: Letter[] = [
  { g: "ੳ", name: "ਊੜਾ", tr: "Oora" },
  { g: "ਅ", name: "ਐੜਾ", tr: "Aira" },
  { g: "ੲ", name: "ਈੜੀ", tr: "Eeri" },
  { g: "ਸ", name: "ਸੱਸਾ", tr: "Sassa" },
  { g: "ਹ", name: "ਹਾਹਾ", tr: "Haha" },
  { g: "ਕ", name: "ਕੱਕਾ", tr: "Kakka" },
  { g: "ਖ", name: "ਖੱਖਾ", tr: "Khakkha" },
  { g: "ਗ", name: "ਗੱਗਾ", tr: "Gagga" },
  { g: "ਘ", name: "ਘੱਘਾ", tr: "Ghagga" },
  { g: "ਙ", name: "ਙੰਙਾ", tr: "Nganga" },
  { g: "ਚ", name: "ਚੱਚਾ", tr: "Chachcha" },
  { g: "ਛ", name: "ਛੱਛਾ", tr: "Chhachha" },
  { g: "ਜ", name: "ਜੱਜਾ", tr: "Jajja" },
  { g: "ਝ", name: "ਝੱਜਾ", tr: "Jhajja" },
  { g: "ਞ", name: "ਞੰਞਾ", tr: "Nyanya" },
  { g: "ਟ", name: "ਟੈਂਕਾ", tr: "Tainka" },
  { g: "ਠ", name: "ਠੱਠਾ", tr: "Thaththa" },
  { g: "ਡ", name: "ਡੱਡਾ", tr: "Dadda" },
  { g: "ਢ", name: "ਢੱਡਾ", tr: "Dhadda" },
  { g: "ਣ", name: "ਣਾਣਾ", tr: "Nanna" },
  { g: "ਤ", name: "ਤੱਤਾ", tr: "Tatta" },
  { g: "ਥ", name: "ਥੱਥਾ", tr: "Thatha" },
  { g: "ਦ", name: "ਦੱਦਾ", tr: "Dada" },
  { g: "ਧ", name: "ਧੱਦਾ", tr: "Dhada" },
  { g: "ਨ", name: "ਨੱਨਾ", tr: "Nana" },
  { g: "ਪ", name: "ਪੱਪਾ", tr: "Pappa" },
  { g: "ਫ", name: "ਫੱਫਾ", tr: "Phappha" },
  { g: "ਬ", name: "ਬੱਬਾ", tr: "Babba" },
  { g: "ਭ", name: "ਭੱਬਾ", tr: "Bhabba" },
  { g: "ਮ", name: "ਮੰਮਾ", tr: "Mamma" },
  { g: "ਯ", name: "ਯਯਾ", tr: "Yaya" },
  { g: "ਰ", name: "ਰਾਰਾ", tr: "Rara" },
  { g: "ਲ", name: "ਲੱਲਾ", tr: "Lalla" },
  { g: "ਵ", name: "ਵਾਵਾ", tr: "Vava" },
  { g: "ੜ", name: "ੜਾੜਾ", tr: "Rarra" },
];

const W = 320;
const H = 360;
const BRUSH = 26;
const THRESHOLD = 0.7;
const FONT = 'bold 260px "Noto Sans Gurmukhi", "GuruGranthUni", sans-serif';

export default function GurmukhiTracePage() {
  const [index, setIndex] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [done, setDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const coveredRef = useRef<Set<number>>(new Set());
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const doneRef = useRef(false);

  const letter = LETTERS[index];

  const setup = useCallback((glyph: string) => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Offscreen mask to find the letter's ink pixels.
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.fillStyle = "#000";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font = FONT;
    octx.fillText(glyph, W / 2, H / 2);
    const data = octx.getImageData(0, 0, W, H).data;
    const targets: { x: number; y: number }[] = [];
    const step = 8;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 64) targets.push({ x, y });
      }
    }
    targetsRef.current = targets;
    coveredRef.current = new Set();
    doneRef.current = false;

    // Faint guide letter on the visible canvas.
    ctx.fillStyle = "rgba(30, 64, 175, 0.16)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = FONT;
    ctx.fillText(glyph, W / 2, H / 2);

    setCoverage(0);
    setDone(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        // Ensure the Gurmukhi font is ready before measuring/rendering.
        const anyDoc = document as unknown as { fonts?: { load: (s: string) => Promise<unknown> } };
        await anyDoc.fonts?.load('bold 260px "Noto Sans Gurmukhi"');
      } catch {
        /* ignore */
      }
      if (!cancelled) setup(letter.g);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [letter.g, setup]);

  function markCovered(px: number, py: number) {
    const targets = targetsRef.current;
    const covered = coveredRef.current;
    const r2 = BRUSH * BRUSH;
    for (let i = 0; i < targets.length; i++) {
      if (covered.has(i)) continue;
      const dx = targets[i].x - px;
      const dy = targets[i].y - py;
      if (dx * dx + dy * dy <= r2) covered.add(i);
    }
  }

  function coverSegment(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.round(dist / 6));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      markCovered(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }
  }

  function report() {
    const total = targetsRef.current.length || 1;
    const frac = coveredRef.current.size / total;
    setCoverage(frac);
    if (!doneRef.current && frac >= THRESHOLD) {
      doneRef.current = true;
      setDone(true);
    }
  }

  function toPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function inkTo(p: { x: number; y: number }) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "rgba(217, 119, 6, 0.6)";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = toPoint(e);
    last.current = p;
    markCovered(p.x, p.y);
    report();
  }
  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    e.preventDefault();
    const p = toPoint(e);
    inkTo(p);
    if (last.current) coverSegment(last.current, p);
    last.current = p;
    report();
  }
  function onUp() {
    drawing.current = false;
    last.current = null;
  }

  const go = (delta: number) => {
    const n = index + delta;
    if (n >= 0 && n < LETTERS.length) setIndex(n);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-3xl px-6 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Santhiya 101</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Gurmukhi Trace
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-700">
            Trace along the centre of each letter with your finger or mouse to fill it in.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-md px-6 pb-16 pt-2">
        <div className="rounded-3xl border border-amber-200 bg-white p-5 text-center shadow-sm">
          <p lang="pa" className="text-2xl font-semibold text-blue-900">
            {letter.name}
          </p>
          <p className="text-sm text-slate-600">{letter.tr}</p>

          <div className="relative mx-auto mt-4 w-[320px] max-w-full">
            <canvas
              ref={canvasRef}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onPointerLeave={onUp}
              className="touch-none mx-auto block rounded-2xl border border-slate-200 bg-white"
              style={{ width: 320, height: 360 }}
            />
            {done && (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-blue-900 shadow ring-1 ring-emerald-300">
                  Gurprasaad, well done!
                </span>
              </div>
            )}
          </div>

          <div className="mx-auto mt-3 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${Math.min(coverage / THRESHOLD, 1) * 100}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              className="h-11 w-11 rounded-full bg-amber-100 text-lg text-amber-700 disabled:opacity-30"
              aria-label="Previous letter"
            >
              ‹
            </button>
            <button
              onClick={() => setup(letter.g)}
              className="rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-amber-700"
            >
              Redo
            </button>
            {index === LETTERS.length - 1 ? (
              <button
                onClick={() => setIndex(0)}
                className="h-11 w-11 rounded-full bg-amber-100 text-lg text-amber-700"
                aria-label="Back to first letter"
              >
                ⤒
              </button>
            ) : (
              <button
                onClick={() => go(1)}
                className="h-11 w-11 rounded-full bg-amber-100 text-lg text-amber-700"
                aria-label="Next letter"
              >
                ›
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Letter {index + 1} of {LETTERS.length}
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link href="/muharni" className="font-medium text-amber-700 hover:underline">
            Back to Santhiya 101
          </Link>
        </p>
      </main>
    </div>
  );
}
