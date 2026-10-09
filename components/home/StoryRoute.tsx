"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { Milestone } from "@/lib/story";

/** Seconds: a beat after the row is in view, then the ride from the first stop to the last. */
const DELAY = 0.3;
const RIDE = 2;
/**
 * Below `lg` the ride stops at each mark long enough to read its line, then moves on: seconds at a stop, and from one
 * to the next.
 */
const HOLD = 1.6;
const LEG = 0.9;
/** Below `lg` the road runs between a mark and its label: this far under the mark, half the gap between the two. */
const ROAD_UNDER_MARK = 18;
const WIDE = "(width >= 64rem)";

/**
 * The story band's marks as a short route (2026-09-29, story band review points 01–04): one truck, the fleet, 48
 * states. Three since 2026-10-05 (owner: cleaner); four from 2026-10-02, when "DOT" made way for the fleet and the new
 * trucks in the yard. The hairline over the row is the road, with a stop at each mark. When the row scrolls into
 * view, the line draws from the first stop to the last, a small orange dot rides it, and each mark lights up as the
 * dot reaches it; "70+" and "48" count up from 1 as it gets to them. The road ends at the last stop, and from `lg` each mark is
 * centred in its column with its stop over its middle, so the road sits centred under the band's heading (owner,
 * 2026-10-05: no grey line past the end; it used to run on, faint, to the row's edge). It plays once and then stays finished. Orange is only the
 * rider and the last stop (the marks are ink and light, one step under the band's heading; white until the band went
 * white, 2026-10-02).
 *
 * Below `lg` it is one row too since 2026-10-09 (the builder's sketch: "line will be horizontal. as line fills out
 * under line there is text that explains what is filling out. then you press on the number the text appears under
 * the block"; the marks were stacked with the road down their left edge). The marks stand over the road, a word for
 * each under it (`label`), and the three share one line of text under the row. The ride stops at each mark for its
 * line to be read (HOLD) before it moves on. After that a mark is a button: pressing one brings the road to its stop
 * and shows its line. The mark being read is in full ink and the others step back; a mark that has counted keeps
 * its number. From `lg` nothing is pressed, every mark has its own title and text under it, as before.
 *
 * Before it's measured on the client (and without JavaScript) everything shows finished; reduced-motion visitors get
 * the finished state straight away.
 */
