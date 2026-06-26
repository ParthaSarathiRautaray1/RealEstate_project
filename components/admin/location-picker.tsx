"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LocationMapInner = dynamic(() => import("./location-map-inner").then((m) => m.LocationMapInner), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-muted text-sm text-muted-foreground">Loading map...</div>
});

type SearchHit = {
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
};

type Props = { defaultLocation?: string; defaultLat?: number; defaultLng?: number };

export function LocationPicker({ defaultLocation = "", defaultLat, defaultLng }: Props) {
  const [location, setLocation] = useState(defaultLocation);
  const [lat, setLat] = useState(defaultLat != null ? String(defaultLat) : "");
  const [lng, setLng] = useState(defaultLng != null ? String(defaultLng) : "");
  const [query, setQuery] = useState(defaultLocation);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setPoint(la: number, ln: number) {
    setLat(la.toFixed(6));
    setLng(ln.toFixed(6));
  }

  function choose(hit: SearchHit, keepResults = false) {
    setPoint(parseFloat(hit.lat), parseFloat(hit.lon));
    setLocation(hit.display_name);
    setQuery(hit.display_name);
    if (!keepResults) setResults([]);
    setError(null);
  }

  async function runSearch() {
    const q = (query || location).trim();
    if (!q) return;
    setSearching(true);
    setError(null);
    setResults([]);
    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "6",
        addressdetails: "1",
        namedetails: "1",
        q
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(`Map search returned ${res.status}`);
      const data = (await res.json()) as SearchHit[];
      if (!data.length) {
        setError("No match found. Add nearby city/state/country, or click the map and drag the pin.");
        return;
      }
      setResults(data);
      choose(data[0], data.length > 1);
    } catch (e) {
      setError(e instanceof Error ? `Address search failed: ${e.message}` : "Address search failed. Check your connection and try again.");
    } finally {
      setSearching(false);
    }
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  return (
    <div className="grid gap-4 rounded-lg border bg-background/40 p-3 sm:p-4">
      <div className="grid gap-2">
        <Label>Location</Label>
        <Input name="location" value={location} onChange={(e) => { setLocation(e.target.value); if (!query) setQuery(e.target.value); }} required placeholder="e.g. Calangute, Goa, India" />
      </div>

      <div className="grid gap-2">
        <Label>Find on map</Label>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search full address, landmark, city, state"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); runSearch(); } }}
          />
          <Button type="button" variant="outline" onClick={runSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {results.length > 1 ? (
          <div className="grid gap-2 rounded-lg border bg-card p-2">
            {results.map((hit) => (
              <button key={`${hit.lat}-${hit.lon}-${hit.display_name}`} type="button" onClick={() => choose(hit)} className="flex gap-2 rounded-md p-2 text-left text-sm hover:bg-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="safe-break">{hit.display_name}</span>
              </button>
            ))}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">Use the most complete address available. If the search result is slightly off, click the map or drag the pin to the exact point.</p>
      </div>

      <div className="h-[260px] overflow-hidden rounded-lg border sm:h-[320px]">
        <LocationMapInner lat={latNum} lng={lngNum} onPick={setPoint} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Latitude</Label>
          <Input name="latitude" type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)} placeholder="15.4909" />
        </div>
        <div className="grid gap-2">
          <Label>Longitude</Label>
          <Input name="longitude" type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)} placeholder="73.8278" />
        </div>
      </div>
    </div>
  );
}
