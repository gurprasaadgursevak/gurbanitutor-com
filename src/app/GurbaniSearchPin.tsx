import Link from "next/link";

/// Pinned shortcut to /search, dropped into the top-right of every page in
/// the Read and Learn sections of the site so Sangat can jump into Gurbani
/// search from any reader without scrolling back to the nav.
export default function GurbaniSearchPin() {
  return (
    <div className="mb-4 flex justify-end">
      <Link
        href="/search"
        aria-label="Search Gurbani"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm transition hover:border-amber-500 hover:bg-amber-100"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search Gurbani
      </Link>
    </div>
  );
}
