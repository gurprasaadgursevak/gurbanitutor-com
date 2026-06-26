import Image from "next/image";
import Link from "next/link";
import DesktopNav from "./DesktopNav";
import InstallWebAppButton from "./InstallWebAppButton";
import MobileNav from "./MobileNav";
import SocialLinks from "./SocialLinks";
import TodayShabad from "./TodayShabad";

type TileBadge = "unique" | "learning";

type Tile = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: keyof typeof TILE_ICONS;
  badge?: TileBadge;
};

const TILES: Tile[] = [
  {
    href: "/arths",
    eyebrow: "Gurbani Vocabulary Builder",
    title: "Arths Dictionary",
    body: "A unique, hand-picked vocabulary of Gurbani words with Punjabi and English meanings. Browsable by Painti Akhari or Ang. The backbone of every quiz on this site.",
    icon: "vocab",
    badge: "unique",
  },
  {
    href: "/quiz",
    eyebrow: "Learn Gurmat by doing",
    title: "Gurbani Quiz",
    body: "Bani-by-bani quizzes drawn from the vocabulary. Sri Japji, Sri Jaap, Sri Sukhmani Sahib, and more. Daily quiz plus streak tracking, Sangat worldwide on the same set.",
    icon: "quiz",
    badge: "learning",
  },
  {
    href: "/shabad-test",
    eyebrow: "Memorize, then test",
    title: "Shabad Test",
    body: "Pick a shabad, study it, then type it from memory. Strict, character-exact grading shows every missed matra and nukta. The discipline that turns reading into recall.",
    icon: "pencil",
    badge: "learning",
  },
  {
    href: "/mukhvak",
    eyebrow: "Read daily",
    title: "Sri Mukhvak",
    body: "Today's Hukamnama from Sri Darbar Sahib, in Gurmukhi with Punjabi and English arth.",
    icon: "sun",
  },
  {
    href: "/granth",
    eyebrow: "Read Ang by Ang",
    title: "Read Sri Guru Granth Sahib Ji & Sri Dasam Guru Granth Sahib Ji",
    body: "Full Gurbani text with optional ਅਰਥ, English Steeks, and ucharan tips. Pick any Nitnem bani from the side rail.",
    icon: "book",
  },
  {
    href: "/search",
    eyebrow: "Find any line",
    title: "Gurbani Search",
    body:
      "Find any line in Sri Guru Granth Sahib Ji or Sri Dasam Guru Granth Sahib Ji. Gurmukhi or English, with first-letter and consonant-skeleton matching.",
    icon: "search",
  },
  {
    href: "/gareebi-pothi",
    eyebrow: "Read with arth",
    title: "Gareebi Pothi",
    body: "313 hand-picked Gurbani entries on Gareebi, the cornerstone of Sikh humility, with the full Punjabi vyakhya.",
    icon: "book",
  },
  {
    href: "/pothi",
    eyebrow: "Read online or download",
    title: "Sri Pothi Sahib library",
    body: "Ten Pothis for offline study. Sri Sukhmani Sahib Ji, SGGS History, Balupdesh, Bhagat Kabir Ji's Sloaks, and more.",
    icon: "library",
  },
  {
    href: "/muharni",
    eyebrow: "Learn from scratch",
    title: "Santhiya 101",
    body: "A step-by-step journey: Painti Akhari, Muharni, Nitnem Santhiya, then Sri Guru Granth Sahib Ji Santhiya — taught by sevadars on YouTube.",
    icon: "letters",
  },
  {
    href: "/games",
    eyebrow: "For kids",
    title: "Games",
    body: "Games for kids to make Brahamvidya learning fun and easy. Gurmukhi Letters sound board, Muharni sound board, and Letter Quiz.",
    icon: "letters",
  },
];

// MARK: - Tile icons (inline SVG so they tint with currentColor)

