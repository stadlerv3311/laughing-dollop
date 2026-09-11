"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before animating — stagger siblings with 0.05–0.15 steps. */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
  className?: string;
};

/**
 * Fades and lifts its children in the first time they scroll into view.
 * Reduced-motion visitors get the same starting state (so the server HTML still matches on hydration)
 * but an instant transition instead of the fade.
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
