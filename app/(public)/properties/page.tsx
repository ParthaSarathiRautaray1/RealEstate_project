import type { Metadata } from "next";
import { PropertyCard } from "@/components/property/property-card";
import { SearchBar } from "@/components/property/search-bar";
import { DynamicPropertyMap } from "@/components/maps/dynamic-property-map";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = { title: "Properties" };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const properties = await getProperties({ query: params.q, type: params.type, sort: params.sort });
  const sorted = params.sort === "rating" ? [...properties].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)) : properties;
  return (
    <main className="container py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-primary">Listings</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold">Find the right address</h1>
        <div className="mt-6"><SearchBar defaultQuery={params.q} defaultType={params.type} /></div>
        <form className="mt-4 flex justify-end">
          <input type="hidden" name="q" value={params.q || ""} />
          <input type="hidden" name="type" value={params.type || ""} />
          <select name="sort" defaultValue={params.sort || "created_at"} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="created_at">Latest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="rating">Sort by rating</option>
          </select>
        </form>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {sorted.length ? <div className="grid gap-6 sm:grid-cols-2">{sorted.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">No properties match these filters.</div>}
        <aside className="sticky top-24 h-[520px] overflow-hidden rounded-lg border">{sorted.length ? <DynamicPropertyMap properties={sorted} /> : null}</aside>
      </div>
    </main>
  );
}
