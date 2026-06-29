"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  MapPin,
  Maximize2,
  Play,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/property/search-bar";
import { DynamicPropertyMap } from "@/components/maps/dynamic-property-map";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type LuxuryHomeExperienceProps = {
  featured: Property[];
  latest: Property[];
};

const heroImage = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop";
const galleryImages = [
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1600&auto=format&fit=crop"
];

const storyStats = [
  { value: 18, suffix: "+", label: "Years shaping landmark addresses" },
  { value: 42, suffix: "+", label: "Curated luxury residences" },
  { value: 98, suffix: "%", label: "Inquiry-to-showing qualification" },
  { value: 4.9, suffix: "/5", label: "Average owner and buyer rating" }
];

const timeline = [
  ["2008", "A private advisory desk for high-intent home buyers was born."],
  ["2014", "The portfolio expanded into verified residences, villas, and skyline apartments."],
  ["2021", "Digital-first touring, owner profiles, reviews, and location intelligence became the core."],
  ["Today", "Aurum blends trust, cinematic discovery, and measurable lead generation."]
];

const testimonials = [
  "Aurum made the search feel calm and highly personal. Every listing had enough context to make a confident decision.",
  "The experience felt closer to a private club than a property portal. We received serious viewing requests within days.",
  "Photos, maps, reviews, and owner details worked together beautifully. It made trust feel immediate."
];

