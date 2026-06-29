"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Compass, Crown, Landmark, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const districts = [
  {
    name: "Skyline Residences",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1400&auto=format&fit=crop",
    copy: "High-rise homes selected for light, privacy, arrival experience, and long-term neighborhood value."
  },
  {
    name: "Garden Villas",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
    copy: "Low-density addresses for families who want silence, landscape, and indoor-outdoor living."
  },
  {
    name: "Heritage Core",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1400&auto=format&fit=crop",
    copy: "Locations with civic gravity: schools, clubs, hospitals, culture, and daily-life convenience."
  }
];

const team = [
  {
    name: "Aarav Mehta",
    role: "Founder & Principal Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    note: "Builds the trust layer between serious buyers, verified owners, and private showings."
  },
  {
    name: "Mira Kapoor",
    role: "Lifestyle Curation Lead",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    note: "Translates each address into its lived experience: light, commute, privacy, and community."
  },
  {
    name: "Rohan Sen",
    role: "Property Intelligence Head",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    note: "Audits owner data, media quality, pricing context, and map intelligence before listing."
  }
];

const principles = [
  ["Verified before visible", "Every listing is supported by owner details, location context, gallery quality, and review moderation."],
  ["Emotion with evidence", "We pair cinematic discovery with practical signals: maps, specs, videos, nearby places, and inquiry workflows."],
  ["Private by design", "The experience guides buyers toward focused conversations instead of noisy, low-intent browsing."]
];

export function AboutExperience() {
  const [activeDistrict, setActiveDistrict] = useState(0);
  const selected = districts[activeDistrict];

  return (
    <main className="luxury-home bg-[#050607] text-white">
      <section className="relative grid min-h-[92vh] place-items-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop" alt="Luxury city skyline" fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(214,177,95,0.18),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.35),#050607)]" />
        <div className="container relative z-10 py-24">
          <motion.p initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="luxury-kicker">About Aurum</motion.p>
          <motion.h1 initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }} className="mt-5 max-w-5xl font-serif text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">
            We do not list properties. We stage the journey to belonging.
          </motion.h1>
          <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }} className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
            Aurum Estates is a luxury real estate platform for verified owners, high-intent buyers, and homes that deserve more than a thumbnail grid.
          </motion.p>
        </div>
      </section>

      <section className="container grid gap-8 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="luxury-kicker">Explore Aurum City</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Tap a district. Feel the lifestyle.</h2>
          <p className="mt-5 leading-8 text-white/64">Inspired by interactive energy-city storytelling, this turns discovery into a living map of aspirations: height, calm, heritage, and convenience.</p>
          <div className="mt-7 grid gap-3">
            {districts.map((district, index) => {
              const Icon = district.icon;
              return (
                <button key={district.name} onClick={() => setActiveDistrict(index)} className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${activeDistrict === index ? "border-[#d6b15f] bg-[#d6b15f]/14" : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
                  <span className="flex items-center gap-3"><Icon className="h-5 w-5 text-[#d6b15f]" />{district.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
        <motion.div key={selected.name} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="luxury-glass overflow-hidden rounded-lg">
          <div className="relative aspect-[16/11]">
            <Image src={selected.image} alt={selected.name} fill sizes="(min-width: 1024px) 55vw, 92vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm uppercase tracking-[0.28em] text-[#d6b15f]">Now exploring</p>
              <h3 className="mt-3 font-serif text-4xl">{selected.name}</h3>
              <p className="mt-3 max-w-xl leading-7 text-white/72">{selected.copy}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container grid gap-4 py-10 sm:grid-cols-3">
        {[["42+", "curated residences"], ["18+", "years advisory experience"], ["98%", "qualified inquiry focus"]].map(([value, label]) => (
          <div key={label} className="luxury-glass rounded-lg p-6">
            <p className="font-serif text-5xl text-[#d6b15f]">{value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/52">{label}</p>
          </div>
        ))}
      </section>

      <section className="container py-20">
        <div className="mb-10 max-w-3xl">
          <p className="luxury-kicker">Our work</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">What we build around every home.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map(([title, text], index) => {
            const icons = [ShieldCheck, Sparkles, Crown];
            const Icon = icons[index];
            return (
              <motion.article key={title} whileHover={{ y: -8, rotateX: 3 }} className="luxury-glass rounded-lg p-7">
                <Icon className="h-7 w-7 text-[#d6b15f]" />
                <h3 className="mt-8 font-serif text-3xl">{title}</h3>
                <p className="mt-4 leading-7 text-white/62">{text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="luxury-kicker">People behind the promise</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">Owner-first. Buyer-aware. Detail-obsessed.</h2>
          </div>
          <Users className="hidden h-12 w-12 text-[#d6b15f] md:block" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {team.map((person) => (
            <article key={person.name} className="luxury-glass overflow-hidden rounded-lg">
              <div className="relative aspect-[4/5]">
                <Image src={person.image} alt={person.name} fill sizes="(min-width: 768px) 31vw, 92vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-serif text-3xl">{person.name}</h3>
                  <p className="mt-1 text-[#d6b15f]">{person.role}</p>
                </div>
              </div>
              <p className="p-5 leading-7 text-white/62">{person.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="luxury-glass grid gap-8 rounded-lg p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="luxury-kicker">Next chapter</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold">Explore properties with the context they deserve.</h2>
            <p className="mt-4 text-white/62">Browse by lifestyle, inspect the map, read verified reviews, and request a private showing.</p>
          </div>
          <Button asChild className="bg-[#d6b15f] text-black hover:bg-[#f2d889]"><Link href="/properties">View properties <Compass className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </main>
  );
}
