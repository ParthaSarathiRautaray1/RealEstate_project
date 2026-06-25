import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const properties = await getProperties();
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/properties`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...properties.map((property) => ({ url: `${siteUrl}/properties/${property.slug}`, lastModified: new Date(property.updated_at) }))
  ];
}
