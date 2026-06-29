// Public join page for a shared Sangat challenge.
//
//   * The whole challenge is encoded inline in the link path
//     (https://gurbanitutor.com/c/<base64url>), so there is no server / KV
//     lookup — nothing to fail.
//   * If iOS Universal Links are configured (they are, via the AASA file in
//     /public/.well-known/), the iOS app intercepts the URL and handles it
//     directly. This page renders for users without the app (web, Android,
//     desktop) and offers an explicit deeplink + Get-the-app button.
import Link from "next/link";

const TESTFLIGHT_URL = "https://testflight.apple.com/join/8HEDEXYY";

type ChallengeSpec = {
  id?: string;
  title: string;
  subtitle?: string;
  targetCount?: number;
  targetSeconds?: number;
  companionText?: string;
};

/// Decodes the inline base64url challenge from the link path. Returns the
/// spec plus the standard-base64 form used for the explicit app deeplink.
/// Returns null for anything that isn't a valid encoded challenge (e.g. a
/// legacy server-token link from an older app version).
function decodeSpec(seg: string): { spec: ChallengeSpec; standardB64: string } | null {
  try {
    let b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const spec = JSON.parse(json) as ChallengeSpec;
    if (!spec || typeof spec.title !== "string" || spec.title.length === 0) return null;
    return { spec, standardB64: b64 };
  } catch {
    return null;
  }
}

function formatTarget(c: ChallengeSpec): string {
  if (c.targetCount) return `${c.targetCount.toLocaleString()} repetitions`;
  if (c.targetSeconds) {
    const m = Math.round(c.targetSeconds / 60);
    return `${m} minute${m === 1 ? "" : "s"}`;
  }
  return "Daily practice";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center">
          <p lang="pa" className="text-base font-semibold text-amber-800">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}

export default async function ChallengeJoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const decoded = decodeSpec(token);

  // Legacy / unreadable link: show a friendly fallback instead of a 404.
  if (!decoded) {
    return (
      <Shell>
        <div className="mt-8 rounded-3xl border border-amber-300 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">This challenge link couldn&apos;t be opened</h1>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            It may be from an older version of the app. Ask the Sangat member to reshare it
            from the latest Gurbani Tutor, then tap the new link.
          </p>
          <Link
            href={TESTFLIGHT_URL}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Get the Gurbani Tutor app
          </Link>
        </div>
      </Shell>
    );
  }

  const { spec, standardB64 } = decoded;
  // Explicit deeplink for Sangat on iOS who declined the universal-link
  // banner. Carries the same challenge inline, so it still needs no server.
  const appLink = `gurbanitutor://challenge?spec=${encodeURIComponent(standardB64)}`;

  return (
    <Shell>
      <div className="mt-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          You&apos;ve been invited to a Sangat Abhiyaas
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-amber-300 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{spec.title}</h1>
        {spec.subtitle && <p className="mt-2 text-base text-slate-700">{spec.subtitle}</p>}

        <div className="mt-6 rounded-2xl bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Daily target
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatTarget(spec)}</p>
        </div>

        {spec.companionText && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Read along
            </p>
            <p
              lang="pa"
              className="mt-2 rounded-2xl bg-slate-50 p-4 text-lg leading-9 text-slate-900"
            >
              {spec.companionText}
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
            href={TESTFLIGHT_URL}
            className="inline-flex w-full items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-500"
          >
            Don&apos;t have the app? Get the free beta
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Shared from Gurbani Tutor. Let&apos;s do it together for Vaheguru.
      </p>
    </Shell>
  );
}
