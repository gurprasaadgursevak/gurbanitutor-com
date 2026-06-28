import type { Metadata } from "next";
import LetterQuiz from "../../LetterQuiz";

export const metadata: Metadata = {
  title: "Letter Quiz · Gurbani Tutor",
  description:
    "Hear a Gurmukhi letter and pick the matching letter from four options. Builds a streak as you go.",
};

export default function LetterQuizPage() {
  return <LetterQuiz />;
}
