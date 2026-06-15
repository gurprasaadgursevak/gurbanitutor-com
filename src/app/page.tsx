import Image from "next/image";
import Link from "next/link";

// Muharni & Painti Akhari lessons from @gurprasaadgursevak — these match the
// first 6 entries in the iOS app's MuharniHubView so the two experiences stay
// aligned. Edit the list freely if you want to change order or titles.
const MUHARNI_VIDEOS: { id: string; title: string }[] = [
  { id: "Q9rmNdAcZ_E", title: "Sounds of Letters" },
  { id: "Nkv8P6Jf0EE", title: "Writing Tutorial" },
  { id: "sHlFfJXB5qo", title: "Vowels (Lagaan)" },
  { id: "H755C5XTHW0", title: "Nasal Sounds (Lagakhar)" },
  { id: "iCT-KqB-oSI", title: "Muharni" },
  { id: "UiePG9DUWuY", title: "Half Letters (Sanyukt Akhar)" },
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
    body: "Look up Gurbani words with Punjabi and English meanings. Star words and quiz yourself anytime. Available live on this site at /arths.",
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
            <Link href="/arths" className="hover:text-slate-900">Arths</Link>
            <Link href="#features" className="hover:text-slate-900">Features</Link>
            <Link href="#santhiya101" className="hover:text-slate-900">Santhiya 101</Link>
            <Link href="#download" className="hover:text-slate-900">Download</Link>
            <Link href="#santhiya" className="hover:text-slate-900">Santhiya Classes</Link>
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
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <span aria-hidden>📱</span>
            iPhone app · Coming soon to the App Store
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span aria-hidden>✦</span>
            Free TestFlight beta open now
          </span>
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-amber-700 sm:text-lg">
          ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          A learning companion for Gurbani.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Gurbani Tutor is an iPhone app. It brings the full Sri Guru Granth Sahib Ji and
          Sri Guru Dasam Granth Sahib Ji to your phone, with daily Nitnem, Simran Mala,
          Abhiyaas challenges, and a Gurmukhi dictionary, all in one calm, focused space.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <a
            href="https://testflight.apple.com/join/8HEDEXYY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Join the iPhone Beta on TestFlight
          </a>
          <Link
            href="/arths"
            className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            Browse Arths Dictionary
          </Link>
          <Link
            href="#santhiya101"
            className="inline-flex items-center justify-center rounded-full border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
          >
            Learn to Read Gurbani
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            See features
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Tap the link on your iPhone. If you don't have TestFlight, the App Store
          will prompt you to install it (free). Then the beta opens automatically.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Free, no accounts, no tracking. Android coming soon.
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

      {/* Santhiya 101 (Muharni learning videos) */}
      <section id="santhiya101" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Santhiya 101
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Learn to read Gurbani, one letter at a time.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Painti Akhari, Muharni, and beginner santhiya lessons, taught with patience and ucharan.
              Watch along here, then practice in the app.
            </p>
          </div>

          {/* Featured channel banner */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-red-600 text-white">
                {/* YouTube play glyph */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Featured channel
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Gurprasaad Gursevak on YouTube
                </h3>
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

          {/* Muharni video grid */}
          <h3 className="mt-14 text-center text-lg font-semibold text-slate-800">
            Painti Akhari & Muharni lessons — the same six lessons used in the app
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
            These six videos open inside the Gurbani Tutor iPhone app under the Muharni tile. They
            also stream right here so anyone can begin learning Gurmukhi today.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          {/* Full playlist link (mirrors the iOS app's link) */}
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
              The same playlist linked from inside the Gurbani Tutor app.
            </p>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          iPhone · Free TestFlight Beta
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Read Gurbani daily, wherever you are.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
          Gurbani Tutor is currently in beta on Apple TestFlight. Try it free and help shape it before the
          public App Store launch.
        </p>

        {/* TestFlight 3-step guide */}
        <ol className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          <li className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Step 1</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Open the link on your iPhone</p>
            <p className="mt-1 text-sm text-slate-600">
              Tap the button below from your iPhone (not a computer or Android phone).
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Step 2</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Install TestFlight</p>
            <p className="mt-1 text-sm text-slate-600">
              TestFlight is Apple's free official beta app. If you don't have it, the App Store will
              prompt you to install it.
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Step 3</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Open Gurbani Tutor</p>
            <p className="mt-1 text-sm text-slate-600">
              TestFlight installs the beta on your home screen. Tap to open. No account needed.
            </p>
          </li>
        </ol>

        <a
          href="https://testflight.apple.com/join/8HEDEXYY"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          Join the iPhone Beta on TestFlight
        </a>
        <p className="mt-3 text-xs text-slate-500">
          Open this page on your iPhone for the smoothest install.
        </p>
      </section>

      {/* Santhiya classes — WhatsApp join */}
      <section id="santhiya" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white p-3 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/santhiya-whatsapp-qr.jpeg"
                  alt="Scan with WhatsApp to join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya group"
                  width={260}
                  height={260}
                  className="h-64 w-64 rounded-xl object-cover"
                />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                Santhiya Classes
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Join the Gursevak Braham Vidya Sri Shubh Gurbani Santhiya group.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                A worldwide Sangat-led WhatsApp group where students are matched with sevadar
                teachers who guide one-on-one Santhiya. Free, online, and self-paced. Open the
                WhatsApp camera and scan the QR code, or tap below.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
                <Link
                  href="/santhiya"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-emerald-400"
                >
                  How to join + class details
                </Link>
                <p className="text-xs text-slate-400">
                  Scan the QR with your phone's WhatsApp camera to be added instantly.
                </p>
              </div>
            </div>
          </div>
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
        <p className="mt-3 text-sm text-slate-500">
          Follow on Instagram{" "}
          <a
            className="font-medium text-amber-700 hover:underline"
            href="https://instagram.com/gurbanitutor"
            target="_blank"
            rel="noopener noreferrer"
          >
            @GurbaniTutor
          </a>{" "}
          for new lessons and updates.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/gurbanitutor"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 hover:underline"
            >
              Instagram @GurbaniTutor
            </a>
            <span>© {new Date().getFullYear()} Gurbani Tutor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
