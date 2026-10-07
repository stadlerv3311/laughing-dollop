"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { TimelineEntry } from "@/lib/story";

/** How far down the screen a chapter's first dot is when the line reaches it. */
const READING_LINE = 0.62;
/** The least room left over a chapter when its picture changes, for the header, in px. */
const TOP_FLOOR = 88;
/** The least a chapter scrolls before its picture changes, as a share of the screen's height. */
const MIN_TRAVEL = 0.32;
/** How far above the foot of a chapter the line starts to bend across to the next one, in px. */
const BEND_LEAD = 10;
/** How long the bend holds its heading at each end, as a share of its drop: enough to clear both pictures' corners. */
const BEND_PULL = 0.6;

type Stop = TimelineEntry & { index: number };
/** A milestone with a picture and the stops after it that have none. */
type Chapter = { stops: Stop[]; image?: TimelineEntry["image"] };

/** Splits the stops into chapters: every stop with a picture opens one, unless its picture is one that goes in place. */
function toChapters(entries: TimelineEntry[]) {
  const chapters: Chapter[] = [];
  entries.forEach((entry, index) => {
    if ((entry.image && !entry.image.inPlace) || chapters.length === 0) {
      chapters.push({ stops: [], image: entry.image?.inPlace ? undefined : entry.image });
    }
    chapters[chapters.length - 1].stops.push({ ...entry, index });
  });
  return chapters;
}

/** Every second chapter is on a black band, so the story goes white, black, white like the rest of the site. */
const onBlack = (chapter: number) => chapter % 2 === 1;

/**
 * The About page's story down one line (owner, 2026-10-06, drawn on a screenshot: a line with dots, a picture on one
 * side and words on the other, swapping sides as it goes). It replaced the pinned route (StoryChapters.tsx), which ran
 * to seven screens.
 *
 * A stop whose picture opens a chapter is a milestone (lib/story.ts): its picture is on one side of the line and the
 * words on the other, and the next chapter is the other way round. Every stop has a dot on the line; the one the
 * reader is at is orange and larger, the ones behind it black, the ones ahead hollow.
 *
 * From `lg` the picture takes the wide side and the words a narrow column (owner, same day, a second drawing: "let's
 * increase pictures size. and curve the line a bit"), so the line isn't down the middle: it runs beside the words, and
 * at the foot of each chapter it bends across, between the two pictures, to the other side. It's one path, from the
 * first dot to the last (owner, same day, of the line showing above the first dot: "line goes up too. is a bug").
 *
 * From `lg` a chapter has one frame and shows one stop at a time (owner, same day, a third drawing: "text on the side
 * of the picture is only the text that corresponds to the year you scrolled"). Its dots are on the line beside the
 * picture; the line fills from one to the next as the chapter comes up the screen, and when it reaches a dot that
 * stop's words take the place of the last one's, half way up the picture (owner: "center the text"), and its picture,
 * if it has one, fades in over the one before in the same frame.
 *
 * The dots share the picture's height evenly from its top, so a chapter of two has its second half way down, beside
 * the words, and not at the foot (owner, 2026-10-06, the foot dot crossed out on a screenshot and a ring drawn half
 * way up: "can we move the dot higher"). When a stop is reached doesn't depend on where its dot is, so that stays as
 * it was (owner: "we need the same time as now"); the line has half as far to go to the second dot and that much
 * further from there to the next chapter, which evens out its pace.
 *
 * Nothing stands still (owner, same day: "lets remove that animation that it makes it so long to scroll. it has an
 * feeling that it extend the screen", then, shown every stop as a row of its own: "it was better when i had only one
 * picture and it changed it. so bring that back. i was talking about the animation that had a feeling of dragging
 * screen. it made the screen look longer for no reason"). Until then a chapter stood still for half a screen of
 * scrolling per stop while its line filled. Now the page scrolls at its own speed and the change comes as the chapter
 * passes the middle of the screen: where it would have come to a stand. The first chapter is nearly there when the
 * page opens, so it's given a third of a screen of scrolling first (`MIN_TRAVEL`).
 *
 * From `lg` a picture is 3:2 and never so tall that the first one touches the foot of the screen the page opens on:
 * it leaves 64px of white there (owner, same day: "reduce picture size by a tiny bit. cause now the picture lays on
 * the bottom of the page. and i want maybe 50-70 pixels white room there"). Below `lg` it stays 4:3.
 *
 * Every second chapter is on a black band the width of the screen (owner, 2026-10-06, a red line drawn across the
 * bend over the second chapter: "lets make the second section on a black band so the page follows the overall site
 * trend"), so the story goes white, black, white as the homepage does. The band starts and ends in the bend; the line
 * and the dots turn white inside it, and the header goes light over it as over any black band. From `lg` there's
 * 100px on each side of a band's edge, black to the picture inside it and white to the picture outside (owner, same
 * day: "lets equalize. lets make 100 pixels from each side").
 *
 * Below `lg` the line runs straight down the left edge, every stop listed with its picture over its words and
 * lighting up as it crosses a point a little under the middle of the screen.
 *
 * The pictures are simply there (owner, same day: "remove the animations of appearing pictures. just let them be there
 * on the screen"). The rest follows the reader's own scrolling, so reduced motion keeps the line and the stops and
 * loses only the fades.
 */
