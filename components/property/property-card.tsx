import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { averageRating } from "@/lib/data";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.property_images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
  const rating = averageRating(property);
  return (
    <Link href={`/properties/${property.slug}`} className="group block h-full">
      <TiltCard className="rounded-lg">
        <Card className="ring-luxury h-full overflow-hidden border-border/70 transition-shadow duration-300 group-hover:shadow-luxury">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={image} alt={property.title} fill className="object-cover transition duration-700 group-hover:scale-[1.07]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />
            <div className="absolute left-3 top-3 flex gap-2">
              {property.featured ? <Badge className="bg-accent text-accent-foreground shadow-soft">Featured</Badge> : null}
              <Badge className="border-white/20 bg-background/80 backdrop-blur">{property.property_type}</Badge>
            </div>
            <p className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-sm font-bold text-primary shadow-soft backdrop-blur">
              {formatCurrency(Number(property.price))}
            </p>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="line-clamp-1 font-semibold tracking-tight">{property.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{property.location}</p>
              </div>
              <p className="flex shrink-0 items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-accent text-accent" />{rating ? rating.toFixed(1) : "New"}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" />4 Beds</span>
              <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" />3 Baths</span>
              <span className="font-medium text-primary transition-transform group-hover:translate-x-0.5">View →</span>
            </div>
          </CardContent>
        </Card>
      </TiltCard>
    </Link>
  );
}
