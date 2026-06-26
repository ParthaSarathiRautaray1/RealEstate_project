"use client";

import { useMemo, useState } from "react";
import { Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyNearbyPlace } from "@/lib/types";

type NearbyDraft = {
  name: string;
  category: string;
  distance_km: string;
  travel_time: string;
  latitude: string;
  longitude: string;
  notes: string;
};

const emptyPlace: NearbyDraft = {
  name: "",
  category: "Hospital",
  distance_km: "",
  travel_time: "",
  latitude: "",
  longitude: "",
  notes: ""
};

const categories = ["Hospital", "Medical", "School", "College", "Airport", "Railway Station", "Market", "Beach", "Temple", "Business Hub", "Landmark", "Other"];

type SearchHit = {
  lat: string;
  lon: string;
  display_name: string;
};

function fromPlace(place: PropertyNearbyPlace): NearbyDraft {
  return {
    name: place.name || "",
    category: place.category || "Hospital",
    distance_km: place.distance_km != null ? String(place.distance_km) : "",
    travel_time: place.travel_time || "",
    latitude: place.latitude != null ? String(place.latitude) : "",
    longitude: place.longitude != null ? String(place.longitude) : "",
    notes: place.notes || ""
  };
}

export function NearbyPlacesFields({ defaultPlaces = [] }: { defaultPlaces?: PropertyNearbyPlace[] }) {
  const [places, setPlaces] = useState<NearbyDraft[]>(defaultPlaces.length ? defaultPlaces.sort((a, b) => a.sort_order - b.sort_order).map(fromPlace) : []);
  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, SearchHit[]>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  const value = useMemo(() => JSON.stringify(places.filter((place) => place.name.trim()).map((place) => ({
    name: place.name.trim(),
    category: place.category,
    distance_km: place.distance_km,
    travel_time: place.travel_time.trim() || null,
    latitude: place.latitude,
    longitude: place.longitude,
    notes: place.notes.trim() || null
  }))), [places]);

  function update(index: number, key: keyof NearbyDraft, value: string) {
    setPlaces((prev) => prev.map((place, i) => i === index ? { ...place, [key]: value } : place));
  }

  function choose(index: number, hit: SearchHit) {
    setPlaces((prev) => prev.map((place, i) => i === index ? {
      ...place,
      name: place.name.trim() ? place.name : hit.display_name.split(",")[0] || hit.display_name,
      latitude: Number(hit.lat).toFixed(6),
      longitude: Number(hit.lon).toFixed(6),
      notes: place.notes.trim() ? place.notes : hit.display_name
    } : place));
    setResults((prev) => ({ ...prev, [index]: [] }));
    setErrors((prev) => ({ ...prev, [index]: "" }));
  }

  async function searchPlace(index: number) {
    const place = places[index];
    const query = (searchQueries[index] || [place.name, place.notes].filter(Boolean).join(" ")).trim();
    if (!query) {
      setErrors((prev) => ({ ...prev, [index]: "Enter a nearby place name or address first." }));
      return;
    }
    setSearchingIndex(index);
    setErrors((prev) => ({ ...prev, [index]: "" }));
    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "5",
        addressdetails: "1",
        namedetails: "1",
        q: query
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(`Search returned ${res.status}`);
      const data = (await res.json()) as SearchHit[];
      if (!data.length) {
        setErrors((prev) => ({ ...prev, [index]: "No match found. Try adding city, state, or country." }));
        return;
      }
      setResults((prev) => ({ ...prev, [index]: data }));
      choose(index, data[0]);
    } catch (error) {
      setErrors((prev) => ({ ...prev, [index]: error instanceof Error ? `Search failed: ${error.message}` : "Search failed. Try again." }));
    } finally {
      setSearchingIndex(null);
    }
  }

  return (
    <div className="grid gap-3 rounded-lg border bg-background/40 p-3 sm:p-4">
      <input type="hidden" name="nearby_places" value={value} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Nearby places</p>
          <p className="text-xs text-muted-foreground">Hospitals, schools, markets, landmarks, transport, and other points buyers care about.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setPlaces((prev) => [...prev, emptyPlace])}>
          <Plus className="h-4 w-4" />Add place
        </Button>
      </div>

      {places.length ? (
        <div className="grid gap-4">
          {places.map((place, index) => (
            <div key={index} className="grid gap-3 rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-primary" />Place {index + 1}</p>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove nearby place" onClick={() => setPlaces((prev) => prev.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={place.name} onChange={(e) => update(index, "name", e.target.value)} placeholder="e.g. Manipal Hospital" />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <select value={place.category} onChange={(e) => update(index, "category", e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Search this nearby place</Label>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input value={searchQueries[index] ?? ""} onChange={(e) => setSearchQueries((prev) => ({ ...prev, [index]: e.target.value }))} placeholder="Full address or landmark, e.g. Manipal Hospital, Dona Paula, Goa" />
                  <Button type="button" variant="outline" onClick={() => searchPlace(index)} disabled={searchingIndex === index}>
                    {searchingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Search
                  </Button>
                </div>
                {errors[index] ? <p className="text-sm text-destructive">{errors[index]}</p> : null}
                {results[index]?.length > 1 ? (
                  <div className="grid gap-2 rounded-lg border bg-background p-2">
                    {results[index].map((hit) => (
                      <button key={`${hit.lat}-${hit.lon}-${hit.display_name}`} type="button" onClick={() => choose(index, hit)} className="flex gap-2 rounded-md p-2 text-left text-sm hover:bg-muted">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="safe-break">{hit.display_name}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-2"><Label>Distance (km)</Label><Input type="number" min="0" step="0.1" value={place.distance_km} onChange={(e) => update(index, "distance_km", e.target.value)} placeholder="2.4" /></div>
                <div className="grid gap-2"><Label>Travel time</Label><Input value={place.travel_time} onChange={(e) => update(index, "travel_time", e.target.value)} placeholder="8 min drive" /></div>
                <div className="grid gap-2"><Label>Latitude</Label><Input type="number" step="any" value={place.latitude} onChange={(e) => update(index, "latitude", e.target.value)} placeholder="15.4909" /></div>
                <div className="grid gap-2"><Label>Longitude</Label><Input type="number" step="any" value={place.longitude} onChange={(e) => update(index, "longitude", e.target.value)} placeholder="73.8278" /></div>
              </div>
              <div className="grid gap-2">
                <Label>Notes</Label>
                <Input value={place.notes} onChange={(e) => update(index, "notes", e.target.value)} placeholder="Known area, gate, metro exit, or useful buyer context" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No nearby places added yet.</p>
      )}
    </div>
  );
}
