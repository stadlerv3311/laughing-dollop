"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, SlideGroup, SlideItem } from "@/components/ui";
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
 * Each row swaps the photo for its own clip (requested 2026-09-19): hover or focus a row and its video fades in
 * over the photo and plays from the start; leave the list and the photo comes back. On touch, a tap picks a
 * row. All three clips are placeholders until the owner sends our own footage — the GPS one is Samsara's and
 * must not go live (docs/DECISIONS.md → Safety band).
 *
 * On first scroll into view the photo slides in from its screen edge and the text from the other side, on
 * one shared trigger so both land on the same frame (requested 2026-09-18) — see `SlideGroup`.
 */
// Draft copy — swap in approved wording when it's ready.
export function SafetyBand() {
  const [active, setActive] = useState<number | null>(null);
  const videos = useRef<Array<HTMLVideoElement | null>>([]);

  // Only the picked clip runs, from its first frame each time; the others stop so they don't use the CPU.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  return (
    <SlideGroup aria-labelledby="safety" className="relative bg-paper lg:flex lg:min-h-[calc(33.75vw+4rem)] lg:items-center">
      {/*
        The photo is absolute from `lg`, so it can't stretch the section. Its box is 54vw wide at 16:10, so
        33.75vw tall; on wide screens that outgrew the text column and the photo ran over the numbers band's
        hairline (46px at 1920). The min-height keeps a 2rem margin above and below it, and the text centres.
      */}
      <Container className="py-16 sm:py-20 lg:py-8">
        <SlideItem from="left" className="lg:w-[46%] lg:pr-8">
          <p className="text-sm font-semibold text-ink/60">Safety and equipment</p>

          <h2 id="safety" className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            We know where every truck and trailer is, and when each was last serviced.
          </h2>

          {/*
            Not numbered: these run side by side, not in order. Buttons, so the swap works from the keyboard
            and by tap as well as by mouse. Leaving the list, or tabbing out of it, puts the photo back.
          */}
          <ul
            className="mt-9 divide-y divide-ink/10 border-y border-ink/10"
            onMouseLeave={() => setActive(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
            }}
          >
            {safetySystems.map((system, i) => {
              const on = active === i;
              return (
                <li key={system.name}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={cx(
                      "group relative block w-full cursor-pointer py-5 text-left transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active !== null && !on && "opacity-45",
                    )}
                  >
                    {/* The orange bar is a mark, not text, so it's clear of the small-orange-text rule. */}
                    <span
                      aria-hidden
                      className={cx(
                        "absolute inset-y-5 left-0 w-[3px] origin-top bg-brand transition-transform duration-300 ease-out",
                        on ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <span
                      className={cx(
                        "block transition-transform duration-300 ease-out",
                        on ? "translate-x-5" : "translate-x-0",
                      )}
                    >
                      <span className="block text-lg font-semibold">{system.name}</span>
                      <span className="mt-1.5 block max-w-lg text-ink/70">{system.body}</span>
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
            {safetySystems.map((system, i) => (
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
                className={cx(
                  "absolute inset-0 size-full object-cover transition-opacity duration-500",
                  active === i ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </SlideItem>
      </div>
    </SlideGroup>
  );
}
