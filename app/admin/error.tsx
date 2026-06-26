"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center gap-4 rounded-lg border bg-card p-6">
      <h1 className="font-serif text-2xl font-semibold">This dashboard view failed to load</h1>
      <p className="max-w-md text-sm text-muted-foreground">An unexpected error occurred. This is usually a temporary database or network hiccup. Try again, or reload the page.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
