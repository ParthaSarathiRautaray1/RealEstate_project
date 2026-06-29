import type { Metadata } from "next";
import { AboutExperience } from "@/components/marketing/about-experience";

export const metadata: Metadata = {
  title: "About Us | Luxury Real Estate Story, Owners & Team",
  description:
    "Meet Aurum Estates, a cinematic luxury real estate platform built around verified owners, curated residences, private showings, and lifestyle-led property discovery.",
  alternates: { canonical: "/aboutus" },
  openGraph: {
    title: "About Aurum Estates",
    description: "A story-led luxury real estate experience for verified owners, premium homes, and high-intent buyers.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 900,
        alt: "Luxury city skyline"
      }
    ]
  }
};

export default function AboutUsPage() {
  return <AboutExperience />;
}
