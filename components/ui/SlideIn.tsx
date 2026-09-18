"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// One duration and one curve for every item, so pieces that start together also land together.
const DURATION = 1.1;
const EASE = [0.22, 1, 0.36, 1] as const;

type SlideGroupProps = {
  children: ReactNode;
  className?: string;
  "aria-labelledby"?: string;
};

/**
 * A `<section>` that tells every `SlideItem` inside it when to move. The trigger lives here rather than on
 * each item so a photo and its text start on the same frame — separate in-view checks fire at different
 * scroll positions when the two sit at different heights.
 *
 * Clips horizontally, so an item waiting off the screen edge doesn't widen the page. `overflow-x: clip`,
 * not `hidden`, so the section doesn't become a scroll container.
 */
export function SlideGroup({ className, children, "aria-labelledby": labelledBy }: SlideGroupProps) {
  return (
    <motion.section
      aria-labelledby={labelledBy}
      className={cx("overflow-x-clip", className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}

type SlideItemProps = {
  children?: ReactNode;
  /** The side it comes in from. */
  from: "left" | "right";
  /** How far away it starts: a length, or a percentage of its own width ("100%" = fully off to that side). */
  distance?: string;
  className?: string;
};

/**
 * Slides in from one side when its `SlideGroup` scrolls into view. Only works inside a `SlideGroup`.
 * Reduced-motion visitors start and end in the same places but jump straight to the end, as with Reveal.
 */
export function SlideItem({ children, from, distance = "6rem", className }: SlideItemProps) {
  const reduceMotion = useReducedMotion();
  const offset = from === "left" ? `-${distance}` : distance;

  const variants: Variants = {
    hidden: { opacity: 0, x: offset },
    shown: {
      opacity: 1,
      x: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: DURATION, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
