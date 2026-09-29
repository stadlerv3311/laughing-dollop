"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, useRef, useState, type RefObject } from "react";
import { Container, Reveal, ScrollFillText, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { safetyGroups, safetyPitch, safetySystems, type SafetyGroup, type SafetySystem } from "@/lib/site";

/**
 * How we look after the freight (2026-09-18): GPS, dash cams, maintenance records and new equipment. It answers
 * the shipper's question "is my load safe with you?" — so it sits straight under the numbers band, as proof before
 * the ask: Ship with us and its Get a Quote follow it, sliding up over it from `lg` (SlideOverStack).
 *
 * A zigzag (owner's sketch, 2026-09-28): the heading with a one-line pitch beside it, then two pictures stepping
 * down the page — the road pair top left with its words to the right, the shop pair bottom right with its words to the
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
  // Which card of each pair is open, and whether the pair is being hovered, focused or tapped — kept here so the
  // words beside a pair can follow it (its readout).
  const [open, setOpen] = useState<number[]>(() => safetyGroups.map((group) => group.open));
  const openCard = (g: number, i: number) => setOpen((all) => (all[g] === i ? all : all.map((v, k) => (k === g ? i : v))));
  const [active, setActive] = useState<boolean[]>(() => safetyGroups.map(() => false));
  const activate = (g: number, on: boolean) =>
    setActive((all) => (all[g] === on ? all : all.map((v, k) => (k === g ? on : v))));

  return (
    <section aria-labelledby="safety" className="bg-paper py-16 sm:py-20 lg:py-24">
      <Container>
        {/* The same 12 columns as the pictures below, so the pitch starts on the first block of words' left edge. */}
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-7">
            <p className={cx(labelClass, "text-ink/70")}>Safety and equipment</p>
            <h2 id="safety" className={cx("mt-4 max-w-[20ch]", sectionHeadingClass)}>
              {/* Fills in word by word as it scrolls up (2026-09-29) — the band's one moving heading. */}
              <ScrollFillText text="We know where every truck and trailer is, and when each was last serviced." />
            </h2>
          </div>
          <p className="max-w-[34rem] text-pretty text-lg leading-relaxed text-ink/70 lg:col-span-5 lg:pl-10">
            {safetyPitch.lead} <span className="font-medium text-ink">{safetyPitch.strong}</span>
          </p>
        </Reveal>

        {/* 12 columns from lg: each picture takes 7, its words the other 5, the second pair mirrored. */}
        <div className="mt-12 grid gap-y-10 sm:mt-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-3">
          {safetyGroups.map((group, g) => (
            <Fragment key={group.title}>
              <Reveal
                className={
                  g === 0 ? "lg:col-start-1 lg:col-end-8 lg:row-start-1" : "lg:col-start-6 lg:col-end-13 lg:row-start-2"
                }
              >
                <Pair
                  group={group}
                  open={open[g]}
                  onOpen={(i) => openCard(g, i)}
                  onActive={(on) => activate(g, on)}
                  reduceMotion={reduceMotion === true}
                  videos={videos}
                  play={play}
                  pause={pause}
                />
              </Reveal>
              {/* Centred on its picture from lg (owner, 2026-09-28), so neither end of the column sits empty. */}
              <Reveal
                delay={0.1}
                className={cx(
                  "lg:self-center",
                  g === 0
                    ? "lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:pl-10"
                    : "lg:col-start-1 lg:col-end-6 lg:row-start-2 lg:pr-10",
                )}
              >
                <div className="max-w-[28rem]">
                  <h3 className="text-balance text-[1.5rem] font-medium leading-[1.12] tracking-[-0.03em] sm:text-[1.75rem]">
                    {group.title}
                  </h3>
                  <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink/65">{group.body}</p>
                  {group.systems.some((index) => safetySystems[index].readout) && (
                    <Readout system={safetySystems[group.systems[open[g]]]} visible={active[g]} />
                  )}
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
  open,
  onOpen,
  onActive,
  reduceMotion,
  videos,
  play,
  pause,
}: {
  group: SafetyGroup;
  open: number;
  onOpen: (i: number) => void;
  onActive: (on: boolean) => void;
  reduceMotion: boolean;
  videos: RefObject<Array<HTMLVideoElement | null>>;
  play: (i: number) => void;
  pause: (i: number) => void;
}) {
  return (
    <ul
      onMouseEnter={() => onActive(true)}
      onMouseLeave={() => {
        onOpen(group.open);
        onActive(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onActive(false);
      }}
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
              onOpen(i);
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
              onFocus={() => {
                onOpen(i);
                onActive(true);
              }}
              onClick={() => {
                onOpen(i);
                onActive(true);
                const video = videos.current[index];
                if (!video) return;
                if (video.paused) play(index);
                else video.pause();
              }}
              // A size container, so a cropped clip can be sized against the card (cq units, see cropStyle).
              style={system.crop ? { containerType: "size" } : undefined}
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
                  style={system.crop ? cropStyle(system.crop) : undefined}
                  className={cx(
                    "absolute transition-transform duration-700 ease-premium group-hover:scale-[1.03]",
                    !system.crop && "inset-0 size-full object-cover",
                  )}
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

/**
 * What the open card's system records, under the pair's words (owner, 2026-09-28, "L1" after a round of mock-ups;
 * the scale after T1 Energy on Mobbin): a small label, one figure in a thin weight at about the heading's size — so it
 * reads as data and doesn't outshout the heading — and a short list of details. At rest only the heading and
 * paragraph show, centred on the pictures; while the pair is hovered, focused or tapped, the readout's row opens and
 * the centred group glides up to make room, then settles back when the pointer leaves. It follows the open card, so
 * moving from GPS to Dash cameras swaps it. Sample values, marked Example; hidden from screen readers while closed.
 */
function Readout({ system, visible }: { system: SafetySystem; visible: boolean }) {
  const readout = system.readout;
  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cx(
        "grid transition-[grid-template-rows,opacity] duration-600 ease-premium motion-reduce:transition-none",
        visible ? "grid-rows-[1fr] opacity-100 delay-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        {readout && (
          <motion.div
            key={system.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-10"
          >
            <p className="flex justify-between text-[13px] text-ink/55">
              <span>{readout.label}</span>
              <span>Example</span>
            </p>
            <p className="mt-1.5 text-[2.5rem] font-light leading-none tracking-[-0.035em] tabular-nums">
              {readout.figure}
              {readout.unit && (
                <span className="ml-1.5 text-[17px] font-normal tracking-normal text-ink/55">{readout.unit}</span>
              )}
            </p>
            <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-y-1.5 text-[15px] leading-normal">
              {readout.rows.map((row) => (
                <Fragment key={row.label}>
                  <dt className="text-ink/55">{row.label}</dt>
                  <dd>{row.value}</dd>
                </Fragment>
              ))}
            </dl>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Places a clip so only its `crop` box can show, centred in the card: the clip is scaled until the box covers the
 * card on both axes (whichever needs more), then shifted so the box's centre sits on the card's centre. Sized in
 * container units against the card, so it holds as the card opens and closes.
 */
function cropStyle({ x, y, w, h, aspect }: { x: number; y: number; w: number; h: number; aspect: number }) {
  const width = `max(calc(100cqw / ${w}), calc(100cqh / ${h} * ${aspect}))`;
  return {
    width,
    maxWidth: "none",
    height: "auto",
    aspectRatio: aspect,
    left: `calc(50cqw - ${width} * ${x + w / 2})`,
    top: `calc(50cqh - ${width} / ${aspect} * ${y + h / 2})`,
  };
}
