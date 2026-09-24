"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Container, SlideGroup, SlideItem, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { safetySystems } from "@/lib/site";
import { ArrowPhotoClip } from "./ArrowPhotoClip";

/**
 * How we look after the freight (2026-09-18): GPS, dash cams and maintenance records. It answers the
 * shipper's question "is my load safe with you?" — so it sits straight under the numbers band, as proof before
 * the ask: Ship with us and its Get a Quote follow it (swapped 2026-09-23; it used to come after Ship with us).
 *
 * The same build as Ship with us, mirrored: text left, photo right, and from `lg` the photo runs to the right
 * screen edge with the angled edge on its left. Read together, the two bands zigzag down the page. Both are
 * white, with no background change between the bands (owner, 2026-09-18).
 *
 * Each row swaps the photo for its own clip (requested 2026-09-19), and the rows play through on a timer
 * (2026-09-24): once the band is on screen, each row is picked in turn for `ROW_MS` while its orange bar fills
 * from the top down, then hands over to the next, looping. Tapping or clicking a row holds it: the cycle pauses
 * there with the bar full, and tapping the held row again gives it a fresh ROW_MS and lets the cycle carry on. The timer also pauses while the band is off screen. Reduced-motion visitors get the old behaviour instead:
 * nothing plays on its own, hover or focus a row to see its clip, leave the list and the photo comes back. All three clips are placeholders until the owner sends our own footage — the GPS one is Samsara's and
 * must not go live (docs/DECISIONS.md → Safety band). The fourth row, New equipment (2026-09-24), has no footage:
 * it swaps in a still of the fleet instead (`image` in `safetySystems`), also a placeholder.
 *
 * On first scroll into view the photo slides in from its screen edge and the text from the other side, on
 * one shared trigger so both land on the same frame (requested 2026-09-18) — see `SlideGroup`.
 */
// How long each row stays picked before the next one takes over (owner, 2026-09-24: 10 s was too long).
const ROW_MS = 5_000;

// False while hydrating (the server can't know the visitor's motion setting), true after — so the first render in
// the browser matches the server's HTML, and the timer switches on right after.
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

