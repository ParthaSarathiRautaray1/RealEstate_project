import { Building2, MessageSquare, Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  const [properties, leads, reviews, featured] = await Promise.all([
    supabaseAdmin.from("properties").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("reviews").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("properties").select("*", { count: "exact", head: true }).eq("featured", true)
  ]);
  const metrics = [
    ["Total Properties", properties.count || 0, Building2],
    ["Total Leads", leads.count || 0, MessageSquare],
    ["Total Reviews", reviews.count || 0, Star],
    ["Featured Properties", featured.count || 0, Trophy]
  ] as const;
  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value, Icon]) => <Card key={label}><CardContent className="p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></CardContent></Card>)}
      </div>
    </div>
  );
}
