import Link from "next/link";
import { Building2, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl">Aurum Estates</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/properties" className="hover:text-foreground">Properties</Link>
          <Link href="/#map" className="hover:text-foreground">Map</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon"><Link href="/properties" aria-label="Search"><Search className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" aria-label="Theme"><Moon className="h-4 w-4" /></Button>
          <Button asChild><Link href="/properties">Browse</Link></Button>
        </div>
      </div>
    </header>
  );
}
