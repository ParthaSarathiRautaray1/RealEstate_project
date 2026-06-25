"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { upsertOwner } from "@/lib/actions/admin";
import { idleState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { FieldError } from "@/components/admin/field-error";

export function OwnerForm() {
  const [state, formAction, pending] = useActionState(upsertOwner, idleState);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      setSuccessOpen(true);
      formRef.current?.reset();
    } else if (state.status === "error") {
      setErrorOpen(true);
    }
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Add owner</h1>
        <form ref={formRef} action={formAction} className="mt-5 grid gap-4">
          <div className="grid gap-2"><Label>Name</Label><Input name="name" required /><FieldError errors={fe.name} /></div>
          <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" /><FieldError errors={fe.email} /></div>
          <div className="grid gap-2"><Label>Phone</Label><Input name="phone" /><FieldError errors={fe.phone} /></div>
          <div className="grid gap-2"><Label>Avatar URL</Label><Input name="avatar_url" placeholder="https://…" /><FieldError errors={fe.avatar_url} /></div>
          <div className="grid gap-2"><Label>Bio</Label><Textarea name="bio" /></div>
          <Button disabled={pending} className="w-full sm:w-auto">{pending ? "Saving..." : "Create owner"}</Button>
          {state.status === "error" && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}
        </form>
      </CardContent>
      <Toast open={successOpen} onOpenChange={setSuccessOpen} title="Owner saved" description={state.message} />
      <Toast open={errorOpen} onOpenChange={setErrorOpen} title="Could not save owner" description={state.message} />
    </Card>
  );
}
