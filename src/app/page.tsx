import Image from "next/image";
import Link from "next/link";

// Placeholder Muharni video IDs — replace these with the real IDs from
// @gurprasaadgursevak when ready. You can also add or remove rows.
const MUHARNI_VIDEOS: { id: string; title: string }[] = [
  { id: "PLACEHOLDER1", title: "Painti Akhari — Letters Introduction" },
  { id: "PLACEHOLDER2", title: "Muharni Sheet Walkthrough" },
  { id: "PLACEHOLDER3", title: "Balupdesh — A Reading Lesson" },
];

const FEATURES = [
  {
    title: "Read Gurbani",
    body: "Sri Guru Granth Sahib Ji and Sri Guru Dasam Granth Sahib Ji ang by ang with arth, English steek, ucharan tips, and a Larivaar toggle.",
  },
  {
    title: "Track Nitnem",
    body: "A daily checklist for the seven Nitnem banis with streaks, reminders, and gentle Gurbani prompts if you miss a few days.",
  },
  {
    title: "Simran Mala",
    body: "A 108 bead rosary you tap to count, with a meru bead and daily totals that sync with the Home dashboard.",
  },
  {
    title: "Abhiyaas Challenges",
    body: "Mool Mantar, Waheguru Jaap, Sehaj Paath, and Shaheedi 48 hour challenges, plus your own custom goals.",
  },
  {
    title: "Arths Dictionary",
    body: "Look up Gurbani words with Punjabi and English meanings. Star words and quiz yourself anytime.",
  },
  {
    title: "Sri Pothi Sahib",
    body: "A bundled library of Pothis including Gareebi Pothi, Sri Sukhmani Sahib, Balupdesh, and Sri Guru Granth Sahib Ji History.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white text-slate-900">
      {/* Header */}
      <header className="border-b border-amber-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold tracking-tight text-amber-700">
            Gurbani Tutor
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
            <Link href="#features" className="hover:text-slate-900">Features</Link>
            <Link href="#search" className="hover:text-slate-900">Search</Link>
            <Link href="#watch" className="hover:text-slate-900">Watch</Link>
            <Link href="#download" className="hover:text-slate-900">Download</Link>
            <Link href="#santhiya" className="hover:text-slate-900">Santhiya</Link>
            <Link href="#about" className="hover:text-slate-900">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <div className="flex justify-center">
          <Image
            src="/app-icon.png"
            alt="Gurbani Tutor app icon"
            width={96}
            height={96}
            priority
            className="rounded-3xl shadow-lg ring-1 ring-slate-200"
          />
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-amber-700 sm:text-lg">
          ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          A learning companion for Gurbani.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Gurbani Tutor brings the full Sri Guru Granth Sahib Ji and Sri Guru Dasam Granth Sahib Ji
          to your iPhone, with daily Nitnem, Simran Mala, Abhiyaas challenges, and a
          Gurmukhi dictionary, all in one calm, focused space.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://testflight.apple.com/join/8HEDEXYY"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Join the iPhone Beta
          </a>
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            See features
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Free, no accounts, no tracking. iPhone only for now, Android coming soon.
        </p>
      </section>

      {/* Features grid */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to read, study, and practice.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Designed around learning, not endless scrolling. Every screen helps you grow in Gurmukhi and abhiyaas.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-amber-200 hover:shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Search showcase */}
      <section id="search" className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Search Sri Guru Granth Sahib Ji + Sri Dasam Granth Sahib Ji
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Find any line, even when you only remember a few letters.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Search across both Granth Sahibs in Gurmukhi or English. Three smart match
                modes find the line you're thinking of, even from a partial spelling.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-600" />
                  <span><strong>Contains</strong>: full word or consonant skeleton match. Useful when you remember most of the line.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-600" />
                  <span><strong>First Letters</strong>: type just the first consonant of each word. Great for tuks you half-remember.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-600" />
                  <span><strong>Anywhere</strong>: match the sequence starting at any word in the line, not just the first.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-600" />
                  <span><strong>English</strong>: search by meaning, steek, or arth — handy when you want a line on a specific theme.</span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-slate-500">
                Tap any result to jump straight into the reader at the right ang.
              </p>
            </div>

            {/* Mock search panel */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
                    <span className="text-amber-700">🔍</span>
                    <span className="text-sm text-slate-400">ਗੁਰ ਕਾ ਸਬਦੁ</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 text-xs">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">ਗੁਰਮੁਖੀ</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">Contains</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">All Granths</span>
                  </div>
                </div>
                <ul className="divide-y divide-slate-100">
                  {[
                    { line: "ਗੁਰ ਕਾ ਸਬਦੁ; ਕਾਟੈ ਕੋਟਿ ਕਰਮ॥", ang: "1357", granth: "SGGS Ji" },
                    { line: "ਜਿਨ ਕਉ ਨਦਰਿ ਕਰਮੁ ਤਿਨ ਕਾਰ॥", ang: "8", granth: "SGGS Ji" },
                    { line: "ਸਤਿਗੁਰ ਕੀ ਬਾਣੀ ਸਤਿ ਸਤਿ ਕਰਿ ਜਾਣਹੁ ਗੁਰਸਿਖਹੁ॥", ang: "920", granth: "SGGS Ji" },
                  ].map((r) => (
                    <li key={r.line} className="px-4 py-3">
                      <p className="text-slate-900">{r.line}</p>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-700">Ang {r.ang}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{r.granth}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-center text-xs italic text-slate-400">
                A taste of the in-app Search experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Watch & Learn (Muharni videos) */}
      <section id="watch" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Watch & Learn
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Muharni and Painti Akhari videos.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Selected lessons from the{" "}
              <a
                href="https://www.youtube.com/@gurprasaadgursevak"
                className="font-medium text-amber-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @gurprasaadgursevak
              </a>{" "}
              YouTube channel, embedded so you can learn Gurmukhi without leaving the page.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MUHARNI_VIDEOS.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-video w-full bg-slate-900">
                  {v.id.startsWith("PLACEHOLDER") ? (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Video coming soon
                    </div>
                  ) : (
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <p className="px-4 py-3 text-sm font-medium text-slate-700">{v.title}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Want to see more?{" "}
            <a
              href="https://www.youtube.com/@gurprasaadgursevak"
              className="font-medium text-amber-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the full channel on YouTube
            </a>
            .
          </p>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Read Gurbani daily, wherever you are.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
          The app is currently in TestFlight beta. Help shape it before the public launch.
        </p>
        <a
          href="https://testflight.apple.com/join/8HEDEXYY"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          Join the iPhone Beta
        </a>
      </section>

      {/* Santhiya placeholder */}
      <section id="santhiya" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Santhiya Classes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            We are building a worldwide directory of Santhiya teachers and a simple way for
            students to be matched with a teacher in their area. Coming soon, with a sign up
            form so we can introduce you as teachers become available.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          About
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600">
          Gurbani Tutor is a humble effort to bring Sri Guru Sahib closer to the daily life of the
          Sangat. Every feature is built around one idea, that reading Gurbani every day,
          with arth, ucharan, and Simran, transforms us slowly into the form Vaheguru Ji intended.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Built by the Sangat, for the Sangat. Free, ad free, and tracking free.
        </p>
        <p className="mt-8 text-sm text-slate-500">
          Questions, ideas, dictionary corrections? Email us at{" "}
          <a className="font-medium text-amber-700 hover:underline" href="mailto:gurprasaadgursevak@gmail.com">
            gurprasaadgursevak@gmail.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p>© {new Date().getFullYear()} Gurbani Tutor</p>
        </div>
      </footer>
    </div>
  );
}
