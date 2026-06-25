import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

/**
 * Convert any common YouTube URL into an embeddable iframe URL.
 * Returns null when the input is not a recognisable YouTube link, so callers
 * can skip it instead of rendering a watch page that the browser will refuse
 * to frame (X-Frame-Options). Handles watch?v=, youtu.be, embed, shorts, live,
 * extra query params, and bare 11-character ids.
 */
const YT_ID = /^[\w-]{11}$/;

export function youtubeEmbedUrl(value: string): string | null {
  if (!value) return null;
  const raw = value.trim();
  try {
    const url = new URL(raw);
    let id: string | null = null;
    if (url.hostname.includes("youtu.be")) {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (url.hostname.includes("youtube.com")) {
      id = url.searchParams.get("v");
      if (!id) {
        const parts = url.pathname.split("/").filter(Boolean);
        const marker = parts.findIndex((part) => ["embed", "shorts", "live", "v"].includes(part));
        if (marker >= 0) id = parts[marker + 1] ?? null;
      }
    }
    return id && YT_ID.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return YT_ID.test(raw) ? `https://www.youtube.com/embed/${raw}` : null;
  }
}
