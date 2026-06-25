"use client";

import { useActionState, useEffect, useState } from "react";
import { loginAdmin } from "@/lib/actions/auth";
import { idleState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, idleState);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (state.status === "error") setErrorOpen(true);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required /></div>
      <div className="grid gap-2"><Label>Password</Label><Input name="password" type="password" required /></div>
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in securely"}</Button>
      {state.status === "error" && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <Toast open={errorOpen} onOpenChange={setErrorOpen} title="Sign in failed" description={state.message} />
    </form>
  );
}
