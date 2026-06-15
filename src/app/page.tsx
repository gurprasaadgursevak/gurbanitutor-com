import Image from "next/image";
import Link from "next/link";
import InstallWebAppButton from "./InstallWebAppButton";
import SocialLinks from "./SocialLinks";

type Tile = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
};

const TILES: Tile[] = [
  {
    href: "/mukhvak",
    eyebrow: "Read daily",
    title: "Sri Mukhvak",
    body: "Today's Hukamnama from Sri Darbar Sahib, in Gurmukhi with Punjabi and English arth.",
  },
  {
    href: "/granth",
    eyebrow: "Read",
    title: "Read Sri Guru Granth Sahib Ji & Sri Dasam Guru Granth Sahib Ji",
    body: "Ang-by-Ang reading with optional ਅਰਥ, English Steeks, and ucharan tips for study.",
  },
  {
    href: "/search",
    eyebrow: "Find",
    title: "Gurbani Search",
    body:
      "Find any line in Sri Guru Granth Sahib Ji or Sri Dasam Guru Granth Sahib Ji. Gurmukhi or English.",
  },
  {
    href: "/arths",
    eyebrow: "Study · Gurbani vocabulary builder",
    title: "Arths Dictionary",
    body: "A curated Gurbani vocabulary builder. Hand-picked words with Punjabi and English meanings, browsable by Painti Akhari or Ang.",
  },
  {
    href: "/quiz",
    eyebrow: "Practice",
    title: "Gurbani Quiz",
    body: "Bani-by-bani quizzes drawn from the Vocabulary. Nitnem, Sukhmani Sahib, or a combined Nitnem pool.",
  },
  {
    href: "/pothi",
    eyebrow: "Read",
    title: "Sri Pothi Sahib",
    body: "Ten free Pothis to read online or download. Sri Sukhmani Sahib Ji, SGGS History, and more.",
  },
  {
    href: "/muharni",
    eyebrow: "Learn",
    title: "Santhiya 101",
    body: "A step-by-step journey: Painti Akhari, Muharni, Nitnem Santhiya, and SGGS Santhiya.",
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
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/search" className="font-semibold text-slate-900 hover:text-amber-700">Gurbani Search</Link>
            <Link href="/arths" className="font-semibold text-amber-700 hover:text-amber-900">Arths · Vocab</Link>
            <Link href="/quiz" className="hover:text-slate-900">Gurbani Quiz</Link>
            <Link href="/granth" className="font-semibold text-slate-900 hover:text-amber-700">Read Gurbani</Link>
            <Link href="/mukhvak" className="hover:text-slate-900">Sri Mukhvak</Link>
            <Link href="/pothi" className="hover:text-slate-900">Pothi Sahib</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
            <Link
              href="/santhiya"
              className="inline-flex h-7 items-center rounded-full bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Santhiya Classes
            </Link>
            <Link
              href="/muharni"
              className="inline-flex h-7 items-center rounded-full bg-red-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Santhiya 101
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-20 text-center sm:pt-28">
        <div className="flex justify-center">
          <Image
            src="/app-icon.png"
            alt="Gurbani Tutor app icon"
            width={88}
            height={88}
            priority
            className="rounded-3xl shadow-lg ring-1 ring-slate-200"
          />
        </div>
        <p className="mt-6 text-base font-medium leading-relaxed text-amber-700">
          ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          A learning companion for Gurbani.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Read, search, study, and learn to read Gurbani, all in one calm space.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://testflight.apple.com/join/8HEDEXYY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Get the iPhone app · Free beta
          </a>
          <InstallWebAppButton />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          iPhone app on TestFlight, coming soon to the App Store. Or install the web app on
          Android, desktop, or even iPhone for an offline, app-like experience.
        </p>
      </section>

      {/* iPhone-only features */}
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-amber-800">
            Why install the iPhone app?
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Everything on the web, plus four daily-practice features.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon="📌"
              title="Pin Favourite Lines"
              body="Swipe left on any Gurbani line in the readers to pin it. Build your own personal Sangat scrapbook for review."
            />
            <FeatureCard
              icon="✎"
              title="Notes on Any Line"
              body="Long-press a line to scribe a quick note. Notes live alongside the verse forever, sorted by Ang."
            />
            <FeatureCard
              icon="◷"
              title="Today's Progress Rings"
              body="Apple-Health-style rings for Nitnem, Simran, and Abhiyas, with daily streaks. Vaheguru's seva, visualized."
            />
            <FeatureCard
              icon="✓"
              title="Bani Quizzes with Streaks"
              body="Same Vocabulary, same Nitnem quizzes you see here, plus Favourites and persistent best-streak tracking."
            />
          </div>
          <p className="mt-8 text-center text-sm text-slate-700">
            The <Link href="/arths" className="font-semibold text-amber-700 hover:underline">Gurbani Vocabulary</Link>{" "}
            and the <Link href="/quiz" className="font-semibold text-amber-700 hover:underline">Quiz</Link> are the
            same on iPhone and web. The iPhone app adds personal tracking on top.
          </p>
        </div>
      </section>

      {/* Inspiration photo */}
      <section className="mx-auto max-w-2xl px-6 pb-14">
        <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
            <Image
              src="/home-teacher.jpg"
              alt="A respected Gurmukh sevadar teaching Gurbani from a chalkboard, in white bana and blue dastaar"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
          <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm italic text-slate-700">
            In the loving memory of ਗੁਰਮੁਖਿ ਅਪਰਸ Bhagat Jaswant Singh Ji Daudhar (Bhagat Ji), a student of Sant Gurbachan Singh Ji &lsquo;Khalsa&rsquo;.
          </figcaption>
        </figure>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {TILES.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md ${
                i === 0 ? "sm:col-span-2 border-amber-200 bg-amber-50/40" : ""
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                {t.eyebrow}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {t.title}
                <span
                  aria-hidden
                  className="ml-2 inline-block text-amber-600 transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.body}</p>
            </Link>
          ))}
        </div>

        {/* Subtle Santhiya callout */}
        <Link
          href="/santhiya"
          className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-300 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Practice with a teacher
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">
              Sri Guru Granth Sahib Ji Santhiya with Baba Jawahar Singh Ji
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">
            How to join <span aria-hidden>→</span>
          </span>
        </Link>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Built by the Sangat, for the Sangat
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Gurbani Tutor is a humble effort to bring Sri Guru Sahib closer to daily life.
          Free, ad-free, and tracking-free.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            Read the full About page
          </Link>
          <a
            href="mailto:gurprasaadgursevak@gmail.com"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Email us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <SocialLinks />
          <p className="mt-3 text-xs">© {new Date().getFullYear()} Gurbani Tutor</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-2xl" aria-hidden>
        {icon}
      </p>
      <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-700">{body}</p>
    </div>
  );
}
