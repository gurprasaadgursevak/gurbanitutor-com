import type { Metadata } from "next";
import GurbaniScrabble from "../../GurbaniScrabble";

export const metadata: Metadata = {
  title: "Gurbani Scrabble · Gurbani Tutor",
  description: "Spell the Gurbani word for a meaning, using scrambled tiles.",
};

export default function Page() {
  return <GurbaniScrabble />;
}
