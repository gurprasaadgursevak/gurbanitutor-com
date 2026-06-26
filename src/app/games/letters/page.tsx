import type { Metadata } from "next";
import LetterSoundBoard from "../../LetterSoundBoard";

export const metadata: Metadata = {
  title: "Gurmukhi Letters · Gurbani Tutor",
  description:
    "Tap any of the 35 Gurmukhi letters to hear the proper Painti Akhari pronunciation. Audio courtesy of Learn Shudh Gurbani by gursevak.com.",
};

export default function GurmukhiLettersPage() {
  return <LetterSoundBoard />;
}
