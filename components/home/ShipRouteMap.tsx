"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { cx } from "@/lib/cx";
import { US_MAP_HEIGHT, US_MAP_WIDTH, usStates, type StateCode } from "@/lib/us-states";

const byCode = new Map(usStates.map((state) => [state.code, state]));

/** The white dots at full strength (scripts/build-us-dots.mjs), so the wave lights only the dots. */
const MASK = "url(/images/us-dots-mask.svg) center / contain no-repeat";
const maskStyle: CSSProperties = { mask: MASK, WebkitMask: MASK };

/** An arc over the top from one state's pin to the other's, higher the farther apart they are. */
function arc(from: StateCode, to: StateCode) {
  const a = byCode.get(from)!;
  const b = byCode.get(to)!;
  const lift = Math.min(160, Math.max(40, Math.hypot(b.cx - a.cx, b.cy - a.cy) * 0.28));
  return `M ${a.cx} ${a.cy} Q ${(a.cx + b.cx) / 2} ${(a.cy + b.cy) / 2 - lift} ${b.cx} ${b.cy}`;
}

type ShipRouteMapProps = {
  pickup: StateCode | null;
  delivery: StateCode | null;
  /** Goes up by one each time a quote is sent: the load rides the route once. */
  ride: number;
  /** Goes up by one to start the wave over from the left edge (the scroll stop). */
  sweep: number;
  /** False while the band is off screen: the wave holds still. */
  playing: boolean;
  className?: string;
};

/**
 * The map behind Ship with us (rebuilt 2026-10-02, owner, from the full-screen mock-ups): the lower 48 in dots
 * (public/images/us-dots.svg), lit by what the visitor types. A pickup ZIP brightens its state's dots and drops a hollow
 * white pin on it with one pulse; a delivery ZIP does the same with a solid orange pin (the form's own marks), and a
 * dashed arc draws between them. When the quote is sent, a small orange dot rides the arc and the line turns solid
 * behind it. A soft white light sweeps across the dots every few seconds (owner: "like a gaming keyboard's colour wave",
 * then "white wave — rainbow is too much for a trucking company").
 *
 * Until 2026-10-02 it was decoration: faint, masked out behind the words, laptop and up only, one dashed California →
 * New York route with a dot riding it.
 *
 * Under reduced motion there's no wave, pulse, draw or ride: the states and pins just appear.
 */
