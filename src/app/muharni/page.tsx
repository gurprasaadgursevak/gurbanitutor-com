import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Santhiya 101 · Muharni — Gurbani Tutor",
  description:
    "Learn to read Gurmukhi with Muharni and Painti Akhari lessons from @gurprasaadgursevak. The same six videos featured in the Gurbani Tutor iPhone app.",
};

const MUHARNI_VIDEOS: { id: string; title: string }[] = [
  { id: "Q9rmNdAcZ_E", title: "Sounds of Letters" },
  { id: "Nkv8P6Jf0EE", title: "Writing Tutorial" },
  { id: "sHlFfJXB5qo", title: "Vowels (Lagaan)" },
  { id: "H755C5XTHW0", title: "Nasal Sounds (Lagakhar)" },
  { id: "iCT-KqB-oSI", title: "Muharni" },
  { id: "UiePG9DUWuY", title: "Half Letters (Sanyukt Akhar)" },
];

export default function MuharniPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Santhiya 101 · Muharni</div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Santhiya 101
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Learn to read Gurbani, one letter at a time.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Painti Akhari, Muharni, and beginner santhiya lessons taught with patience and
            ucharan. Watch along here, then practice in the app.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        {/* Featured channel banner */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-red-600 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Featured channel
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Gurprasaad Gursevak on YouTube
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Santhiya, Muharni, katha, and shabad kirtan, refreshed weekly.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@gurprasaadgursevak?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* Video grid */}
        <h3 className="mt-14 text-center text-lg font-semibold text-slate-800">
          Painti Akhari & Muharni lessons
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
          These six videos also open inside the Gurbani Tutor iPhone app under the Muharni tile.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MUHARNI_VIDEOS.map((v) => (
            <div
              key={v.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-video w-full bg-slate-900">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="px-4 py-3 text-sm font-medium text-slate-700">{v.title}</p>
            </div>
          ))}
        </div>

        {/* Full playlist */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href="https://www.youtube.com/playlist?list=PLtSa45TBwsnXpmcvmfpwcLkZtsZeV-uVM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            View the full Muharni playlist on YouTube
          </a>
          <p className="text-xs text-slate-500">
            Looking for one-on-one teaching? Join{" "}
            <Link href="/santhiya" className="font-medium text-amber-700 hover:underline">
              Santhiya Classes
            </Link>
            .
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/santhiya" className="font-medium text-amber-700 hover:underline">
              Santhiya classes
            </Link>
            {" · "}
            <a
              href="https://instagram.com/gurbanitutor"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 hover:underline"
            >
              Instagram @GurbaniTutor
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
