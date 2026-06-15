import Link from "next/link";
import type { Metadata } from "next";
import PaintiViewer from "../PaintiViewer";

export const metadata: Metadata = {
  title: "Santhiya 101 · Your journey — Gurbani Tutor",
  description:
    "A step-by-step Santhiya journey: Painti Akhari, Balupdesh, Muharni, Nitnem Santhiya, Sri Guru Granth Sahib Ji Santhiya, and one-on-one classes.",
};

const MUHARNI_VIDEOS: { id: string; title: string }[] = [
  { id: "Q9rmNdAcZ_E", title: "Sounds of Letters" },
  { id: "Nkv8P6Jf0EE", title: "Writing Tutorial" },
  { id: "sHlFfJXB5qo", title: "Vowels (Lagaan)" },
  { id: "H755C5XTHW0", title: "Nasal Sounds (Lagakhar)" },
  { id: "iCT-KqB-oSI", title: "Muharni" },
  { id: "UiePG9DUWuY", title: "Half Letters (Sanyukt Akhar)" },
];

const NITNEM_VIDEO_ID = "d53tPerszMk";
const NITNEM_PLAYLIST_ID = "PLtSa45TBwsnXnrvXN6bkpn9TRDzw3CTX4";
const SGGS_VIDEO_ID = "c3nO78d0_Kk";
const SGGS_PLAYLIST_ID = "PLtSa45TBwsnWrCXbKRNjxUDv-dB0gDuXX";

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-600 text-sm font-semibold text-white shadow-sm">
      {n}
    </span>
  );
}

function StepHeader({ n, title, kicker }: { n: number; title: string; kicker?: string }) {
  return (
    <div className="flex items-start gap-3">
      <StepBadge n={n} />
      <div>
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            {kicker}
          </p>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

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
          <div className="text-sm font-semibold text-amber-700">Santhiya 101 · Your journey</div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Santhiya 101
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Your Santhiya journey, step by step.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700">
            A guided path for Sangat Ji, from the very first letter of Gurmukhi all the way to
            Sri Guru Granth Sahib Ji Santhiya. Take your time, take your seva.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 pb-16 pt-4">
        {/* Step 1 — Painti Akhari */}
        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <StepHeader n={1} kicker="Prerequisite · Painti Akhari" title="Learn the 35 letters" />
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Swipe through each letter of Gurmukhi. Watch the &ldquo;Sounds of Letters&rdquo; video
            from <span className="font-semibold">Gurprasaad Gursevak</span> on YouTube to practice
            each ucharan.
          </p>
          <div className="mt-5">
            <PaintiViewer />
          </div>
        </section>

        {/* Step 2 — Balupdesh + Muharni */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <StepHeader n={2} kicker="Prerequisite · Reading practice" title="Read Balupdesh and learn Muharni" />
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Read <span className="font-semibold">Balupdesh</span> alongside the Muharni and
            Painti Akhari video lessons. These build the foundation for Santhiya.
          </p>

          {/* Balupdesh */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Reading
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Balupdesh · Reading lessons for new students
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/pothi/balupdesh.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                Read Balupdesh
              </a>
              <a
                href="/pothi/balupdesh.pdf"
                download
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Download
              </a>
            </div>
          </div>

          {/* Muharni videos */}
          <h3 className="mt-8 text-base font-semibold text-slate-900">
            Painti Akhari & Muharni video lessons
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Six lessons from <span className="font-semibold">Gurprasaad Gursevak</span>.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="px-3 py-2 text-sm font-medium text-slate-700">{v.title}</p>
              </div>
            ))}
          </div>

          {/* Muharni PDF */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Reference
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Muharni Primer PDF</h3>
            <p className="mt-1 text-sm text-slate-700">
              The full Muharni chart of consonants with each vowel.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/santhiya101/muharni.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                Read Muharni PDF
              </a>
              <a
                href="/santhiya101/muharni.pdf"
                download
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Download
              </a>
            </div>
          </div>
        </section>

        {/* Step 3 — Nitnem Santhiya */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <StepHeader n={3} kicker="Practice" title="Nitnem Santhiya, one word behind" />
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Follow this Nitnem playlist and recite each word{" "}
            <span className="font-semibold">one word behind</span> the recording. This is the
            traditional Santhiya method, and it lets ucharan settle in naturally.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${NITNEM_VIDEO_ID}?list=${NITNEM_PLAYLIST_ID}`}
                title="Nitnem Santhiya playlist"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm font-medium text-slate-700">
                Nitnem Santhiya playlist
              </p>
              <a
                href={`https://www.youtube.com/playlist?list=${NITNEM_PLAYLIST_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Open playlist on YouTube
              </a>
            </div>
          </div>
        </section>

        {/* Step 4 — SGGS Santhiya */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <StepHeader
            n={4}
            kicker="Advance"
            title="Sri Guru Granth Sahib Ji Santhiya"
          />
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Ready to read Sri Guru Granth Sahib Ji? Follow this Santhiya playlist Ang by Ang,
            again reciting one word behind the sevadar.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${SGGS_VIDEO_ID}?list=${SGGS_PLAYLIST_ID}`}
                title="Sri Guru Granth Sahib Ji Santhiya playlist"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm font-medium text-slate-700">
                Sri Guru Granth Sahib Ji Santhiya playlist
              </p>
              <a
                href={`https://www.youtube.com/playlist?list=${SGGS_PLAYLIST_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Open playlist on YouTube
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Want to read alongside? Use the{" "}
            <Link href="/granth" className="font-semibold text-amber-700 hover:underline">
              Read Gurbani
            </Link>{" "}
            page for Ang-by-Ang Gurmukhi and arth.
          </p>
        </section>

        {/* Step 5 — Apps */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <StepHeader n={5} kicker="Practice daily" title="Get the apps for daily abhiyaas" />
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Two free companion apps make daily practice easy. Use them together.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Gurbani Tutor
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                The companion app to this site
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Painti Akhari, Muharni, dictionary, Pothi Sahib library, and Santhiya 101, all
                offline on your iPhone.
              </p>
              <a
                href="https://testflight.apple.com/join/8HEDEXYY"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Get Gurbani Tutor on iPhone
              </a>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Learn Shudh Gurbani
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Stream Santhiya audio for every Ang
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                From the Gursevak.com team. Sehaj Paath mode streams ucharan audio for each Ang,
                perfect for practicing alongside.
              </p>
              <a
                href="https://apps.apple.com/app/learn-shudh-gurbani/id1080522313"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Get Learn Shudh Gurbani
              </a>
            </div>
          </div>
        </section>

        {/* Step 6 — Join Santhiya class */}
        <section className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white shadow-sm">
              6
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                One-on-one
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Join free Santhiya classes with a sevadar teacher
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            When you are ready, join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya
            WhatsApp group to be matched with a Sangat sevadar for one-on-one Santhiya.
            Worldwide, free, online.
          </p>
          <Link
            href="/santhiya"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Go to Santhiya Classes →
          </Link>
        </section>

        <p className="mt-12 text-center text-xs text-slate-500">
          Questions or feedback?{" "}
          <a
            href="mailto:gurprasaadgursevak@gmail.com?subject=Santhiya%20101%20feedback"
            className="font-medium text-amber-700 hover:underline"
          >
            Email us
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
            <Link href="/santhiya" className="font-medium text-amber-700 hover:underline">
              Santhiya classes
            </Link>
            {" · "}
            <Link href="/youtube" className="font-medium text-amber-700 hover:underline">
              YouTube channel
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
