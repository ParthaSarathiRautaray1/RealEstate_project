"use client";

import dynamic from "next/dynamic";

const NearbyPlaceMap = dynamic(() => import("@/components/maps/nearby-place-map").then((mod) => mod.NearbyPlaceMap), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-muted text-xs text-muted-foreground">Loading map...</div>
});

type Point = { lat: number; lng: number };

export function DynamicNearbyPlaceMap({
  origin,
  destination,
  destinationName,
  onRoute
}: {
  origin: Point;
  destination: Point;
  destinationName: string;
  onRoute?: (route: { distanceKm: number; durationMin: number | null; routed: boolean }) => void;
}) {
  return <NearbyPlaceMap origin={origin} destination={destination} destinationName={destinationName} onRoute={onRoute} />;
}
