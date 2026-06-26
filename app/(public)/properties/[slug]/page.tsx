import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Mail, Maximize, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Gallery } from "@/components/property/gallery";
import { LeadForm } from "@/components/forms/lead-form";
import { PropertyCard } from "@/components/property/property-card";
import { NearbyPlacesSection } from "@/components/property/nearby-places-section";
import { DynamicPropertyMap } from "@/components/maps/dynamic-property-map";
import { averageRating, getProperties, getPropertyBySlug } from "@/lib/data";
import { formatCurrency, youtubeEmbedUrl } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property" };
  const canonical = `${SITE_URL}/properties/${property.slug}`;
  const image = property.property_images?.[0]?.url || FALLBACK_IMAGE;
  return {
    title: property.title,
    description: property.description,
    alternates: { canonical },
    openGraph: {
      title: property.title,
      description: property.description,
      type: "website",
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: property.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.description,
      images: [image]
    }
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const related = (await getProperties({ type: property.property_type, limit: 3 })).filter((item) => item.id !== property.id);
  const reviews = (property.reviews || []).filter((review) => review.approved);
  const nearbyPlaces = (property.property_nearby_places || []).sort((a, b) => a.sort_order - b.sort_order);
  const rating = averageRating(property);
  const specs = [
    property.bedrooms != null ? { icon: BedDouble, label: `${property.bedrooms} ${property.bedrooms === 1 ? "Bed" : "Beds"}` } : null,
    property.bathrooms != null ? { icon: Bath, label: `${property.bathrooms} ${property.bathrooms === 1 ? "Bath" : "Baths"}` } : null,
    property.area_sqft != null ? { icon: Maximize, label: `${property.area_sqft.toLocaleString()} sq ft` } : null
  ].filter((spec): spec is { icon: typeof BedDouble; label: string } => spec !== null);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Product", "Residence"],
    name: property.title,
    description: property.description,
    image: (property.property_images || []).map((img) => img.url).filter(Boolean),
    url: `${SITE_URL}/properties/${property.slug}`,
    address: { "@type": "PostalAddress", name: property.location },
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "USD",
      availability: property.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
    }
  };
  if (rating) jsonLd.aggregateRating = { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: reviews.length };

  return (
    <main className="container py-8 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div className="min-w-0"><p className="text-sm uppercase tracking-[0.25em] text-primary">{property.property_type}</p><h1 className="safe-break mt-2 font-serif text-4xl font-semibold sm:text-5xl">{property.title}</h1><p className="safe-break mt-2 text-muted-foreground">{property.location}</p></div>
        <div className="text-left md:text-right"><p className="text-3xl font-bold text-primary">{formatCurrency(Number(property.price))}</p><p className="mt-1 flex items-center gap-1 md:justify-end"><Star className="h-4 w-4 fill-accent text-accent" />{rating ? rating.toFixed(1) : "New"} rating</p></div>
      </div>
      {specs.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground sm:gap-6">
          {specs.map((spec) => <span key={spec.label} className="flex items-center gap-2"><spec.icon className="h-4 w-4 text-primary" />{spec.label}</span>)}
        </div>
      ) : null}
      <Gallery images={property.property_images || []} title={property.title} />
      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-8">
          <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold sm:text-3xl">Property details</h2><p className="mt-4 leading-7 text-muted-foreground">{property.description}</p></CardContent></Card>
          {property.property_videos?.length ? <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold sm:text-3xl">Video tour</h2><div className="mt-4 grid gap-4">{property.property_videos.map((video) => {
            const embed = youtubeEmbedUrl(video.youtube_url);
            return embed
              ? <iframe key={video.id} className="aspect-video w-full rounded-lg border-0" src={embed} title={video.title || property.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              : <a key={video.id} href={video.youtube_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-4">Watch this video on YouTube</a>;
          })}</div></CardContent></Card> : null}
          <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold sm:text-3xl">Location</h2><div className="mt-4 h-[320px] overflow-hidden rounded-lg border sm:h-[420px]"><DynamicPropertyMap properties={[property]} center={[property.latitude, property.longitude]} /></div></CardContent></Card>
          {nearbyPlaces.length ? (
            <Card><CardContent className="p-4 sm:p-6"><NearbyPlacesSection property={{ latitude: property.latitude, longitude: property.longitude, title: property.title }} places={nearbyPlaces} /></CardContent></Card>
          ) : null}
          <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold sm:text-3xl">Reviews</h2><div className="mt-4 grid gap-4">{reviews.length ? reviews.map((review) => <div key={review.id} className="border-b pb-4 last:border-0"><p className="safe-break flex items-center gap-2 font-semibold">{review.user_name} <span className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < review.rating ? "h-3.5 w-3.5 fill-accent text-accent" : "h-3.5 w-3.5 text-muted-foreground/30"} />)}</span></p><p className="safe-break mt-1 text-sm text-muted-foreground">{review.review}</p></div>) : <p className="text-muted-foreground">No approved reviews yet.</p>}</div></CardContent></Card>
          {related.length ? <div><h2 className="mb-4 font-serif text-2xl font-semibold sm:text-3xl">Related properties</h2><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></div> : null}
        </div>
        <aside className="grid gap-6 self-start lg:sticky lg:top-24">
          <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold">Request a showing</h2><div className="mt-4"><LeadForm propertyId={property.id} /></div></CardContent></Card>
          {property.owners ? <Card><CardContent className="p-4 sm:p-6"><h2 className="font-serif text-2xl font-semibold">Owner details</h2><p className="safe-break mt-3 font-semibold">{property.owners.name}</p><p className="safe-break mt-2 text-sm text-muted-foreground">{property.owners.bio}</p><div className="mt-4 grid gap-2 text-sm">{property.owners.email ? <p className="safe-break flex gap-2"><Mail className="h-4 w-4 shrink-0" />{property.owners.email}</p> : null}{property.owners.phone ? <p className="safe-break flex gap-2"><Phone className="h-4 w-4 shrink-0" />{property.owners.phone}</p> : null}</div></CardContent></Card> : null}
        </aside>
      </div>
    </main>
  );
}
