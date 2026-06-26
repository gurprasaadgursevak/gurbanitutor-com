import type { Metadata } from "next";
import FirstLetterMatch from "../../FirstLetterMatch";

export const metadata: Metadata = {
  title: "First Letter Match · Gurbani Tutor",
  description: "Four Gurbani words, pick the one starting with the given letter.",
};

export default function Page() {
  return <FirstLetterMatch />;
}
