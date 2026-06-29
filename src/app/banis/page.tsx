"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SocialLinks from "../SocialLinks";
import { baniHasAudio } from "../baniAudio";
import GurbaniSearchPin from "../GurbaniSearchPin";

// Hand-curated Nitnem + Sundar Gutka banis. The id here must match the id used
// in `granth/page.tsx`'s BANI_LIST so deep-links via `?bani=<id>` resolve.
type CuratedBani = {
  id: string;
  name: string;
  subtitle: string;
};

const NITNEM: CuratedBani[] = [
  { id: "moolMantar", name: "Mool Mantar", subtitle: "Beginning of Sri Guru Granth Sahib Ji" },
  { id: "japji", name: "Sri Japji Sahib", subtitle: "Morning Nitnem · M1" },
  { id: "jaap", name: "Sri Jaap Sahib", subtitle: "Morning Nitnem · Sri Dasam Guru Granth Sahib Ji" },
  { id: "tvaPrasaad", name: "Sri Tav Prasaad Savaiye", subtitle: "Morning Nitnem · from Akal Ustat" },
  { id: "chaupai", name: "Sri Chaupai Sahib", subtitle: "Evening Nitnem · M10" },
  { id: "anand", name: "Sri Anand Sahib", subtitle: "Ramkali · M3" },
  { id: "rehras", name: "Sri Rehrass Sahib", subtitle: "Evening Nitnem · composite from SGGS and Sri Dasam" },
  { id: "rakhiaDeShabad", name: "Rakhia Day Shabad", subtitle: "Read after Sri Rehrass Sahib" },
  { id: "kirtanSohila", name: "Sri Kirtan Sohila Sahib", subtitle: "Bedtime Nitnem" },
];

const SUNDAR_GUTKA: CuratedBani[] = [
  { id: "sukhmani", name: "Sri Sukhmani Sahib Ji", subtitle: "Gauri · M5 · Ang 262 to 296" },
  { id: "aarti", name: "Aarti", subtitle: "Compiled · selected verses" },
  { id: "ramkaliKiVaar", name: "Ramkali Ki Vaar", subtitle: "Rai Balvand & Satta · Ang 966-968" },
  { id: "basantKiVaar", name: "Basant Ki Vaar", subtitle: "M5 · Ang 1193" },
  { id: "shabadHazareP10", name: "Shabad Hazaray Patshahi 10", subtitle: "Sri Dasam · Patshahi 10" },
  { id: "svaiyeDeenan", name: "Svaiye Deenan", subtitle: "Compiled · Patshahi 10" },
];

type ExtraBani = {
  sectionId: number;
  name: string;
  nameGurmukhi: string;
  verseCount?: number;
};

type ExtraCategory = {
  id: number;
  name: string;
  nameGurmukhi: string;
  banis: ExtraBani[];
};

export default function BanisPage() {
  const [extra, setExtra] = useState<ExtraCategory[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/banis_manifest.json");
        if (!res.ok) return;
        const data: { categories: ExtraCategory[] } = await res.json();
        if (cancelled) return;
        // Filter out banis whose source DB isn't loaded yet (verseCount === 0)
        // and drop any category that ends up empty after the filter. Those
        // entries will reappear automatically once the manifest ships their
        // verse data in a future deploy.
        const trimmed = data.categories
          .map((c) => ({
            ...c,
            banis: c.banis.filter((b) => (b.verseCount ?? 0) > 0),
          }))
          .filter((c) => c.banis.length > 0);
        setExtra(trimmed);
      } catch {
        // Silently degrade: curated banis still work.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalExtra = useMemo(
    () => extra.reduce((n, c) => n + c.banis.length, 0),
    [extra]
  );

  const q = query.trim().toLowerCase();
  const matchesQuery = (s: string) => q === "" || s.toLowerCase().includes(q);

  const nitnemFiltered = NITNEM.filter((b) => matchesQuery(b.name) || matchesQuery(b.subtitle));
  const sundarFiltered = SUNDAR_GUTKA.filter((b) => matchesQuery(b.name) || matchesQuery(b.subtitle));
  const extraFiltered = extra
    .map((c) => ({
      ...c,
      banis: c.banis.filter((b) => matchesQuery(b.name) || matchesQuery(c.name)),
    }))
    .filter((c) => c.banis.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <GurbaniSearchPin />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Amrit Banis
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Read a Bani.
          </h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            Nitnem, Sundar Gutka, plus {totalExtra} more banis across Beant Bani,
            Bhagat Bani, Baee Vara, and other categories. Tap any bani to open it
            in the reader.
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search
          </label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Japji, Sukhmani, Anand"
            className="mt-1 w-full max-w-xl rounded-xl border border-slate-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        {nitnemFiltered.length > 0 && (
          <Section title="Nitnem" count={nitnemFiltered.length}>
            <BaniGrid banis={nitnemFiltered} />
          </Section>
        )}

        {sundarFiltered.length > 0 && (
          <Section title="Sundar Gutka" count={sundarFiltered.length}>
            <BaniGrid banis={sundarFiltered} />
          </Section>
        )}

        {extraFiltered.map((cat) => (
          <Section
            key={cat.id}
            title={cat.name}
            subtitle={cat.nameGurmukhi}
            count={cat.banis.length}
          >
            <BaniGrid
              banis={cat.banis.map((b) => ({
                id: `mfst_${cat.id}_${b.sectionId}`,
                name: b.name,
                subtitle: cat.name,
              }))}
            />
          </Section>
        ))}

        {q !== "" &&
          nitnemFiltered.length === 0 &&
          sundarFiltered.length === 0 &&
          extraFiltered.length === 0 && (
            <p className="mt-10 text-center text-slate-500">
              No banis match your search.
            </p>
          )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/granth" className="font-medium text-amber-700 hover:underline">
              Read Gurbani
            </Link>
            {" · "}
            <Link href="/search" className="font-medium text-amber-700 hover:underline">
              Gurbani Search
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  subtitle,
  count,
  children,
}: {
  title: string;
  subtitle?: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
          {subtitle && (
            <span className="ml-2 text-base font-normal text-slate-500">
              {subtitle}
            </span>
          )}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {count} {count === 1 ? "bani" : "banis"}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BaniGrid({ banis }: { banis: CuratedBani[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {banis.map((bani) => (
        <li key={bani.id}>
          <Link
            href={`/granth?bani=${encodeURIComponent(bani.id)}`}
            className="flex h-full min-h-[80px] flex-col justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400 hover:shadow-md"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              {bani.name}
              {/* Mirrors the iOS Sundar Gutka list: a small speaker glyph
                  flags the banis with a Bhagat Jaswant Singh Ji recording
                  available in the reader. */}
              {baniHasAudio(bani.id) && (
                <span aria-label="Audio available" title="Audio available" className="text-amber-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A6.5 6.5 0 0 1 14 18.71v2.06A8.5 8.5 0 0 0 14 3.23z"/>
                  </svg>
                </span>
              )}
            </span>
            {bani.subtitle && (
              <span className="mt-1 text-xs text-slate-500">{bani.subtitle}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
