import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Property } from "@/lib/types";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: property }, { data: owners }] = await Promise.all([
    supabaseAdmin.from("properties").select("*, property_images(*), property_videos(*)").eq("id", id).single(),
    supabaseAdmin.from("owners").select("*").order("name")
  ]);
  if (!property) notFound();
  return <div><h1 className="mb-6 font-serif text-4xl font-semibold">Edit property</h1><PropertyForm property={property as Property} owners={owners || []} /></div>;
}
