"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { leadSchema, type LeadInput } from "@/lib/validations/schemas";

export function LeadForm({ propertyId }: { propertyId?: string }) {
  const [toast, setToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadInput>({ resolver: zodResolver(leadSchema), defaultValues: { property_id: propertyId || null } });
  async function onSubmit(values: LeadInput) {
    setStatus(null);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error("Unable to submit inquiry");
      reset({ property_id: propertyId, name: "", email: "", phone: "", budget: null, message: "" });
      setStatus("Inquiry sent successfully.");
      setToast(true);
    } catch {
      setStatus("Inquiry failed. Check Supabase setup and try again.");
      setErrorToast(true);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <input type="hidden" {...register("property_id")} />
      {/* Honeypot: hidden from users, only bots fill it. Submissions with it set are silently dropped. */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("company")} />
      <div className="grid gap-2"><Label>Name</Label><Input {...register("name")} />{errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2"><Label>Email</Label><Input type="email" {...register("email")} />{errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}</div>
        <div className="grid gap-2"><Label>Phone</Label><Input {...register("phone")} />{errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}</div>
      </div>
      <div className="grid gap-2"><Label>Budget</Label><Input type="number" {...register("budget")} /></div>
      <div className="grid gap-2"><Label>Message</Label><Textarea {...register("message")} placeholder="Tell us what you would like to schedule or know." /></div>
      <Button disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? "Sending..." : "Request private consultation"}</Button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      <Toast open={toast} onOpenChange={setToast} title="Inquiry sent" description="The admin team has been notified and will follow up shortly." />
      <Toast open={errorToast} onOpenChange={setErrorToast} title="Inquiry failed" description="Please check Supabase tables and Resend credentials, then try again." />
    </form>
  );
}
