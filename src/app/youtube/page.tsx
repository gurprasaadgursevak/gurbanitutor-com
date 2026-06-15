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

type FeaturedItem = {
  videoId: string;
  playlistId?: string;
  title: string;
  subtitle: string;
  badge: string;
};

const FEATURED: FeaturedItem[] = [
  {
    videoId: "Q9rmNdAcZ_E",
    title: "Painti Akhari · Sounds of Letters",
    subtitle: "The 35 letters of Gurmukhi with correct ucharan.",
    badge: "Video",
  },
  {
    videoId: "Q9rmNdAcZ_E",
    playlistId: "PLtSa45TBwsnXpmcvmfpwcLkZtsZeV-uVM",
    title: "Painti Akhari & Muharni playlist",
    subtitle: "Six lessons that power Santhiya 101 inside Gurbani Tutor.",
    badge: "Playlist · 6 videos",
  },
  {
    videoId: "d53tPerszMk",
    playlistId: "PLtSa45TBwsnXnrvXN6bkpn9TRDzw3CTX4",
    title: "Nitnem Santhiya playlist",
    subtitle: "Recite one word behind the sevadar to settle ucharan.",
    badge: "Playlist",
  },
  {
    videoId: "c3nO78d0_Kk",
    playlistId: "PLtSa45TBwsnWrCXbKRNjxUDv-dB0gDuXX",
    title: "Sri Guru Granth Sahib Ji Santhiya playlist",
    subtitle: "Ang by Ang reading and ucharan from the sevadar.",
    badge: "Playlist",
  },
];

function youTubeUrl({ videoId, playlistId }: FeaturedItem): string {
  if (playlistId) {
    return `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function thumbUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

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

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Featured list */}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Watch on YouTube
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          A curated start from{" "}
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-red-700 hover:underline"
          >
            @gurprasaadgursevak
          </a>
          . Each link opens on YouTube.
        </p>
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {FEATURED.map((item, i) => (
            <li key={`${item.videoId}-${i}`}>
              <a
                href={youTubeUrl(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-stretch gap-4 p-3 transition hover:bg-amber-50 sm:p-4"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-32 flex-none overflow-hidden rounded-xl bg-slate-900 sm:w-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbUrl(item.videoId)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>
                {/* Text */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                    {item.badge}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
                <span aria-hidden className="self-center text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-amber-700">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Topics */}
        <h2 className="mt-16 text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          What you&apos;ll find on the channel
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TOPICS.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.body}</p>
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
