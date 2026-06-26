import type { Metadata } from "next";
import NameTheLetter from "../../NameTheLetter";

export const metadata: Metadata = {
  title: "Name the Letter · Gurbani Tutor",
  description: "See a Gurmukhi letter, pick its name from four options.",
};

export default function Page() {
  return <NameTheLetter />;
}
