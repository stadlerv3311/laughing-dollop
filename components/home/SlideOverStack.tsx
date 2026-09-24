"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/** True while the `over` section has slid across most of the `under` one, so the one underneath can pause. */
const CoveredContext = createContext(false);
export const useCovered = () => useContext(CoveredContext);

const WIDE = "(width >= 64rem)";
/** How tall the sliding section is, as a share of the one it slides over. */
const OVER_SHARE = 0.7;
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () =>
  useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);

/**
 * Two sections where the second slides up over the first (owner, 2026-09-24): the safety band holds still at the
 * top of the screen while Ship with us rises over it like a sheet, then the page scrolls on. The movement is plain
 * scrolling, with `position: sticky` on the first section, so it follows the reader's own pace.
 *
 * It happens once, on the way down. As soon as the second section has covered the first, the first stops being
 * sticky, and that switch can't be seen: it's hidden behind the sheet at that moment, and sticky never changes the
 * layout, so nothing jumps. Scrolling back up is then ordinary scrolling, with no slide in reverse (owner's ask).
 *
 * From `lg` only, since on phones the safety band is taller than the screen, and pinning it would feel heavy.
 * Reduced-motion visitors get the two sections in plain order.
 */
export function SlideOverStack({ under, over }: { under: ReactNode; over: ReactNode }) {
  const underRef = useRef<HTMLDivElement>(null);
  const overRef = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduceMotion = useReducedMotion();
  const [pinTop, setPinTop] = useState(0);
  const [underHeight, setUnderHeight] = useState(0);
  const [covered, setCovered] = useState(false);
  const [done, setDone] = useState(false);
  const active = wide && reduceMotion === false && !done;

  // Pinned at the top of the screen, or, if it's taller than the screen, at the point its bottom edge shows.
  useEffect(() => {
    const el = underRef.current;
    if (!el) return;
    const measure = () => {
      setPinTop(Math.min(0, window.innerHeight - el.offsetHeight));
      setUnderHeight(el.offsetHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const under = underRef.current;
    const over = overRef.current;
    if (!active || !under || !over) return;
    const overTop = over.getBoundingClientRect().top;
    setCovered(overTop < pinTop + under.offsetHeight / 2);
    // Its top has reached the pinned section's top: whatever's left of that section is above the screen by now.
    if (overTop <= pinTop) {
      setDone(true);
      setCovered(false);
    }
  });

  return (
    <CoveredContext.Provider value={covered && active}>
      {/* The wrapper bounds the sticky section, so it can never stay pinned past the sheet that covers it. */}
      <div>
        <div ref={underRef} style={active ? { position: "sticky", top: pinTop } : undefined}>
          {under}
        </div>
        {/*
          OVER_SHARE of the covered section's height, with its content centred (owner, 2026-09-24: the full height
          was too big). It rises over the pinned section; once it's too short to hide the rest, the wrapper's end
          carries both up together, so the top of the section underneath scrolls away above it. Kept on wide screens
          after the slide too, so switching the slide off never changes the layout.
        */}
        <div
          ref={overRef}
          className={cx(
            "relative z-10 flex flex-col justify-center bg-paper transition-shadow duration-500",
            active && "shadow-[0_-28px_56px_-20px_rgb(0_0_0/0.16)]",
          )}
          style={wide && reduceMotion === false ? { minHeight: Math.round(underHeight * OVER_SHARE) } : undefined}
        >
          {over}
        </div>
      </div>
    </CoveredContext.Provider>
  );
}
