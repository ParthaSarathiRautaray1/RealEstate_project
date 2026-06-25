import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { approveReview, deleteReview } from "@/lib/actions/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ReviewRow = {
  id: string;
  user_name: string;
  rating: number;
  review: string;
  approved: boolean;
  properties?: { title: string } | null;
};

export default async function ReviewsPage() {
  const { data } = await supabaseAdmin.from("reviews").select("*, properties(title)").order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Reviews</h1>
      <div className="mt-6 grid gap-3">
        {data?.length ? (data as ReviewRow[]).map((review) => <Card key={review.id}><CardContent className="flex items-center justify-between gap-4 p-4"><div><p className="font-semibold">{review.user_name} · {"*".repeat(review.rating)}</p><p className="text-sm text-muted-foreground">{review.properties?.title} · {review.approved ? "Approved" : "Pending"}</p><p className="mt-2 text-sm">{review.review}</p></div><div className="flex gap-2">{!review.approved ? <form action={approveReview}><input type="hidden" name="id" value={review.id} /><Button size="icon" variant="outline"><Check className="h-4 w-4" /></Button></form> : null}<form action={deleteReview}><input type="hidden" name="id" value={review.id} /><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button></form></div></CardContent></Card>) : <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">No reviews yet.</div>}
      </div>
    </div>
  );
}