export function StoryLine({ entries }: { entries: TimelineEntry[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);
  const drawnRef = useRef<SVGRectElement>(null);
  /** Each chapter's band, the full width of the screen: white, or black for every second one. */
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Each band's box in the line's drawing, which the line takes its colours from. */
  const shadeRefs = useRef<(SVGRectElement | null)[]>([]);
  /** Each chapter's row: its picture and its words. */
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  /** How many stops the line has reached. */
  const [reached, setReached] = useState(0);
  const chapters = toChapters(entries);
  const drawnId = useId();
  const lightId = useId();
  const darkId = useId();

  useEffect(() => {
    let frame = 0;
    const wide = window.matchMedia("(min-width: 64rem)");
    const parts = toChapters(entries);
    let path = "";
    let lead = "";
    const px = (value: number) => value.toFixed(1);
    const update = () => {
      const root = rootRef.current;
      const line = lineRef.current;
      if (!root || !line) return;
      const rootBox = root.getBoundingClientRect();
      const rows: DOMRect[] = [];
      for (let c = 0; c < parts.length; c++) {
        const row = rowRefs.current[c];
        if (!row) return;
        rows.push(row.getBoundingClientRect());
      }
      /** Dot centres on the screen. */
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < entries.length; i++) {
        const dot = dotRefs.current[i];
        if (!dot) return;
        const box = dot.getBoundingClientRect();
        points.push({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }
      if (points.length === 0) return;

      // How far down the page the story starts, which is what a picture's height has to leave room for on the screen
      // the page opens on.
      const above = `${Math.round(rootBox.top + window.scrollY)}px`;
      if (above !== lead) {
        lead = above;
        root.style.setProperty("--lead", lead);
      }

      // The line, in the page's own terms, so it doesn't change as the page scrolls: from the first dot down its
      // chapter, across in one slow bend to the next chapter's first dot, and on to the last dot.
      let next = `M${px(points[0].x - rootBox.left)} ${px(points[0].y - rootBox.top)}`;
      for (let c = 0; c < parts.length - 1; c++) {
        const x = points[parts[c].stops[0].index].x - rootBox.left;
        const to = points[parts[c + 1].stops[0].index];
        const toX = to.x - rootBox.left;
        if (Math.abs(toX - x) < 1) continue;
        const toY = to.y - rootBox.top;
        const from = Math.min(toY, rows[c].bottom - BEND_LEAD - rootBox.top);
        const reach = (toY - from) * BEND_PULL;
        next += `V${px(from)}C${px(x)} ${px(from + reach)} ${px(toX)} ${px(toY - reach)} ${px(toX)} ${px(toY)}`;
      }
      next += `V${px(points[points.length - 1].y - rootBox.top)}`;
      if (next !== path) {
        path = next;
        line.querySelectorAll("path").forEach((copy) => copy.setAttribute("d", path));
      }
      // Which stretch of the line is over white and which over black.
      for (let c = 0; c < parts.length; c++) {
        const band = bandRefs.current[c]?.getBoundingClientRect();
        const shade = shadeRefs.current[c];
        if (!band || !shade) continue;
        shade.setAttribute("y", px(band.top - rootBox.top));
        shade.setAttribute("width", px(rootBox.width + 40));
        shade.setAttribute("height", px(band.height));
      }
      line.style.opacity = "1";

      // How far each stop still has to come up the screen before the line reaches it, in px: none left, it's reached.
      const at = window.innerHeight * READING_LINE;
      let left: number[];
      if (wide.matches) {
        left = [];
        parts.forEach((part, c) => {
          const row = rows[c];
          /** Where the chapter is on the screen when the page opens, or its foot if it's further down than that. */
          const start = Math.min(window.innerHeight, row.top + window.scrollY);
          // Its first stop is reached with its dot on the reading line, its last with the chapter in the middle of
          // the screen and clear of the header, and the ones between at even steps from one to the other.
          const enter = Math.min(start, at - (points[part.stops[0].index].y - row.top));
          const middle = Math.max(TOP_FLOOR, (window.innerHeight - row.height) / 2);
          const leave = Math.min(enter, middle, Math.max(TOP_FLOOR, start - window.innerHeight * MIN_TRAVEL));
          part.stops.forEach((stop, k) => {
            const share = part.stops.length > 1 ? k / (part.stops.length - 1) : 0;
            left[stop.index] = row.top - (enter + (leave - enter) * share);
          });
        });
      } else {
        // Every stop is listed: each is reached as its own dot crosses the reading line.
        left = points.map((point) => point.y - at);
      }
      // Counted in stops: 2.5 is half way from the third dot to the fourth. The first stop is reached from the start
      // (owner, 2026-10-06: "first dot in orange"), so the page never opens on a story with nothing lit.
      const passed = left.filter((gap) => gap <= 1).length;
      let along = 0;
      if (passed === left.length) along = passed - 1;
      else if (passed > 0) along = passed - 1 + Math.max(0, -left[passed - 1]) / Math.max(1, left[passed] - left[passed - 1]);
      const lit = Math.min(entries.length, Math.floor(along + 0.001) + 1);
      setReached((current) => (current === lit ? current : lit));

      // The dark copy of the path shows through a box that reaches down to where the reader is.
      const whole = Math.min(entries.length - 1, Math.max(0, Math.floor(along)));
      const onward = points[Math.min(entries.length - 1, whole + 1)];
      const drawn = points[whole].y + (onward.y - points[whole].y) * (along - whole) - rootBox.top;
      drawnRef.current?.setAttribute("width", px(rootBox.width + 40));
      drawnRef.current?.setAttribute("height", px(Math.max(0, drawn + 20)));
    };
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    // The pictures and fonts arriving can move the dots without a scroll or a resize.
    const observer = new ResizeObserver(run);
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      observer.disconnect();
    };
  }, [entries]);

  return (
    <section aria-labelledby="about-timeline">
      <h2 id="about-timeline" className="sr-only">
        How we got here
      </h2>
      <div ref={rootRef} className="relative">
        {/* The line: one path, set by the scroll handler, grey for the whole of it and dark for the part the reader
            has reached. The grey is solid, the ink at 15% on white. Over a black band it's drawn again the other way
            round: white for the part reached, the white at 25% on black for the rest. */}
        <svg ref={lineRef} aria-hidden fill="none" strokeWidth={1.5} className="pointer-events-none absolute inset-0 size-full overflow-visible opacity-0">
          <clipPath id={drawnId} clipPathUnits="userSpaceOnUse">
            <rect ref={drawnRef} x={-20} y={-20} width={0} height={0} />
          </clipPath>
          {[false, true].map((dark) => (
            <clipPath key={String(dark)} id={dark ? darkId : lightId} clipPathUnits="userSpaceOnUse">
              {chapters.map(
                (chapter, c) =>
                  onBlack(c) === dark && (
                    <rect
                      key={chapter.stops[0].year}
                      ref={(node) => {
                        shadeRefs.current[c] = node;
                      }}
                      x={-20}
                      y={0}
                      width={0}
                      height={0}
                    />
                  ),
              )}
            </clipPath>
          ))}
          <g clipPath={`url(#${lightId})`}>
            <path className="stroke-[#dedede]" />
            <path clipPath={`url(#${drawnId})`} className="stroke-ink" />
          </g>
          <g clipPath={`url(#${darkId})`}>
            <path className="stroke-[#5c5c5c]" />
            <path clipPath={`url(#${drawnId})`} className="stroke-paper" />
          </g>
        </svg>

        {chapters.map((chapter, c) => {
          const dark = onBlack(c);
          /** Picture on the left and words on the right, then the other way round. */
          const wordsLeft = c % 2 === 1;
          const first = chapter.stops[0].index;
          const last = first + chapter.stops.length - 1;
          /** The stop whose words this chapter shows from `lg`: the one the reader is at, or its nearest. */
          const showing = Math.min(last, Math.max(first, reached - 1));
          return (
            <div
              key={chapter.stops[0].year}
              ref={(node) => {
                bandRefs.current[c] = node;
              }}
              data-header-theme={dark ? "dark" : undefined}
              className={cx(
                // The site's step between a chapter and the edge of a band; from `lg` 100px on each side of the edge
                // (owner's figure), which is also the room the line needs to cross.
                dark
                  ? "bg-ink py-16 text-paper sm:py-[4.375rem] lg:py-[6.25rem]"
                  : cx(
                      c > 0 && "pt-16 sm:pt-[4.375rem] lg:pt-[6.25rem]",
                      // The last chapter has the same space under it: the page's closing black band comes next
                      // (app/about/page.tsx, 2026-10-07), with the same on white and on black at its edge as the
                      // story's own band has (owner, same day).
                      "pb-16 sm:pb-[4.375rem] lg:pb-[6.25rem]",
                    ),
              )}
            >
              <Container>
                <div
                  ref={(node) => {
                    rowRefs.current[c] = node;
                  }}
                  className={cx(
                    "flex flex-col gap-8 pl-8 lg:grid lg:gap-x-28 lg:pl-0",
                    // The words keep a column of their own width; the picture has the rest.
                    wordsLeft ? "lg:grid-cols-[22rem_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_22rem]",
                  )}
                >
                  {chapter.image ? (
                    <div
                      className={cx(
                        "relative aspect-[4/3] overflow-hidden bg-cloud lg:aspect-[3/2] lg:max-h-[max(22rem,calc(100svh-var(--lead,23.25rem)-4rem))] lg:w-full lg:self-start",
                        wordsLeft && "lg:order-last",
                      )}
                    >
                      {/* The chapter's own picture and, from `lg`, over it the picture of any later stop that has
                          one, shown once the line has reached that stop. */}
                      {chapter.stops.map(
                        (stop, i) =>
                          stop.image && (
                            <Image
                              key={stop.year}
                              src={stop.image.src}
                              alt=""
                              aria-hidden
                              fill
                              sizes="(width >= 75rem) 46rem, (width >= 64rem) 55vw, 100vw"
                              className={cx(
                                "object-cover",
                                i > 0 && "hidden transition-opacity duration-500 ease-premium motion-reduce:transition-none lg:block",
                                i > 0 && (stop.index <= showing ? "opacity-100" : "opacity-0"),
                              )}
                              style={stop.image.position ? { objectPosition: stop.image.position } : undefined}
                            />
                          ),
                      )}
                    </div>
                  ) : (
                    <div aria-hidden className={cx("hidden lg:block", wordsLeft && "lg:order-last")} />
                  )}

                  {/* From `lg` the list is the height of the picture: the dots share it evenly from the top and the
                      words sit half way up, one stop's on show at a time. */}
                  <ol start={first + 1} className={cx("relative flex flex-col gap-10 lg:block", wordsLeft && "lg:text-right")}>
                    {chapter.stops.map((stop, i) => {
                      const milestone = i === 0 && Boolean(chapter.image);
                      const lit = stop.index < reached;
                      const here = stop.index === reached - 1;
                      const onShow = stop.index === showing;
                      return (
                        <li key={stop.year} style={{ "--at": i / chapter.stops.length } as CSSProperties}>
                          {/* Below `lg` a later stop's own picture sits over its words, as the chapter's does. */}
                          {i > 0 && stop.image && (
                            <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-cloud lg:hidden">
                              <Image
                                src={stop.image.src}
                                alt=""
                                aria-hidden
                                fill
                                sizes="100vw"
                                className="object-cover"
                                style={stop.image.position ? { objectPosition: stop.image.position } : undefined}
                              />
                            </div>
                          )}
                          {/* The dot and the words: the dot is set from this box below `lg`, from the list above it. */}
                          <div className="relative lg:static">
                            <span
                              ref={(node) => {
                                dotRefs.current[stop.index] = node;
                              }}
                              aria-hidden
                              className={cx(
                                "absolute top-2.5 left-[-26.5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,box-shadow] duration-300 motion-reduce:transition-none lg:top-[calc(10px+var(--at)*(100%-20px))]",
                                wordsLeft ? "lg:right-[-3.5rem] lg:left-auto lg:translate-x-1/2" : "lg:left-[-3.5rem]",
                                here
                                  ? "size-[17px] bg-brand"
                                  : lit
                                    ? cx("size-[9px]", dark ? "bg-paper" : "bg-ink")
                                    : cx(
                                        "size-[9px]",
                                        dark
                                          ? "bg-ink shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.45)]"
                                          : "bg-paper shadow-[inset_0_0_0_1.5px_rgb(37_37_37/0.35)]",
                                      ),
                              )}
                            />
                            <div className="lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2">
                              <div
                                className={cx(
                                  "transition-[opacity,translate] duration-500 ease-premium motion-reduce:transition-none",
                                  lit ? "max-lg:translate-y-0 max-lg:opacity-100" : "max-lg:translate-y-2 max-lg:opacity-30",
                                  onShow
                                    ? cx("lg:translate-y-0", lit ? "lg:opacity-100" : "lg:opacity-30")
                                    : cx("lg:pointer-events-none lg:opacity-0", stop.index < showing ? "lg:-translate-y-3" : "lg:translate-y-3"),
                                )}
                              >
                                <p className={cx("text-sm font-semibold tabular-nums", dark ? "text-paper/70" : "text-ink/70")}>{stop.year}</p>
                                <h3
                                  className={cx(
                                    "text-balance font-display font-semibold leading-[1.1] tracking-[-0.03em]",
                                    milestone ? "mt-3 text-[1.75rem] sm:text-4xl" : "mt-2 text-[1.375rem] lg:mt-3 lg:text-4xl",
                                  )}
                                >
                                  {stop.title}
                                </h3>
                                <p
                                  className={cx(
                                    "max-w-[22rem] text-pretty leading-relaxed",
                                    dark ? "text-paper/70" : "text-ink/70",
                                    milestone ? "mt-4 text-[17px]" : "mt-3 text-base lg:mt-4 lg:text-[17px]",
                                    wordsLeft && "lg:ml-auto",
                                  )}
                                >
                                  {stop.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </Container>
            </div>
          );
        })}
      </div>
    </section>
  );
}
