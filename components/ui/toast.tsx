"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastPrimitives.Provider swipeDirection="right">{children}<ToastPrimitives.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2" /></ToastPrimitives.Provider>;
}

export function Toast({ title, description, open, onOpenChange }: { title: string; description?: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <ToastPrimitives.Root open={open} onOpenChange={onOpenChange} className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-luxury")}>
      <ToastPrimitives.Title className="font-semibold">{title}</ToastPrimitives.Title>
      {description ? <ToastPrimitives.Description className="mt-1 text-sm text-muted-foreground">{description}</ToastPrimitives.Description> : null}
    </ToastPrimitives.Root>
  );
}