export function ShipRouteMap({ pickup, delivery, ride, sweep, playing, className }: ShipRouteMapProps) {
  const still = useReducedMotion() ?? false;
  const svgRef = useRef<SVGSVGElement>(null);
  const solidRef = useRef<SVGPathElement>(null);
  const loadRef = useRef<SVGCircleElement>(null);
  // Map units per screen pixel, so the pin labels stay 14px whatever size the map is drawn at.
  const [unit, setUnit] = useState(1.6);
  // Bumped when the load arrives, so the delivery pin pulses again.
  const [arrived, setArrived] = useState(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(() => {
      const box = svg.getBoundingClientRect();
      const scale = Math.min(box.width / US_MAP_WIDTH, box.height / US_MAP_HEIGHT);
      if (scale > 0) setUnit(1 / scale);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const route = pickup && delivery && pickup !== delivery ? arc(pickup, delivery) : null;

  // The ride: the dot follows the arc and the solid line grows behind it. Eased in and out, 1.5s.
  useEffect(() => {
    const solid = solidRef.current;
    const load = loadRef.current;
    if (!ride || !route || !solid || !load || still) return;
    const length = solid.getTotalLength();
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const point = solid.getPointAtLength(length * eased);
      load.setAttribute("cx", String(point.x));
      load.setAttribute("cy", String(point.y));
      load.style.opacity = t < 1 ? "1" : "0";
      solid.style.strokeDashoffset = String(1 - eased);
      if (t < 1) frame = requestAnimationFrame(step);
      else setArrived((n) => n + 1);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // Only a new send starts a ride.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride]);

  return (
    <div aria-hidden className={cx("pointer-events-none", className)}>
      <Image src="/images/us-dots.svg" alt="" fill sizes="80rem" className="select-none object-contain invert" />

      {!still && (
        <div className="absolute inset-0 overflow-hidden opacity-50" style={maskStyle}>
          <div
            key={sweep}
            className="absolute inset-0 animate-ship-wave bg-[linear-gradient(90deg,transparent_30%,rgb(255_255_255/0.55)_50%,transparent_70%)]"
            style={{ animationPlayState: playing ? "running" : "paused" }}
          />
        </div>
      )}

      <svg ref={svgRef} viewBox={`0 0 ${US_MAP_WIDTH} ${US_MAP_HEIGHT}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <pattern id="ship-dot-lit" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="4.5" cy="4.5" r="2.1" className="fill-paper" />
          </pattern>
        </defs>

        <g fill="url(#ship-dot-lit)" opacity={0.6}>
          {usStates.map((state) => (
            <path
              key={state.code}
              d={state.d}
              className="transition-opacity duration-600 ease-premium motion-reduce:transition-none"
              style={{ opacity: state.code === pickup || state.code === delivery ? 1 : 0 }}
            />
          ))}
        </g>

        {route && <Route key={route} d={route} still={still} solidRef={solidRef} />}
        <circle ref={loadRef} r={5} className="fill-brand" style={{ opacity: 0 }} />

        {pickup && <Pin key={`p-${pickup}`} code={pickup} kind="pickup" unit={unit} still={still} />}
        {delivery && <Pin key={`d-${delivery}-${arrived}`} code={delivery} kind="delivery" unit={unit} still={still} />}
      </svg>
    </div>
  );
}

/** The dashed arc, drawn in from the pickup end; and the solid line the ride lays over it. */
function Route({ d, still, solidRef }: { d: string; still: boolean; solidRef: RefObject<SVGPathElement | null> }) {
  const [drawn, setDrawn] = useState(still);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <g>
      <mask id="ship-route-reveal" maskUnits="userSpaceOnUse" x="-50" y="-200" width="1060" height="900">
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke="#fff"
          strokeWidth={8}
          strokeDasharray="1 1"
          className="transition-[stroke-dashoffset] duration-900 ease-premium"
          style={{ strokeDashoffset: drawn ? 0 : 1 }}
        />
      </mask>
      <path d={d} fill="none" strokeWidth={1.8} strokeDasharray="5 7" mask="url(#ship-route-reveal)" className="stroke-paper/50" />
      <path ref={solidRef} d={d} fill="none" strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} className="stroke-paper/90" />
    </g>
  );
}

/** A state's pin: hollow white for pickup, solid orange for delivery, a pulse as it lands, and the state's name. */
function Pin({ code, kind, unit, still }: { code: StateCode; kind: "pickup" | "delivery"; unit: number; still: boolean }) {
  const state = byCode.get(code)!;
  // The name goes on the side with more room, so it never runs off the map.
  const right = state.cx < US_MAP_WIDTH * 0.8;
  const pickup = kind === "pickup";
  return (
    <g>
      {!still && (
        <circle
          cx={state.cx}
          cy={state.cy}
          r={7}
          fill="none"
          strokeWidth={2}
          className={cx("origin-center animate-ship-pulse [transform-box:fill-box]", pickup ? "stroke-paper" : "stroke-brand")}
        />
      )}
      <circle
        cx={state.cx}
        cy={state.cy}
        r={7}
        strokeWidth={pickup ? 2.6 : 0}
        className={pickup ? "fill-ink stroke-paper" : "fill-brand"}
      />
      <text
        x={right ? state.cx + 16 : state.cx - 16}
        y={state.cy}
        dy={5}
        textAnchor={right ? "start" : "end"}
        className="fill-paper/90 stroke-ink font-medium [paint-order:stroke] [stroke-linejoin:round]"
        style={{ fontSize: 14 * unit, strokeWidth: 5 * unit }}
      >
        {state.name}
      </text>
    </g>
  );
}
