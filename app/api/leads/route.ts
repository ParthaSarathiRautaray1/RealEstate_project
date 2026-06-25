import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations/schemas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { error } = await supabaseAdmin.from("leads").insert(parsed.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      await resend.emails.send({
        from: "Aurum Estates <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `New property inquiry from ${parsed.data.name}`,
        html: `<p><strong>${parsed.data.name}</strong> submitted an inquiry.</p><p>Email: ${parsed.data.email}<br/>Phone: ${parsed.data.phone}<br/>Budget: ${parsed.data.budget || "Not provided"}</p><p>${parsed.data.message || ""}</p>`
      });
    } catch (error) {
      console.error("Lead saved, but Resend notification failed:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
