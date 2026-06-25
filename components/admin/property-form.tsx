import { upsertProperty } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Owner, Property } from "@/lib/types";

export function PropertyForm({ property, owners }: { property?: Property; owners: Owner[] }) {
  return (
    <form action={upsertProperty} className="grid gap-5 rounded-lg border bg-card p-6">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={property?.title} />
        <Field label="Slug" name="slug" defaultValue={property?.slug} />
      </div>
      <div className="grid gap-2"><Label>Description</Label><Textarea name="description" defaultValue={property?.description} required /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Price" name="price" type="number" defaultValue={property?.price} />
        <Field label="Property type" name="property_type" defaultValue={property?.property_type} />
        <div className="grid gap-2"><Label>Status</Label><select name="status" defaultValue={property?.status || "published"} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="published">Published</option><option value="draft">Draft</option><option value="sold">Sold</option></select></div>
      </div>
      <Field label="Location" name="location" defaultValue={property?.location} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Latitude" name="latitude" type="number" step="any" defaultValue={property?.latitude} />
        <Field label="Longitude" name="longitude" type="number" step="any" defaultValue={property?.longitude} />
      </div>
      <div className="grid gap-2"><Label>Owner</Label><select name="owner_id" defaultValue={property?.owner_id || ""} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">No owner</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" value="true" defaultChecked={property?.featured} /> Featured property</label>
      <div className="grid gap-2"><Label>Cloudinary image URLs</Label><Textarea name="image_urls" defaultValue={property?.property_images?.map((image) => image.url).join("\n")} placeholder="One URL per line" /></div>
      <div className="grid gap-2"><Label>YouTube URLs</Label><Textarea name="youtube_urls" defaultValue={property?.property_videos?.map((video) => video.youtube_url).join("\n")} placeholder="One URL per line" /></div>
      <Button className="w-fit">{property ? "Update property" : "Create property"}</Button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...input } = props;
  return <div className="grid gap-2"><Label>{label}</Label><Input required {...input} /></div>;
}
