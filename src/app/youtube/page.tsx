import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gurprasaad Gursevak on YouTube — Gurbani Tutor",
  description:
    "Subscribe to the Gurprasaad Gursevak YouTube channel for Santhiya, Muharni, katha, and shabad kirtan from the Sangat sevadar.",
};

const CHANNEL_URL =
  "https://www.youtube.com/@gurprasaadgursevak?sub_confirmation=1";

const MUHARNI_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLtSa45TBwsnXpmcvmfpwcLkZtsZeV-uVM";

const TOPICS = [
  {
    title: "Santhiya & Muharni",
    body: "Beginner Painti Akhari, Muharni, and ucharan lessons for new readers of Gurmukhi.",
  },
  {
    title: "Katha",
    body: "Reflective discourses on Gurbani, Sikh history, and daily Gurmat living.",
  },
  {
    title: "Shabad Kirtan",
    body: "Soulful kirtan recordings, refreshed regularly for sangat listening.",
  },
];

export default function YouTubePage() {
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
          <div className="text-sm font-semibold text-red-700">
            YouTube · Gurprasaad Gursevak
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-red-700">
            YouTube channel
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Gurprasaad Gursevak
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Santhiya, Muharni, katha, and shabad kirtan from a Sangat sevadar, refreshed
            weekly. The same teacher whose Muharni videos power Santhiya 101 inside Gurbani
            Tutor.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Subscribe on YouTube
            </a>
            <a
              href={MUHARNI_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              View Muharni playlist
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        {/* Topics */}
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          What you&apos;ll find on the channel
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TOPICS.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.body}</p>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <Link
            href="/muharni"
            className="group rounded-2xl border border-amber-200 bg-amber-50 p-6 transition hover:border-amber-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Learn here
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">
              Santhiya 101 lessons
              <span aria-hidden className="ml-2 inline-block text-amber-600 transition group-hover:translate-x-0.5">→</span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Six Muharni videos embedded here on Gurbani Tutor, ready to watch and practice.
            </p>
          </Link>
          <Link
            href="/santhiya"
            className="group rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition hover:border-emerald-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Practice one-on-one
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">
              Santhiya Classes
              <span aria-hidden className="ml-2 inline-block text-emerald-600 transition group-hover:translate-x-0.5">→</span>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Get matched with a sevadar teacher in the WhatsApp Santhiya group, free and worldwide.
            </p>
          </Link>
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
            <Link href="/muharni" className="font-medium text-amber-700 hover:underline">
              Santhiya 101
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
