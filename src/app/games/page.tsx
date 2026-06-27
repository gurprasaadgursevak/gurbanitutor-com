import Link from "next/link";
import type { Metadata } from "next";
import LetterSoundBoard from "../LetterSoundBoard";
import MuharniSoundBoard from "../MuharniSoundBoard";

export const metadata: Metadata = {
  title: "Games · Gurbani Tutor",
  description:
    "Games for kids and Sangat to make Brahamvidya learning fun and easy. Organized by skill level: Beginner, Intermediate, Advanced.",
};

type GameTile = { href: string; title: string; body: string };

const BEGINNER: GameTile[] = [
  { href: "/games/letters", title: "Gurmukhi Letters", body: "Tap any of the 35 letters to hear the pronunciation." },
  { href: "/games/muharni", title: "Muharni Sound Board", body: "Tap a row to hear the full chant for that consonant." },
  { href: "/games/quiz", title: "Letter Quiz", body: "Hear a letter, pick the matching Gurmukhi from four options." },
  { href: "/games/name-the-letter", title: "Name the Letter", body: "See a Gurmukhi letter, pick its English name from four options." },
];

const INTERMEDIATE: GameTile[] = [
  { href: "/games/first-letter-match", title: "First Letter Match", body: "See a letter name, pick the Gurbani word that starts with it." },
  { href: "/games/memory-match", title: "Memory Match", body: "Pair Gurbani words with their English meanings. Beat your fastest time." },
  { href: "/games/akhar-sound-race", title: "Akhar Sound Race", body: "Hear three letters in order, then tap them in the same order." },
  { href: "/games/gurbani-scrabble", title: "Gurbani Scrabble", body: "Spell the Gurbani word for a meaning, using scrambled tiles." },
];

const ADVANCED: GameTile[] = [
  { href: "/games/tukh-completion", title: "Tukh Completion", body: "Pick the missing word in a famous Nitnem tukh, or the odd-one-out for Jaap Sahib." },
  { href: "/games/bani-identifier", title: "Bani Identifier", body: "Read a tukh, pick which bani it is from. 230+ lines across 14 banis." },
  { href: "/games/sentence-unscramble", title: "Sentence Unscramble", body: "Tap words to put a Gurbani line back in order." },
  { href: "/games/punctuation-master", title: "Punctuation Master", body: "Add the right , ; . ॥ to a Gurbani line." },
];

export default function GamesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-amber-800">Games</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Games for kids and Sangat to make Brahamvidya learning fun and easy.
        Audio courtesy of Learn Shudh Gurbani by gursevak.com.
      </p>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-2 sm:p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          Featured · 35 Letters
        </p>
        <LetterSoundBoard lessonMode />
      </section>

      <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-2 sm:p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          Featured · Muharni
        </p>
        <MuharniSoundBoard />
      </section>

      <SkillSection title="Beginner" subtitle="Best for kids and Sangat just starting Gurmukhi." games={BEGINNER} />
      <SkillSection title="Intermediate" subtitle="For Sangat building vocabulary and faster recognition." games={INTERMEDIATE} />
      <SkillSection title="Advanced" subtitle="For Sangat fluent in Gurbani." games={ADVANCED} />
    </main>
  );
}

function SkillSection({ title, subtitle, games }: { title: string; subtitle: string; games: GameTile[] }) {
  return (
    <section className="mt-7">
      <h2 className="text-lg font-bold text-amber-800">{title}</h2>
      <p className="mt-1 text-xs text-amber-900/70">{subtitle}</p>
      <ul className="mt-3 space-y-2.5">
        {games.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="block rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:bg-amber-100"
            >
              <div className="text-base font-bold text-amber-900">{g.title}</div>
              <div className="mt-1 text-sm text-amber-900/80">{g.body}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
