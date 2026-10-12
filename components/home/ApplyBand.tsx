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
      // `lvh` like Ship with us: the phone's toolbar is folded away this far down the page.
      // On phones the words and the pill stand where Ship with us has them (the builder, 2026-10-09: "make text and
      // button positions similar to ship with us"): the heading 112px from the top instead of in the middle, the pill
      // at the foot of the screen, where a thumb reaches it, and the road between them. The foot's padding is what the
      // browser's toolbar takes when it's showing, and 2rem, so the pill is never under it. Centred from `md`.
      className="relative isolate flex min-h-lvh flex-col items-center justify-center overflow-hidden bg-ink px-5 pt-26 pb-8 text-center text-paper max-md:justify-start max-md:pt-28 max-md:pb-[calc(100lvh-100svh+2rem)] sm:px-8 md:pt-22 md:pb-12"
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

      <div className="relative z-10 flex w-full justify-center max-md:mt-auto md:mt-11">
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
 * The road's turns (the builder, 2026-10-09: "can we add some turns to that road?"; it ran dead straight until then).
 * It is laid out like a road, in lane marks: a straight, a turn to the left, a straight, a turn to the right, and
 * round again. The first try swung it from side to side without a pause, which read as a zigzag (the builder, the same
 * day: "goes straight then left then straight again then right … 5-7 sec straight … like an actual road").
 *
 * `STRAIGHT` and `CURVE` are how long each is. The road is longer than it looks straight: a turn shows from about a
 * mark and a half off, and the far end, where it starts, is faint. At these lengths the road below the horizon's
 * fade is within a quarter of a dot of dead straight for 6.5 seconds between turns (measured; 3 gives 5.7s, 3.5 gives
 * 7.5s), and a turn comes every 24 seconds. `TURN` is how hard the turns are: the share of the band's width the far
 * end stands off to the side at the start of one (0.28 looked like a lane change on a phone).
 */
const STRAIGHT = 3.25;
const CURVE = 3.5;
const TURN = 0.4;
const LAP = 2 * (STRAIGHT + CURVE);

// One turn, `into` marks into it: how far round the road has come, and how far to the side that has carried it. The
// bend eases in and out (sin²), as a road's does, instead of starting at full lock.
const turned = (into: number) => into / 2 - (CURVE / (4 * Math.PI)) * Math.sin((2 * Math.PI * into) / CURVE);
const carried = (into: number) =>
  (into * into) / 4 + ((CURVE * CURVE) / (8 * Math.PI * Math.PI)) * (Math.cos((2 * Math.PI * into) / CURVE) - 1);
const TURNED = CURVE / 2;
const CARRIED = (CURVE * CURVE) / 4;
/** How far ahead the road can be seen, in lane marks: from the band's foot to the horizon (`along` in the drawing). */
const SIGHT = 1.5 / 0.14 - 1.5 / 1.14;
/** How far off the viewer's line the far end is as a turn begins, which is what `TURN` is measured against. */
const FAR_OFF = CARRIED + TURNED * (SIGHT - CURVE);

/** Which way the road points at a place along it, counted in lane marks: 0 on the first straight, left of that after. */
function heading(along: number) {
  const place = along - Math.floor(along / LAP) * LAP;
  if (place < STRAIGHT) return 0;
  if (place < STRAIGHT + CURVE) return turned(place - STRAIGHT);
  if (place < 2 * STRAIGHT + CURVE) return TURNED;
  return TURNED - turned(place - 2 * STRAIGHT - CURVE);
}

/** How far to the left the road has run by that place. Each lap ends pointing the way it began, a step further left. */
function side(along: number) {
  const laps = Math.floor(along / LAP);
  const place = along - laps * LAP;
  const before = laps * TURNED * (STRAIGHT + CURVE);
  if (place < STRAIGHT) return before;
  if (place < STRAIGHT + CURVE) return before + carried(place - STRAIGHT);
  if (place < 2 * STRAIGHT + CURVE) return before + CARRIED + TURNED * (place - STRAIGHT - CURVE);
  const into = place - 2 * STRAIGHT - CURVE;
  return before + CARRIED + TURNED * (STRAIGHT + into) - carried(into);
}

/** How lit a dot is that sits `inside` a line's edge by that many pixels: half at the edge, over `soft` pixels. */
const cover = (inside: number, soft: number) => Math.min(1, Math.max(0, inside / soft + 0.5));

/**
 * A road in the map's dots, behind the band's words: the same grid and grey as Ship with us's map, cut to the shape of
 * a road that runs from a point near the top of the band out past its bottom corners. The surface is as faint as the
 * map (13%), the two edges a little brighter, and the lane marks down the middle are lit dots that travel towards the
 * viewer. The road has turns (`STRAIGHT`, `CURVE`, `TURN`): they come towards the viewer with the lane marks, and the
 * view is a driver's, so the road always runs straight out from under the viewer, at the middle of the band's foot,
 * and a turn bends what is ahead. The dots stay on their grid, so a line that moves sideways
 * fades from one column into the next instead of jumping. Drawn on a canvas, since every dot is redrawn each frame; it
 * runs only while the band is on screen, and holds still under reduced motion.
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
      const travelled = (still ? 0 : time / 1000) * ROAD_SPEED;
      // Places along the road are counted in lane marks, evenly spaced, so they bunch up towards the horizon.
      const along = (depth: number) => 1.5 / (depth + 0.14) + travelled;
      // The road under the viewer, and which way it points there: every row is placed against that line, so the near
      // end never leaves the middle and a straight is drawn straight whichever way it runs.
      const here = along(1);
      const from = side(here);
      const pointing = heading(here);

      for (let y = horizon + step / 2; y < height + step; y += step) {
        // 0 at the horizon, 1 at the band's bottom edge.
        const depth = (y - horizon) / (height - horizon);
        const half = (0.006 + 0.4 * depth) * Math.max(width, 760);
        // The far end fades in instead of starting on a hard point.
        const near = Math.min(1, depth * 4);
        const place = along(depth);
        const marked = place % 1 < 0.5;
        // How far the road is off that line at this row, drawn smaller the further away it is. `depth + 0.14` is one
        // over the distance, as in `along`.
        const off = side(place) - from - pointing * (place - here);
        const middle = centre - (off / FAR_OFF) * TURN * width * ((depth + 0.14) / 0.14);
        const first = Math.max(Math.floor((middle - half - centre) / step), -Math.ceil((centre + step) / step));
        const last = Math.min(Math.ceil((middle + half - centre) / step), Math.ceil((centre + step) / step));
        for (let column = first; column <= last; column++) {
          const inside = half - Math.abs(centre + column * step - middle);
          const surface = cover(inside, step);
          if (surface === 0) continue;
          let alpha = 0.13 + 0.27 * cover(step * (0.6 + 1.2 * depth) - inside, step);
          if (marked) alpha += (0.9 - alpha) * cover(step * (0.2 + 0.9 * depth) - (half - inside) + step / 4, step / 2);
          context.globalAlpha = alpha * surface * near;
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
