"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type T = { pa: string; en: string };
type Step = { id: string; icon: string; heading: T; body: T };
type Guide = { title: T; source: string; intro: T; steps: Step[]; note: T };

export default function WritingGuidePage() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [failed, setFailed] = useState(false);
  const [lang, setLang] = useState<"pa" | "en">("en");

  useEffect(() => {
    fetch("/balupdesh_writing_guide.json")
      .then((r) => r.json())
      .then(setGuide)
      .catch(() => setFailed(true));
  }, []);

  const pa = lang === "pa";
  const t = (x: T) => (pa ? x.pa : x.en);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Santhiya 101</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How to Write the Letters
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-700">
            The method for forming each letter, especially which way the pen should move. Read it once,
            carefully, then practise.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-2">
        {failed && (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            The guide could not be loaded. Please try again later.
          </p>
        )}
        {!guide && !failed && <p className="text-center text-sm text-slate-500">Loading…</p>}

        {guide && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                {(["pa", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={[
                      "rounded-full px-4 py-1.5 text-sm font-semibold transition",
                      lang === l ? "bg-amber-600 text-white" : "text-slate-600",
                    ].join(" ")}
                  >
                    {l === "pa" ? "ਪੰਜਾਬੀ" : "English"}
                  </button>
                ))}
              </div>
            </div>

            <p lang={pa ? "pa" : undefined} className="text-base leading-7 text-slate-700">
              {t(guide.intro)}
            </p>

            {guide.steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span aria-hidden className="text-2xl">
                  {step.icon}
                </span>
                <div className="min-w-0">
                  <p lang={pa ? "pa" : undefined} className="font-semibold text-amber-700">
                    {t(step.heading)}
                  </p>
                  <p lang={pa ? "pa" : undefined} className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-800">
                    {t(step.body)}
                  </p>
                </div>
              </div>
            ))}

            <p lang={pa ? "pa" : undefined} className="text-sm text-slate-600">
              {t(guide.note)}
            </p>
            <p className="text-xs text-slate-500">{guide.source}</p>
          </div>
        )}

        <p className="mt-12 text-center text-sm text-slate-500">
          <Link href="/muharni" className="font-medium text-amber-700 hover:underline">
            Back to Santhiya 101
          </Link>
        </p>
      </main>
    </div>
  );
}
