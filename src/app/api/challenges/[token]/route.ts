// GET /api/challenges/<token>
//
// Returns the stored challenge or 404. Used by:
//   * /c/<token>/page.tsx for the public join screen
//   * the iOS app when the universal link opens, to hydrate the join flow
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const TOKEN_PATTERN = /^[2-9A-HJ-NP-Z]{4,12}$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!TOKEN_PATTERN.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  try {
    const record = await kv.get(`challenge:${token}`);
    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch {
    return NextResponse.json(
      { error: "Storage unavailable. Try again in a moment." },
      { status: 503 }
    );
  }
}
