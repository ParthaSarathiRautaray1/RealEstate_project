import { Building2 } from "lucide-react";
import { loginAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Building2 /></div><CardTitle className="font-serif text-3xl">Admin login</CardTitle></CardHeader>
        <CardContent>
          <form action={loginAdmin} className="grid gap-4">
            <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required /></div>
            <div className="grid gap-2"><Label>Password</Label><Input name="password" type="password" required /></div>
            <Button>Sign in securely</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
