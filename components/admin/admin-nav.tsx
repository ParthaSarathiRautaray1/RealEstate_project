import Link from "next/link";
import { BarChart3, Building2, LogOut, MessageSquare, Settings, Star, Users } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const links = [
  ["/admin", "Dashboard", BarChart3],
  ["/admin/properties", "Properties", Building2],
  ["/admin/owners", "Owners", Users],
  ["/admin/reviews", "Reviews", Star],
  ["/admin/leads", "Leads", MessageSquare],
  ["/admin/settings", "Settings", Settings]
] as const;

export function AdminNav() {
  return (
    <aside className="border-r bg-card">
      <div className="flex h-16 items-center border-b px-5 font-serif text-xl font-semibold">Aurum Admin</div>
      <nav className="grid gap-1 p-3">
        {links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Icon className="h-4 w-4" />{label}</Link>)}
      </nav>
      <form action={logoutAdmin} className="p-3"><Button variant="ghost" className="w-full justify-start"><LogOut className="h-4 w-4" />Sign out</Button></form>
    </aside>
  );
}
