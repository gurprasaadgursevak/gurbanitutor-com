import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SocialLinks from "../SocialLinks";

export const metadata: Metadata = {
  title: "Sri Pothi Sahib — Gurbani Tutor",
  description:
    "Free Sangat resources from the Gurbani Tutor library. Read and download Sri Sukhmani Sahib Ji, Sri Guru Granth Sahib Ji History, Balupdesh, Gareebi Pothi, and more.",
};

type Pothi = {
  title: string;
  subtitle: string;
  file: string;
  thumb: string;
  size: string;
};

const POTHIS: Pothi[] = [
  {
    title: "Sri Sukhmani Sahib Ji",
    subtitle: "The treasury of peace, with arth and Gurmukhi.",
    file: "/pothi/sri-sukhmani-sahib-ji.pdf",
    thumb: "/pothi/thumbs/sri-sukhmani-sahib-ji-thumb.jpg",
    size: "6.3 MB",
  },
  {
    title: "Sri Guru Granth Sahib Ji History",
    subtitle: "A short history of how Sri Guru Granth Sahib Ji came to be.",
    file: "/pothi/sggs-ji-history.pdf",
    thumb: "/pothi/thumbs/sggs-ji-history-thumb.jpg",
    size: "3.0 MB",
  },
  {
    title: "Character Pothi",
    subtitle: "Sangat-friendly teachings to build a Gursikh character.",
    file: "/pothi/character-pothi.pdf",
    thumb: "/pothi/thumbs/character-pothi-thumb.jpg",
    size: "4.0 MB",
  },
  {
    title: "Sloak Bhagat Kabir Sahib Ji",
    subtitle: "Sloaks of Bhagat Kabir Sahib Ji with explanation.",
    file: "/pothi/sloak-bhagat-kabir-ji.pdf",
    thumb: "/pothi/thumbs/sloak-bhagat-kabir-ji-thumb.jpg",
    size: "2.9 MB",
  },
  {
    title: "Gareebi Pothi",
    subtitle: "On humility, the cornerstone of a Sikh life.",
    file: "/pothi/gareebi-pothi.pdf",
    thumb: "/pothi/thumbs/gareebi-pothi-thumb.jpg",
    size: "2.0 MB",
  },
  {
    title: "Panj Sanskar",
    subtitle: "The five Sikh sacraments explained.",
    file: "/pothi/panj-sanskar.pdf",
    thumb: "/pothi/thumbs/panj-sanskar-thumb.jpg",
    size: "1.9 MB",
  },
  {
    title: "Sri GurBansavli",
    subtitle: "The lineage of the Guru Sahibs.",
    file: "/pothi/sri-gurbansavli.pdf",
    thumb: "/pothi/thumbs/sri-gurbansavli-thumb.jpg",
    size: "1.4 MB",
  },
  {
    title: "Q&A Pothi",
    subtitle: "Common questions on Sikhi answered.",
    file: "/pothi/qa-pothi.pdf",
    thumb: "/pothi/thumbs/qa-pothi-thumb.jpg",
    size: "1.2 MB",
  },
  {
    title: "Balupdesh",
    subtitle: "Reading lessons for new students.",
    file: "/pothi/balupdesh.pdf",
    thumb: "/pothi/thumbs/balupdesh-thumb.jpg",
    size: "0.9 MB",
  },
  {
    title: "Health Pothi (Gursevak)",
    subtitle: "Naturopathic guidance from the Sangat sevadar.",
    file: "/pothi/health-pothi.pdf",
    thumb: "/pothi/thumbs/health-pothi-thumb.jpg",
    size: "0.8 MB",
  },
];

export default function PothiPage() {
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
          <div className="text-sm font-semibold text-amber-700">
            Sri Pothi Sahib · Library
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Free Sangat Library
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Sri Pothi Sahib
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                The same pothis bundled inside the Gurbani Tutor iPhone app, also available
                here to read in your browser or download for offline study. Tilt your phone to
                landscape for a wider page.
              </p>
            </div>
            <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                <Image
                  src="/pothi/pothi-hero.jpg"
                  alt="A respected sevadar reading and revering Sangat pothis"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm italic text-slate-600">
                Pothis revered and read by the Sangat for generations.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POTHIS.map((p) => (
            <li
              key={p.file}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow"
            >
              <a
                href={p.file}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${p.title}`}
                className="relative block aspect-[3/4] w-full overflow-hidden bg-slate-100"
              >
                <Image
                  src={p.thumb}
                  alt={`First page of ${p.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              </a>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-amber-700">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm9 1.5V8h4.5L15 3.5z" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-wider">PDF · {p.size}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{p.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{p.subtitle}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <a
                    href={p.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                  >
                    Read online
                  </a>
                  <a
                    href={p.file}
                    download
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    Download
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-sm text-slate-500">
          Pothis are courtesy of the Sangat. If you spot a correction or want a pothi added,{" "}
          <a className="font-medium text-amber-700 hover:underline" href="mailto:gurprasaadgursevak@gmail.com">
            email us
          </a>
          .
        </p>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/arths" className="font-medium text-amber-700 hover:underline">
              Browse Arths
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
