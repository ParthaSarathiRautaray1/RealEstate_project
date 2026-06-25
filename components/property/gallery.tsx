"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { PropertyImage } from "@/lib/types";

const FALLBACK: PropertyImage = {
  id: "fallback",
  property_id: "",
  url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
  public_id: null,
  alt: null,
  sort_order: 0
};

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const items = images.length ? images : [FALLBACK];
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const inlineRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const clamp = useCallback((i: number) => (i + count) % count, [count]);

  const scrollTrackTo = (ref: React.RefObject<HTMLDivElement | null>, i: number, smooth = true) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  const onTrackScroll = (ref: React.RefObject<HTMLDivElement | null>) => () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((prev) => (prev === i ? prev : i));
  };

  const go = (dir: number) => {
    const next = clamp(index + dir);
    setIndex(next);
    scrollTrackTo(open ? lightboxRef : inlineRef, next);
  };

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  // Keep the two tracks in sync: jump the lightbox to the active photo when it
  // opens; when it closes, leave the inline slider on the photo last viewed.
  useEffect(() => {
    if (open) requestAnimationFrame(() => scrollTrackTo(lightboxRef, index, false));
    else scrollTrackTo(inlineRef, index, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Arrow-key navigation while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      setIndex((i) => {
        const next = clamp(i + (e.key === "ArrowRight" ? 1 : -1));
        scrollTrackTo(lightboxRef, next);
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, clamp]);

  return (
    <>
      {/* Inline Instagram-style swipeable slider */}
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        <div
          ref={inlineRef}
          onScroll={onTrackScroll(inlineRef)}
          className="no-scrollbar flex aspect-[16/10] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth md:aspect-[16/9]"
        >
          {items.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Open photo ${i + 1} of ${count}`}
              className="relative w-full shrink-0 basis-full snap-start"
            >
              <Image src={image.url} alt={image.alt || title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" priority={i === 0} />
            </button>
          ))}
        </div>

        {count > 1 ? (
          <>
            <SlideButton side="left" onClick={() => go(-1)} />
            <SlideButton side="right" onClick={() => go(1)} />
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {items.map((image, i) => (
                <span key={image.id} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </div>
          </>
        ) : null}

        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">{index + 1} / {count}</span>
        <button
          type="button"
          onClick={() => openAt(index)}
          aria-label="Open full screen"
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnail strip */}
      {count > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {items.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => { setIndex(i); scrollTrackTo(inlineRef, i); }}
              aria-label={`Go to photo ${i + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={image.url} alt={image.alt || title} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {/* Fullscreen lightbox (z above Leaflet's controls so the map never overlaps it) */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[1101] flex flex-col outline-none">
            <Dialog.Title className="sr-only">{title} — photo gallery</Dialog.Title>
            <Dialog.Description className="sr-only">Swipe or use the arrow keys to browse photos. Press Escape or the close button to go back.</Dialog.Description>

            <div className="flex items-center justify-between p-4 text-white">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{index + 1} / {count}</span>
              <Dialog.Close aria-label="Close gallery" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div
              ref={lightboxRef}
              onScroll={onTrackScroll(lightboxRef)}
              className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
            >
              {items.map((image) => (
                <div key={image.id} className="grid w-full shrink-0 basis-full snap-start place-items-center p-4">
                  <Image src={image.url} alt={image.alt || title} width={1600} height={1066} sizes="100vw" className="max-h-[78vh] w-auto rounded-lg object-contain" />
                </div>
              ))}
            </div>

            {count > 1 ? (
              <>
                <SlideButton side="left" onClick={() => go(-1)} large />
                <SlideButton side="right" onClick={() => go(1)} large />
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function SlideButton({ side, onClick, large }: { side: "left" | "right"; onClick: () => void; large?: boolean }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75 ${large ? "h-12 w-12" : "h-9 w-9"} ${side === "left" ? "left-3" : "right-3"}`}
    >
      <Icon className={large ? "h-6 w-6" : "h-5 w-5"} />
    </button>
  );
}
