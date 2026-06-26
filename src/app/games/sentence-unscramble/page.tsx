import type { Metadata } from "next";
import SentenceUnscramble from "../../SentenceUnscramble";

export const metadata: Metadata = {
  title: "Sentence Unscramble · Gurbani Tutor",
  description: "Tap words to put a Gurbani line back in order.",
};

export default function Page() {
  return <SentenceUnscramble />;
}
