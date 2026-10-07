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
  /** "City, ST" for each pin's label, when the ZIP is in the list; the state's name is used without it. */
  pickupCity?: string | null;
  deliveryCity?: string | null;
  /** Goes up by one each time a quote is sent: the load rides the route once. */
  ride: number;
  /** Goes up by one to start the wave over from the left edge (the scroll stop). */
  sweep: number;
  /** False while the band is off screen: the wave holds still. */
  playing: boolean;
  /** True while the quote button is closed: made-up trips come and go on the map (DemoQuotes). */
  demo: boolean;
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
 * While the button is closed, made-up trips come and go (owner, 2026-10-05: "connect random dots on the map like
 * somebody is getting a quote"; DemoQuotes). Pressing Get a quote clears them, so only the wave stays and the map is
 * the visitor's own.
 *
 * Under reduced motion there's no wave, pulse, draw, ride or demo trip: the states and pins just appear.
 */
export function ShipRouteMap({ pickup, delivery, pickupCity, deliveryCity, ride, sweep, playing, demo, className }: ShipRouteMapProps) {
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
  // Both ZIPs in one state, in two cities: one pin, so the two labels go one over the other.
  const apart = Boolean(pickup && pickup === delivery && (pickupCity ?? null) !== (deliveryCity ?? null));

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

        {!still && <DemoQuotes active={demo && playing} />}

        {route && <Route key={route} d={route} still={still} solidRef={solidRef} />}
        <circle ref={loadRef} r={5} className="fill-brand" style={{ opacity: 0 }} />

        {pickup && <Pin key={`p-${pickup}`} code={pickup} kind="pickup" label={pickupCity} shift={apart ? -1 : 0} unit={unit} still={still} />}
        {delivery && (
          <Pin key={`d-${delivery}-${arrived}`} code={delivery} kind="delivery" label={deliveryCity} shift={apart ? 1 : 0} unit={unit} still={still} />
        )}
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

/**
 * A state's pin: hollow white for pickup, solid orange for delivery, a pulse as it lands, and beside it the city and
 * state the ZIP belongs to (owner, 2026-10-06: "can we show on the map city and state instead of just state"), or the
 * state's name when the ZIP isn't in the list. The pin itself stays on the state. `shift` moves the label a line up
 * (-1) or down (1): two ZIPs in one state share a pin, and their two cities would sit on top of each other.
 */
function Pin({
  code,
  kind,
  label,
  shift,
  unit,
  still,
}: {
  code: StateCode;
  kind: "pickup" | "delivery";
  label?: string | null;
  shift: -1 | 0 | 1;
  unit: number;
  still: boolean;
}) {
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
        dy={5 + shift * 9 * unit}
        textAnchor={right ? "start" : "end"}
        className="fill-paper/90 stroke-ink font-medium [paint-order:stroke] [stroke-linejoin:round]"
        style={{ fontSize: 14 * unit, strokeWidth: 5 * unit }}
      >
        {label ?? state.name}
      </text>
    </g>
  );
}

/** A new made-up trip every DEMO_MS; each one plays for TRIP_MS of that. */
const DEMO_MS = 4400;
const TRIP_MS = 4100;

/** Two states far enough apart that the arc reads as a trip, not a hop; never starting where the last one ended. */
function randomTrip(last: StateCode | null): [StateCode, StateCode] {
  for (;;) {
    const a = usStates[Math.floor(Math.random() * usStates.length)];
    const b = usStates[Math.floor(Math.random() * usStates.length)];
    if (a.code === last || a.code === b.code) continue;
    if (Math.hypot(b.cx - a.cx, b.cy - a.cy) < 260) continue;
    return [a.code, b.code];
  }
}

/**
 * Made-up trips, one after another, so the map looks like people are getting quotes (owner, 2026-10-05). Decoration
 * only: random states, no names or numbers, nothing that reads as a live feed of real requests. Each trip is the
 * form's own marks a little quieter — the two states light, a hollow white pickup and an orange delivery drop in, the
 * dashed arc draws, a dot rides it — then it fades and the next begins. While `active` is false (the button pressed,
 * or the band off screen) no new trip starts and the one on the map fades out.
 */
function DemoQuotes({ active }: { active: boolean }) {
  const [trip, setTrip] = useState<{ id: number; from: StateCode; to: StateCode } | null>(null);

  useEffect(() => {
    if (!active) {
      const clear = window.setTimeout(() => setTrip(null), 400);
      return () => window.clearTimeout(clear);
    }
    let id = 0;
    let last: StateCode | null = null;
    const next = () => {
      const [from, to] = randomTrip(last);
      last = to;
      id += 1;
      setTrip({ id, from, to });
    };
    const first = window.setTimeout(next, 800);
    const timer = window.setInterval(next, DEMO_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [active]);

  return (
    <g
      className="transition-opacity duration-400 ease-premium"
      style={{ opacity: active ? 0.85 : 0 }}
    >
      {trip && <DemoTrip key={trip.id} id={trip.id} from={trip.from} to={trip.to} />}
    </g>
  );
}

/** One made-up trip's whole life, driven by one animation frame loop so nothing re-renders while it plays. */
function DemoTrip({ id, from, to }: { id: number; from: StateCode; to: StateCode }) {
  const groupRef = useRef<SVGGElement>(null);
  const deliveryRef = useRef<SVGGElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const solidRef = useRef<SVGPathElement>(null);
  const loadRef = useRef<SVGCircleElement>(null);
  const d = arc(from, to);
  const a = byCode.get(from)!;
  const b = byCode.get(to)!;
  const maskId = `ship-demo-reveal-${id}`;

  useEffect(() => {
    const group = groupRef.current;
    const drop = deliveryRef.current;
    const reveal = revealRef.current;
    const solid = solidRef.current;
    const load = loadRef.current;
    if (!group || !drop || !reveal || !solid || !load) return;
    const length = solid.getTotalLength();
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const start = performance.now();
    let frame = 0;
    // Seconds: the pickup at 0, the delivery at 0.35, the arc draws 0.35–1.25, the ride 1.4–2.8, the fade 3.5–4.1.
    const step = (now: number) => {
      const s = (now - start) / 1000;
      group.style.opacity = String(s < 3.5 ? clamp(s / 0.3) : 1 - clamp((s - 3.5) / 0.6));
      drop.style.opacity = String(clamp((s - 0.35) / 0.2));
      reveal.style.strokeDashoffset = String(1 - ease(clamp((s - 0.35) / 0.9)));
      const r = ease(clamp((s - 1.4) / 1.4));
      const point = solid.getPointAtLength(length * r);
      load.setAttribute("cx", String(point.x));
      load.setAttribute("cy", String(point.y));
      load.style.opacity = s > 1.4 && s < 2.8 ? "1" : "0";
      solid.style.strokeDashoffset = String(1 - r);
      if (s * 1000 < TRIP_MS) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <g ref={groupRef} style={{ opacity: 0 }}>
      <g fill="url(#ship-dot-lit)" opacity={0.45}>
        <path d={a.d} />
        <path d={b.d} />
      </g>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-50" y="-200" width="1060" height="900">
        <path ref={revealRef} d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="1 1" strokeDashoffset={1} />
      </mask>
      <path d={d} fill="none" strokeWidth={1.6} strokeDasharray="5 7" mask={`url(#${maskId})`} className="stroke-paper/45" />
      <path ref={solidRef} d={d} fill="none" strokeWidth={1.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} className="stroke-paper/80" />
      <circle cx={a.cx} cy={a.cy} r={6} fill="none" strokeWidth={2} className="origin-center animate-ship-pulse stroke-paper [transform-box:fill-box]" />
      <circle cx={a.cx} cy={a.cy} r={6} strokeWidth={2.2} className="fill-ink stroke-paper" />
      <g ref={deliveryRef} style={{ opacity: 0 }}>
        <circle
          cx={b.cx}
          cy={b.cy}
          r={6}
          fill="none"
          strokeWidth={2}
          className="origin-center animate-ship-pulse stroke-brand [transform-box:fill-box]"
          style={{ animationDelay: "0.35s" }}
        />
        <circle cx={b.cx} cy={b.cy} r={6} className="fill-brand" />
      </g>
      <circle ref={loadRef} r={4.5} className="fill-brand" style={{ opacity: 0 }} />
    </g>
  );
}
