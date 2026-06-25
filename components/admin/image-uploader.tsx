"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Admin image picker. Uploads files straight to Cloudinary via
 * /api/admin/upload and keeps the resulting URLs in a hidden `image_urls`
 * field (newline-joined) so the existing upsertProperty server action keeps
 * working unchanged. Pasting an existing image URL is still supported.
 */
export function ImageUploader({ defaultUrls = [] }: { defaultUrls?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultUrls.filter(Boolean));
  const [uploading, setUploading] = useState(false);
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    setUploading(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Upload failed (${res.status})`);
        }
        const { secure_url } = (await res.json()) as { secure_url?: string };
        if (secure_url) added.push(secure_url);
      }
      if (added.length) setUrls((prev) => [...prev, ...added.filter((u) => !prev.includes(u))]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addManual() {
    const value = manual.trim();
    if (!value) return;
    setUrls((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setManual("");
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="image_urls" value={urls.join("\n")} />

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background/50 p-6 text-center text-sm text-muted-foreground outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <ImagePlus className="h-5 w-5 text-primary" />}
        <span className="font-medium text-foreground">{uploading ? "Uploading to Cloudinary…" : "Click or drag photos here"}</span>
        <span className="text-xs">Files upload straight to Cloudinary — no need to paste URLs manually.</span>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); }} />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-2">
        <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="…or paste an existing image URL" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }} />
        <Button type="button" variant="outline" onClick={addManual}><Plus className="h-4 w-4" />Add</Button>
      </div>

      {urls.length ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => setUrls((prev) => prev.filter((_, i) => i !== index))} aria-label="Remove image" className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow transition group-hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-1 left-1 flex items-center gap-1">
                {index === 0 ? (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">Cover</span>
                ) : (
                  <button type="button" onClick={() => move(index, -1)} aria-label="Make cover / move up" className="rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium opacity-0 shadow transition group-hover:opacity-100">↑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No images yet. The first image becomes the cover photo.</p>
      )}
    </div>
  );
}
