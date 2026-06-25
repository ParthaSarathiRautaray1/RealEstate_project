import Link from "next/link";
import { BarChart3, Building2, LogOut, MessageSquare, Settings, Star, Users } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <aside className="sticky top-0 z-40 border-b bg-card md:static md:min-h-screen md:border-b-0 md:border-r">
      <div className="flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-5">
        <span className="min-w-0 truncate font-serif text-lg font-semibold sm:text-xl">Aurum Admin</span>
        <ThemeToggle />
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto p-2 md:grid md:overflow-visible md:p-3">
        {links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground md:gap-3"><Icon className="h-4 w-4" />{label}</Link>)}
      </nav>
      <form action={logoutAdmin} className="hidden p-3 md:block"><Button variant="ghost" className="w-full justify-start"><LogOut className="h-4 w-4" />Sign out</Button></form>
    </aside>
  );
}
