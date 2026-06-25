"use client";

import { useActionState, useEffect, useState } from "react";
import { upsertProperty } from "@/lib/actions/admin";
import { idleState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { FieldError } from "@/components/admin/field-error";
import { ImageUploader } from "@/components/admin/image-uploader";
import { LocationPicker } from "@/components/admin/location-picker";
import { slugify } from "@/lib/utils";
import type { Owner, Property } from "@/lib/types";

export function PropertyForm({ property, owners }: { property?: Property; owners: Owner[] }) {
  const [state, formAction, pending] = useActionState(upsertProperty, idleState);
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  // Keep an existing property's slug stable; only auto-sync when untouched.
  const [slugLocked, setSlugLocked] = useState(Boolean(property?.slug));
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (state.status === "error") setErrorOpen(true);
  }, [state]);

  const fe = state.fieldErrors ?? {};
  const locationError = fe.location ?? fe.latitude ?? fe.longitude;

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugLocked) setSlug(slugify(value));
  }

  function onSlugChange(value: string) {
    setSlugLocked(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
  }

  return (
    <form action={formAction} className="grid gap-5 rounded-lg border bg-card p-4 sm:p-6">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input name="title" value={title} onChange={(e) => onTitleChange(e.target.value)} required />
          <FieldError errors={fe.title} />
        </div>
        <div className="grid gap-2">
          <Label>Slug</Label>
          <Input name="slug" value={slug} onChange={(e) => onSlugChange(e.target.value)} required />
          <p className="text-xs text-muted-foreground">Public URL: <span className="font-mono">/properties/{slug || "your-slug"}</span> — auto-filled from the title; edit to override.</p>
          <FieldError errors={fe.slug} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea name="description" defaultValue={property?.description} required />
        <p className="text-xs text-muted-foreground">At least 20 characters.</p>
        <FieldError errors={fe.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-2"><Label>Price</Label><Input name="price" type="number" min="0" step="any" defaultValue={property?.price} required /><FieldError errors={fe.price} /></div>
        <div className="grid gap-2"><Label>Property type</Label><Input name="property_type" defaultValue={property?.property_type} placeholder="Villa, Penthouse…" required /><FieldError errors={fe.property_type} /></div>
        <div className="grid gap-2"><Label>Status</Label><select name="status" defaultValue={property?.status || "published"} className="h-10 rounded-lg border bg-background px-3 text-sm"><option value="published">Published</option><option value="draft">Draft</option><option value="sold">Sold</option></select></div>
      </div>

      <div className="grid gap-2">
        <Label>Location &amp; map</Label>
        <LocationPicker defaultLocation={property?.location} defaultLat={property?.latitude} defaultLng={property?.longitude} />
        <FieldError errors={locationError} />
      </div>

      <div className="grid gap-2">
        <Label>Owner</Label>
        <select name="owner_id" defaultValue={property?.owner_id || ""} className="h-10 rounded-lg border bg-background px-3 text-sm"><option value="">No owner</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select>
        <FieldError errors={fe.owner_id} />
      </div>

      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" value="true" defaultChecked={property?.featured} /> Featured property</label>

      <div className="grid gap-2">
        <Label>Property images</Label>
        <ImageUploader defaultUrls={property?.property_images?.map((image) => image.url) ?? []} />
      </div>

      <div className="grid gap-2">
        <Label>YouTube video links</Label>
        <Textarea name="youtube_urls" defaultValue={property?.property_videos?.map((video) => video.youtube_url).join("\n")} placeholder="One link per line — e.g. https://youtu.be/VIDEO_ID" />
        <p className="text-xs text-muted-foreground">Paste normal watch, share, Shorts, live, or embed links. They are converted to embeds automatically.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={pending} className="w-full sm:w-auto">{pending ? "Saving..." : property ? "Update property" : "Create property"}</Button>
        {state.status === "error" && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}
      </div>

      <Toast open={errorOpen} onOpenChange={setErrorOpen} title="Could not save property" description={state.message} />
    </form>
  );
}
