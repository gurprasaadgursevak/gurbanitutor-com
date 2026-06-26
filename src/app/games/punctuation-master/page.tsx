import type { Metadata } from "next";
import PunctuationMaster from "../../PunctuationMaster";

export const metadata: Metadata = {
  title: "Punctuation Master · Gurbani Tutor",
  description: "Add the right , ; . ॥ to a Gurbani line.",
};

export default function Page() {
  return <PunctuationMaster />;
}
