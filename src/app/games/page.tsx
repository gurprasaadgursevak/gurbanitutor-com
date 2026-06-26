import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games · Gurbani Tutor",
  description:
    "Games for kids to make Brahamvidya learning fun and easy. Includes the Gurmukhi Letters sound board, Muharni sound board, and Letter Quiz.",
};

const games = [
  {
    href: "/games/letters",
    title: "Gurmukhi Letters",
    body: "Tap any of the 35 Gurmukhi letters to hear the proper pronunciation.",
  },
  {
    href: "/games/muharni",
    title: "Muharni",
    body: "Tap a consonant to hear it chanted through all 12 lagaan (e.g. ਸ ਸਾ ਸਿ ਸੀ).",
  },
  {
    href: "/games/quiz",
    title: "Letter Quiz",
    body: "Hear a random Gurmukhi letter and pick the matching letter from four options. Builds a streak.",
  },
];

export default function GamesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-amber-800">Games</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Games for kids to make Brahamvidya learning fun and easy. Audio courtesy
        of Learn Shudh Gurbani by gursevak.com.
      </p>

      <ul className="mt-6 space-y-3">
        {games.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="block rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:bg-amber-100"
            >
              <div className="text-lg font-bold text-amber-900">{g.title}</div>
              <div className="mt-1 text-sm text-amber-900/80">{g.body}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
