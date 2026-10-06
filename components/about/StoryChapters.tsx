"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Container } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { TimelineEntry } from "@/lib/story";

const WIDE = "(width >= 64rem)";
/** How many stops the first chapter holds; the rest go to the second, on the other side. */
const SPLIT = 3;
/** The line and what it has passed, and the line still ahead. */
const LINE = "absolute left-[-0.75px] w-[1.5px]";

/**
 * Runs `update` on every scroll and resize, once a frame at most, and once at the start. The page's smooth scroll
 * (Lenis) moves the real scroll position, so the plain event is enough.
 */
function useOnScroll(update: () => void) {
  useEffect(() => {
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
    };
    // `update` reads refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * The About page's story as a route you scroll (owner, 2026-10-06, drawn on a screenshot: text on one side, a picture
 * on the other, a line with dots between them, then the same mirrored; "you scroll text and picture changes in"). It
 * replaced the short story row and the sideways timeline (Timeline.tsx).
 *
 * Two chapters. In each, from `lg`, the picture pins to the screen while the stops' words scroll past it; the stop
 * nearest the middle of the screen is the lit one, and its picture wipes in from below over the last. A line as tall
 * as the picture stands between words and picture, with a dot for each stop: it fills as you go and each dot turns ink
 * as the line reaches it. After the first chapter's last stop the line runs on down, crosses to the other side
 * (Bridge) and comes down beside the second chapter's picture, where words and picture have swapped sides. The last
 * dot of all is orange.
 *
 * Below `lg` the picture is a band pinned at the top of the screen and the words scroll under it; the line lies along
 * the band's foot and there is no crossing.
 *
 * It all follows the reader's own scrolling, so reduced motion keeps it and only loses the wipe and the fades.
 */
export function StoryChapters({ entries }: { entries: TimelineEntry[] }) {
  const firstLine = useRef<HTMLDivElement>(null);
  const secondLine = useRef<HTMLDivElement>(null);
  const first = entries.slice(0, SPLIT);
  const second = entries.slice(SPLIT);

  return (
    <section aria-labelledby="about-timeline" className="lg:pt-[4.375rem]">
      <Container>
        <h2 id="about-timeline" className="sr-only">
          How we got here
        </h2>
        <Chapter entries={first} lineRef={firstLine} runsOn={second.length > 0} />
        {second.length > 0 && (
          <>
            <Bridge from={firstLine} to={secondLine} />
            <Chapter entries={second} lineRef={secondLine} flip runsIn end />
          </>
        )}
      </Container>
    </section>
  );
}

type ChapterState = { active: number; passed: number; live: boolean; started: boolean; done: boolean };

function Chapter({
  entries,
  lineRef,
  flip = false,
  runsIn = false,
  runsOn = false,
  end = false,
}: {
  entries: TimelineEntry[];
  lineRef: RefObject<HTMLDivElement | null>;
  /** Picture on the left, words on the right. */
  flip?: boolean;
  /** The line arrives from the chapter above. */
  runsIn?: boolean;
  /** The line carries on to the chapter below. */
  runsOn?: boolean;
  /** The route ends here: its last dot is the orange one. */
  end?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<ChapterState>({ active: 0, passed: 0, live: false, started: false, done: false });
  const count = entries.length;

  useOnScroll(() => {
    const list = listRef.current;
    const root = rootRef.current;
    if (!list || !root) return;
    const wide = window.matchMedia(WIDE).matches;
    // The reading line: the middle of the screen, or lower on phones, where the words sit under the picture band.
    const at = wide ? window.innerHeight / 2 : window.innerHeight * 0.68;
    const centres = Array.from(list.children, (step) => {
      const box = step.getBoundingClientRect();
      return box.top + box.height / 2;
    });
    const top = centres[0];
    const bottom = centres[centres.length - 1];
    const progress = bottom > top ? Math.min(1, Math.max(0, (at - top) / (bottom - top))) : at >= top ? 1 : 0;
    let active = 0;
    centres.forEach((centre, i) => {
      if (Math.abs(centre - at) < Math.abs(centres[active] - at)) active = i;
    });
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

    const next: ChapterState = {
      active,
      passed: at >= top - 1 ? Math.floor(progress * (count - 1) + 0.001) + 1 : 0,
      live: at >= top - 40 && at <= bottom + 40,
      started: root.getBoundingClientRect().top < window.innerHeight / 2,
      done: progress >= 1,
    };
    setState((current) =>
      (Object.keys(next) as (keyof ChapterState)[]).every((key) => current[key] === next[key]) ? current : next,
    );
  });

  return (
    <div ref={rootRef} className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6">
      <ol ref={listRef} className={cx("lg:row-start-1", flip ? "lg:col-start-9 lg:col-end-13" : "lg:col-start-1 lg:col-end-5")}>
        {entries.map((entry, i) => (
          <li
            key={entry.year}
            className={cx(
              "flex min-h-[52svh] flex-col justify-center transition-opacity duration-500 ease-premium motion-reduce:transition-none lg:min-h-[76svh]",
              // So the first and last stops can reach the middle of the screen while the picture is pinned.
              i === 0 && "lg:mt-[12svh]",
              i === count - 1 && "lg:mb-[12svh]",
              i === state.active ? "opacity-100" : "opacity-25",
            )}
          >
            <p className="text-sm font-semibold tabular-nums text-ink/70">{entry.year}</p>
            <h3 className="mt-3 text-balance font-display font-semibold text-[1.75rem] leading-[1.1] tracking-[-0.03em] sm:text-4xl">
              {entry.title}
            </h3>
            <p className="mt-4 max-w-[22rem] text-pretty text-[17px] leading-relaxed text-ink/70">{entry.text}</p>
          </li>
        ))}
      </ol>

      {/* The picture: a band across the top of the screen on phones, pinned beside the words from `lg`. */}
      <div
        className={cx(
          "sticky top-0 z-10 order-first -mx-5 flex h-[42svh] items-center overflow-hidden sm:-mx-8 lg:z-auto lg:order-none lg:mx-0 lg:row-start-1 lg:h-svh",
          flip ? "lg:col-start-1 lg:col-end-9 lg:pr-18" : "lg:col-start-5 lg:col-end-13 lg:pl-18",
        )}
      >
        <div className="relative size-full lg:aspect-[4/3] lg:h-auto lg:max-h-[72svh]">
          {/* Dark for the header while the band or the picture is under it. Each stop's picture lies over the last
              and is uncovered from the bottom up when its stop is reached. */}
          <div data-header-theme="dark" className="absolute inset-0 overflow-hidden bg-cloud">
            {entries.map(
              (entry, i) =>
                entry.image && (
                  <Image
                    key={entry.year}
                    src={entry.image.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(width >= 75rem) 44rem, (width >= 64rem) 60vw, 100vw"
                    className={cx(
                      "object-cover transition-[clip-path,scale] duration-[900ms] ease-premium motion-reduce:transition-none",
                      i <= state.active ? "scale-100 [clip-path:inset(0)]" : "scale-[1.06] [clip-path:inset(100%_0_0_0)]",
                    )}
                    style={entry.image.position ? { objectPosition: entry.image.position } : undefined}
                  />
                ),
            )}
            {/* Phones: the line along the band's foot. */}
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-paper/35 lg:hidden">
              <span ref={barRef} className="block h-full origin-left scale-x-0 bg-paper" />
            </span>
          </div>

          {/* The line beside the picture, in the gap between it and the words. */}
          <div
            ref={lineRef}
            aria-hidden
            className={cx("absolute inset-y-0 hidden w-0 lg:block", flip ? "-right-9" : "-left-9")}
          >
            {runsIn && (
              <span
                className={cx(LINE, "bottom-full h-[60svh] transition-colors duration-300", state.started ? "bg-ink" : "bg-ink/15")}
              />
            )}
            <span className={cx(LINE, "inset-y-0 bg-ink/15")} />
            <span ref={fillRef} className={cx(LINE, "inset-y-0 origin-top scale-y-0 bg-ink")} />
            {runsOn && (
              <span
                className={cx(LINE, "top-full h-[60svh] transition-colors duration-300", state.done ? "bg-ink" : "bg-ink/15")}
              />
            )}
            {entries.map((entry, i) => {
              const passed = i < state.passed;
              return (
                <span
                  key={entry.year}
                  style={{ top: `${count > 1 ? (i / (count - 1)) * 100 : 0}%` }}
                  className={cx(
                    "absolute left-0 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,box-shadow,scale] duration-300 motion-reduce:transition-none",
                    passed
                      ? end && i === count - 1
                        ? "bg-brand"
                        : "bg-ink"
                      : "bg-paper shadow-[inset_0_0_0_1.5px_rgb(37_37_37/0.35)]",
                    state.live && i === state.active && "scale-[1.45]",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Where the line crosses from one side to the other between the chapters (from `lg`): down from the first chapter's
 * line, across, and down into the second's. It's drawn from where the two lines really are, and fills as it passes the
 * middle of the screen.
 */
function Bridge({ from, to }: { from: RefObject<HTMLDivElement | null>; to: RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const measure = () => {
      const start = from.current?.getBoundingClientRect();
      const finish = to.current?.getBoundingClientRect();
      const frame = box.getBoundingClientRect();
      if (!start || !finish || !frame.height) return;
      const a = start.left - frame.left;
      const b = finish.left - frame.left;
      const middle = frame.height / 2;
      const turn = 28 * Math.sign(b - a);
      setPath(
        `M${a} 0V${middle - 28}Q${a} ${middle} ${a + turn} ${middle}H${b - turn}Q${b} ${middle} ${b} ${middle + 28}V${frame.height}`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [from, to]);

  useOnScroll(() => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || !box.height || !fillRef.current) return;
    const crossed = Math.min(1, Math.max(0, (window.innerHeight / 2 - box.top) / box.height));
    fillRef.current.style.strokeDashoffset = String(1 - crossed);
  });

  return (
    <div ref={ref} aria-hidden className="relative hidden h-[9.375rem] lg:block">
      <svg fill="none" strokeWidth="1.5" className="absolute inset-0 size-full overflow-visible">
        <path d={path} stroke="currentColor" className="text-ink/15" />
        <path ref={fillRef} d={path} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="currentColor" className="text-ink" />
      </svg>
    </div>
  );
}
