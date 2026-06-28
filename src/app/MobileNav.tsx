"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavLink = {
  href: string;
  label: string;
  accent?: "amber" | "emerald" | "red";
};

const LINKS: NavLink[] = [
  { href: "/search", label: "Gurbani Search" },
  { href: "/games/letters", label: "Gurmukhi Letters" },
  { href: "/games/muharni", label: "Muharni" },
  { href: "/arths", label: "Arths · Vocab", accent: "amber" },
  { href: "/quiz", label: "Gurbani Quiz" },
  { href: "/shabad-test", label: "Shabad Test" },
  { href: "/granth", label: "Read Gurbani" },
  { href: "/banis", label: "Banis" },
  { href: "/mukhvak", label: "Sri Mukhvak" },
  { href: "/gareebi-pothi", label: "Gareebi Pothi" },
  { href: "/pothi", label: "Pothi Sahib" },
  { href: "/games", label: "Games" },
  { href: "/games/quiz", label: "Letter Quiz" },
  { href: "/games/name-the-letter", label: "Name the Letter" },
  { href: "/games/first-letter-match", label: "First Letter Match" },
  { href: "/games/memory-match", label: "Memory Match" },
  { href: "/games/akhar-sound-race", label: "Akhar Sound Race" },
  { href: "/games/gurbani-scrabble", label: "Gurbani Scrabble" },
  { href: "/games/tukh-completion", label: "Tukh Completion" },
  { href: "/games/bani-identifier", label: "Bani Identifier" },
  { href: "/games/sentence-unscramble", label: "Sentence Unscramble" },
  { href: "/games/punctuation-master", label: "Punctuation Master" },
  { href: "/about", label: "About" },
  { href: "/santhiya", label: "Santhiya Classes", accent: "emerald" },
  { href: "/muharni", label: "Santhiya 101", accent: "red" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition active:bg-slate-100"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`fixed inset-x-0 top-[64px] z-50 origin-top transform border-b border-amber-100 bg-white shadow-lg transition ${
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
        role="dialog"
        aria-label="Site navigation"
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
          {LINKS.map((link) => {
            const base =
              "flex min-h-[44px] items-center rounded-md px-3 text-base font-medium";
            const accent =
              link.accent === "amber"
                ? "text-amber-700"
                : link.accent === "emerald"
                  ? "text-emerald-700"
                  : link.accent === "red"
                    ? "text-red-700"
                    : "text-slate-800";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${base} ${accent} hover:bg-amber-50`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
