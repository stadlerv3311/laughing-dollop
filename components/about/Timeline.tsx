"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Container, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { TimelineEntry } from "@/lib/story";

const WIDE = "(width >= 64rem)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);

/** The strip's side padding: the Container's left edge, so the first year starts under the heading. */
const GUTTER = "px-5 sm:px-8 desktop:px-[calc((100vw-75rem)/2)]";

/**
 * The About page's timeline, sideways (owner, 2026-09-25: a horizontal timeline with some scroll animation — the
 * plain list read as boring). After a Mobbin pass: Square's single line with the years along it, Büro's year range
 * in the corner, Mews's oversized years.
 *
 * From `lg` the section pins to the screen and scrolling down moves the strip left, so the reader keeps their own
 * pace and nothing plays by itself. A hairline runs from the first year to the last; an orange line fills along it
 * as you go, and each year lights up — its dot turns orange, its number goes from faint to full ink — as the line
 * reaches it. The section is exactly as tall as the sideways distance plus a screen, so the pin lets go right as the
 * last year arrives.
 *
 * Below `lg`, and for reduced motion, there's no pin: the strip is a row you swipe, snapping year by year, with the
 * same line filling as it scrolls.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduceMotion = useReducedMotion();
  const pinned = wide && reduceMotion === false;

  // How far the strip travels sideways: its full width less the screen's.
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const measure = () => setDistance(Math.max(0, strip.offsetWidth - document.documentElement.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { scrollXProgress } = useScroll({ container: scrollerRef });
  const progress = pinned ? scrollYProgress : scrollXProgress;
  const x = useTransform(scrollYProgress, (p) => -p * distance);

  // How many years the line has reached. A little ahead of the exact point, so a year lights as it arrives rather
  // than once it's already past.
  const [reached, setReached] = useState(1);
  useMotionValueEvent(progress, "change", (p) => {
    setReached(Math.min(entries.length, Math.floor(p * (entries.length - 1) + 1.15)));
  });

  const first = entries[0]?.year;
  const last = entries.at(-1)?.year;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-timeline"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={cx(pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-20 sm:py-28")}>
        <Container className="flex items-end justify-between gap-8">
          <div>
            <p className={cx(labelClass, "text-ink/70")}>Timeline</p>
            <h2 id="about-timeline" className={cx("mt-4", sectionHeadingClass)}>
              How we got here.
            </h2>
          </div>
          {first && last && (
            <p className="shrink-0 text-sm tabular-nums text-ink/60">
              {first} &ndash; {last}
            </p>
          )}
        </Container>

        <div
          ref={scrollerRef}
          className={cx(
            "mt-12 sm:mt-16",
            !pinned && "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          <motion.div
            ref={stripRef}
            style={pinned ? { x } : undefined}
            className={cx("relative w-max [--item:min(78vw,21rem)]", GUTTER)}
          >
            {/*
              The line runs from the first dot to the last (each dot sits at its year's left edge), at the dots'
              height: the year's 3.5rem, the 1.5rem gap, half the 0.75rem dot. Its ends repeat GUTTER.
            */}
            <span
              aria-hidden
              className="absolute left-5 right-[calc(1.25rem+var(--item))] top-[5.375rem] h-px bg-ink/12 sm:left-8 sm:right-[calc(2rem+var(--item))] desktop:left-[calc((100vw-75rem)/2)] desktop:right-[calc((100vw-75rem)/2+var(--item))]"
            >
              <motion.span aria-hidden className="block h-full origin-left bg-brand" style={{ scaleX: progress }} />
            </span>

          <ol className="relative flex gap-10 sm:gap-14">
            {entries.map((entry, i) => {
              const on = i < reached;
              return (
                <li key={entry.year} className="w-[var(--item)] shrink-0 snap-start scroll-ml-5 sm:scroll-ml-8">
                  <p
                    className={cx(
                      "text-[3.5rem] font-medium leading-none tracking-[-0.05em] tabular-nums transition-colors duration-500",
                      on ? "text-ink" : "text-ink/20",
                    )}
                  >
                    {entry.year}
                  </p>
                  <span className="mt-6 flex h-3 items-center" aria-hidden>
                    <span
                      className={cx(
                        "size-3 rounded-full ring-4 ring-paper transition-colors duration-500",
                        on ? "bg-brand" : "bg-ink/20",
                      )}
                    />
                  </span>
                  <h3
                    className={cx(
                      "mt-8 text-lg font-medium tracking-[-0.01em] transition-colors duration-500",
                      on ? "text-ink" : "text-ink/40",
                    )}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className={cx(
                      "mt-2 text-pretty leading-relaxed transition-colors duration-500",
                      on ? "text-ink/70" : "text-ink/30",
                    )}
                  >
                    {entry.text}
                  </p>
                </li>
              );
            })}
          </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
