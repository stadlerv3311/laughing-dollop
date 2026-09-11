"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { useState, type PointerEvent, type SyntheticEvent } from "react";
import { cx } from "@/lib/cx";
import { US_MAP_HEIGHT, US_MAP_WIDTH, usStates, type StateCode, type UsState } from "@/lib/us-states";

const byCode = new Map(usStates.map((state) => [state.code, state]));
const EASE = [0.22, 1, 0.36, 1] as const;
/** Opaque version of the resting fill, a step darker, so the lifted state hides the borders underneath it. */
const HOVER_FILL = "fill-[color-mix(in_oklab,var(--color-ink)_24%,var(--color-mist))]";

type StateMapProps = {
  pickup: StateCode | null;
  delivery: StateCode | null;
  onPick: (code: StateCode) => void;
};

/**
 * Lower-48 map for the quote form. Hovering a state lifts it and shows its name; clicking sets pickup first,
 * then delivery, and a route line draws between them. Clicking a picked state clears it.
 * Mouse and touch only — hidden from screen readers because the dropdowns next to it do the same job.
 */
export function StateMap({ pickup, delivery, onPick }: StateMapProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<StateCode | null>(null);

  const hoveredState = hovered ? byCode.get(hovered) : undefined;
  const from = pickup ? byCode.get(pickup) : undefined;
  const to = delivery ? byCode.get(delivery) : undefined;

  const timing = (duration: number, delay = 0): Transition =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE };

  function roleFill(code: StateCode) {
    if (code === pickup) return "fill-ink";
    if (code === delivery) return "fill-brand";
    return null;
  }

  function hint(code: StateCode) {
    if (code === pickup) return "Pickup · click to clear";
    if (code === delivery) return "Delivery · click to clear";
    if (!pickup) return "Click to set pickup";
    if (!delivery) return "Click to set delivery";
    return "Click to change delivery";
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${US_MAP_WIDTH} ${US_MAP_HEIGHT}`}
        className="block h-auto w-full touch-manipulation select-none"
        aria-hidden
        // Touch has no hover — a tap would leave the last state stuck in its lifted look.
        onPointerOver={(event: PointerEvent<SVGSVGElement>) => {
          if (event.pointerType !== "touch") setHovered(stateFromEvent(event));
        }}
        onPointerLeave={() => setHovered(null)}
        onClick={(event) => {
          const code = stateFromEvent(event);
          if (code) onPick(code);
        }}
      >
        <g>
          {usStates.map((state) => (
            <path
              key={state.code}
              data-state={state.code}
              d={state.d}
              className={cx(
                "cursor-pointer stroke-paper transition-colors duration-300",
                roleFill(state.code) ?? "fill-ink/10",
              )}
              strokeWidth={1.25}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <AnimatePresence>
          {hoveredState && (
            <motion.path
              key={hoveredState.code}
              d={hoveredState.d}
              className={cx(
                "pointer-events-none stroke-paper drop-shadow-lg",
                roleFill(hoveredState.code) ?? HOVER_FILL,
              )}
              strokeWidth={1.25}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 1, y: 0, opacity: 0 }}
              animate={{ scale: 1.045, y: -4, opacity: 1 }}
              exit={{ scale: 1, y: 0, opacity: 0 }}
              transition={timing(0.35)}
            />
          )}
        </AnimatePresence>

        {from && to && from.code !== to.code && (
          <Route key={`${from.code}-${to.code}`} from={from} to={to} transition={timing(0.9)} />
        )}

        <AnimatePresence>
          {from && <Pin key={`pickup-${from.code}`} state={from} ringClass="stroke-ink" transition={timing(0.4)} />}
          {to && <Pin key={`delivery-${to.code}`} state={to} ringClass="stroke-brand" transition={timing(0.4, 0.15)} />}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {hoveredState && (
          <div
            key={hoveredState.code}
            className="pointer-events-none absolute z-10"
            style={{
              left: `${(hoveredState.cx / US_MAP_WIDTH) * 100}%`,
              top: `${(hoveredState.cy / US_MAP_HEIGHT) * 100}%`,
            }}
          >
            <motion.div
              className="absolute bottom-3 left-0 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-2 text-paper shadow-lg"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={timing(0.25)}
            >
              <span className="block text-sm font-semibold">{hoveredState.name}</span>
              <span className="block text-xs text-paper/75">{hint(hoveredState.code)}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function stateFromEvent(event: SyntheticEvent) {
  const target = event.target;
  return target instanceof SVGPathElement ? ((target.dataset.state as StateCode | undefined) ?? null) : null;
}

/** Curved line from pickup to delivery that draws itself in, with a white casing so it reads over the filled states. */
function Route({ from, to, transition }: { from: UsState; to: UsState; transition: Transition }) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const distance = Math.hypot(dx, dy);
  // Bend the curve sideways by a fifth of its length, always toward the top of the map.
  let nx = -dy / distance;
  let ny = dx / distance;
  if (ny > 0) [nx, ny] = [-nx, -ny];
  const bend = distance * 0.2;
  const controlX = (from.cx + to.cx) / 2 + nx * bend;
  const controlY = (from.cy + to.cy) / 2 + ny * bend;
  const d = `M${from.cx} ${from.cy} Q${controlX} ${controlY} ${to.cx} ${to.cy}`;

  return (
    <g className="pointer-events-none" fill="none" strokeLinecap="round">
      <motion.path
        d={d}
        className="stroke-paper"
        strokeWidth={8}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      />
      <motion.path
        d={d}
        className="stroke-ink"
        strokeWidth={3.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      />
    </g>
  );
}

function Pin({ state, ringClass, transition }: { state: UsState; ringClass: string; transition: Transition }) {
  return (
    <motion.circle
      cx={state.cx}
      cy={state.cy}
      r={8}
      className={cx("pointer-events-none fill-paper", ringClass)}
      strokeWidth={4}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={transition}
    />
  );
}
