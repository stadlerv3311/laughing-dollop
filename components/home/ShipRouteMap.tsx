"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Northern California (home) to New York, arcing over the top so both ends sit outside the words, in the dot map's
 * 960 × 613 units. A picture, not a lane.
 */
const ROUTE = "M 66 236 C 240 90, 620 80, 828 168";
const START = { x: 66, y: 236 };
const END = { x: 828, y: 168 };

/**
 * A clear hole over the text column (so no dot or line sits behind the heading, the bar or the proof line), and a fade
 * at both sides. Two masks, kept where they overlap.
 */
const MASK = [
  "radial-gradient(ellipse 46% 44% at 50% 52%, transparent 62%, #000 100%)",
  "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
].join(", ");
const maskStyle: CSSProperties = {
  maskImage: MASK,
  WebkitMaskImage: MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/**
 * The faint map behind Ship with us (owner's pick "B", 2026-09-29, Ship with us review point 06): the lower 48 in dots
 * (public/images/us-dots.svg, built from the Fleet map's state shapes by scripts/build-us-dots.mjs) and one dashed
 * route across it (California to New York, over the top), a small orange dot riding it every 8 seconds. It only shows around the words, never behind them.
 *
 * From `lg` only: at phone and tablet width it can't sit clear of the words. The dot and the drift pause while the band
 * is off screen, and neither plays under reduced motion (the map and route stay, still).
 */
export function ShipRouteMap() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const still = useReducedMotion() ?? false;
  const playing = inView && !still;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (playing) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [playing]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
      <div className="relative aspect-[960/613] w-[min(74rem,100%)] shrink-0" style={maskStyle}>
        <Image src="/images/us-dots.svg" alt="" fill sizes="74rem" className="select-none" />
        <svg ref={svgRef} viewBox="0 0 960 613" className="absolute inset-0 size-full">
          <path
            id="ship-route"
            d={ROUTE}
            fill="none"
            strokeOpacity={0.4}
            strokeWidth={1.6}
            strokeDasharray="5 7"
            className="animate-route-flow stroke-ink motion-reduce:animate-none"
            style={{ animationPlayState: playing ? "running" : "paused" }}
          />
          <circle cx={START.x} cy={START.y} r={5} fillOpacity={0.6} className="fill-ink" />
          <circle cx={END.x} cy={END.y} r={5} className="fill-brand" />
          {!still && (
            <circle r={4} className="fill-brand">
              <animateMotion dur="8s" repeatCount="indefinite">
                <mpath href="#ship-route" />
              </animateMotion>
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
}
