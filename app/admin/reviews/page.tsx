import { Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/admin/action-button";
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
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Reviews</h1>
      <div className="mt-6 grid gap-3">
        {data?.length ? (data as ReviewRow[]).map((review) => (
          <Card key={review.id}>
            <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="safe-break font-semibold">{review.user_name} · {"*".repeat(review.rating)}</p>
                <p className="safe-break text-sm text-muted-foreground">{review.properties?.title} · {review.approved ? "Approved" : "Pending"}</p>
                <p className="safe-break mt-2 text-sm">{review.review}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!review.approved ? (
                  <ActionButton action={approveReview} id={review.id} variant="outline" size="icon" ariaLabel="Approve review">
                    <Check className="h-4 w-4" />
                  </ActionButton>
                ) : null}
                <ActionButton action={deleteReview} id={review.id} confirm="Delete this review?" variant="ghost" size="icon" ariaLabel="Delete review">
                  <Trash2 className="h-4 w-4" />
                </ActionButton>
              </div>
            </CardContent>
          </Card>
        )) : <div className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">No reviews yet.</div>}
      </div>
    </div>
  );
}
