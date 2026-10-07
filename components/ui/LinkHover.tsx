import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * The hover for the site's underlined arrow links — Get a quote, Read our full story, Apply now (owner, 2026-10-05,
 * "E" of the link-hover mock-ups, after the text-rise and arrow moves on 21st.dev's animated links): the words roll
 * up and a copy rolls in from below, while the ↗ flies out up and right and a fresh one comes in from down and left.
 * The underline stays put. Both pieces run off the link's `group` hover and keyboard focus. Where the `group` is a
 * card around the link (the About page's SplitCard), focus on the link inside it plays them too. Plain CSS, so they work
 * in server components. Reduced motion swaps each copy for its twin instantly, which looks like nothing moved.
 */

const roll = "block transition-transform duration-500 ease-premium motion-reduce:transition-none";
const rolled =
  "group-hover:-translate-y-full group-focus-visible:-translate-y-full group-has-[a:focus-visible]:-translate-y-full";

/**
 * The link's words with its underline (`className` replaces the default 1px line and its 2px gap). The window is
 * one line tall plus room under it for descenders, pulled back with a negative margin so the line box — and the
 * underline under it — sit exactly where they did before.
 */
export function RiseLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("border-current", className ?? "border-b pb-0.5")}>
      <span className="-mb-[0.2em] block h-[calc(1lh+0.2em)] overflow-hidden">
        <span className={cx(roll, rolled, "pb-[0.2em]")}>{children}</span>
        <span aria-hidden className={cx(roll, rolled, "pb-[0.2em] delay-[30ms]")}>
          {children}
        </span>
      </span>
    </span>
  );
}

const ARROW = <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" />;
const fly = "absolute inset-0 size-full transition-transform duration-[450ms] ease-premium motion-reduce:transition-none";

/** The ↗ that flies through on hover. `className` sizes it (e.g. `size-3.5`). */
export function FlyArrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx("relative inline-block shrink-0 overflow-hidden", className)}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={cx(
          fly,
          "group-hover:translate-x-[110%] group-hover:-translate-y-[110%] group-focus-visible:translate-x-[110%] group-focus-visible:-translate-y-[110%] group-has-[a:focus-visible]:translate-x-[110%] group-has-[a:focus-visible]:-translate-y-[110%]",
        )}
      >
        {ARROW}
      </svg>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={cx(
          fly,
          "-translate-x-[110%] translate-y-[110%] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-has-[a:focus-visible]:translate-x-0 group-has-[a:focus-visible]:translate-y-0",
        )}
      >
        {ARROW}
      </svg>
    </span>
  );
}
