import type { Metadata } from "next";
import BaniIdentifier from "../../BaniIdentifier";

export const metadata: Metadata = {
  title: "Bani Identifier · Gurbani Tutor",
  description: "Read a tukh, pick which bani it is from.",
};

export default function Page() {
  return <BaniIdentifier />;
}
