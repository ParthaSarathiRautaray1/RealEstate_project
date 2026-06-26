"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-primary">Something went wrong</p>
      <h1 className="font-serif text-4xl font-semibold">We couldn&apos;t load this page</h1>
      <p className="max-w-md text-muted-foreground">An unexpected error occurred while loading content. Please try again — if it keeps happening, refresh in a moment.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
