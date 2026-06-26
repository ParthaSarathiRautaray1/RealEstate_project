"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

type Point = { lat: number; lng: number };

function haversineKm(a: Point, b: Point) {
  const toRad = (value: number) => value * Math.PI / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * radius * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [24, 24], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export function NearbyPlaceMap({
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
  const originLat = origin.lat;
  const originLng = origin.lng;
  const destinationLat = destination.lat;
  const destinationLng = destination.lng;
  const [route, setRoute] = useState<[number, number][]>([]);
  const fallbackRoute = useMemo<[number, number][]>(() => [[originLat, originLng], [destinationLat, destinationLng]], [originLat, originLng, destinationLat, destinationLng]);

  useEffect(() => {
    let cancelled = false;
    async function loadRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destinationLng},${destinationLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Route service unavailable");
        const json = await res.json() as { routes?: Array<{ distance: number; duration: number; geometry?: { coordinates?: [number, number][] } }> };
        const first = json.routes?.[0];
        const coordinates = first?.geometry?.coordinates;
        if (!first || !coordinates?.length) throw new Error("No route found");
        const points = coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
        if (!cancelled) {
          setRoute(points);
          onRoute?.({ distanceKm: first.distance / 1000, durationMin: first.duration / 60, routed: true });
        }
      } catch {
        const distanceKm = haversineKm({ lat: originLat, lng: originLng }, { lat: destinationLat, lng: destinationLng });
        if (!cancelled) {
          setRoute(fallbackRoute);
          onRoute?.({ distanceKm, durationMin: null, routed: false });
        }
      }
    }
    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [destinationLat, destinationLng, fallbackRoute, onRoute, originLat, originLng]);

  const points = route.length ? route : fallbackRoute;
  const center: [number, number] = [(originLat + destinationLat) / 2, (originLng + destinationLng) / 2];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitRoute points={points} />
      <Polyline positions={points} pathOptions={{ color: "hsl(var(--primary))", weight: 5, opacity: 0.85 }} />
      <Marker position={[originLat, originLng]}><Popup>Property</Popup></Marker>
      <Marker position={[destinationLat, destinationLng]}><Popup>{destinationName}</Popup></Marker>
    </MapContainer>
  );
}
