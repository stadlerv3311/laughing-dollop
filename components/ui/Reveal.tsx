"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before animating — stagger siblings with 0.05–0.15 steps. */
  delay?: number;
  /** Starting offset in px — small, so blocks settle rather than travel. */
  y?: number;
  className?: string;
};

/**
 * Fades and lifts its children in the first time they scroll into view — as soon as their top edge enters, quick and
 * short (0.6s, 16px), so a screen is never mostly waiting to appear (owner, 2026-09-30; it was 0.9s, 28px, starting
 * 10% above the bottom edge).
 * Reduced-motion visitors get the same starting state (so the server HTML still matches on hydration)
 * but an instant transition instead of the fade.
 */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
