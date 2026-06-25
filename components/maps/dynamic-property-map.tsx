"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/lib/types";

const PropertyMap = dynamic(() => import("@/components/maps/property-map").then((mod) => mod.PropertyMap), {
  ssr: false,
  loading: () => <div className="grid h-full min-h-[360px] place-items-center bg-muted text-sm text-muted-foreground">Loading map...</div>
});

export function DynamicPropertyMap({ properties, center }: { properties: Property[]; center?: [number, number] }) {
  return <PropertyMap properties={properties} center={center} />;
}
