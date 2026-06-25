import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { averageRating } from "@/lib/data";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.property_images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
  const rating = averageRating(property);
  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <Card className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-luxury">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={image} alt={property.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex gap-2">
            {property.featured ? <Badge className="bg-accent text-accent-foreground">Featured</Badge> : null}
            <Badge className="bg-background/85 backdrop-blur">{property.property_type}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{property.location}</p>
            </div>
            <p className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-accent text-accent" />{rating ? rating.toFixed(1) : "New"}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">{formatCurrency(Number(property.price))}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />4</span><span className="flex items-center gap-1"><Bath className="h-4 w-4" />3</span></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
