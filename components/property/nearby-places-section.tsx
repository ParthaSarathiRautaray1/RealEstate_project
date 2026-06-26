"use client";

import { useMemo, useState } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { DynamicNearbyPlaceMap } from "@/components/maps/dynamic-nearby-place-map";
import type { PropertyNearbyPlace } from "@/lib/types";

type RouteSummary = { distanceKm: number; durationMin: number | null; routed: boolean };

function formatDistance(value: number) {
  return value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(value < 10 ? 1 : 0)} km`;
}

function formatDuration(value: number) {
  if (value < 60) return `${Math.round(value)} min`;
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

export function NearbyPlacesSection({
  property,
  places
}: {
  property: { latitude: number; longitude: number; title: string };
  places: PropertyNearbyPlace[];
}) {
  const mappedPlaces = useMemo(() => places.filter((place) => place.latitude != null && place.longitude != null), [places]);
  const [selectedId, setSelectedId] = useState(mappedPlaces[0]?.id ?? "");
  const [route, setRoute] = useState<RouteSummary | null>(null);
  const selected = mappedPlaces.find((place) => place.id === selectedId) || mappedPlaces[0];

  if (!places.length) return null;

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Nearby places</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select a nearby place to see the path from this property.</p>
      </div>

      {selected ? (
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="h-[280px] border-b sm:h-[360px]">
            <DynamicNearbyPlaceMap
              origin={{ lat: property.latitude, lng: property.longitude }}
              destination={{ lat: Number(selected.latitude), lng: Number(selected.longitude) }}
              destinationName={selected.name}
              onRoute={setRoute}
            />
          </div>
          <div className="flex flex-wrap gap-3 p-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground"><MapPin className="h-4 w-4 text-primary" />{property.title} to {selected.name}</span>
            {route ? <span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary" />{formatDistance(route.distanceKm)}{route.routed ? " by road" : " straight-line"}</span> : null}
            {route?.durationMin != null ? <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />About {formatDuration(route.durationMin)} drive</span> : null}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Add coordinates to nearby places to show route maps.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {places.map((place) => {
          const hasMap = place.latitude != null && place.longitude != null;
          const active = selected?.id === place.id;
          return (
            <button
              key={place.id}
              type="button"
              disabled={!hasMap}
              onClick={() => { setSelectedId(place.id); setRoute(null); }}
              className={`rounded-lg border bg-background p-4 text-left transition ${active ? "border-primary shadow-sm" : "hover:bg-muted"} ${hasMap ? "" : "opacity-70"}`}
            >
              <p className="safe-break font-semibold">{place.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{place.category}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {place.distance_km != null ? <span className="flex items-center gap-1.5"><Navigation className="h-4 w-4 text-primary" />{Number(place.distance_km).toLocaleString()} km saved</span> : null}
                {place.travel_time ? <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{place.travel_time}</span> : null}
              </div>
              {place.notes ? <p className="safe-break mt-3 text-sm text-muted-foreground">{place.notes}</p> : null}
              {!hasMap ? <p className="mt-3 text-xs text-destructive">Add coordinates in admin to enable map route.</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
