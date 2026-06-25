"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      map.setView([lat, lng], Math.max(map.getZoom(), 13));
    }
  }, [lat, lng, map]);
  return null;
}

export function LocationMapInner({ lat, lng, onPick }: { lat: number; lng: number; onPick: (lat: number, lng: number) => void }) {
  const hasPoint = Number.isFinite(lat) && Number.isFinite(lng);
  const center: [number, number] = hasPoint ? [lat, lng] : [20, 0];
  return (
    <MapContainer center={center} zoom={hasPoint ? 13 : 2} scrollWheelZoom className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onPick={onPick} />
      {hasPoint ? (
        <Marker
          position={[lat, lng]}
          draggable
          eventHandlers={{ dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onPick(p.lat, p.lng); } }}
        />
      ) : null}
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
}
