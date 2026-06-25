"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LocationMapInner = dynamic(() => import("./location-map-inner").then((m) => m.LocationMapInner), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-muted text-sm text-muted-foreground">Loading map…</div>
});

type Props = { defaultLocation?: string; defaultLat?: number; defaultLng?: number };

export function LocationPicker({ defaultLocation = "", defaultLat, defaultLng }: Props) {
  const [location, setLocation] = useState(defaultLocation);
  const [lat, setLat] = useState(defaultLat != null ? String(defaultLat) : "");
  const [lng, setLng] = useState(defaultLng != null ? String(defaultLng) : "");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setPoint(la: number, ln: number) {
    setLat(la.toFixed(6));
    setLng(ln.toFixed(6));
  }

  async function runSearch() {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, {
        headers: { Accept: "application/json" }
      });
      const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (!data.length) {
        setError("No match found. Try a more specific address.");
        return;
      }
      const hit = data[0];
      setPoint(parseFloat(hit.lat), parseFloat(hit.lon));
      if (!location.trim()) setLocation(hit.display_name);
    } catch {
      setError("Address search failed. Check your connection and try again.");
    } finally {
      setSearching(false);
    }
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  return (
    <div className="grid gap-4 rounded-lg border bg-background/40 p-4">
      <div className="grid gap-2">
        <Label>Location</Label>
        <Input name="location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Calangute, Goa" />
      </div>

      <div className="grid gap-2">
        <Label>Find on map</Label>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an address or place name"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); runSearch(); } }}
          />
          <Button type="button" variant="outline" onClick={runSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <p className="text-xs text-muted-foreground">Search an address, or click the map to drop the pin (drag to fine-tune). Latitude &amp; longitude fill in automatically.</p>
      </div>

      <div className="h-[320px] overflow-hidden rounded-lg border">
        <LocationMapInner lat={latNum} lng={lngNum} onPick={setPoint} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Latitude</Label>
          <Input name="latitude" type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.7128" />
        </div>
        <div className="grid gap-2">
          <Label>Longitude</Label>
          <Input name="longitude" type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.006" />
        </div>
      </div>
    </div>
  );
}
