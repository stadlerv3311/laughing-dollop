"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

type CountUpProps = {
  value: number;
  /** Text after the number, e.g. "+" or "M+". */
  suffix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
};

/**
 * Fills a number up from zero the first time it scrolls into view.
 * The server HTML and reduced-motion visitors get the final value; screen readers only ever read the final value.
 */
export function CountUp({ value, suffix = "", duration = 2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const final = format(value) + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) {
      el.textContent = final;
      return;
    }
    if (!inView) {
      el.textContent = format(0) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        el.textContent = format(n) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, suffix, duration, final]);

  return (
    <span className={className}>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
    </span>
  );
}
