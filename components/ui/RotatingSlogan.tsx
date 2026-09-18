"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Slogan } from "@/lib/site";

type RotatingSloganProps = {
  /** Shown in order and looped. The first one is what search engines and screen readers get. */
  slogans: readonly Slogan[];
  /** Seconds each slogan stays put before rolling away. */
  hold?: number;
  className?: string;
  /**
   * The element to render. The homepage passes `h1`, because there the rolling slogan *is* the headline —
   * which is why the first slogan has to be the one that describes the company.
   */
  as?: "h1" | "h2" | "p";
};

const ROLL_SECONDS = 0.7;

/**
 * Cycles through slogans, each rolling up and out while the next rolls in underneath it — an odometer,
 * which is the one counter every driver already reads all day.
 *
 * Three things keep it from being a nuisance:
 * - Reduced-motion visitors get the first slogan and nothing else moves. Auto-changing text is motion
 *   even without a transition, so the rotation stops too, not just the roll.
 * - It pauses on hover and on keyboard focus, and while the tab is in the background.
 * - Only the first slogan is in the accessibility tree; the roll itself is aria-hidden, so a screen
 *   reader gets one stable sentence instead of text that rewrites itself every few seconds.
 *
 * Each slogan is set in two tones, the setup in ink over its turn in grey — the treatment the fixed
 * headline used before this replaced it.
 */
export function RotatingSlogan({ slogans, hold = 3.6, className, as: Tag = "p" }: RotatingSloganProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || slogans.length < 2) return;

    const advance = () => setIndex((current) => (current + 1) % slogans.length);
    const timer = window.setTimeout(advance, hold * 1000);
    return () => window.clearTimeout(timer);
    // `index` restarts the timer after each change, so the hold is measured from when a slogan arrives.
  }, [index, hold, paused, reduceMotion, slogans.length]);

  useEffect(() => {
    // A background tab freezes the animation but not the timer, so slogans would pile up and snap
    // through on return.
    const sync = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const active = slogans[index] ?? slogans[0];

  return (
    <Tag
      className={className}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(document.hidden)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(document.hidden)}
    >
      <span className="sr-only">{`${slogans[0].lead} ${slogans[0].tail}`}</span>

      {/* The grid stacks every slogan in one cell, so the tallest reserves the height and nothing below
          shifts when a shorter line rolls in. Only the active one is visible. */}
      <span aria-hidden className="relative grid overflow-hidden">
        {slogans.map((slogan) => (
          <span key={slogan.lead} className="invisible [grid-area:1/1]">
            <span className="md:block">{slogan.lead}</span>{" "}
            <span className="md:block">{slogan.tail}</span>
          </span>
        ))}

        <AnimatePresence initial={false}>
          <motion.span
            key={active.lead}
            className="[grid-area:1/1]"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: ROLL_SECONDS, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Two lines from `md` up, where they fit; below that the sentence just flows and the
                grey starts mid-line, because a forced break there costs a whole extra line. */}
            <span className="md:block">{active.lead}</span>{" "}
            <span className="md:block text-ink/60">{active.tail}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </Tag>
  );
}
