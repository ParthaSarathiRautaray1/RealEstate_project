"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { idleState, type FormState } from "@/lib/actions/form-state";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Single-button form bound to a server action (delete / approve / etc).
 * Surfaces failures as a toast so the admin always sees why an action did not
 * work; on success the surrounding list revalidates. Optional confirm guard
 * for destructive actions.
 */
export function ActionButton({
  action,
  id,
  children,
  confirm,
  errorTitle = "Action failed",
  variant,
  size,
  className,
  ariaLabel
}: {
  action: Action;
  id: string;
  children: React.ReactNode;
  confirm?: string;
  errorTitle?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  ariaLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, idleState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.status === "error") setOpen(true);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={className}
        aria-label={ariaLabel}
        disabled={pending}
        onClick={(e) => { if (confirm && !window.confirm(confirm)) e.preventDefault(); }}
      >
        {children}
      </Button>
      <Toast open={open} onOpenChange={setOpen} title={errorTitle} description={state.message} />
    </form>
  );
}
