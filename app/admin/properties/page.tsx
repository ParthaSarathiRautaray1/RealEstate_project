import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/admin/action-button";
import { deleteProperty } from "@/lib/actions/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

type AdminPropertyRow = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
};

export default async function AdminPropertiesPage() {
  const { data } = await supabaseAdmin.from("properties").select("*, owners(name)").order("created_at", { ascending: false });
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-4xl font-semibold">Properties</h1><Button asChild><Link href="/admin/properties/new"><Plus className="h-4 w-4" />New</Link></Button></div>
      <div className="mt-6 grid gap-3">
        {data?.length ? (data as AdminPropertyRow[]).map((property) => <Card key={property.id}><CardContent className="flex items-center justify-between gap-4 p-4"><div><Link className="font-semibold hover:underline" href={`/admin/properties/${property.id}/edit`}>{property.title}</Link><p className="text-sm text-muted-foreground">{property.location} · {formatCurrency(Number(property.price))} · {property.status}</p></div><ActionButton action={deleteProperty} id={property.id} confirm="Delete this property? This cannot be undone." variant="ghost" size="icon" ariaLabel="Delete property"><Trash2 className="h-4 w-4" /></ActionButton></CardContent></Card>) : <Empty label="No properties yet." />}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">{label}</div>;
}
