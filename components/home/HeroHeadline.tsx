"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { heroPairs, type HeroLine, type HeroPair } from "@/lib/site";

/** How long each pair stays put, measured from when it arrives (and, for the first, from when the words light up). */
const HOLD_MS = 3400;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Same nouns, verbs traded between the lines — the see / trust swap. */
function isSwap({ lines: [a, b] }: HeroPair, { lines: [c, d] }: HeroPair) {
  return a.noun === c.noun && b.noun === d.noun && a.verb === d.verb && b.verb === c.verb;
}

const sentence = (pair: HeroPair) => pair.lines.map((l) => `A ${l.noun} you can ${l.verb}.`).join(" ");

// A word rolls up and out while the next rolls in from below. On a swap the verbs fly between the lines instead (a
// shared `layoutId`), so neither end rolls: the outgoing copy just goes, the incoming one starts where it was.
const roll: Variants = {
  enter: (swap: boolean) => (swap ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (swap: boolean) => (swap ? { opacity: 0, transition: { duration: 0 } } : { y: "-100%", opacity: 0 }),
};

type HeroHeadlineProps = {
  /** Set by HomeHero once the intro hands over; the words light up one by one, then the rolling starts. */
  lit: boolean;
  className?: string;
};

/**
 * The homepage h1 (2026-09-29, from a Mobbin pass — Aurora's swapped word). "A … you can …" is fixed and dimmed;
 * each line's noun and verb are full white and change every few seconds, rolling like an odometer. When two pairs
 * share their nouns with the verbs traded (fleet/see, load/trust → fleet/trust, load/see), the two verbs cross
 * between the lines. The words in `heroPairs` are picked to be close in width, so "you can" barely moves.
 *
 * Every pair is stacked invisibly in one grid cell, so the h1 is always the size of its widest (and on phones, its
 * tallest) pair and nothing around it moves. Screen readers and search engines get the first pair only; it pauses on hover and in a background tab, and
 * reduced-motion visitors keep the first pair.
 */
export function HeroHeadline({ lit, className }: HeroHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const [{ index, swap }, setStep] = useState({ index: 0, swap: false });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!lit || reduceMotion || hovered || hidden) return;
    const timer = window.setTimeout(() => {
      setStep(({ index: current }) => {
        const next = (current + 1) % heroPairs.length;
        return { index: next, swap: isSwap(heroPairs[current], heroPairs[next]) };
      });
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [index, lit, reduceMotion, hovered, hidden]);

  return (
    <h1 className={className} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <span className="sr-only">{sentence(heroPairs[0])}</span>
      <span aria-hidden className="grid">
        {heroPairs.map((pair, i) => (
          <span key={i} className="invisible [grid-area:1/1]">
            {pair.lines.map((line, l) => (
              <Line key={l} line={line} />
            ))}
          </span>
        ))}
        <span className="[grid-area:1/1]">
          {heroPairs[index].lines.map((line, l) => (
            <Line key={l} line={line} live={{ lit, swap, firstWord: l * 5 }} />
          ))}
        </span>
      </span>
    </h1>
  );
}

type LineProps = {
  line: HeroLine;
  /** Left out for the invisible sizing copies. */
  live?: { lit: boolean; swap: boolean; firstWord: number };
};

function Line({ line, live }: LineProps) {
  // The words light up in reading order as the intro hands over, 70ms apart (as the fixed h1 did).
  const word = (n: number, content: React.ReactNode, dim = false) => (
    <span
      className={cx(
        "transition-opacity duration-700 ease-premium motion-reduce:transition-none",
        dim && "text-paper/60",
      )}
      style={live && { opacity: live.lit ? 1 : 0.22, transitionDelay: live.lit ? `${(live.firstWord + n) * 70}ms` : "0ms" }}
    >
      {content}
    </span>
  );

  return (
    <span className="block">
      {word(0, "A", true)} {word(1, live ? <Slot text={line.noun} swap={live.swap} /> : <Word>{line.noun}</Word>)}{" "}
      {word(2, "you can", true)}{" "}
      {word(3, live ? <Slot text={line.verb} swap={live.swap} /> : <Word>{line.verb}</Word>)}
      {word(4, ".")}
    </span>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/**
 * One changing word. An invisible copy of the current word sits in the flow and gives the slot its height (and its
 * width before hydration); the slot's width then eases to each new word's, so the fixed words beside it glide
 * rather than jump. The visible words are stacked on top of it and roll through.
 */
function Slot({ text, swap }: { text: string; swap: boolean }) {
  const sizer = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const el = sizer.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <motion.span
      className={cx(
        // Clip only top and bottom (with room for descenders), so the rolling words are cut at the line; a swap
        // needs the words to leave the slot altogether.
        "relative inline-block whitespace-nowrap pb-[0.15em] -mb-[0.15em]",
        swap ? "overflow-visible" : "overflow-y-clip",
      )}
      initial={false}
      animate={width === undefined ? undefined : { width }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span ref={sizer} className="invisible">
        {text}
      </span>
      <AnimatePresence initial={false} custom={swap}>
        <motion.span
          key={text}
          layoutId={`hero-word-${text}`}
          className="absolute top-0 left-0"
          custom={swap}
          variants={roll}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: EASE, layout: { duration: 0.8, ease: EASE } }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
