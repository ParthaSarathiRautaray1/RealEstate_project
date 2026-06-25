import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/admin/action-button";
import { OwnerForm } from "@/components/admin/owner-form";
import { deleteOwner } from "@/lib/actions/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function OwnersPage() {
  const { data } = await supabaseAdmin.from("owners").select("*").order("created_at", { ascending: false });
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <OwnerForm />
      <div>
        <h2 className="mb-4 font-serif text-4xl font-semibold">Owners</h2>
        <div className="grid gap-3">
          {data?.length ? data.map((owner) => (
            <Card key={owner.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{owner.name}</p>
                  <p className="text-sm text-muted-foreground">{owner.email || "No email"} · {owner.phone || "No phone"}</p>
                </div>
                <ActionButton action={deleteOwner} id={owner.id} confirm="Delete this owner?" variant="ghost" size="icon" ariaLabel="Delete owner">
                  <Trash2 className="h-4 w-4" />
                </ActionButton>
              </CardContent>
            </Card>
          )) : <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">No owners yet.</div>}
        </div>
      </div>
    </div>
  );
}
