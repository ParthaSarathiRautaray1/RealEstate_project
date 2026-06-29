"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { reviewSchema, type ReviewInput } from "@/lib/validations/schemas";

export function ReviewForm({ propertyId }: { propertyId: string }) {
  const [toast, setToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [rating, setRating] = useState(5);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { property_id: propertyId, user_name: "", rating: 5, review: "", approved: false }
  });

  async function onSubmit(values: ReviewInput) {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, approved: false })
      });
      if (!response.ok) throw new Error("Unable to submit review");
      reset({ property_id: propertyId, user_name: "", rating: 5, review: "", approved: false });
      setRating(5);
      setToast(true);
    } catch {
      setErrorToast(true);
    }
  }

  function chooseRating(value: number) {
    setRating(value);
    setValue("rating", value, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 rounded-lg border bg-muted/35 p-4">
      <input type="hidden" {...register("property_id")} />
      <input type="hidden" {...register("approved")} />
      <div className="grid gap-2">
        <Label>Your name</Label>
        <Input {...register("user_name")} placeholder="Enter your name" />
        {errors.user_name ? <p className="text-sm text-destructive">{errors.user_name.message}</p> : null}
      </div>
      <div className="grid gap-2">
        <Label>Rating</Label>
        <input type="hidden" {...register("rating")} />
        <div className="flex gap-1" aria-label="Choose a rating">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <button key={value} type="button" onClick={() => chooseRating(value)} className="rounded-md p-1 transition hover:bg-background" aria-label={`${value} star${value === 1 ? "" : "s"}`}>
                <Star className={value <= rating ? "h-6 w-6 fill-accent text-accent" : "h-6 w-6 text-muted-foreground/35"} />
              </button>
            );
          })}
        </div>
        {errors.rating ? <p className="text-sm text-destructive">{errors.rating.message}</p> : null}
      </div>
      <div className="grid gap-2">
        <Label>Review</Label>
        <Textarea {...register("review")} placeholder="Share what stood out about this property." />
        {errors.review ? <p className="text-sm text-destructive">{errors.review.message}</p> : null}
      </div>
      <Button disabled={isSubmitting} className="w-full sm:w-fit">{isSubmitting ? "Submitting..." : "Submit review"}</Button>
      <p className="text-xs text-muted-foreground">Reviews appear after admin approval.</p>
      <Toast open={toast} onOpenChange={setToast} title="Review submitted" description="Thanks. It will appear after admin approval." />
      <Toast open={errorToast} onOpenChange={setErrorToast} title="Review failed" description="Please try again in a moment." />
    </form>
  );
}
