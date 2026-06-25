"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

/**
 * Mouse-follow 3D tilt wrapper. Purely presentational — wrap any card-like
 * content with it to get an interactive, depth-aware hover. Respects
 * `prefers-reduced-motion` via Framer Motion's reduced-motion handling.
 */
export function TiltCard({
  children,
  className,
  glare = true,
  max = 8
}: {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
  max?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, hsl(0 0% 100% / 0.22), transparent 45%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className="tilt-scene h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative h-full", className)}
      >
        {children}
        {glare ? (
          <motion.span
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
