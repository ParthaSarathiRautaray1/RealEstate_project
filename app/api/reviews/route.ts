import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { reviewSchema } from "@/lib/validations/schemas";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 4;
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many review submissions. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse({ ...body, approved: false });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { property_id, user_name, rating, review } = parsed.data;
  const { error } = await supabaseAdmin.from("reviews").insert({
    property_id,
    user_name,
    rating,
    review,
    approved: false
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
