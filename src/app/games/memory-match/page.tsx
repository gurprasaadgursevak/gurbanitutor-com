import type { Metadata } from "next";
import MemoryMatch from "../../MemoryMatch";

export const metadata: Metadata = {
  title: "Memory Match · Gurbani Tutor",
  description: "Flip cards to match Gurbani words with their English meanings.",
};

export default function Page() {
  return <MemoryMatch />;
}
