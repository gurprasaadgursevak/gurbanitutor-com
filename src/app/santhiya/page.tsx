import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SocialLinks from "../SocialLinks";

export const metadata: Metadata = {
  title: "Santhiya Classes — Gurbani Tutor",
  description:
    "Learn Sri Guru Granth Sahib Ji Santhiya with Baba Jawahar Singh Ji. Two weekly group classes online, plus one-on-one Santhiya. Open to Sangat worldwide.",
};

const SIGNUP_MAILTO_SUBJECT = encodeURIComponent(
  "Santhiya class signup"
);

const SIGNUP_MAILTO_BODY = encodeURIComponent(
  `Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh!

Please add me to a Santhiya class. My details:

  Name:
  City and timezone:
  WhatsApp number (with country code):
  Preferred class:  Class 1 / Class 2 / One-on-one
  If one-on-one, my best available time windows:
  Current Gurmukhi reading level (Beginner / Some letters / Comfortable reading):
  Anything else you'd like to share:

Gurprasaad,`
);

const SIGNUP_MAILTO = `mailto:gurprasaadgursevak@gmail.com?subject=${SIGNUP_MAILTO_SUBJECT}&body=${SIGNUP_MAILTO_BODY}`;

// Google Form for Santhiya signups.
// IMPORTANT: this must be the public "embed" URL (Send → < > tab → src),
// NOT the /edit URL. The public URL has /d/e/<long_id>/viewform format.
// Until that public URL is captured, GOOGLE_FORM_URL_PUBLIC stays null and
// the page falls back to the mailto button.
const GOOGLE_FORM_URL_PUBLIC: string | null = null;
// The "open in new tab" version for users who'd rather fill it on docs.google.com.
const GOOGLE_FORM_EDIT_URL =
  "https://docs.google.com/forms/d/1YFyEaO1gPz-OfbyvxBg3acTQRtCeHU7btzcQMbaFXgw/edit";
const GOOGLE_FORM_EMBED_URL: string | null = GOOGLE_FORM_URL_PUBLIC;

const GOOGLE_MEET_URL = "https://meet.google.com/dmj-pyvq-qeg";
const BABA_PHONE_DISPLAY = "+1 (705) 274-7027";
const BABA_PHONE_TEL = "+17052747027";
const MUHARNI_VIDEO_URL = "https://youtu.be/iCT-KqB-oSI";

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
            Worldwide · Online · Open to all
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Sri Guru Granth Sahib Ji Santhiya with Baba Jawahar Singh Ji.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700">
            Two weekly group classes on Google Meet, plus one-on-one Santhiya arranged
            directly with Baba Ji. Offered as Gurprasaad, in the loving tradition of Gurmukh
            sevadars.
          </p>
        </div>
      </section>

      {/* Poster + inspiration photo */}
      <section className="mx-auto max-w-6xl px-6 pt-2 pb-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
              <Image
                src="/santhiya-poster.jpg"
                alt="Baba Jawahar Singh Ji Santhiya Classes poster · Our aim is to make Shudh Gurbani Santhiya accessible for everyone."
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
              <Image
                src="/santhiya-teacher.jpg"
                alt="An elder sevadar teaching one-on-one Santhiya outdoors, with a chalkboard and pothis"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm italic text-slate-700">
              One-on-one Santhiya, taught in the loving tradition of Gurmukh sevadars.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Class times */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Weekly group classes
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          Pick the slot that fits your schedule. Both classes meet on the same Google Meet
          link below.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Class 1
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              7:00 PM – 8:00 PM
            </p>
            <p className="text-sm text-slate-700">Toronto (EDT)</p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              4:30 AM – 5:30 AM
            </p>
            <p className="text-sm text-slate-700">India (IST)</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Class 2
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              9:00 AM – 10:00 AM
            </p>
            <p className="text-sm text-slate-700">Toronto (EDT)</p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              6:30 PM – 7:30 PM
            </p>
            <p className="text-sm text-slate-700">India (IST)</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Google Meet link
          </p>
          <a
            href={GOOGLE_MEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-baseline gap-2 font-mono text-sm text-emerald-700 hover:underline sm:text-base"
          >
            meet.google.com/dmj-pyvq-qeg
            <span aria-hidden>↗</span>
          </a>
          <p className="mt-2 text-sm text-slate-700">
            Bookmark this link. It opens directly into the class at the scheduled time.
          </p>
        </div>
      </section>

      {/* Prem Benti */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Prem Benti · Before class
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Please practice Muharni at least 25 times.
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-900">
            Pay close attention to each Akhar (letter) so your pronunciation is Shudh. The
            more time you give to Muharni, the more your Gurbani Ucharan will settle and
            strengthen.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={MUHARNI_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch the Muharni video
            </a>
            <Link
              href="/muharni"
              className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:border-amber-400"
            >
              Open Santhiya 101 →
            </Link>
          </div>
        </div>
      </section>

      {/* Sign up */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Request a class
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Send a short note with your name, timezone, and the slot you&apos;d like. Baba
            Ji will confirm with you on WhatsApp.
          </p>

          {GOOGLE_FORM_EMBED_URL ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Santhiya class signup form"
                className="h-[1200px] w-full"
                loading="lazy"
              />
            </div>
          ) : (
            <a
              href={SIGNUP_MAILTO}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <span aria-hidden>✉️</span>
              Sign up by email
            </a>
          )}

          <p className="mt-4 text-xs text-slate-500">
            We will only use your details to confirm your spot and share class updates. No
            account is created on this website.
          </p>
        </div>
      </section>

      {/* 1:1 Santhiya */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            One-on-one Santhiya
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            If group timings don&apos;t suit you, arrange 1:1 with Baba Ji.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Baba Jawahar Singh Ji is happy to work around your schedule to help you progress
            in your Gurbani learning journey. Please contact Baba Ji directly to arrange
            individual Santhiya.
          </p>
          <a
            href={`tel:${BABA_PHONE_TEL}`}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400"
          >
            <span aria-hidden>📞</span>
            {BABA_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      {/* WhatsApp QR */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-emerald-700">
                WhatsApp community
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

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Join the WhatsApp community
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Class updates, Sangat resources, and reminders are shared here. Joining the
              group is the easiest way to stay connected and to hear about new sessions
              and Sangat events.
            </p>
            <ol className="mt-6 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Open WhatsApp on your phone</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Tap the camera icon at the top right of the Chats tab. If you don&apos;t
                    see one, tap any chat and use the attachment menu to find Camera or QR
                    scanner.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Scan the QR code</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Point your camera at the QR on this page. WhatsApp will prompt you to
                    join the group. On the same phone, save the image and use WhatsApp&apos;s
                    &ldquo;Upload from gallery&rdquo; option in the QR scanner.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Introduce yourself</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Once you&apos;re in, share a short hello with your name and city. Sangat
                    sevadars will welcome you and answer any questions.
                  </p>
                </div>
              </li>
            </ol>
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
                title: "Sri Guru Granth Sahib Ji Santhiya",
                body: "Read Ang by Ang with Baba Ji, settling each line until your ucharan flows.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{b.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-600">
            Want to start practising today, before your first class? Begin with the{" "}
            <Link href="/muharni" className="font-medium text-amber-700 hover:underline">
              Santhiya 101 journey
            </Link>
            .
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
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
