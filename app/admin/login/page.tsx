import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="p-5 sm:p-6"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Building2 /></div><CardTitle className="font-serif text-2xl sm:text-3xl">Admin login</CardTitle></CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
