"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Property } from "@/lib/types";
import Link from "next/link";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export function PropertyMap({ properties, center }: { properties: Property[]; center?: [number, number] }) {
  const mapCenter = center || (properties[0] ? [properties[0].latitude, properties[0].longitude] as [number, number] : [40.7128, -74.006]);
  return (
    <MapContainer center={mapCenter} zoom={properties.length > 1 ? 11 : 14} scrollWheelZoom={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map((property) => (
        <Marker key={property.id} position={[property.latitude, property.longitude]}>
          <Popup><Link href={`/properties/${property.slug}`} className="font-semibold">{property.title}</Link><br />{property.location}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
