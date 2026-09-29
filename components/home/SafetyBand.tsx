"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { Fragment, useRef, useState, type RefObject } from "react";
import { Container, Reveal, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { safetyGroups, safetyPitch, safetySystems, type SafetyGroup } from "@/lib/site";

/**
 * How we look after the freight (2026-09-18): GPS, dash cams, maintenance records and new equipment. It answers
 * the shipper's question "is my load safe with you?" — so it sits straight under the numbers band, as proof before
 * the ask: Ship with us and its Get a Quote follow it, sliding up over it from `lg` (SlideOverStack).
 *
 * A zigzag (owner's sketch, 2026-09-28): the heading with a one-line pitch beside it, then two pictures stepping
 * down the page — On the road top left with its words to the right, In the shop bottom right with its words to the
 * left. Each picture is a pair of cards that open up like the apply cards: hovering one widens it, shows its line and
 * plays its clip; the clips stand paused on a frame until then and pause again when the pointer leaves, and leaving
 * the pair puts it back as it started (the first pair open on its left card, the second on its right). Cards are
 * buttons: focus opens one, a click or tap plays or pauses its clip — how touch screens play them. Below `sm` the
 * cards stack, every one open; below `lg` each picture sits over its words. Reduced-motion visitors get clips only
 * on a click or tap. Square corners and no box (DECISIONS.md → Homepage section look). Copy in lib/site.ts →
 * `safetyGroups` / `safetyPitch` (draft).
 *
 * All three clips are placeholders until the owner sends our own footage — the GPS one is Samsara's and must not
 * go live (docs/DECISIONS.md → Safety band). New equipment has no footage: a still of the fleet, also a placeholder.
 */
export function SafetyBand() {
  const reduceMotion = useReducedMotion();
  // One list for all four clips, so starting one stops whichever was playing in the other pair.
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const play = (i: number) =>
    videos.current.forEach((video, k) => {
      if (!video) return;
      if (k === i) video.play().catch(() => {});
      else video.pause();
    });
  const pause = (i: number) => videos.current[i]?.pause();

  return (
    <section aria-labelledby="safety" className="bg-paper py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className={cx(labelClass, "text-ink/70")}>Safety and equipment</p>
            <h2 id="safety" className={cx("mt-4 max-w-[20ch]", sectionHeadingClass)}>
              We know where every truck and trailer is, and when each was last serviced.
            </h2>
          </div>
          <p className="max-w-[34rem] text-pretty text-lg leading-relaxed text-ink/70">
            {safetyPitch.lead} <span className="font-medium text-ink">{safetyPitch.strong}</span>
          </p>
        </Reveal>

        {/* 12 columns from lg: each picture takes 7, its words the other 5, the second pair mirrored. */}
        <div className="mt-12 grid gap-y-10 sm:mt-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-3">
          {safetyGroups.map((group, g) => (
            <Fragment key={group.kicker}>
              <Reveal
                className={
                  g === 0 ? "lg:col-start-1 lg:col-end-8 lg:row-start-1" : "lg:col-start-6 lg:col-end-13 lg:row-start-2"
                }
              >
                <Pair group={group} reduceMotion={reduceMotion === true} videos={videos} play={play} pause={pause} />
              </Reveal>
              <Reveal
                delay={0.1}
                className={cx(
                  "lg:self-center",
                  g === 0
                    ? "lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:pl-10"
                    : "lg:col-start-1 lg:col-end-6 lg:row-start-2 lg:justify-self-end lg:pr-10",
                )}
              >
                <div className="max-w-[30rem]">
                  <p className={cx(labelClass, "text-ink/70")}>{group.kicker}</p>
                  <h3 className="mt-3 text-balance text-[1.625rem] font-medium leading-[1.12] tracking-[-0.035em] sm:text-[2rem]">
                    {group.title}
                  </h3>
                  <p className="mt-4 text-pretty leading-relaxed text-ink/70">{group.body}</p>
                  <dl className="mt-6 border-t border-ink/10">
                    {group.facts.map((fact) => (
                      <div key={fact.label} className="flex justify-between gap-4 border-b border-ink/10 py-3 text-[15px]">
                        <dt>{fact.label}</dt>
                        <dd className="text-ink/70">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Two cards side by side that open up; `group.open` is the one that starts (and settles back) wide. */
function Pair({
  group,
  reduceMotion,
  videos,
  play,
  pause,
}: {
  group: SafetyGroup;
  reduceMotion: boolean;
  videos: RefObject<Array<HTMLVideoElement | null>>;
  play: (i: number) => void;
  pause: (i: number) => void;
}) {
  const [open, setOpen] = useState<number>(group.open);

  return (
    <ul
      onMouseLeave={() => setOpen(group.open)}
      // The tighter 0.625rem gap inside a pair (owner, 2026-09-28); the open card takes up the difference, so the
      // closed one keeps its place on the column lines.
      className="flex flex-col gap-2.5 sm:aspect-[1/0.92] sm:flex-row"
    >
      {group.systems.map((index, i) => {
        const system = safetySystems[index];
        const isOpen = open === i;
        return (
          <li
            key={system.name}
            onMouseEnter={() => {
              setOpen(i);
              if (!reduceMotion) play(index);
            }}
            onMouseLeave={() => pause(index)}
            className={cx(
              "relative aspect-4/3 sm:aspect-auto sm:min-w-0 sm:basis-0 sm:transition-[flex-grow,flex-basis] sm:duration-700 sm:ease-premium motion-reduce:transition-none",
              // From lg the widths snap to the section's 12-column grid (owner, 2026-09-28): a pair spans 7 columns,
              // the closed card exactly 2 and the open one 5, so both pairs' closed cards stand in the same two
              // columns (6–7, where the pairs overlap). 100% is the pair's width: one column is (100% − 6 gaps) / 7.
              // The open card is the rest less the pair's own 0.625rem gap: 5 columns + 5 gaps − 0.625rem.
              isOpen
                ? "sm:grow-[2.1] lg:grow-0 lg:basis-[calc((100%-9rem)*5/7+6.875rem)]"
                : "sm:grow lg:grow-0 lg:basis-[calc((100%-9rem)*2/7+1.5rem)]",
            )}
          >
            <button
              type="button"
              aria-pressed={isOpen}
              onFocus={() => setOpen(i)}
              onClick={() => {
                setOpen(i);
                const video = videos.current[index];
                if (!video) return;
                if (video.paused) play(index);
                else video.pause();
              }}
              className="group absolute inset-0 block cursor-pointer overflow-hidden bg-ink text-left text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {system.image ? (
                <Image
                  src={system.image.src}
                  alt={system.image.alt}
                  fill
                  sizes="(width >= 64rem) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                />
              ) : (
                // `#t=0.1` so the paused clip shows a frame rather than black (Safari draws none at 0).
                <video
                  ref={(el) => {
                    videos.current[index] = el;
                  }}
                  src={`${system.video}#t=0.1`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                />
              )}
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

              <span className="absolute inset-x-5 bottom-5 block lg:inset-x-6 lg:bottom-6">
                <span className="block text-xl font-medium leading-tight tracking-[-0.025em] lg:text-[1.375rem]">
                  {system.name}
                </span>
                {/* Fixed width, so the line doesn't rewrap while the card widens. Always in the DOM for screen readers. */}
                <span
                  className={cx(
                    "block overflow-hidden transition-[opacity,max-height] duration-500 ease-premium motion-reduce:transition-none sm:w-[22rem] sm:max-w-full",
                    isOpen ? "max-h-40 opacity-100 sm:delay-150" : "max-h-40 opacity-100 sm:max-h-0 sm:opacity-0",
                  )}
                >
                  <span className="mt-2 block text-pretty text-[15px] leading-relaxed text-paper/80">{system.body}</span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
