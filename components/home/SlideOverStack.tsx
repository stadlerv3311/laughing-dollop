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
/** …but never taller than this share of the screen. */
const OVER_MAX = 0.75;
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
 * The sheet rises a little faster than the page scrolls, so it reaches the top of the screen (under the header) while
 * the band is still pinned, instead of leaving a strip of the band above it (owner, 2026-09-28: no fade, the sheet
 * just takes its place). It then holds there while the band scrolls away behind it, and settles back into its own
 * place by the time the band is gone. The gap the lift opens under the sheet is filled with its own white, so the
 * next section never shows the band through it. Scrolling back up shows both sections at their usual size.
 *
 * It happens once, on the way down. As soon as the second section has covered the first, the first stops being
 * sticky, and that switch can't be seen: it's hidden behind the sheet at that moment, and sticky never changes the
 * layout, so nothing jumps. Scrolling back up is then ordinary scrolling, with no slide in reverse (owner's ask).
 *
 * From `lg` only, since on phones the safety band is taller than the screen, and pinning it would feel heavy.
 * Reduced-motion visitors get the two sections in plain order.
 */
export function SlideOverStack({ under, over }: { under: ReactNode; over: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);
  const overRef = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduceMotion = useReducedMotion();
  const [pinTop, setPinTop] = useState(0);
  const [underHeight, setUnderHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
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
      setScreenHeight(window.innerHeight);
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
    const wrap = wrapRef.current;
    const under = underRef.current;
    const over = overRef.current;
    if (!active || !wrap || !under || !over) return;
    // Where the sheet's top would be without the lift: the wrapper isn't sticky, so its box is the real layout.
    const natural = wrap.getBoundingClientRect().top + under.offsetHeight;
    // Where the band lets go (the wrapper's end carries both up from here), and where the sheet enters the screen.
    const release = pinTop + under.offsetHeight - over.offsetHeight;
    const enter = window.innerHeight;
    // Where the sheet stops: the top of the screen, or the pinned band's top if that's lower. A band taller than
    // the screen pins above it (pinTop < 0), and stopping there would carry the sheet off the top.
    const stop = Math.max(pinTop, 0);
    // Enter → release maps onto enter → stop, then it holds at stop until the natural top gets there too.
    const shown =
      natural >= enter
        ? natural
        : natural > release
          ? stop + ((natural - release) * (enter - stop)) / (enter - release)
          : Math.min(natural, stop);
    const lift = Math.max(0, natural - shown);
    over.style.transform = lift ? `translateY(${-lift}px)` : "";
    over.style.setProperty("--sheet-lift", `${lift}px`);
    setCovered(shown < stop + (pinTop + under.offsetHeight - stop) / 2);
    // Its top has reached the stop in its own place: the band's bottom is above the screen by now.
    if (natural <= stop) {
      over.style.transform = "";
      over.style.setProperty("--sheet-lift", "0px");
      setDone(true);
      setCovered(false);
    }
  });

  return (
    <CoveredContext.Provider value={covered && active}>
      {/* The wrapper bounds the sticky section, so it can never stay pinned past the sheet that covers it. */}
      <div ref={wrapRef}>
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
          // Capped at OVER_MAX of the screen (2026-09-28): the safety band grew past a screen and a half, and 70% of
          // that made Ship with us taller than the screen.
          style={
            wide && reduceMotion === false
              ? { minHeight: Math.round(Math.min(underHeight * OVER_SHARE, screenHeight * OVER_MAX)) }
              : undefined
          }
        >
          {over}
          {/* Fills the gap the lift opens between the sheet and the next section, so the band never shows through. */}
          {active && (
            <div aria-hidden className="absolute inset-x-0 top-full h-[var(--sheet-lift,0px)] bg-paper" />
          )}
        </div>
      </div>
    </CoveredContext.Provider>
  );
}
