"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ownerSchema, parseNearbyPlaces, propertySchema, reviewSchema, residentialPropertyTypes } from "@/lib/validations/schemas";
import type { FormState } from "@/lib/actions/form-state";

function splitLines(value?: string) {
  return (value || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function invalid(error: ZodError): FormState {
  return {
    status: "error",
    message: "Please fix the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors as FormState["fieldErrors"]
  };
}

type DbError = { message?: string; code?: string; details?: string } | null;

function dbMessage(error: NonNullable<DbError>): string {
  switch (error.code) {
    case "23505":
      return "A record with one of these unique values already exists (for example the slug).";
    case "23503":
      return "A linked record is missing. Refresh the page and try again.";
    case "23514":
      return "A value is outside the allowed range.";
    default:
      return error.message || "Database error. Please try again.";
  }
}

function requireId(formData: FormData): string {
  return String(formData.get("id") || "");
}

export async function upsertProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const nearbyParsed = parseNearbyPlaces(parsed.data.nearby_places);
  if (!nearbyParsed.success) {
    return {
      status: "error",
      message: "Please check the nearby places. Each saved place needs at least a name and category.",
      fieldErrors: { nearby_places: ["Please check nearby place details."] }
    };
  }

  const { image_urls, youtube_urls, nearby_places, ...propertyInput } = parsed.data;
  void nearby_places;
  const needsRooms = (residentialPropertyTypes as readonly string[]).includes(propertyInput.property_type);
  const property = {
    ...propertyInput,
    bedrooms: needsRooms ? propertyInput.bedrooms : null,
    bathrooms: needsRooms ? propertyInput.bathrooms : null
  };
  const id = requireId(formData);
  const { data, error } = id
    ? await supabaseAdmin.from("properties").update(property).eq("id", id).select("id").single()
    : await supabaseAdmin.from("properties").insert(property).select("id").single();

  if (error || !data) {
    const fieldErrors = error?.code === "23505" ? { slug: ["This slug is already taken — pick a different one."] } : undefined;
    return { status: "error", message: error ? dbMessage(error) : "Could not save the property.", fieldErrors };
  }

  if (id) {
    await supabaseAdmin.from("property_images").delete().eq("property_id", data.id);
    await supabaseAdmin.from("property_videos").delete().eq("property_id", data.id);
    await supabaseAdmin.from("property_nearby_places").delete().eq("property_id", data.id);
  }
  const images = splitLines(image_urls).map((url, index) => ({ property_id: data.id, url, alt: property.title, sort_order: index }));
  const videos = splitLines(youtube_urls).map((youtube_url) => ({ property_id: data.id, youtube_url, title: property.title }));
  const nearby = nearbyParsed.data.map((place, index) => ({ ...place, property_id: data.id, sort_order: index }));
  if (images.length) {
    const { error: imageError } = await supabaseAdmin.from("property_images").insert(images);
    if (imageError) return { status: "error", message: `Property saved, but the images failed: ${imageError.message}` };
  }
  if (videos.length) {
    const { error: videoError } = await supabaseAdmin.from("property_videos").insert(videos);
    if (videoError) return { status: "error", message: `Property saved, but the videos failed: ${videoError.message}` };
  }
  if (nearby.length) {
    const { error: nearbyError } = await supabaseAdmin.from("property_nearby_places").insert(nearby);
    if (nearbyError) return { status: "error", message: `Property saved, but nearby places failed: ${nearbyError.message}` };
  }

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function deleteProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = requireId(formData);
  if (!id) return { status: "error", message: "Missing property id." };
  const { error } = await supabaseAdmin.from("properties").delete().eq("id", id);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/admin/properties");
  return { status: "success", message: "Property deleted." };
}

export async function upsertOwner(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = ownerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = requireId(formData);
  const payload = { ...parsed.data, email: parsed.data.email || null, avatar_url: parsed.data.avatar_url || null };
  const { error } = id
    ? await supabaseAdmin.from("owners").update(payload).eq("id", id)
    : await supabaseAdmin.from("owners").insert(payload);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/admin/owners");
  return { status: "success", message: id ? "Owner updated." : "Owner created." };
}

export async function deleteOwner(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = requireId(formData);
  if (!id) return { status: "error", message: "Missing owner id." };
  const { error } = await supabaseAdmin.from("owners").delete().eq("id", id);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/admin/owners");
  return { status: "success", message: "Owner deleted." };
}

export async function upsertReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = requireId(formData);
  const { error } = id
    ? await supabaseAdmin.from("reviews").update(parsed.data).eq("id", id)
    : await supabaseAdmin.from("reviews").insert(parsed.data);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/admin/reviews");
  return { status: "success", message: id ? "Review updated." : "Review created." };
}

export async function approveReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = requireId(formData);
  if (!id) return { status: "error", message: "Missing review id." };
  const { error } = await supabaseAdmin.from("reviews").update({ approved: true }).eq("id", id);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { status: "success", message: "Review approved." };
}

export async function deleteReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = requireId(formData);
  if (!id) return { status: "error", message: "Missing review id." };
  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
  if (error) return { status: "error", message: dbMessage(error) };
  revalidatePath("/admin/reviews");
  return { status: "success", message: "Review deleted." };
}
