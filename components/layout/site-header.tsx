import Link from "next/link";
import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl tracking-tight">Aurum Estates</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link href="/properties" className="transition-colors hover:text-foreground">Properties</Link>
          <Link href="/#map" className="transition-colors hover:text-foreground">Map</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon"><Link href="/properties" aria-label="Search"><Search className="h-4 w-4" /></Link></Button>
          <ThemeToggle />
          <Button asChild className="shadow-glow"><Link href="/properties">Browse</Link></Button>
        </div>
      </div>
    </header>
  );
}
