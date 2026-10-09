"use client";

import { useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyBand, applyLink } from "@/lib/site";

/**
 * The careers half's closing ask, the twin of Ship with us (owner, 2026-10-05, "A" of three mock-ups after a Mobbin
 * pass: "lets do a twin"). A full black screen with a label, a 72px question and one pill, so the job seeker's ask is
 * as loud as the shipper's: until now Apply now was a 30px underlined link at the foot of Why work with us, the end of
 * the page's longest white stretch. Where Ship with us has the map in dots, this band has a road in the same dots
 * (ApplyRoad).
 *
 * The pill is the Get a quote pill at its closed size, but a plain link: it opens the application, like every Apply
 * now (docs/DECISIONS.md → One label per action). Nothing opens in place.
 *
 * It's the page's last screen, straight on the footer, which went white the same day so the page doesn't end on two
 * black blocks. It slides up over Why work with us like Ship with us does over the safety band (SlideOverStack in
 * app/page.tsx), but it has no landing pause and no wave: those stay Ship with us's own moment. Grey and white only,
 * like the rest of the careers half.
 *
 * Mocked against the careers block moved onto black, and against the three jobs as link rows.
 */
// Draft copy — swap in approved wording when it's ready.
export function ApplyBand() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      aria-labelledby="apply-band"
      data-header-theme="dark"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-5 pt-26 pb-8 text-center text-paper sm:px-8 md:pt-22 md:pb-12"
    >
      <ApplyRoad playing={inView} />

      {/* A soft pool of ink behind the heading, so the dots and the lane marks never run through the words. */}
      <div className="relative z-10 max-w-[64rem] before:absolute before:-inset-x-[12%] before:-inset-y-12 before:-z-10 before:bg-[radial-gradient(closest-side,rgb(37_37_37/0.92)_45%,transparent)]">
        <p className={cx(labelClass, "text-paper/70")}>{applyBand.label}</p>
        {/* Ship with us's size: a step over the other band headings, held under the hero's. */}
        <h2
          id="apply-band"
          className="mt-3.5 font-display font-semibold text-[3rem] leading-none tracking-[-0.03em] text-balance sm:text-[4.5rem]"
        >
          {applyBand.heading}
        </h2>
      </div>

      <div className="relative z-10 mt-7 flex w-full justify-center md:mt-11">
        {/* Get a quote's closed pill (QuoteBar): 240 × 56px from `md`, full width and 52px tall on phones. */}
        <Link
          href={applyLink.href}
          className="group/launch relative flex h-13 w-full items-center justify-center overflow-hidden rounded-full bg-cloud text-base font-semibold tracking-[-0.01em] text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:h-14 md:max-w-[15rem] md:text-[1.0625rem]"
        >
          {/* The site's button move: the dot grows until it fills the pill, and the label turns white. */}
          <span
            aria-hidden
            className="absolute top-1/2 left-[calc(50%-4.375rem)] size-2 -translate-y-1/2 rounded-full bg-ink transition-transform duration-500 ease-premium group-hover/launch:scale-[100] group-focus-visible/launch:scale-[100] motion-reduce:transition-none"
          />
          {/* The dot is orange while the pill rests, as on Get a quote's (the builder, 2026-10-09: "on work with us
              too"): a dot of its own over the ink one that fades as the pill fills, so the pill is never orange. */}
          <span
            aria-hidden
            className="absolute top-1/2 left-[calc(50%-4.375rem)] size-2 -translate-y-1/2 rounded-full bg-brand transition-opacity delay-300 duration-150 group-hover/launch:opacity-0 group-hover/launch:delay-0 group-focus-visible/launch:opacity-0 group-focus-visible/launch:delay-0 motion-reduce:transition-none"
          />
          <span className="relative pl-5 transition-colors duration-300 group-hover/launch:text-paper group-focus-visible/launch:text-paper">
            {applyLink.label}
          </span>
          {/* The orange line round the pill while it's hovered or focused, as on Get a quote's (owner, 2026-10-06:
              "add this to the driver section too"): the pill fills black on the black band. The band's one orange. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand opacity-0 transition-opacity duration-300 group-hover/launch:opacity-100 group-focus-visible/launch:opacity-100 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </section>
  );
}

/** The map's dots as they show on ink: `us-dots.svg`'s ink dots, inverted. */
const DOT = "rgb(218 218 218)";

/**
 * How fast the lane marks come: marks passing a given spot each second. 0.2 until 2026-10-07 (owner: "please increase
 * a bit the speed of the road"), so a mark now takes about 3.6s to reach where the one ahead of it was, not 5s.
 */
const ROAD_SPEED = 0.28;

/**
 * A road in the map's dots, behind the band's words: the same grid and grey as Ship with us's map, cut to the shape of
 * a road that runs from a point near the top of the band out past its bottom corners. The surface is as faint as the
 * map (13%), the two edges a little brighter, and the lane marks down the middle are lit dots that travel towards the
 * viewer. Drawn on a canvas, since every dot is redrawn each frame; it runs only while the band is on screen, and
 * holds still under reduced motion.
 */
function ApplyRoad({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const moving = playing && !still;
    let frame = 0;

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = DOT;

      // The map's grid is 9px with 1.7px dots, drawn about a third larger on a laptop; the same here.
      const step = Math.max(9, Math.min(13, width / 108));
      const radius = step * 0.19;
      const centre = width / 2;
      const horizon = height * 0.09;
      const seconds = still ? 0 : time / 1000;

      for (let y = horizon + step / 2; y < height + step; y += step) {
        // 0 at the horizon, 1 at the band's bottom edge.
        const depth = (y - horizon) / (height - horizon);
        const half = (0.006 + 0.4 * depth) * Math.max(width, 760);
        // The far end fades in instead of starting on a hard point.
        const near = Math.min(1, depth * 4);
        // Marks are evenly spaced along the road, so they bunch up towards the horizon.
        const marked = ((1 / (depth + 0.14)) * 1.5 + seconds * ROAD_SPEED) % 1 < 0.5;
        const reach = Math.ceil(Math.min(half, centre + step) / step);
        for (let column = -reach; column <= reach; column++) {
          const offset = Math.abs(column * step);
          if (offset > half) continue;
          let alpha = 0.13;
          if (half - offset < step * (0.6 + 1.2 * depth)) alpha = 0.4;
          if (marked && offset <= step * (0.2 + 0.9 * depth)) alpha = 0.9;
          context.globalAlpha = alpha * near;
          context.beginPath();
          context.arc(centre + column * step, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (moving) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    // While it isn't moving, a resize still has to redraw it at the new size.
    const observer = new ResizeObserver(() => {
      if (!moving) draw(performance.now());
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [playing, still]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}
