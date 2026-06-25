import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const env = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "RESEND_API_KEY", "ADMIN_EMAIL"];
  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">Settings</h1>
      <Card className="mt-6"><CardContent className="p-6"><h2 className="font-semibold">Environment variables</h2><p className="mt-2 text-sm text-muted-foreground">Configure these in Vercel and locally in `.env.local`.</p><div className="mt-4 grid gap-2">{env.map((item) => <code key={item} className="rounded bg-muted px-3 py-2 text-sm">{item}</code>)}</div></CardContent></Card>
    </div>
  );
}
