import type { Metadata } from "next";
import MuharniSoundBoard from "../../MuharniSoundBoard";

export const metadata: Metadata = {
  title: "Muharni · Gurbani Tutor",
  description:
    "Practise Muharni one consonant at a time. Tap any letter to hear all 12 lagaan chanted.",
};

export default function MuharniGamePage() {
  return <MuharniSoundBoard />;
}
