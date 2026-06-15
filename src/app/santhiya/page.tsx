import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Santhiya Classes — Gurbani Tutor",
  description:
    "Join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya WhatsApp group to be matched with a sevadar teacher and begin one-on-one Santhiya. Worldwide, free, online.",
};

export default function SanthiyaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-emerald-700">
            Santhiya Classes
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Worldwide · Free · Online
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Learn Gurbani Santhiya with a sevadar teacher.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya WhatsApp group to be
            introduced to a teacher in your area. Lessons are one-on-one, self-paced, and
            entirely free, as a labour of love by the Sangat.
          </p>
        </div>
      </section>

      {/* QR + How to join */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* QR card */}
          <div className="flex flex-col items-center">
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-emerald-700">
                WhatsApp group
              </p>
              <p className="mt-1 text-center text-sm font-semibold text-slate-900">
                Gursevak Braham Vidya Sri Shubh Gurbani Santhiya
              </p>
              <div className="mt-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/santhiya-whatsapp-qr.jpeg"
                  alt="Scan with WhatsApp to join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya group"
                  width={320}
                  height={320}
                  className="h-72 w-72 rounded-2xl object-cover"
                />
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Scan or upload this QR code using the WhatsApp camera to join the group.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              How to join
            </h2>
            <ol className="mt-6 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Open WhatsApp on your phone</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Tap the camera icon at the top right of the Chats tab. If you don't see one,
                    tap any chat and use the attachment menu to find Camera or QR scanner.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Scan the QR code</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Point your camera at the QR on this page. WhatsApp will prompt you to join
                    the group. If you are reading on the same phone, save the image to your
                    Photos and use WhatsApp's "Upload from gallery" option in the QR scanner.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Introduce yourself</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Once you're in, share a short introduction: your name, your city, and what
                    you'd like to learn. A sevadar teacher will reach out and a one-on-one
                    schedule will be set with you directly.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-semibold">A note from the Sangat</p>
              <p className="mt-2 leading-6">
                Classes are taught entirely as seva. Please be patient as you are matched —
                teachers join as their schedules allow, and we want every student paired with
                someone who fits well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            What you can expect to learn
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Painti Akhari & Muharni",
                body: "Master the 35 letters and the matra system so reading Gurmukhi becomes natural.",
              },
              {
                title: "Ucharan (Pronunciation)",
                body: "Correct ucharan with attention to nasal sounds, half letters, and special letters of Gurmukhi.",
              },
              {
                title: "Daily Nitnem Santhiya",
                body: "Practice Japji Sahib, Jaap Sahib, Rehrass and other Nitnem banis with a teacher's guidance.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{b.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">
            Want to start learning today, before you're matched? Try the{" "}
            <Link href="/#santhiya101" className="font-medium text-amber-700 hover:underline">
              Santhiya 101 lessons
            </Link>{" "}
            on the home page.
          </p>
        </div>
      </section>

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