export function LuxuryHomeExperience({ featured, latest }: LuxuryHomeExperienceProps) {
  const [loading, setLoading] = useState(true);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 420, damping: 34 });
  const smoothY = useSpring(cursorY, { stiffness: 420, damping: 34 });
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const signature = featured.length ? featured : latest.slice(0, 3);
  const mapItems = latest.length ? latest : featured;
  const gallery = useMemo(() => {
    const propertyImages = latest
      .flatMap((property) => property.property_images?.map((image) => image.url) || [])
      .filter(Boolean);
    return [...propertyImages, ...galleryImages].slice(0, 6);
  }, [latest]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX - 14);
      cursorY.set(event.clientY - 14);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-story]").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 72, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%" } }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => {
        gsap.to(image, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      if (statsRef.current) {
        statsRef.current.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count || "0");
          gsap.fromTo(
            node,
            { textContent: 0 },
            {
              textContent: target,
              duration: 1.6,
              snap: target % 1 ? { textContent: 0.1 } : { textContent: 1 },
              scrollTrigger: { trigger: statsRef.current, start: "top 75%", once: true }
            }
          );
        });
      }
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="luxury-home relative min-h-screen overflow-hidden bg-[#050607] text-white">
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-7 w-7 rounded-full border border-[#d6b15f]/70 mix-blend-difference lg:block"
        style={{ x: smoothX, y: smoothY }}
      />

      {loading ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-[#050607]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.55, duration: 0.55 }}
          onAnimationComplete={() => setLoading(false)}
        >
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 rounded-full border border-[#d6b15f]/25 border-t-[#d6b15f]" />
            <p className="text-xs uppercase tracking-[0.45em] text-[#d6b15f]">Aurum Estates</p>
          </div>
        </motion.div>
      ) : null}

      <section className="relative grid min-h-screen place-items-center overflow-hidden">
        <Image src={heroImage} alt="Drone view of a luxury estate at golden hour" fill priority sizes="100vw" className="scale-105 object-cover motion-safe:animate-[heroDrift_18s_ease-in-out_infinite_alternate]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,177,95,0.16),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.45),rgba(0,0,0,0.72))]" />
        <div className="container relative z-10 grid min-h-screen content-center gap-10 pb-12 pt-24 lg:grid-cols-[1fr_380px] lg:items-end">
          <div className="max-w-4xl">
            <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#e7cf9a] backdrop-blur-2xl">
              <Play className="h-3.5 w-3.5 fill-current" /> Cinematic estate discovery
            </motion.p>
            <motion.h1 initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }} className="font-serif text-5xl font-semibold leading-[0.96] sm:text-7xl lg:text-8xl">
              Luxury homes, told like a story.
            </motion.h1>
            <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }} className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              Aurum Estates curates verified residences, owner intelligence, cinematic galleries, and private showing journeys for buyers who want more than a listing.
            </motion.p>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }} className="mt-8 max-w-3xl text-[#111]">
              <SearchBar />
            </motion.div>
          </div>
          <FloatingShowcase property={signature[0]} />
        </div>
      </section>

      <section data-story className="container grid gap-10 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="luxury-kicker">The philosophy</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">A quieter way to discover rare addresses.</h2>
        </div>
        <p className="max-w-2xl text-lg leading-9 text-white/68">
          Inspired by legacy developers and hospitality-grade service, the experience moves from first impression to trust: aerial context, property emotion, neighborhood intelligence, human ownership, and a clear next step.
        </p>
      </section>

      <section ref={statsRef} data-story className="container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {storyStats.map((stat) => (
          <div key={stat.label} className="luxury-glass rounded-lg p-6">
            <p className="font-serif text-5xl text-[#e5c675]">
              <span data-count={stat.value}>0</span>{stat.suffix}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/62">{stat.label}</p>
          </div>
        ))}
      </section>

      <section data-story className="py-24">
        <div className="container mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="luxury-kicker">Signature collection</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Homes that hold the frame.</h2>
          </div>
          <Button asChild className="w-fit bg-[#d6b15f] text-black hover:bg-[#f2d889]"><Link href="/properties">Explore all <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="container grid gap-5 lg:grid-cols-3">
          {signature.length ? signature.map((property, index) => <LuxuryPropertyCard key={property.id} property={property} index={index} />) : <EmptyState />}
        </div>
      </section>

      <section data-story className="relative min-h-screen overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image src={gallery[0] || galleryImages[0]} alt="" fill sizes="100vw" className="object-cover opacity-35" data-parallax />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050607] via-[#050607]/72 to-[#050607]" />
        </div>
        <div className="container relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="sticky top-24">
            <p className="luxury-kicker">Gallery</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Open the doors before the visit.</h2>
            <p className="mt-5 leading-8 text-white/64">Fullscreen transitions turn each residence into a paced visual tour, from arrival sequence to private corners.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((image, index) => (
              <button key={`${image}-${index}`} onClick={() => setActiveImage(image)} className={`group relative overflow-hidden rounded-lg border border-white/10 ${index % 3 === 0 ? "col-span-2 aspect-[16/8]" : "aspect-[4/5]"}`}>
                <Image src={image} alt="Luxury property gallery" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur"><Maximize2 className="h-4 w-4" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section data-story id="map" className="container grid gap-10 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="luxury-kicker">Location intelligence</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">A map that feels like arrival.</h2>
          <p className="mt-5 leading-8 text-white/64">Every property is placed in context so buyers understand approach, neighborhood rhythm, and lifestyle fit before they request a private tour.</p>
        </div>
        <div className="luxury-glass min-h-[430px] overflow-hidden rounded-lg p-2">
          {mapItems.length ? <DynamicPropertyMap properties={mapItems} /> : <div className="grid h-[430px] place-items-center text-white/55">Publish properties to populate the interactive map.</div>}
        </div>
      </section>

      <section data-story className="relative overflow-hidden py-16 md:py-20">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1rem,calc((100vw-1200px)/2+1rem))]">
          {timeline.map(([year, text], index) => (
            <div key={year} className="luxury-glass grid min-h-[380px] w-[86vw] shrink-0 snap-center content-between rounded-lg p-6 sm:min-h-[460px] sm:w-[78vw] sm:p-8 md:min-h-[520px] md:w-[680px] md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-serif text-4xl text-[#d6b15f] sm:text-5xl md:text-6xl">{year}</span>
                <CalendarDays className="h-7 w-7 text-white/45" />
              </div>
              <div>
                <p className="luxury-kicker">Chapter {index + 1}</p>
                <h3 className="mt-4 max-w-lg break-words font-serif text-2xl leading-tight sm:text-4xl md:text-5xl">{text}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-story className="container grid gap-8 pb-24 pt-10 md:pt-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="luxury-kicker">Voices</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Trust should be felt before it is claimed.</h2>
        </div>
        <div className="grid gap-4">
          {testimonials.map((quote, index) => (
            <motion.blockquote key={quote} initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.08 }} className="luxury-glass rounded-lg p-6">
              <Quote className="mb-5 h-6 w-6 text-[#d6b15f]" />
              <p className="text-lg leading-8 text-white/78">{quote}</p>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section data-story className="container pb-28">
        <div className="luxury-glass relative overflow-hidden rounded-lg p-8 sm:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d6b15f]/10 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="luxury-kicker">Private access</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold sm:text-6xl">Begin with a curated shortlist, not another search result.</h2>
            </div>
            <Button asChild size="lg" className="bg-white text-black hover:bg-[#f2d889]"><Link href="/contact">Schedule consultation <ChevronRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      <Link href="/contact" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[#d6b15f]/35 bg-[#d6b15f] px-5 py-3 text-sm font-semibold text-black shadow-[0_20px_80px_rgba(214,177,95,0.35)] transition hover:scale-105">
        <Sparkles className="h-4 w-4" /> Book private tour
      </Link>

      {activeImage ? (
        <motion.button className="fixed inset-0 z-[70] bg-black/92 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setActiveImage(null)}>
          <Image src={activeImage} alt="Fullscreen luxury property" fill sizes="100vw" className="object-contain p-4 sm:p-10" />
        </motion.button>
      ) : null}
    </main>
  );
}

function FloatingShowcase({ property }: { property?: Property }) {
  return (
    <motion.div initial={{ y: 34, opacity: 0, rotateX: 8 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ delay: 0.42 }} className="luxury-glass hidden rounded-lg p-4 lg:block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md">
        <Image src={property?.property_images?.[0]?.url || galleryImages[1]} alt={property?.title || "Luxury residence"} fill sizes="380px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">{property?.property_type || "Private Residence"}</p>
          <h2 className="font-serif text-2xl">{property?.title || "A residence made for unhurried living"}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/72"><MapPin className="h-4 w-4" />{property?.location || "Curated luxury neighborhood"}</p>
        </div>
      </div>
    </motion.div>
  );
}

function LuxuryPropertyCard({ property, index }: { property: Property; index: number }) {
  const image = property.property_images?.[0]?.url || galleryImages[index % galleryImages.length];
  const rating = property.reviews?.filter((review) => review.approved).reduce((sum, review, _, arr) => sum + review.rating / arr.length, 0) || 0;

  return (
    <motion.div initial={{ y: 42, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }}>
      <Link href={`/properties/${property.slug}`} className="group block">
        <motion.article whileHover={{ rotateX: 4, rotateY: index % 2 ? -5 : 5, y: -8 }} className="luxury-glass overflow-hidden rounded-lg">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={image} alt={property.title} fill sizes="(min-width: 1024px) 31vw, 92vw" className="object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/8 to-transparent" />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className="rounded-full bg-[#d6b15f] px-3 py-1 text-xs font-semibold text-black">{property.featured ? "Signature" : "New"}</span>
              <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs text-white backdrop-blur">{property.property_type}</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm text-[#e7cf9a]">{formatCurrency(Number(property.price))}</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight">{property.title}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/68">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{property.location}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-[#d6b15f] text-[#d6b15f]" />{rating ? rating.toFixed(1) : "New"}</span>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="luxury-glass col-span-full grid min-h-[260px] place-items-center rounded-lg p-10 text-center text-white/60">
      <div>
        <Building2 className="mx-auto mb-4 h-8 w-8 text-[#d6b15f]" />
        <p>Publish properties from the admin dashboard to populate this cinematic collection.</p>
      </div>
    </div>
  );
}
