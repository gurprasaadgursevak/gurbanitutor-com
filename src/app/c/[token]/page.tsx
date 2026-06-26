// Public join page for a shared Sangat challenge.
//
//   * Renders the challenge title, target, and creator
//   * If iOS Universal Links are configured (which they are via the AASA
//     file in /public/.well-known/), the iOS app intercepts the URL and
//     handles it directly. This page only renders for users without the
//     app installed (web, Android, desktop)
//   * Offers an explicit "Open in Gurbani Tutor app" deeplink so users on
//     iOS who declined the universal-link prompt can still launch the app
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

type Challenge = {
  token: string;
  title: string;
  subtitle?: string;
  targetCount?: number;
  targetSeconds?: number;
  companionText?: string;
  creator?: string;
  createdAt?: string;
};

async function fetchChallenge(token: string): Promise<Challenge | null> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) return null;
  try {
    const res = await fetch(`${proto}://${host}/api/challenges/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Challenge;
  } catch {
    return null;
  }
}

function formatTarget(c: Challenge): string {
  if (c.targetCount) return `${c.targetCount.toLocaleString()} repetitions`;
  if (c.targetSeconds) {
    const m = Math.round(c.targetSeconds / 60);
    return `${m} minute${m === 1 ? "" : "s"}`;
  }
  return "Daily practice";
}

export default async function ChallengeJoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const challenge = await fetchChallenge(token);
  if (!challenge) notFound();

  // The iOS app honours the same deeplink scheme it shipped with — the
  // universal-link flow is preferred (handled at the OS level), but this
  // explicit button lets Sangat who tapped "Cancel" on the universal link
  // banner still get into the app.
  const appLink = `gurbanitutor://challenge?token=${token}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center">
          <p lang="pa" className="text-base font-semibold text-amber-800">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            You&apos;ve been invited to a Sangat Challenge
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-300 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {challenge.title}
          </h1>
          {challenge.subtitle && (
            <p className="mt-2 text-base text-slate-700">{challenge.subtitle}</p>
          )}
          {challenge.creator && (
            <p className="mt-3 text-sm text-slate-500">Shared by {challenge.creator}</p>
          )}

          <div className="mt-6 rounded-2xl bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Daily target
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{formatTarget(challenge)}</p>
          </div>

          {challenge.companionText && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Read along
              </p>
              <p
                lang="pa"
                className="mt-2 rounded-2xl bg-slate-50 p-4 text-lg leading-9 text-slate-900"
              >
                {challenge.companionText}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={appLink}
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
            >
              Join in the Gurbani Tutor app
            </a>
            <Link
              href="https://apps.apple.com/app/id0000000000"
              className="inline-flex w-full items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-500"
            >
              Don&apos;t have the app? Get it on the App Store
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Challenge token: <span className="font-mono">{challenge.token}</span>
        </p>
      </main>
    </div>
  );
}
