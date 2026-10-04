"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useRef } from "react";
import { chapterHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";

/** Seconds for each line's rise, and after the first line's start, how long until the next one starts. */
const RISE = 0.9;
const STAGGER = 0.15;

/**
 * The story band's two-line heading, each line rising in from behind its own edge (2026-09-29, story band review
 * point 05): the second 0.15s after the first, so "The rule didn't." lands like the punchline it is. Plays once, the
 * first time the heading is in view; reduced-motion visitors get the lines in place straight away.
 *
 * Two tones and one orange word (owner's pick "D", 2026-09-29): the setup lines at 55% white, the last line full white,
 * and `accent` in it warming to orange once the line has landed, like the route's last stop lighting up below.
 *
 * Each line is its own clip box, padded down a little (and pulled back up by the same) so the clip doesn't cut the
 * descenders at the heading's tight line height.
 *
 * The safety band's heading uses it too (owner, 2026-09-30: make it look like Our story's), with "We know" lit to full
 * white in its grey first line — the company is the one in control — so `accent` can sit in any line, and `tone`
 * picks orange (the story's) or white. Since 2026-10-02 that band is on white (owner: the black top half made it read as
 * two sections), so `light` turns the grey lines and the full-strength word to ink. `inline` runs the lines on as one
 * (owner, same day: "Tracked trucks. Proven service." on one line): each part is still its own clip box, so they rise
 * in turn, and where the screen is too narrow they wrap between the parts, never inside one. `solid` drops the grey from
 * the setup lines, so every line is full strength (owner, same day: the safety band's grey first half looked washed out).
 */
export function StoryHeadline({
  id,
  lines,
  accent,
  tone = "brand",
  as: Tag = "h2",
  light = false,
  inline = false,
  solid = false,
  large = false,
  className,
}: {
  id: string;
  lines: string[];
  /** A word or phrase, lit after the rise — in whichever line holds it. */
  accent?: string;
  /** What the accent lights up to: the brand orange (the story's), or full white inside a grey line. */
  tone?: "brand" | "paper";
  /** h1 where it's the page's own heading (the About page's opening). */
  as?: "h1" | "h2";
  /** On white: grey lines in ink at 60% (large type) and a "paper" accent lit to full ink. */
  light?: boolean;
  /** The lines side by side on one line, wrapping between them only when they don't fit. */
  inline?: boolean;
  /** Every line full strength: no grey setup lines. */
  solid?: boolean;
  /** 64px from laptops up instead of 56px (the safety band and Our story, owner 2026-10-02: the safety one looked alone at 56). */
  large?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const still = useReducedMotion() ?? false;
  const last = lines.length - 1;

  return (
    <Tag
      ref={ref}
      id={id}
      className={cx(large ? chapterHeadingClass.replace("lg:text-[3.5rem]", "lg:text-[4rem]") : chapterHeadingClass, className)}
    >
      {lines.map((line, i) => (
        <Fragment key={line}>
          {/* A real space between inline parts: where they wrap, and for screen readers. */}
          {inline && i > 0 && " "}
          <span
            className={cx(
              "-mb-[0.12em] overflow-hidden pb-[0.12em]",
              inline ? "inline-block align-top" : "block",
              i < last && !solid && (light ? "text-ink/60" : "text-paper/55"),
            )}
          >
            <motion.span
              className="block text-balance"
              initial={{ y: "120%" }}
              animate={inView ? { y: 0 } : undefined}
              transition={still ? { duration: 0 } : { duration: RISE, delay: 0.1 + i * STAGGER, ease: [0.22, 1, 0.36, 1] }}
            >
              {accent && line.includes(accent) ? (
                <Accented line={line} word={accent} tone={tone} lit={inView} still={still} light={light} />
              ) : (
                line
              )}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/** The line with `word` wrapped; it lights up (once `lit`) as the line settles, not while it's still rising. */
function Accented({
  line,
  word,
  tone,
  lit,
  still,
  light,
}: {
  line: string;
  word: string;
  tone: "brand" | "paper";
  lit: boolean;
  still: boolean;
  light: boolean;
}) {
  const at = line.indexOf(word);
  if (at < 0) return line;
  const full = light ? "text-ink" : "text-paper";
  return (
    <>
      {line.slice(0, at)}
      <span
        className={cx(
          !still && "transition-colors delay-[1050ms] duration-700 ease-out",
          lit || still ? (tone === "brand" ? "text-brand" : full) : tone === "brand" ? full : undefined,
        )}
      >
        {word}
      </span>
      {line.slice(at + word.length)}
    </>
  );
}
