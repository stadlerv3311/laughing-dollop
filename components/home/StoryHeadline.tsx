"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
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
 */
export function StoryHeadline({
  id,
  lines,
  accent,
  className,
}: {
  id: string;
  lines: string[];
  /** A word in the last line, turned orange after the rise. */
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion() ?? false;
  const last = lines.length - 1;

  return (
    <h2 ref={ref} id={id} className={cx(chapterHeadingClass, className)}>
      {lines.map((line, i) => (
        <span key={line} className={cx("-mb-[0.12em] block overflow-hidden pb-[0.12em]", i < last && "text-paper/55")}>
          <motion.span
            className="block text-balance"
            initial={{ y: "120%" }}
            animate={inView ? { y: 0 } : undefined}
            transition={still ? { duration: 0 } : { duration: RISE, delay: 0.1 + i * STAGGER, ease: [0.22, 1, 0.36, 1] }}
          >
            {i === last && accent ? <Accented line={line} word={accent} lit={inView} still={still} /> : line}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/** The line with `word` wrapped; it turns orange (once `lit`) as the line settles, not while it's still rising. */
function Accented({ line, word, lit, still }: { line: string; word: string; lit: boolean; still: boolean }) {
  const at = line.indexOf(word);
  if (at < 0) return line;
  return (
    <>
      {line.slice(0, at)}
      <span
        className={cx(
          !still && "transition-colors delay-[1050ms] duration-700 ease-out",
          lit || still ? "text-brand" : "text-paper",
        )}
      >
        {word}
      </span>
      {line.slice(at + word.length)}
    </>
  );
}