export function StoryRoute({ milestones }: { milestones: Milestone[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });
  const still = useReducedMotion() ?? false;

  // Each stop's distance along the road, in px; how far down the row the road runs (0 from `lg`, where it's the row's
  // top edge); and whether this is the `lg` layout.
  const [stops, setStops] = useState<number[]>([]);
  const [roadY, setRoadY] = useState(0);
  const [wide, setWide] = useState(true);
  const stopsRef = useRef<number[]>([]);
  const markRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  // How far the rider has got, 0–1 of the way from the first stop to the last. A share rather than px, so a re-measure
  // mid-ride (text reflowing, a resize) moves the road under it instead of restarting or cutting the ride short.
  const progress = useMotionValue(0);
  const [lit, setLit] = useState(0);
  // How many marks the rider has ever reached: those have counted up and keep their number when the road is brought
  // back to an earlier stop.
  const [seen, setSeen] = useState(0);
  // The mark pressed below `lg`, once one has been.
  const [picked, setPicked] = useState<number | null>(null);
  const pickedRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const isWide = window.matchMedia(WIDE).matches;
      const next = itemRefs.current.map((li) => (li ? li.offsetLeft + li.offsetWidth / 2 : 0));
      const changed = next.join() !== stopsRef.current.join();
      stopsRef.current = next;
      const mark = markRefs.current[0];
      setRoadY(isWide || !mark ? 0 : mark.offsetTop + mark.offsetHeight + ROAD_UNDER_MARK);
      setWide(isWide);
      if (changed) setStops(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const reach = (p: number) => {
    const x = along(stopsRef.current, p);
    const count = stopsRef.current.filter((stop) => x >= stop - 1).length;
    setLit(count);
    setSeen((most) => Math.max(most, count));
  };
  useMotionValueEvent(progress, "change", reach);

  const measured = stops.length > 0;

  // Ride once, the first time the row is in view; reduced motion jumps to the end.
  useEffect(() => {
    if (!measured) return;
    if (still) {
      progress.set(1);
      return;
    }
    if (!inView || pickedRef.current || progress.get() >= 1) return;
    if (window.matchMedia(WIDE).matches) {
      const controls = animate(progress, 1, {
        delay: DELAY,
        duration: RIDE,
        // Even pace in the middle, so the stops light at about equal beats (an ease-out left a long wait for 48).
        ease: [0.42, 0, 0.58, 1],
      });
      return () => controls.stop();
    }
    // Below `lg`: wait at each stop, then on to the next. The first stop is lit by hand, since the rider starts on it
    // and nothing has moved yet.
    const list = stopsRef.current;
    const shares = list.map((stop) => share(list, stop));
    const values = shares.flatMap((s, i) => (i < shares.length - 1 ? [s, s] : [s]));
    const total = (shares.length - 1) * (HOLD + LEG);
    const times = values.map((_, k) => (Math.floor(k / 2) * (HOLD + LEG) + (k % 2) * HOLD) / total);
    const first = setTimeout(() => reach(progress.get()), DELAY * 1000);
    const controls = animate(progress, values, { delay: DELAY, duration: total, times, ease: "easeInOut" });
    return () => {
      clearTimeout(first);
      controls.stop();
    };
  }, [inView, still, measured, progress]);

  // Pressed (below `lg`): the road goes to that stop, forward or back, and its line shows.
  const pick = (i: number) => {
    if (wide) return;
    pickedRef.current = true;
    setPicked(i);
    const to = share(stopsRef.current, stopsRef.current[i] ?? 0);
    if (still) progress.set(to);
    else animate(progress, to, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };
  // The mark whose line shows: the pressed one, or the last one the rider reached. The last of all before it's
  // measured, the finished state.
  const active = !measured || (still && picked === null) ? milestones.length - 1 : (picked ?? Math.max(0, lit - 1));
  const lineShown = !measured || still || lit > 0 || picked !== null;

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
            <span className="absolute h-px bg-ink/15" style={{ left: first, top: roadY, width: last - first }} />
            <motion.span className="absolute h-px bg-ink/55" style={{ left: first, top: roadY, width: length }} />
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
                  style={{ left: stop, top: roadY }}
                />
              );
            })}
            {/* The rider is the first ride's only: a pressed mark moves the road without it. */}
            {!still && picked === null && (
              <motion.span
                className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
                style={{ left: riderAt, top: roadY, opacity: riderOpacity }}
              />
            )}
          </>
        )}
      </div>

      <ol className="grid grid-cols-3 gap-x-3 lg:gap-10 lg:pt-14">
        {milestones.map((milestone, i) => {
          // Dim until the rider reaches it — only once measured, so the server HTML shows the finished row.
          const on = !measured || still || i < lit;
          const reached = !measured || still || i < seen;
          const pressable = measured && !wide;
          return (
            <li
              key={milestone.title}
              ref={(li) => {
                itemRefs.current[i] = li;
              }}
              className="text-center"
            >
              {/* Below `lg` the mark and its label are one button; from `lg` it's plain text. A `div` either way, so
                  the counting mark inside isn't thrown away when the layout is known. */}
              <div
                role={pressable ? "button" : undefined}
                tabIndex={pressable ? 0 : undefined}
                aria-pressed={pressable ? i === active : undefined}
                aria-label={pressable ? `${milestone.mark} ${milestone.label}` : undefined}
                onClick={() => pick(i)}
                onKeyDown={(event) => {
                  if (!pressable || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  pick(i);
                }}
                className="max-lg:cursor-pointer max-lg:select-none max-lg:pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <p
                  ref={(mark) => {
                    markRefs.current[i] = mark;
                  }}
                  aria-hidden
                  className={cx(
                    // Up to 80px, on one line. Capped at 68px while "In-house" was a mark (2026-10-02); every mark is a number now.
                    // Regular weight since 2026-10-05 (owner: semibold was too bold and crowded the section).
                    // 40px on phones since 2026-10-09, where the three stand in one row.
                    "whitespace-nowrap font-display font-normal text-[2.5rem] leading-[0.95] tracking-[-0.03em] text-ink transition-[opacity,translate] duration-700 ease-premium sm:text-[clamp(3rem,6vw,5rem)]",
                    // Below `lg` only the mark being read is in full ink.
                    reached ? (i === active ? "opacity-100" : "opacity-100 max-lg:opacity-40") : "translate-y-2.5 opacity-20",
                  )}
                >
                  {/* A mark with `countFrom` counts up as the rider reaches its stop, keeping what follows its number
                      ("70+"). Until 2026-10-07 only the last one did, once the ride was over (owner, of the middle
                      one: "70 doesnt have the animation. please check"). */}
                  {milestone.countFrom !== undefined ? (
                    <CountUp
                      value={parseInt(milestone.mark, 10)}
                      suffix={milestone.mark.replace(/^\d+/, "")}
                      from={milestone.countFrom}
                      play={still || i < seen}
                      duration={1}
                    />
                  ) : (
                    milestone.mark
                  )}
                </p>
                {/* Twice ROAD_UNDER_MARK under the mark, so the road runs through the middle of the gap. */}
                <p
                  aria-hidden
                  className={cx(
                    "mt-9 whitespace-nowrap text-sm transition-colors duration-500 lg:hidden",
                    reached && i === active ? "text-ink" : "text-ink/70",
                  )}
                >
                  {milestone.label}
                </p>
              </div>
              <div className={cx("transition-opacity delay-100 duration-700 max-lg:hidden", on ? "opacity-100" : "opacity-35")}>
                <h3 className="mt-6 text-sm text-ink/70">{milestone.title}</h3>
                <p className="mt-2 max-w-[20rem] text-pretty leading-relaxed lg:mx-auto">{milestone.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Below `lg`, the one line under the row: the text of the mark being read. All three lie in the same spot, so
          the row under it never moves as they swap. */}
      <div aria-live="polite" className="mt-8 grid text-center lg:hidden">
        {milestones.map((milestone, i) => (
          <p
            key={milestone.title}
            aria-hidden={i !== active}
            className={cx(
              "mx-auto max-w-[22rem] text-pretty leading-relaxed transition-opacity duration-500 [grid-area:1/1]",
              i === active && lineShown ? "opacity-100 delay-150" : "opacity-0",
            )}
          >
            {milestone.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/** How far along the road a stop is, 0–1 of the way from the first stop to the last. */
function share(stops: number[], stop: number) {
  const first = stops[0] ?? 0;
  const span = (stops.at(-1) ?? 0) - first;
  return span ? (stop - first) / span : 0;
}

/** The point `p` (0–1) of the way from the first stop to the last, in px along the road. */
function along(stops: number[], p: number) {
  const first = stops[0] ?? 0;
  return first + p * ((stops.at(-1) ?? 0) - first);
}
