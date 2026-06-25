import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
      <AdminNav />
      <main className="min-w-0 bg-muted/30 p-6">{children}</main>
    </div>
  );
}
