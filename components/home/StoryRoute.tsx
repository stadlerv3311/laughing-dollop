"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { Milestone } from "@/lib/story";

/** Seconds: a beat after the row is in view, then the ride from the first stop to the last. */
const DELAY = 0.3;
const RIDE = 2;
/** Where a stop sits on the road below `lg`, where the road runs down the left: level with its mark's middle. */
const STACKED_STOP_OFFSET = 24;
const WIDE = "(width >= 64rem)";

/**
 * The story band's four marks as a short route (2026-09-29, story band review points 01–04): one truck, the fleet,
 * our own office, 48 states (four since 2026-10-02, owner: the road ran on empty past the last of three; "DOT" made way
 * for the fleet and the office). The hairline over the row is the road, with a stop at each mark. When the row scrolls into
 * view, the line draws from the first stop to the last, a small orange dot rides it, and each mark lights up as the
 * dot reaches it; at the last one "48" counts up from 1. It plays once and then stays finished. Orange is only the
 * rider and the last stop (the marks are ink and light, one step under the band's heading; white until the band went
 * white, 2026-10-02).
 *
 * Below `lg` the marks stack and the road runs down their left edge (`sm` until 2026-10-02: four across don't fit a tablet). Before it's measured on the client (and without
 * JavaScript) everything shows finished; reduced-motion visitors get the finished state straight away.
 */
export function StoryRoute({ milestones }: { milestones: Milestone[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });
  const still = useReducedMotion() ?? false;

  // Each stop's distance along the road, in px, and whether the road runs across (from `lg`) or down.
  const [stops, setStops] = useState<number[]>([]);
  const [across, setAcross] = useState(true);
  const stopsRef = useRef<number[]>([]);
  // How far the rider has got, 0–1 of the way from the first stop to the last. A share rather than px, so a re-measure
  // mid-ride (text reflowing, a resize) moves the road under it instead of restarting or cutting the ride short.
  const progress = useMotionValue(0);
  const [lit, setLit] = useState(0);
  const done = still || lit === milestones.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wide = window.matchMedia(WIDE).matches;
      const next = itemRefs.current.map((li) =>
        !li ? 0 : wide ? li.offsetLeft : li.offsetTop + STACKED_STOP_OFFSET,
      );
      const changed = next.join() !== stopsRef.current.join();
      stopsRef.current = next;
      setAcross(wide);
      if (changed) setStops(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const x = p * (stopsRef.current.at(-1) ?? 0);
    setLit(stopsRef.current.filter((stop) => x >= stop - 1).length);
  });

  const measured = stops.length > 0;

  // Ride once, the first time the row is in view; reduced motion jumps to the end.
  useEffect(() => {
    if (!measured) return;
    if (still) {
      progress.set(1);
      return;
    }
    if (!inView || progress.get() >= 1) return;
    const controls = animate(progress, 1, {
      delay: DELAY,
      duration: RIDE,
      // Even pace in the middle, so the stops light at about equal beats (an ease-out left a long wait for 48).
      ease: [0.42, 0, 0.58, 1],
    });
    return () => controls.stop();
  }, [inView, still, measured, progress]);

  // Read through the ref, so the drawn length follows a re-measure (the re-render after it recomputes this).
  const length = useTransform(progress, (p) => p * (stopsRef.current.at(-1) ?? 0));
  const riderOpacity = useTransform(progress, (p) => (p > 0 && p < 1 ? 1 : 0));

  return (
    <div ref={wrapRef} className="relative mt-14 sm:mt-20">
      {/* The road: a faint track, the drawn part over it, a stop at each mark and the rider. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute bg-ink/15 max-lg:inset-y-0 max-lg:left-0 max-lg:w-px lg:inset-x-0 lg:top-0 lg:h-px" />
        {measured && (
          <>
            {/* Both sizes set every time: motion keeps a style it's no longer given, so switching direction on a resize
                would otherwise leave the old length behind. */}
            <motion.span
              className="absolute top-0 left-0 bg-ink/55"
              style={{ width: across ? length : 1, height: across ? 1 : length }}
            />
            {stops.map((stop, i) => {
              const on = still || i < lit;
              const end = i === stops.length - 1;
              return (
                <span
                  key={i}
                  className={cx(
                    "absolute size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-500",
                    on
                      ? end
                        ? "bg-brand shadow-[inset_0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(255_48_0/0.18)]"
                        : "bg-ink shadow-[inset_0_0_0_1px_var(--color-ink)]"
                      : "bg-paper shadow-[inset_0_0_0_1px_rgb(37_37_37/0.35)]",
                  )}
                  style={across ? { left: stop, top: 0 } : { left: 0, top: stop }}
                />
              );
            })}
            {!still && (
              <motion.span
                className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
                style={{ left: across ? length : 0, top: across ? 0 : length, opacity: riderOpacity }}
              />
            )}
          </>
        )}
      </div>

      <ol className="grid gap-12 pt-12 max-lg:pl-8 lg:grid-cols-4 lg:gap-10 lg:pt-14">
        {milestones.map((milestone, i) => {
          // Dim until the rider reaches it — only once measured, so the server HTML shows the finished row.
          const on = !measured || still || i < lit;
          return (
            <li
              key={milestone.title}
              ref={(li) => {
                itemRefs.current[i] = li;
              }}
            >
              <p
                aria-hidden
                className={cx(
                  // Up to 80px, on one line. Capped at 68px while "In-house" was a mark (2026-10-02); all four are numbers now.
                  "whitespace-nowrap text-[3rem] font-light leading-[0.95] tracking-[-0.05em] text-ink transition-[opacity,translate] duration-700 ease-premium sm:text-[clamp(3rem,6vw,5rem)]",
                  on ? "opacity-100" : "translate-y-2.5 opacity-20",
                )}
              >
                {milestone.countFrom !== undefined ? (
                  <CountUp value={Number(milestone.mark)} from={milestone.countFrom} play={done} duration={1} />
                ) : (
                  milestone.mark
                )}
              </p>
              <div className={cx("transition-opacity delay-100 duration-700", on ? "opacity-100" : "opacity-35")}>
                <h3 className="mt-6 text-sm text-ink/70">{milestone.title}</h3>
                <p className="mt-2 max-w-[20rem] text-pretty leading-relaxed">{milestone.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
