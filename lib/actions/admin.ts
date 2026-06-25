"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ownerSchema, propertySchema, reviewSchema } from "@/lib/validations/schemas";

function splitLines(value?: string) {
  return (value || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

export async function upsertProperty(formData: FormData) {
  const parsed = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid property data");
  const { image_urls, youtube_urls, ...property } = parsed.data;
  const id = String(formData.get("id") || "");
  const { data, error } = id
    ? await supabaseAdmin.from("properties").update(property).eq("id", id).select("id").single()
    : await supabaseAdmin.from("properties").insert(property).select("id").single();
  if (error) throw new Error(error.message);

  if (id) {
    await supabaseAdmin.from("property_images").delete().eq("property_id", data.id);
    await supabaseAdmin.from("property_videos").delete().eq("property_id", data.id);
  }
  const images = splitLines(image_urls).map((url, index) => ({ property_id: data.id, url, alt: property.title, sort_order: index }));
  const videos = splitLines(youtube_urls).map((youtube_url) => ({ property_id: data.id, youtube_url, title: property.title }));
  if (images.length) await supabaseAdmin.from("property_images").insert(images);
  if (videos.length) await supabaseAdmin.from("property_videos").insert(videos);
  revalidatePath("/");
  revalidatePath("/properties");
  redirect("/admin/properties");
}

export async function deleteProperty(formData: FormData) {
  await supabaseAdmin.from("properties").delete().eq("id", String(formData.get("id")));
  revalidatePath("/");
  revalidatePath("/properties");
}

export async function upsertOwner(formData: FormData) {
  const parsed = ownerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid owner data");
  const id = String(formData.get("id") || "");
  const payload = { ...parsed.data, email: parsed.data.email || null, avatar_url: parsed.data.avatar_url || null };
  const request = id ? supabaseAdmin.from("owners").update(payload).eq("id", id) : supabaseAdmin.from("owners").insert(payload);
  const { error } = await request;
  if (error) throw new Error(error.message);
  revalidatePath("/admin/owners");
}

export async function deleteOwner(formData: FormData) {
  await supabaseAdmin.from("owners").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/owners");
}

export async function upsertReview(formData: FormData) {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid review data");
  const id = String(formData.get("id") || "");
  const request = id ? supabaseAdmin.from("reviews").update(parsed.data).eq("id", id) : supabaseAdmin.from("reviews").insert(parsed.data);
  const { error } = await request;
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function approveReview(formData: FormData) {
  await supabaseAdmin.from("reviews").update({ approved: true }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  await supabaseAdmin.from("reviews").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/reviews");
}
