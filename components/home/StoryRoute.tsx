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
 * The story band's marks as a short route (2026-09-29, story band review points 01–04): one truck, the fleet, 48
 * states. Three since 2026-10-05 (owner: cleaner); four from 2026-10-02, when "DOT" made way for the fleet and the new
 * trucks in the yard. The hairline over the row is the road, with a stop at each mark. When the row scrolls into
 * view, the line draws from the first stop to the last, a small orange dot rides it, and each mark lights up as the
 * dot reaches it; at the last one "48" counts up from 1. The road ends at the last stop, and from `lg` each mark is
 * centred in its column with its stop over its middle, so the road sits centred under the band's heading (owner,
 * 2026-10-05: no grey line past the end; it used to run on, faint, to the row's edge). It plays once and then stays finished. Orange is only the
 * rider and the last stop (the marks are ink and light, one step under the band's heading; white until the band went
 * white, 2026-10-02).
 *
 * Below `lg` the marks stack and the road runs down their left edge (`sm` until 2026-10-02, when four across didn't fit a tablet). Before it's measured on the client (and without
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
        !li ? 0 : wide ? li.offsetLeft + li.offsetWidth / 2 : li.offsetTop + STACKED_STOP_OFFSET,
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
    const x = along(stopsRef.current, p);
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
  const length = useTransform(progress, (p) => along(stopsRef.current, p) - (stopsRef.current[0] ?? 0));
  const riderAt = useTransform(progress, (p) => along(stopsRef.current, p));
  const first = stops[0] ?? 0;
  const last = stops.at(-1) ?? 0;
  const riderOpacity = useTransform(progress, (p) => (p > 0 && p < 1 ? 1 : 0));

  // 58px under Read our full story's underline (owner, 2026-10-05: first 48, even with the gaps above it, then
  // "lower the number band by 10 pixels"; it was 80).
  return (
    <div ref={wrapRef} className="relative mt-[3.625rem]">
      {/* The road: a faint track from the first stop to the last, the drawn part over it, a stop at each mark and the
          rider. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {measured && (
          <>
            <span
              className="absolute bg-ink/15"
              style={
                across
                  ? { left: first, top: 0, width: last - first, height: 1 }
                  : { left: 0, top: first, width: 1, height: last - first }
              }
            />
            {/* Both sizes and both offsets set every time: motion keeps a style it's no longer given, so switching
                direction on a resize would otherwise leave the old ones behind. */}
            <motion.span
              className="absolute bg-ink/55"
              style={{
                left: across ? first : 0,
                top: across ? 0 : first,
                width: across ? length : 1,
                height: across ? 1 : length,
              }}
            />
            {stops.map((stop, i) => {
              const on = still || i < lit;
              const end = i === stops.length - 1;
              return (
                <span
                  key={i}
                  className={cx(
                    "absolute size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-500",
                    // The last stop is plain brand orange, no pale ring around it (owner, 2026-10-05: make it the same
                    // colour as "rule" — it already was #ff3000, but the 18% ring washed it out to a lighter orange).
                    on
                      ? end
                        ? "bg-brand shadow-[inset_0_0_0_1px_var(--color-brand)]"
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
                style={{ left: across ? riderAt : 0, top: across ? 0 : riderAt, opacity: riderOpacity }}
              />
            )}
          </>
        )}
      </div>

      <ol className="grid gap-12 pt-12 max-lg:pl-8 lg:grid-cols-3 lg:gap-10 lg:pt-14">
        {milestones.map((milestone, i) => {
          // Dim until the rider reaches it — only once measured, so the server HTML shows the finished row.
          const on = !measured || still || i < lit;
          return (
            <li
              key={milestone.title}
              ref={(li) => {
                itemRefs.current[i] = li;
              }}
              className="lg:text-center"
            >
              <p
                aria-hidden
                className={cx(
                  // Up to 80px, on one line. Capped at 68px while "In-house" was a mark (2026-10-02); every mark is a number now.
                  // Regular weight since 2026-10-05 (owner: semibold was too bold and crowded the section).
                  "whitespace-nowrap font-display font-normal text-[3rem] leading-[0.95] tracking-[-0.03em] text-ink transition-[opacity,translate] duration-700 ease-premium sm:text-[clamp(3rem,6vw,5rem)]",
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
                <p className="mt-2 max-w-[20rem] text-pretty leading-relaxed lg:mx-auto">{milestone.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The point `p` (0–1) of the way from the first stop to the last, in px along the road. */
function along(stops: number[], p: number) {
  const first = stops[0] ?? 0;
  return first + p * ((stops.at(-1) ?? 0) - first);
}
