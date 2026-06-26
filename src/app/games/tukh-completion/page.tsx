import type { Metadata } from "next";
import TukhCompletion from "../../TukhCompletion";

export const metadata: Metadata = {
  title: "Tukh Completion · Gurbani Tutor",
  description: "Pick the missing word in a famous Nitnem tukh.",
};

export default function Page() {
  return <TukhCompletion />;
}
