"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type ScrollFillTextProps = {
  /** Plain text, split on spaces. Put it inside the heading element, which keeps its own styles. */
  text: string;
  /** How faint a word is before it fills (share of full strength). */
  from?: number;
};

/**
 * Words that fill in from faint to full strength as the page scrolls — tied to scroll position, so scrolling back up
 * empties them again (2026-09-29, after Runway on Mobbin). Use it once per screen at most, on a large heading; see
 * docs/DECISIONS.md → Wording and type.
 *
 * It starts as the text's top comes up past 85% of the screen and is full by the time its foot is 40% from the top,
 * so the sentence is never left half-faint where people stop to read. It fades opacity, so it works on light and dark
 * bands alike. Reduced-motion visitors get the finished text; screen readers get ordinary words either way.
 */
export function ScrollFillText({ text, from = 0.25 }: ScrollFillTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });

  const words = text.split(" ");
  // The span always renders, so useScroll's target stays attached even when there's nothing to animate.
  return (
    <span ref={ref}>
      {reduceMotion
        ? text
        : words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              from={from}
              start={i / words.length}
              end={(i + 1.5) / words.length}
            >
              {word}
              {i < words.length - 1 && " "}
            </Word>
          ))}
    </span>
  );
}

type WordProps = {
  progress: MotionValue<number>;
  from: number;
  start: number;
  end: number;
  children: React.ReactNode;
};

// Each word's ramp overlaps the next one's by half a word, so the fill runs along the line instead of stepping.
function Word({ progress, from, start, end, children }: WordProps) {
  const opacity = useTransform(progress, [start, Math.min(end, 1)], [from, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
