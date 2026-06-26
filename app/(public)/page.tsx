import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MotionSection } from "@/components/motion-section";
import { PropertyCard } from "@/components/property/property-card";
import { SearchBar } from "@/components/property/search-bar";
import { DynamicPropertyMap } from "@/components/maps/dynamic-property-map";
import { getProperties } from "@/lib/data";

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getProperties({ featured: true, limit: 3 }), getProperties({ limit: 6 })]);
  const mapItems = latest.length ? latest : featured;
  const featuredToShow = featured.length ? featured : latest.slice(0, 3);
  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col justify-center py-10 text-white sm:py-12">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm backdrop-blur">Private viewings. Verified owners. Better leads.</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl">Aurum Estates</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">A premium property showcase for buyers who want clarity, trust, and homes worth slowing down for.</p>
            <div className="mt-8 max-w-4xl text-foreground"><SearchBar /></div>
          </div>
        </div>
      </section>

      <MotionSection className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.25em] text-primary">Featured</p><h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Signature properties</h2></div>
          <Button asChild variant="outline"><Link href="/properties">View all <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        {featuredToShow.length ? <div className="grid gap-6 md:grid-cols-3">{featuredToShow.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <EmptyProperties />}
      </MotionSection>

      <MotionSection className="bg-card py-16">
        <div className="container">
          <div className="mb-8"><p className="text-sm uppercase tracking-[0.25em] text-primary">Latest</p><h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">New to market</h2></div>
          {latest.length ? <div className="grid gap-6 md:grid-cols-3">{latest.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <EmptyProperties />}
        </div>
      </MotionSection>

      <MotionSection id="map" className="container grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div><p className="text-sm uppercase tracking-[0.25em] text-primary">Map</p><h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Browse by neighborhood</h2><p className="mt-4 text-muted-foreground">OpenStreetMap keeps location discovery lightweight, reliable, and privacy-friendly.</p></div>
        <div className="min-h-[320px] overflow-hidden rounded-lg border sm:min-h-[420px]">{mapItems.length ? <DynamicPropertyMap properties={mapItems} /> : <div className="grid h-full place-items-center text-muted-foreground">Add published properties to populate the map.</div>}</div>
      </MotionSection>

      <MotionSection className="container grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
        {[["$2.4B", "Listed portfolio"], ["98%", "Qualified lead capture"], ["430+", "Private showings"], ["4.9", "Average rating"]].map(([value, label]) => <Card key={label}><CardContent className="p-6"><p className="text-3xl font-bold text-primary">{value}</p><p className="mt-2 text-sm text-muted-foreground">{label}</p></CardContent></Card>)}
      </MotionSection>

      <MotionSection className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[Home, ShieldCheck, Users].map((Icon, i) => <Card key={i} className="glass"><CardContent className="p-6"><Icon className="h-6 w-6 text-primary" /><h3 className="mt-4 font-semibold">{["Curated inventory","Owner transparency","Lead-ready workflow"][i]}</h3><p className="mt-2 text-sm text-muted-foreground">{["Premium homes with image galleries, videos, reviews, and exact map context.","Owner profiles make each listing feel accountable and human.","Every inquiry is validated, stored, emailed, and exportable for sales follow-up."][i]}</p></CardContent></Card>)}
        </div>
      </MotionSection>

      <MotionSection className="bg-primary py-16 text-primary-foreground">
        <div className="container grid gap-8 md:grid-cols-2">
          <div><Star className="h-8 w-8 fill-current" /><h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Clients remember the experience.</h2></div>
          <div className="grid gap-4">
            {["The property pages made trust immediate. Photos, owner details, reviews, and map context were all there.", "We reduced back-and-forth and started getting higher-quality showing requests within days."].map((quote) => <blockquote key={quote} className="rounded-lg bg-white/10 p-5 text-white/90">{quote}</blockquote>)}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="container grid gap-8 py-16 md:grid-cols-2">
        <div><h2 className="font-serif text-3xl font-semibold sm:text-4xl">Questions buyers ask first</h2><p className="mt-3 text-muted-foreground">Fast answers help visitors become serious leads.</p></div>
        <div className="grid gap-4">{["Are owners verified?","Can I schedule a private viewing?","Do listings include video tours?"].map((q) => <Card key={q}><CardContent className="p-5"><p className="font-semibold">{q}</p><p className="mt-2 text-sm text-muted-foreground">Yes. The platform supports owner profiles, inquiry workflows, media galleries, YouTube embeds, reviews, and location maps.</p></CardContent></Card>)}</div>
      </MotionSection>

      <section className="container pb-16"><div className="glass flex flex-col items-start justify-between gap-6 rounded-lg p-8 md:flex-row md:items-center"><div><h2 className="font-serif text-3xl font-semibold">Ready to tour your next property?</h2><p className="mt-2 text-muted-foreground">Send a focused inquiry and let the team handle the follow-up.</p></div><Button asChild size="lg"><Link href="/contact">Contact us</Link></Button></div></section>
    </main>
  );
}

function EmptyProperties() {
  return <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">No published properties yet. Add them from the admin dashboard.</div>;
}
