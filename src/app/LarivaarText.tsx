"use client";

import React from "react";

/// Renders a Gurmukhi tukh, optionally in Larivaar style — spaces removed
/// (words flow together) with each word that precedes a pause mark coloured
/// to telegraph the pause length:
///   `;` green (long pause), `,` orange (medium pause), `.` red (short pause).
///
/// Mirrors the iOS reader's `larivaarAttributed(_:)` in GurbaniFont.swift so
/// the two platforms paint the same vishrams the same way.

type Word = { text: string; color: string | null };

const PAUSE_COLOR: Record<string, string> = {
  ";": "#16a34a",  // green
  ",": "#ea580c",  // orange
  ".": "#dc2626",  // red
};

function tokenize(tukh: string): Word[] {
  const words: Word[] = [];
  let current = "";
  let color: string | null = null;
  const flush = () => {
    if (current.length > 0) words.push({ text: current, color });
    current = "";
    color = null;
  };
  for (const ch of tukh) {
    if (ch === " ") {
      flush();
    } else if (PAUSE_COLOR[ch]) {
      color = PAUSE_COLOR[ch];
      flush();
    } else {
      current += ch;
    }
  }
  flush();
  return words;
}

export default function LarivaarText({ text, enabled }: { text: string; enabled: boolean }) {
  if (!enabled) return <>{text}</>;
  const words = tokenize(text);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} style={w.color ? { color: w.color } : undefined}>
          {w.text}
        </span>
      ))}
    </>
  );
}
