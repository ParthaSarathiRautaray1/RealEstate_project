import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Gallery } from "@/components/property/gallery";
import { LeadForm } from "@/components/forms/lead-form";
import { PropertyCard } from "@/components/property/property-card";
import { DynamicPropertyMap } from "@/components/maps/dynamic-property-map";
import { averageRating, getProperties, getPropertyBySlug } from "@/lib/data";
import { formatCurrency, youtubeEmbedUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  return { title: property?.title || "Property", description: property?.description };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const related = (await getProperties({ type: property.property_type, limit: 3 })).filter((item) => item.id !== property.id);
  const reviews = (property.reviews || []).filter((review) => review.approved);
  const rating = averageRating(property);
  return (
    <main className="container py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div><p className="text-sm uppercase tracking-[0.25em] text-primary">{property.property_type}</p><h1 className="mt-2 font-serif text-5xl font-semibold">{property.title}</h1><p className="mt-2 text-muted-foreground">{property.location}</p></div>
        <div className="text-left md:text-right"><p className="text-3xl font-bold text-primary">{formatCurrency(Number(property.price))}</p><p className="mt-1 flex items-center gap-1 md:justify-end"><Star className="h-4 w-4 fill-accent text-accent" />{rating ? rating.toFixed(1) : "New"} rating</p></div>
      </div>
      <Gallery images={property.property_images || []} title={property.title} />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-8">
          <Card><CardContent className="p-6"><h2 className="font-serif text-3xl font-semibold">Property details</h2><p className="mt-4 leading-7 text-muted-foreground">{property.description}</p></CardContent></Card>
          {property.property_videos?.length ? <Card><CardContent className="p-6"><h2 className="font-serif text-3xl font-semibold">Video tour</h2><div className="mt-4 grid gap-4">{property.property_videos.map((video) => {
            const embed = youtubeEmbedUrl(video.youtube_url);
            return embed
              ? <iframe key={video.id} className="aspect-video w-full rounded-lg border-0" src={embed} title={video.title || property.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              : <a key={video.id} href={video.youtube_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-4">Watch this video on YouTube</a>;
          })}</div></CardContent></Card> : null}
          <Card><CardContent className="p-6"><h2 className="font-serif text-3xl font-semibold">Location</h2><div className="mt-4 h-[420px] overflow-hidden rounded-lg border"><DynamicPropertyMap properties={[property]} center={[property.latitude, property.longitude]} /></div></CardContent></Card>
          <Card><CardContent className="p-6"><h2 className="font-serif text-3xl font-semibold">Reviews</h2><div className="mt-4 grid gap-4">{reviews.length ? reviews.map((review) => <div key={review.id} className="border-b pb-4 last:border-0"><p className="font-semibold">{review.user_name} <span className="text-accent">{"*".repeat(review.rating)}</span></p><p className="mt-1 text-sm text-muted-foreground">{review.review}</p></div>) : <p className="text-muted-foreground">No approved reviews yet.</p>}</div></CardContent></Card>
          {related.length ? <div><h2 className="mb-4 font-serif text-3xl font-semibold">Related properties</h2><div className="grid gap-6 md:grid-cols-3">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></div> : null}
        </div>
        <aside className="grid gap-6 self-start lg:sticky lg:top-24">
          <Card><CardContent className="p-6"><h2 className="font-serif text-2xl font-semibold">Request a showing</h2><div className="mt-4"><LeadForm propertyId={property.id} /></div></CardContent></Card>
          {property.owners ? <Card><CardContent className="p-6"><h2 className="font-serif text-2xl font-semibold">Owner details</h2><p className="mt-3 font-semibold">{property.owners.name}</p><p className="mt-2 text-sm text-muted-foreground">{property.owners.bio}</p><div className="mt-4 grid gap-2 text-sm">{property.owners.email ? <p className="flex gap-2"><Mail className="h-4 w-4" />{property.owners.email}</p> : null}{property.owners.phone ? <p className="flex gap-2"><Phone className="h-4 w-4" />{property.owners.phone}</p> : null}</div></CardContent></Card> : null}
        </aside>
      </div>
    </main>
  );
}
