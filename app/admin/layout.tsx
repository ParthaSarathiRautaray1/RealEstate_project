import { AdminNav } from "@/components/admin/admin-nav";

// The admin area is authenticated and data-driven: render every page per
// request so dashboard metrics and lists are always current, and so the build
// never prerenders these pages with live Supabase calls (which made it flaky).
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[240px_minmax(0,1fr)]">
      <AdminNav />
      <main className="min-w-0 bg-muted/30 p-4 sm:p-6">{children}</main>
    </div>
  );
}
