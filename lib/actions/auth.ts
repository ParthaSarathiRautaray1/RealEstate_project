"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/form-state";

export async function loginAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!email || !password) return { status: "error", message: "Enter both your email and password." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { status: "error", message: error?.message || "Invalid email or password." };

  const { data: admin } = await supabase.from("admins").select("id").eq("id", data.user.id).single();
  if (!admin) {
    await supabase.auth.signOut();
    return { status: "error", message: "This account is not registered as an admin." };
  }
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
