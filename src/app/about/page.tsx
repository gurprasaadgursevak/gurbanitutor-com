import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SocialLinks from "../SocialLinks";

export const metadata: Metadata = {
  title: "About Us — Gurbani Tutor",
  description:
    "Gurbani Tutor is an education app for Shudh Gurbani Santhiya, focused on learning, understanding, and connecting with Gurbani. Built by the Sangat, for the Sangat.",
};

const CONTRIBUTORS = [
  "Bhai Santokh Singh (Bhai Sukhdeep Singh)",
  "Bhai Randip Singh",
  "Bhai Jagneet Singh",
  "Bhai Gursevak Dot Com Singh",
  "Bhai Gurjot Singh",
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
