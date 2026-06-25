"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { PropertyImage } from "@/lib/types";

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const fallback = [{ id: "fallback", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop", alt: title, property_id: "", public_id: null, sort_order: 0 }];
  const items = images.length ? images : fallback;
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        <button onClick={() => setActive(items[0].url)} className="relative aspect-[16/10] overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:aspect-auto">
          <Image src={items[0].url} alt={items[0].alt || title} fill className="object-cover" priority />
        </button>
        {items.slice(1, 5).map((image) => (
          <button key={image.id} onClick={() => setActive(image.url)} className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={image.url} alt={image.alt || title} fill className="object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>
      <Dialog.Root open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4">
          {active ? <Image src={active} alt={title} width={1400} height={900} className="max-h-[90vh] w-auto rounded-lg object-contain" /> : null}
        </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