// Draft copy — swap in approved wording when it's ready.
export function SafetyBand() {
  const [active, setActive] = useState<number | null>(null);
  // Bumped on every pick, so each row's bar starts filling from empty.
  const [turn, setTurn] = useState(0);
  const [inView, setInView] = useState(false);
  // Held by a tap: the picked row stays until the same row is tapped again.
  const [held, setHeld] = useState(false);
  const reduceMotion = useReducedMotion();
  const cycling = useHydrated() && reduceMotion === false;
  const listRef = useRef<HTMLUListElement>(null);
  const videos = useRef<Array<HTMLVideoElement | null>>([]);

  const pick = (i: number) => {
    setActive(i);
    setTurn((t) => t + 1);
  };
  // A tap on another row jumps there and holds it; a tap on the row already picked holds it, or, if it's held,
  // lets the cycle carry on with a fresh ROW_MS on that row.
  const tap = (i: number) => {
    if (i === active && held) {
      pick(i);
      setHeld(false);
    } else if (i === active) {
      setHeld(true);
    } else {
      pick(i);
      setHeld(true);
    }
  };

  // The timer runs only while the list is on screen; the first time it comes into view, the first row is picked.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !cycling) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setActive((a) => a ?? 0);
    }, { threshold: 0.3 });
    observer.observe(list);
    return () => observer.disconnect();
  }, [cycling]);

  // Only the picked clip runs, from its first frame each time; the others stop so they don't use the CPU. Off
  // screen, nothing plays.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && (inView || !cycling)) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, turn, inView, cycling]);

  return (
    <SlideGroup aria-labelledby="safety" className="relative bg-paper lg:flex lg:min-h-[calc(33.75vw+4rem)] lg:items-center">
      {/*
        The photo is absolute from `lg`, so it can't stretch the section. Its box is 54vw wide at 16:10, so
        33.75vw tall; on wide screens that outgrew the text column and the photo ran over the numbers band's
        hairline (46px at 1920). The min-height keeps a 2rem margin above and below it, and the text centres.
      */}
      <Container className="py-16 sm:py-20 lg:py-8">
        <SlideItem from="left" className="lg:w-[46%] lg:pr-8">
          <p className={cx(labelClass, "text-ink/70")}>Safety and equipment</p>

          <h2 id="safety" className={cx("mt-4", sectionHeadingClass)}>
            We know where every truck and trailer is, and when each was last serviced.
          </h2>

          {/*
            Not numbered: these run side by side, not in order. Buttons, so a pick works from the keyboard and by
            tap as well as by mouse. Without the timer (reduced motion), hover and focus pick too, and leaving the
            list, or tabbing out of it, puts the photo back.
          */}
          <ul
            ref={listRef}
            className="mt-10 divide-y divide-ink/10 border-y border-ink/10"
            onMouseLeave={cycling ? undefined : () => setActive(null)}
            onBlur={
              cycling
                ? undefined
                : (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
                  }
            }
          >
            {safetySystems.map((system, i) => {
              const on = active === i;
              return (
                <li key={system.name}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={cycling ? undefined : () => setActive(i)}
                    onFocus={cycling ? undefined : () => setActive(i)}
                    onClick={() => (cycling ? tap(i) : setActive(i))}
                    className={cx(
                      "group relative block w-full cursor-pointer py-5 text-left transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active !== null && !on && "opacity-45",
                    )}
                  >
                    {/*
                      The orange bar is a mark, not text, so it's clear of the small-orange-text rule. On the timer it
                      is the clock: it fills from the top down over ROW_MS, and when it's full the next row takes
                      over. Pausing its CSS animation (the band off screen) pauses the cycle. A held row shows the bar
                      full and still, so it reads as picked rather than stopped halfway.
                    */}
                    {cycling ? (
                      on && (
                        <span
                          key={turn}
                          aria-hidden
                          className={cx(
                            "absolute inset-y-5 left-0 w-[3px] origin-top bg-brand",
                            !held && "animate-row-timer",
                          )}
                          style={held ? undefined : { animationDuration: `${ROW_MS}ms`, animationPlayState: inView ? "running" : "paused" }}
                          onAnimationEnd={() => pick((i + 1) % safetySystems.length)}
                        />
                      )
                    ) : (
                      <span
                        aria-hidden
                        className={cx(
                          "absolute inset-y-5 left-0 w-[3px] origin-top bg-brand transition-transform duration-300 ease-out",
                          on ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                    )}
                    <span
                      className={cx(
                        "block transition-transform duration-300 ease-out",
                        on ? "translate-x-5" : "translate-x-0",
                      )}
                    >
                      <span className="block text-lg font-medium tracking-[-0.01em]">{system.name}</span>
                      <span className="mt-1.5 block max-w-lg leading-relaxed text-ink/70">{system.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SlideItem>
      </Container>

      {/*
        Same box as Ship with us — a fixed 16:10 so the crop is identical at every width (see the note there)
        — pinned to the right edge instead. Below `lg` it's a full-width band under the text.
      */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:right-0 lg:top-1/2 lg:aspect-16/10 lg:h-auto lg:w-[54%] lg:-translate-y-1/2">
        <ArrowPhotoClip id="safety-band-arrow" point="left" />
        {/* Starts fully off the right edge, so the photo arrives from outside the screen. */}
        <SlideItem from="right" distance="100%" className="absolute inset-0">
          {/* The angled edge clips the photo and every clip together. */}
          <div className="absolute inset-0 overflow-hidden bg-ink lg:[clip-path:url(#safety-band-arrow)]">
            <Image
              src="/images/ship-truck-side.jpg"
              alt="An ITrucking dry van on a desert highway at sunset, the logo on its trailer"
              fill
              sizes="(width >= 64rem) 54vw, 100vw"
              className="object-cover"
            />
            {safetySystems.map((system, i) => {
              const shown = cx(
                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                active === i ? "opacity-100" : "opacity-0",
              );
              if (system.image) {
                // A still for rows with no footage (New equipment). Lazy like the clips, and hidden from
                // screen readers until its row is picked, since only one picture is ever on show.
                return (
                  <Image
                    key={system.image.src}
                    src={system.image.src}
                    alt={active === i ? system.image.alt : ""}
                    aria-hidden={active !== i}
                    fill
                    sizes="(width >= 64rem) 54vw, 100vw"
                    className={shown}
                  />
                );
              }
              return (
                <video
                  key={system.video}
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={system.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  className={shown}
                />
              );
            })}
          </div>
        </SlideItem>
      </div>
    </SlideGroup>
  );
}
