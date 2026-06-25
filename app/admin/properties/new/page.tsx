import { PropertyForm } from "@/components/admin/property-form";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function NewPropertyPage() {
  const { data: owners } = await supabaseAdmin.from("owners").select("*").order("name");
  return <div><h1 className="mb-6 font-serif text-3xl font-semibold sm:text-4xl">New property</h1><PropertyForm owners={owners || []} /></div>;
}
