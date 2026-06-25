import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";

const propertySelect = "*, owners(*), property_images(*), property_videos(*), reviews(*)";

export async function getProperties({ featured, limit, query, type, sort = "created_at" }: { featured?: boolean; limit?: number; query?: string; type?: string; sort?: string } = {}) {
  const supabase = await createClient();
  let request = supabase.from("properties").select(propertySelect).eq("status", "published");
  if (featured !== undefined) request = request.eq("featured", featured);
  if (query) request = request.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
  if (type) request = request.eq("property_type", type);
  if (sort === "price_asc") request = request.order("price", { ascending: true });
  else if (sort === "price_desc") request = request.order("price", { ascending: false });
  else request = request.order("created_at", { ascending: false });
  if (limit) request = request.limit(limit);
  const { data, error } = await request;
  if (error) throw error;
  return (data || []) as Property[];
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select(propertySelect).eq("slug", slug).single();
  if (error) return null;
  return data as Property;
}

export function averageRating(property: Property) {
  const reviews = (property.reviews || []).filter((review) => review.approved);
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}
