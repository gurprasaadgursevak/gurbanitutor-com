import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

/// Global site header rendered on every page via the root layout. Gives each
/// page a consistent way home plus the full Read / Learn / Games / Search /
/// About navigation, so no page (especially the games) is a dead end.
///
/// Sticky so the nav is always one tap away while scrolling long readers and
/// lists. The MobileNav drawer anchors to `top-[64px]`, matching this bar's
/// height.
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-amber-700"
        >
          Gurbani Tutor
        </Link>
        <div className="flex items-end gap-2">
          <MobileNav />
          <DesktopNav />
        </div>
      </div>
    </header>
  );
}
