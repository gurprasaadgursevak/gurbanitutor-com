import type { Metadata } from "next";
import AkharSoundRace from "../../AkharSoundRace";

export const metadata: Metadata = {
  title: "Akhar Sound Race · Gurbani Tutor",
  description: "Hear three letters in order, then tap them in the same order.",
};

export default function Page() {
  return <AkharSoundRace />;
}
