import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold">Aurum Estates</p>
          <p className="mt-3 text-sm text-muted-foreground">Premium property showcases, owner-led trust, and high-intent real estate inquiries.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-muted-foreground">
            <Link href="/properties">Properties</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <span className="font-serif text-2xl leading-none text-primary" aria-hidden="true">∞</span>
            Developed by Partha
          </p>
        </div>
      </div>
    </footer>
  );
}
