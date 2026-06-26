import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations/schemas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

// Lightweight per-instance fixed-window rate limiter. For multi-instance
// production (multiple Vercel lambdas) move this to Upstash Redis so the
// window is shared across instances.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
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

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Honeypot: a filled "company" field means a bot. Pretend success so the bot
  // gets no signal, but never persist or notify. Strip it before inserting.
  const { company, ...lead } = parsed.data;
  if (company && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin.from("leads").insert(lead);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      await resend.emails.send({
        from: "Aurum Estates <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `New property inquiry from ${escapeHtml(lead.name)}`,
        html: `<p><strong>${escapeHtml(lead.name)}</strong> submitted an inquiry.</p><p>Email: ${escapeHtml(lead.email)}<br/>Phone: ${escapeHtml(lead.phone)}<br/>Budget: ${escapeHtml(lead.budget || "Not provided")}</p><p>${escapeHtml(lead.message || "")}</p>`
      });
    } catch (error) {
      console.error("Lead saved, but Resend notification failed:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
