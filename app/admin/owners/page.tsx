import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteOwner, upsertOwner } from "@/lib/actions/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function OwnersPage() {
  const { data } = await supabaseAdmin.from("owners").select("*").order("created_at", { ascending: false });
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card><CardContent className="p-6"><h1 className="font-serif text-3xl font-semibold">Add owner</h1><form action={upsertOwner} className="mt-5 grid gap-4"><Field label="Name" name="name" /><Field label="Email" name="email" type="email" /><Field label="Phone" name="phone" /><Field label="Avatar URL" name="avatar_url" /><div className="grid gap-2"><Label>Bio</Label><Textarea name="bio" /></div><Button>Create owner</Button></form></CardContent></Card>
      <div><h2 className="mb-4 font-serif text-4xl font-semibold">Owners</h2><div className="grid gap-3">{data?.length ? data.map((owner) => <Card key={owner.id}><CardContent className="flex items-center justify-between p-4"><div><p className="font-semibold">{owner.name}</p><p className="text-sm text-muted-foreground">{owner.email || "No email"} · {owner.phone || "No phone"}</p></div><form action={deleteOwner}><input type="hidden" name="id" value={owner.id} /><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></form></CardContent></Card>) : <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">No owners yet.</div>}</div></div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...input } = props;
  return <div className="grid gap-2"><Label>{label}</Label><Input {...input} /></div>;
}
