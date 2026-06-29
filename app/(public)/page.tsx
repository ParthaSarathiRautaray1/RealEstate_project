import type { Metadata } from "next";
import { LuxuryHomeExperience } from "@/components/marketing/luxury-home-experience";
import { getProperties } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realestateproject-ten.vercel.app";

export const metadata: Metadata = {
  title: "Luxury Real Estate in India | Premium Homes, Villas & Private Property Tours",
  description:
    "Explore Aurum Estates, a cinematic luxury real estate experience for premium apartments, villas, verified owners, property maps, private showings, and high-intent buyer inquiries.",
  keywords: [
    "luxury real estate",
    "premium properties",
    "luxury homes India",
    "villas for sale",
    "real estate app",
    "verified property owners",
    "private property tour",
    "premium apartments",
    "property investment",
    "Aurum Estates"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aurum Estates | Cinematic Luxury Real Estate",
    description: "Discover verified luxury residences through cinematic storytelling, maps, galleries, reviews, and private viewing workflows.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 900,
        alt: "Drone view of a luxury estate"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurum Estates | Luxury Real Estate",
    description: "A premium real estate experience for curated homes, private showings, maps, and verified owners."
  }
};

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getProperties({ featured: true, limit: 3 }), getProperties({ limit: 6 })]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Aurum Estates",
    url: siteUrl,
    description: metadata.description,
    areaServed: "India",
    sameAs: [siteUrl],
    makesOffer: latest.slice(0, 6).map((property) => ({
      "@type": "Offer",
      name: property.title,
      url: `${siteUrl}/properties/${property.slug}`,
      price: property.price,
      priceCurrency: "INR",
      itemOffered: {
        "@type": "Residence",
        name: property.title,
        address: property.location
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LuxuryHomeExperience featured={featured} latest={latest} />
    </>
  );
}
