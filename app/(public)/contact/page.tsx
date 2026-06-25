import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="container grid gap-8 py-12 md:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-primary">Contact</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold">Tell us what home should feel like.</h1>
        <p className="mt-4 text-muted-foreground">Your inquiry is saved to Supabase, emailed to the admin team with Resend, and ready for follow-up in the dashboard.</p>
      </div>
      <Card><CardContent className="p-6"><LeadForm /></CardContent></Card>
    </main>
  );
}