const TILE_ICONS = {
  vocab: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5V5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h13" />
      <path d="M8 7h7M8 11h7M8 15h4" />
      <path d="M17.5 7.5l1 2 2.2.3-1.6 1.5.4 2.2-1.9-1-2 1 .4-2.2L14.3 9.8l2.2-.3z" fill="currentColor" stroke="none" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2.2 2.2L15.5 9.5" />
      <circle cx="17.5" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5.5C9.5 4 5 4 3.5 4.5v14C5 18 9.5 18 12 19.5c2.5-1.5 7-1.5 8.5-1v-14c-1.5-.5-6-.5-8.5 1z" />
      <path d="M12 5.5v14" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20 20" />
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="4" width="3.5" height="16" rx="0.5" />
      <rect x="9" y="4" width="3.5" height="16" rx="0.5" />
      <path d="M16 5l4 .8-3 15-4-.8z" />
    </svg>
  ),
  letters: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19l4-12 4 12M5.6 15h4.8" />
      <path d="M15 7v12M15 7c2.5 0 4 1.3 4 3s-1.5 3-4 3M15 13c3 0 4.5 1.4 4.5 3s-1.5 3-4.5 3" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20h4l10-10-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
      <path d="M3 22h18" />
    </svg>
  ),
} as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white text-slate-900">
      {/* Header — folder tabs sit flush with the bottom border so the active
          tab visually merges with the page below. */}
      <header className="border-b border-amber-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-6 pb-0 pt-4">
          <Link
            href="/"
            className="mb-3 font-semibold tracking-tight text-amber-700"
          >
            Gurbani Tutor
          </Link>
          <MobileNav />
          <DesktopNav />
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
          Read Sri Guru Granth Sahib Ji and Sri Dasam Guru Granth Sahib Ji, build your
          Gurbani vocabulary, quiz yourself bani by bani, and learn Santhiya, all in one
          calm Sangat space.
        </p>
      </section>

      {/* Today's Shabad — featured at the top so daily visitors see it first */}
      <TodayShabad />

      {/* Tools — front and centre, right under the hero so Sangat see immediately what's on offer */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        {/* Featured pair: Vocabulary Builder + Quiz */}
        <div className="grid gap-4 sm:grid-cols-2">
          {TILES.filter((t) => t.badge).map((t) => (
            <TileCard key={t.href} tile={t} featured />
          ))}
        </div>

        {/* Standard tools */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.filter((t) => !t.badge).map((t) => (
            <TileCard key={t.href} tile={t} />
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

      {/* Install / iPhone app CTA (moved below tools — Sangat see what we offer before the install pitch) */}
      <section className="mx-auto max-w-3xl px-6 pb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Take it with you
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Install Gurbani Tutor on your device.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use it offline on Android, desktop, or iPhone as an installable web app, or get
          the native iPhone beta.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
      </section>

      {/* iPhone-only features (deeper pitch for the curious) */}
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
              body="Same vocabulary, same Nitnem quizzes you see here, plus favourites and persistent best-streak tracking."
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

function TileCard({ tile, featured = false }: { tile: Tile; featured?: boolean }) {
  const Icon = TILE_ICONS[tile.icon];
  // Featured tiles (Vocab Builder + Quiz) get heavier visual treatment — amber tint
  // for "unique", emerald for "learning" — to anchor them as the site's marquee tools.
  const accent = tile.badge === "unique"
    ? "border-amber-300 bg-amber-50/60 hover:border-amber-400"
    : tile.badge === "learning"
      ? "border-emerald-300 bg-emerald-50/60 hover:border-emerald-400"
      : "border-slate-200 bg-white hover:border-amber-300";
  const iconBg = tile.badge === "unique"
    ? "bg-amber-100 text-amber-700"
    : tile.badge === "learning"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-amber-700";
  const badgeLabel = tile.badge === "unique"
    ? "Unique to Gurbani Tutor"
    : tile.badge === "learning"
      ? "Learning platform"
      : null;
  const badgeColor = tile.badge === "unique"
    ? "bg-amber-600 text-white"
    : "bg-emerald-600 text-white";
  return (
    <Link
      href={tile.href}
      className={`group flex flex-col rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${iconBg}`}
        >
          <span className="block h-6 w-6">{Icon}</span>
        </span>
        {badgeLabel && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}
          >
            {badgeLabel}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-700">
        {tile.eyebrow}
      </p>
      <h3
        className={`mt-1 font-semibold text-slate-900 ${
          featured ? "text-xl sm:text-2xl" : "text-lg"
        }`}
      >
        {tile.title}
        <span
          aria-hidden
          className="ml-2 inline-block text-amber-600 transition group-hover:translate-x-0.5"
        >
          →
        </span>
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{tile.body}</p>
    </Link>
  );
}
