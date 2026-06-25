import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: number | null;
  message: string | null;
  properties?: { title: string; slug: string } | null;
};

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  let query = supabaseAdmin.from("leads").select("*, properties(title,slug)").order("created_at", { ascending: false });
  if (params.q) query = query.or(`name.ilike.%${params.q}%,email.ilike.%${params.q}%,phone.ilike.%${params.q}%`);
  const { data } = await query;
  return (
    <div>
      <div className="flex items-center justify-between gap-4"><h1 className="font-serif text-4xl font-semibold">Leads</h1><Button asChild><Link href="/api/admin/leads/export"><Download className="h-4 w-4" />Export Excel</Link></Button></div>
      <form className="mt-6"><input name="q" defaultValue={params.q || ""} placeholder="Search leads" className="h-10 w-full max-w-md rounded-md border bg-background px-3 text-sm" /></form>
      <div className="mt-6 grid gap-3">
        {data?.length ? (data as LeadRow[]).map((lead) => <Card key={lead.id}><CardContent className="grid gap-2 p-4 md:grid-cols-[1fr_1fr_1fr]"><div><p className="font-semibold">{lead.name}</p><p className="text-sm text-muted-foreground">{lead.email} · {lead.phone}</p></div><div className="text-sm"><p>{lead.properties?.title || "General inquiry"}</p><p className="text-muted-foreground">{lead.budget ? formatCurrency(Number(lead.budget)) : "No budget"}</p></div><p className="text-sm text-muted-foreground">{lead.message || "No message"}</p></CardContent></Card>) : <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">No leads yet.</div>}
      </div>
    </div>
  );
}
