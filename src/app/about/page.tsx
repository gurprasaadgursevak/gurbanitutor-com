import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SocialLinks from "../SocialLinks";

export const metadata: Metadata = {
  title: "About Us · Gurbani Tutor",
  description:
    "Gurbani Tutor is an education app for Shudh Gurbani Santhiya, focused on learning, understanding, and connecting with Gurbani. Built by the Sangat, for the Sangat.",
};

const CONTRIBUTORS = [
  "Bhai Santokh Singh (Bhai Sukhdeep Singh)",
  "Bhai Randip Singh",
  "Bhai Jagneet Singh",
  "Bhai Gursevak Dot Com Singh",
  "Bhai Gurjot Singh",
  "Bhai Irvanjit Singh",
  "Bhai Yadevinder Singh (Surrey BC)",
  "Bhai Jaiinder Singh (Surrey BC)",
  "Bibi Satbir Kaur",
  "Bhai Harloveleen Singh",
];

const DEDICATIONS = [
  "Dhan Dhan Baba Ajit Singh Sahib Ji",
  "Dhan Dhan Baba Jujhar Singh Sahib Ji",
  "Dhan Dhan Baba Zorawar Singh Sahib Ji",
  "Dhan Dhan Baba Fateh Singh Sahib Ji",
];

function GoldDotItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-amber-600" />
      <span className="text-slate-800">{children}</span>
    </li>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-amber-700 sm:text-2xl">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">About Us</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-center">
          <p className="text-lg font-semibold leading-relaxed text-amber-700 sm:text-xl">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
          </p>
        </div>

        {/* Dedication */}
        <section className="mt-12">
          <SectionTitle>Dedication</SectionTitle>
          <p className="mt-3 text-slate-700">This App is dedicated to:</p>
          <ul className="mt-3 space-y-2">
            {DEDICATIONS.map((d) => (
              <GoldDotItem key={d}>{d}</GoldDotItem>
            ))}
          </ul>
        </section>

        {/* Inspiration */}
        <section className="mt-12">
          <SectionTitle>Inspiration</SectionTitle>
          <blockquote className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-lg leading-8 text-amber-900">
            ਛਛਾ; ਛੋਹਰੇ ਦਾਸ ਤੁਮਾਰੇ ॥ ਦਾਸ ਦਾਸਨ ਕੇ; ਪਾਨੀਹਾਰੇ ॥
            <br />
            ਛਛਾ; ਛਾਰੁ ਹੋਤ ਤੇਰੇ ਸੰਤਾ ॥ ਅਪਨੀ ਕ੍ਰਿਪਾ; ਕਰਹੁ ਭਗਵੰਤਾ ॥
          </blockquote>

          {/* Inspiration photo */}
          <figure className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <Image
                src="/about-inspiration.jpg"
                alt="The respected elders whose tireless seva inspired Gurbani Tutor"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority={false}
              />
            </div>
            <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-700">
              Baba Jawahar Singh Ji (Chaminda) and Sachkhandwasi ਗੁਰਮੁਖਿ ਅਪਰਸ Bhagat Jaswant
              Singh Ji (Daudhar).
            </figcaption>
          </figure>

          <p className="mt-6 leading-7 text-slate-700">
            This app is based on and inspired by the tireless seva of Sachkhandwasi ਗੁਰਮੁਖਿ
            ਅਪਰਸ Bhagat Jaswant Singh Ji (Daudhar), student of Sriman Sant Gyani Gurbachan
            Singh Sahib Khalsa, and Baba Jawahar Singh Ji (Chaminda).
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Bhagat Jaswant Singh Ji biography */}
        <section>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <Image
                src="/bhagat-ji-baba-jawahar-singh.jpg"
                alt="Bhagat Jaswant Singh Ji with Baba Jawahar Singh Ji"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority={false}
              />
            </div>
            <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-700">
              Bhagat Jaswant Singh Ji (right) with Baba Jawahar Singh Ji (Chaminda).
            </figcaption>
          </figure>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-amber-700 sm:text-2xl">
            Bhagat Jaswant Singh Ji (June 1936 to March 2025)
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            Bhai Jaswant Singh Ji, known reverently as Bhagat Ji, was a Sikh scholar born in
            June 1936 who devoted more than 60 years to the study, teaching, and preservation of
            Gurbani. His life's focus was Shudh Ucharan, the correct pronunciation of
            Gurbani, and Santhiya, the discipline through which that pronunciation is taught.
            He completed his life journey in March 2025.
          </p>

          <h3 className="mt-8 text-lg font-semibold tracking-tight text-amber-700">
            Spiritual Training
          </h3>
          <p className="mt-3 leading-7 text-slate-700">
            Bhagat Ji joined the Damdami Taksal in 1961 and studied for over eight years
            under Sant Baba Gurbachan Singh Ji Bhindranwale, the twelfth leader of the
            institution. It was Sant Gurbachan Singh Ji who affectionately gave him the
            name Bhagat, a title that stayed with him for the rest of his life. He later
            lived with Sant Kartar Singh Ji Khalsa Bhindranwale and became one of the era's
            principal Santhiya teachers.
          </p>

          <h3 className="mt-8 text-lg font-semibold tracking-tight text-amber-700">
            Major Contributions
          </h3>
          <ul className="mt-3 space-y-3 text-slate-700">
            <GoldDotItem>
              <span className="font-semibold">Katha recordings.</span> Bhagat Ji took on the
              difficult work of recording scriptural discourses, carrying heavy Grundig
              recorders across regions that lacked reliable electricity, often at personal
              risk, so that these teachings would be preserved.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">The Steek project.</span> In 1967, Sant
              Gurbachan Singh Ji blessed a team of five scholars, Bhagat Ji among them, with
              the mission of composing detailed meanings of Sri Guru Granth Sahib Ji. Bhagat
              Ji was the last surviving member of that team and carried the work forward
              until he completed his life journey. After his passing, Baba Jawahar Singh, a
              long time companion and student of Bhagat Ji, is resuming the translation
              seva, continuing the Steek project in his teacher's footsteps.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Manuscript correction.</span> More than three
              decades ago, at the request of the SGPC, he was among the pioneering scholars
              who corrected the mangals, the introductory headings of Sri Guru Granth Sahib
              Ji, helping to preserve the authentic text.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Recordings and publications.</span> He
              produced what is recognised as the first ever correct pronunciation recording
              of Sri Guru Granth Sahib Ji, and authored ten texts, eight of which have
              audiobooks and five of which have videobooks. His teachings reach seekers
              today through an app, a website, YouTube, and Instagram.
            </GoldDotItem>
          </ul>

          <h3 className="mt-8 text-lg font-semibold tracking-tight text-amber-700">
            Legacy
          </h3>
          <p className="mt-3 leading-7 text-slate-700">
            Many respected Sikh scholars and preachers were students of Bhagat Ji. His
            lifelong service to Shudh Ucharan continues to guide seekers in pronouncing
            Gurbani with care and accuracy rather than reading it as casual Punjabi. Having
            completed his life journey in March 2025, Bhagat Ji leaves behind his
            recordings, his writings, and his students to carry the tradition forward.
            Among them, Baba Jawahar Singh, his long time companion and student, is taking
            up the translation seva of the Steek project, ensuring that the mission
            entrusted by Sant Gurbachan Singh Ji in 1967 lives on.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* About Gurbani Tutor */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-amber-700 sm:text-3xl">
            About Gurbani Tutor
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            Gurbani Tutor is primarily an education app, created with a simple mission to make
            Shudh Gurbani Santhiya accessible to everyone. It is focused on learning,
            understanding, and connecting with Gurbani.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Whether you are taking your first steps in learning Gurmukhi or seeking to refine
            your pronunciation and understanding, Gurbani Tutor provides a structured and
            welcoming path for learners of all levels.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Our lessons focus on correct Ucharan (pronunciation), reading fluency, Gurbani
            vocabulary, Nitnem, and deeper understanding of the teachings contained within Sri
            Guru Granth Sahib Ji. We are inspired by the rich Santhiya tradition and the
            teachings of respected scholars and educators who dedicated their lives to
            preserving the purity of Gurbani.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* What's New */}
        <section>
          <SectionTitle>What's New</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Recent updates across iPhone and{" "}
            <Link href="/granth" className="font-semibold text-amber-700 hover:underline">
              Read Gurbani
            </Link>:
          </p>
          <ul className="mt-4 space-y-3 text-slate-700">
            <GoldDotItem>
              <span className="font-semibold">Gurmukhi typeface picker.</span>{" "}
              Switch between <span className="font-semibold">GuruGranthUni</span> (the new
              default) and <span className="font-semibold">Noto Sans Gurmukhi</span> anytime.
              On the web, find the toggle in the Read Gurbani toolbar. On iPhone, open
              About Us → Gurbani Typeface. The other face is used as an automatic fallback
              for any glyph the chosen font doesn't cover.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">More Amrit Banis.</span> 118 additional banis
              across 10 categories: Beant Bani (Dukh Bhanjani Sahib, Karhalay, Pahray,
              Salok Sahaskriti, Sukhmana Sahib, etc.), Bhagat Bani, the full 22 Vaaran
              cycle, Beant Dasam Bani (Zafarnama, 33 Svaiye, Khalsa Mehima, Bara Maha),
              Panj Granthi, Das Granthi, Ardas, Astotar, Kavach, and Gurbani Pothi.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Bhai Gurdas Sahib Ji Vaaran &amp; Bhai
              Nand Lal Sahib Ji.</span> Both auxiliary granths are bundled with the app
              and live in the Read Gurbani granth picker on the website. Together
              that's 13,525 more verses with English steeks.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Sri Dasam Granth English steeks.</span>{" "}
              34,784 verses in Sri Guru Dasam Granth Sahib Ji now carry SSK English
              translation, refreshed from the gursevakdb project.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Cross-Granth search.</span> The iPhone
              search tab now indexes Sri Guru Granth Sahib Ji, Sri Guru Dasam Granth
              Sahib Ji, Bhai Gurdas Sahib Ji, and Bhai Nand Lal Sahib Ji in one place.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Sehaj Paath audio improvements.</span>{" "}
              The Read Gurbani player now has a draggable scrubber with current/total
              time, an improved Auto-advance toggle that resumes the next Ang cleanly,
              and prev/next Ang movers at both the top and bottom of the page.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Multiple Punjabi steeks per line.</span>{" "}
              Both the iPhone readers (SGGS, Sri Dasam Guru Granth Sahib Ji, and
              every Nitnem bani) and the website's{" "}
              <Link href="/granth" className="font-semibold text-amber-700 hover:underline">
                Read Gurbani
              </Link>{" "}
              page now offer two new toggles: <em>Punjabi Steek</em>{" "}
              (Prof Sahib Singh for SGGS-derived banis, Das Granthi for Dasam-derived
              banis) and <em>Classical Steek 1</em> (Faridkot Wala Teeka) for
              SGGS-derived banis. Each one renders inline beneath the Gurbani line
              when a match exists.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">iCloud sync for everything Sangat care about.</span>{" "}
              Notes, Favourites, and now reader settings (dark mode, font sizes,
              steek toggles, daily reminders, search defaults) all follow you to a
              new device or survive a fresh install. Notes + Favourites also share
              in bulk to Apple Notes, Mail, Messages, or Files from the share
              button in each list.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Resume where you left off.</span> The
              SGGS and Sri Dasam readers remember the line you were last reading,
              so re-opening Sri Mukhvak drops you straight back to the same spot
              instead of the top of the Ang. Synced across devices via iCloud.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Bani-to-bani flow on the web.</span>{" "}
              The{" "}
              <Link href="/banis" className="font-semibold text-amber-700 hover:underline">
                Banis directory
              </Link>{" "}
              reader now has Prev / Next bani buttons at the top and bottom, a
              Back-to-top button on long banis like Sri Sukhmani Sahib, and your
              filter toggle choices persist across banis and reloads so you don't
              have to set them again every time.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Daily reminder toggle.</span> About Us →
              Daily Reminders flips the evening Nitnem reminder and the gentle
              missed-day nudges on or off. On by default; off any time without
              affecting your saved progress.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Quiz pools expanded.</span> Four
              groupings: Daily Quiz (same 10 questions for Sangat worldwide),
              Favourited Words, Nitnem Bani Quizzes (now strictly scoped to lines
              within each bani, with no leakage from shared Angs), and Random Shabads
              from SGGS (fair-play random lines from anywhere in Sri Guru Granth
              Sahib Ji).
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Search default updated.</span> The
              search default match mode is now <em>Anywhere</em> across both the
              iPhone app and the website, so consonant-skeleton queries land lines
              starting from any word in the line.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Hukamnama picker (iPhone).</span> Tap
              Hukamnama on Home and pick Sri Guru Granth Sahib Ji or Sri Dasam
              Granth Sahib Ji. The reader opens on a random ang in a temporary
              session so it doesn't disturb the ang you were already studying.
              First time? Start from the bottom shabad (or the first complete
              shabad you come across as you scroll up), the same etiquette used
              when receiving Hukam in person.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Extra Nitnem from the Amrit Bani
              Gutka (iPhone).</span> Open the Nitnem checklist → Add Banis → Browse
              Amrit Bani Gutka to pick from 118 banis across 10 categories. Added
              banis show up on the Nitnem ring (so 7 + 1 reads as 8 of 8 today)
              and contribute to your streak going forward, without retroactively
              breaking past days.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Abhiyas inline Undo (iPhone).</span>{" "}
              Every Abhiyas Log row has an inline Undo button so you can drop the
              last count without opening the counter sheet. The Abhiyas Challenge
              counter card adds an Undo Last button too, and Reset Progress /
              Delete Challenge are tucked behind the ellipsis menu in the top-right
              with confirmation prompts so they're hard to tap by accident.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Game stats system (iPhone).</span>{" "}
              Every game now tracks your Best Score and a Daily Streak flame, with
              an optional speed bonus. Hitting 100, 500, 1,000, or 5,000 lifetime
              correct answers in any game brings up a Milestone Shabad card as a
              small reward.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">More archival Literature (iPhone).</span>{" "}
              Resources now points to additional treasured Gurmat reads from
              archive.org: Sri Dasam Granth Sahib Ji (Braham Dev Ji and Mehron
              steeks), Tarna Dal Nitnem Gutka, Dussehra Mahatam Pothi, Gurmukh
              Darshan by Giani Kirpal Singh Ji, the Taksali Steek Pehli Pothi
              (Sri Guru Granth Sahib Ji) by Sant Gurbachan Singh Ji Bhindranwale,
              Gurmukh Parkash by Sant Gurbachan Singh Ji, and Sampooran Sarab Loh
              Granth.
            </GoldDotItem>
          </ul>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Games (now live) */}
        <section>
          <SectionTitle>Games</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Games for kids and Sangat to make Brahamvidya learning fun and easy,
            organized by skill level. Multiple-choice quizzes, a memory match game,
            and more, all in the{" "}
            <Link href="/games" className="font-semibold text-amber-700 hover:underline">
              Games hub
            </Link>
            . The tap-to-hear{" "}
            <Link href="/games/letters" className="font-semibold text-amber-700 hover:underline">
              Gurmukhi Letters
            </Link>{" "}
            and{" "}
            <Link href="/games/muharni" className="font-semibold text-amber-700 hover:underline">
              Muharni
            </Link>{" "}
            sound boards now live under Learn.
          </p>
          <ul className="mt-4 space-y-3 text-slate-700">
            <GoldDotItem>
              <span className="font-semibold">Best Score, Streaks, and Milestone Shabads.</span>{" "}
              Every game now tracks your Best Score and a Daily Streak flame, with an optional
              speed bonus you can toggle on or off when you want pure accuracy. Cross 100, 500,
              1,000, or 5,000 lifetime correct answers in any game and a Milestone Shabad card
              appears as a small reward from Nitnem.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Beginner.</span> Name the Letter, Letter
              Quiz, and Muharni Quiz.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Intermediate.</span> First Letter Match, Memory
              Match (with a timer to beat), Akhar Sound Race, and Gurbani Scrabble.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">Advanced.</span> Tukh Completion (fill in the
              blank, or pick the odd-one-out for Jaap Sahib lines, with a per-bani source
              drill-down), Bani Identifier, Sentence Unscramble, and Punctuation Master.
            </GoldDotItem>
          </ul>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* What's Coming */}
        <section>
          <SectionTitle>What's Coming</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Sangat-requested features being built next:
          </p>
          <ul className="mt-4 space-y-3 text-slate-700">
            <GoldDotItem>
              <span className="font-semibold">Storytelling.</span> A new section
              for short AI-illustrated Sakhian and curated YouTube videos on
              Gurmat history, drawn from trusted Sangat sources.
            </GoldDotItem>
            <GoldDotItem>
              <span className="font-semibold">More games.</span> A Muharni Quiz
              once lagaan-level audio is available from gursevak.com, plus a
              Sangat-suggested Sakhi Quiz and Bani Order game.
            </GoldDotItem>
          </ul>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Vocabulary + Quiz */}
        <section>
          <SectionTitle>Gurbani Vocabulary, on every device</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            The{" "}
            <Link href="/arths" className="font-semibold text-amber-700 hover:underline">
              Gurbani Vocabulary builder
            </Link>{" "}
            is the shared backbone of Gurbani Tutor across iPhone and web. The same curated
            word list, the same arth, the same Ang references. From it we build the{" "}
            <Link href="/quiz" className="font-semibold text-amber-700 hover:underline">
              Gurbani Quiz
            </Link>{" "}
            in both places, with bani-by-bani pools (Sri Japji Sahib, Sri Jaap Sahib, Sri Tav
            Prasaad Savaiye, Sri Chaupai Sahib, Sri Anand Sahib, Sri Rehrass Sahib, Sri Kirtan
            Sohila Sahib, plus Sri Sukhmani Sahib Ji) drawn from the verified lines of each
            bani.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            On <span className="font-semibold">iPhone</span>, the same vocabulary lets you{" "}
            <span className="font-semibold">star words</span>,{" "}
            <span className="font-semibold">pin Gurbani lines</span> for review,{" "}
            <span className="font-semibold">scribe notes</span> on any verse, and watch your
            daily Nitnem, Simran, and Abhiyas progress in three concentric rings. The quiz
            tracks your best streak across sessions.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Also Recommended */}
        <section>
          <SectionTitle>Also Recommended</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            For a deeper, complementary learning experience, please also download the{" "}
            <strong>Learn Shudh Gurbani app</strong> by Gursevak.com.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* With Gratitude */}
        <section>
          <SectionTitle>With Gratitude</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            We are deeply thankful to the following Singhs for their invaluable contributions
            in creating, refining, and updating the Gurbani database that powers this app:
          </p>
          <ul className="mt-4 space-y-2">
            {CONTRIBUTORS.map((name) => (
              <GoldDotItem key={name}>{name}</GoldDotItem>
            ))}
          </ul>
          <p className="mt-5 italic leading-7 text-slate-600">
            And the beant Gursevaks who did, and are doing, loving seva. Your contributions,
            big and small, make this resource possible.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Feedback */}
        <section>
          <SectionTitle>Feedback</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Your suggestions and corrections help us improve. We would love to hear from you.
          </p>
          <a
            href="mailto:gurprasaadgursevak@gmail.com?subject=Gurbani%20Tutor%20Feedback"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            <span aria-hidden>✉️</span> gurprasaadgursevak@gmail.com
          </a>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Related project */}
        <section>
          <SectionTitle>Also Visit</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Gursevak.com is a companion website by the same Sangat that records
            the Nitnem audio you hear in the readers.
          </p>
          <a
            href="https://gursevak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-600 px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
          >
            <span aria-hidden>🌐</span> Gursevak.com
          </a>
        </section>

        <hr className="my-12 border-slate-200" />

        {/* Follow Us */}
        <section>
          <SectionTitle>Follow Us</SectionTitle>
          <p className="mt-3 leading-7 text-slate-700">
            Join the Sangat on Instagram for updates, learning tips, and Gurmat reflections.
          </p>
          <a
            href="https://instagram.com/gurbanitutor"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <span aria-hidden>📷</span> @gurbanitutor on Instagram
          </a>
        </section>

        <hr className="my-12 border-slate-200" />

        <p className="text-center italic leading-7 text-slate-600">
          May this platform serve as a humble resource in your journey toward Gurbani,
          Gurmat, and spiritual growth.
        </p>

        <p className="mt-8 text-center text-lg font-semibold leading-relaxed text-amber-700 sm:text-xl">
          ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
        </p>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-3xl px-6 text-center text-sm text-slate-500">
          <p>
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
