// POST /api/challenges
//
// Body (JSON):
//   { title: string, subtitle?: string, targetCount?: number,
//     targetSeconds?: number, companionText?: string, creator?: string }
//
// Returns: { token: string, url: string }
//
// The token resolves to the same payload via GET /api/challenges/<token> and
// is the path component of the shareable universal link gurbanitutor.com/c/<token>.
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { customAlphabet } from "nanoid";

// Crockford-style alphabet — no look-alike chars (no 0/O, 1/I/l) for typing
// friendliness if a Sangat ever has to read a link aloud.
const newToken = customAlphabet("23456789ABCDEFGHJKMNPQRSTVWXYZ", 7);

const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

type ChallengeBody = {
  title: string;
  subtitle?: string;
  targetCount?: number;
  targetSeconds?: number;
  companionText?: string;
  creator?: string;
};

function isValidBody(b: unknown): b is ChallengeBody {
  if (!b || typeof b !== "object") return false;
  const x = b as Record<string, unknown>;
  if (typeof x.title !== "string" || x.title.trim().length === 0 || x.title.length > 120) return false;
  if (x.subtitle !== undefined && (typeof x.subtitle !== "string" || x.subtitle.length > 240)) return false;
  if (x.targetCount !== undefined && (typeof x.targetCount !== "number" || x.targetCount < 1 || x.targetCount > 1_000_000)) return false;
  if (x.targetSeconds !== undefined && (typeof x.targetSeconds !== "number" || x.targetSeconds < 1 || x.targetSeconds > 86_400)) return false;
  if (x.companionText !== undefined && (typeof x.companionText !== "string" || x.companionText.length > 4_000)) return false;
  if (x.creator !== undefined && (typeof x.creator !== "string" || x.creator.length > 80)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isValidBody(body)) {
    return NextResponse.json({ error: "Invalid challenge payload" }, { status: 400 });
  }

  const token = newToken();
  const record = {
    ...body,
    token,
    createdAt: new Date().toISOString(),
  };

  try {
    await kv.set(`challenge:${token}`, record, { ex: TTL_SECONDS });
  } catch (e) {
    return NextResponse.json(
      { error: "Storage unavailable. Try again in a moment." },
      { status: 503 }
    );
  }

  const base = new URL(req.url);
  const url = `${base.protocol}//${base.host}/c/${token}`;
  return NextResponse.json({ token, url });
}
