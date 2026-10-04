"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useRef, useState, type ReactNode, type RefObject } from "react";
import { Container, Reveal, sectionTop } from "@/components/ui";
import { cx } from "@/lib/cx";
import { safetyGroups, safetyPitch, safetySystems, type SafetyGroup, type SafetySystem } from "@/lib/site";
import { StoryHeadline } from "./StoryHeadline";

/** The band's heading, run on as one line (owner's wording, 2026-10-02; it was "We know truck and trailer location / and last service."). */
const SAFETY_HEADLINE = ["Tracked trucks.", "Proven service."];

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
 * All on white since 2026-10-02 (owner: the black top half — heading and road pair on ink, 2026-09-30 — made the band
 * read as two sections). The orange half star went with the black.
 *
 * All three clips are placeholders until the owner sends our own footage — the GPS one is Samsara's and must not
 * go live (docs/DECISIONS.md → Safety band). New equipment has no footage: a still of the fleet, also a placeholder.
 *
 * `between` sits between the two pictures (owner, 2026-10-02: the numbers band, TrustBar, moved in there from above
 * the band). It brings its own Container and no padding; the slot sets 70px from the pictures to it on either side
 * (owner, same day, after trying 80; 64px on phones).
 */
export function SafetyBand({ between }: { between?: ReactNode }) {
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

  // One picture and its words. Each block below has its own 12-column grid on the same container, so the two still
  // line up: the first pair in columns 1–7 with its words in 8–12, the second mirrored (6–12, words in 1–5).
  const group = (g: number) => (
    <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
      <Reveal className={cx("lg:row-start-1", g === 0 ? "lg:col-start-1 lg:col-end-8" : "lg:col-start-6 lg:col-end-13")}>
        <Pair
          group={safetyGroups[g]}
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
          "lg:row-start-1 lg:self-center",
          g === 0 ? "lg:col-start-8 lg:col-end-13 lg:pl-10" : "lg:col-start-1 lg:col-end-6 lg:pr-10",
        )}
      >
        <div className="max-w-[28rem]">
          <h3 className="text-balance text-[1.5rem] font-medium leading-[1.12] tracking-[-0.03em] sm:text-[1.75rem]">
            {safetyGroups[g].title}
          </h3>
          <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink/70">
            {safetyGroups[g].body}
          </p>
          {safetyGroups[g].systems.some((index) => safetySystems[index].readout) && (
            <Readout system={safetySystems[safetyGroups[g].systems[open[g]]]} active={active[g]} />
          )}
        </div>
      </Reveal>
    </div>
  );

  return (
    // 70px from the shop pair to the logo row under it (owner, 2026-10-02; 64 on phones), the same as either side of
    // the numbers — not the usual section foot.
    <section aria-labelledby="safety" className={cx("bg-paper pb-16 sm:pb-[4.375rem]", sectionTop)}>
      <Container>
        {/* Set like Our story's heading (owner, 2026-09-30): a two-line chapter heading, the first line in grey and
            the second in full ink, each rising in, with the pitch under it. Centred since 2026-10-02 (owner), like the
            numbers band and Ship with us, so the page holds one look. */}
        <Reveal className="text-center">
          {/* No "Safety and equipment" label over it since 2026-10-02 (owner: remove). */}
          <StoryHeadline id="safety" lines={SAFETY_HEADLINE} light inline solid large />
          <p className="mx-auto mt-6 max-w-[38rem] text-balance text-lg leading-relaxed text-ink">
            {safetyPitch}
          </p>
        </Reveal>
        <div className="mt-12 sm:mt-14">{group(0)}</div>
      </Container>
      {between && <div className="mt-16 sm:mt-[4.375rem]">{between}</div>}
      {/* The two pictures step down the page, sharing columns 6–7, so they need clear space between them. */}
      <Container className={between ? "mt-16 sm:mt-[4.375rem]" : "mt-16 sm:mt-20 lg:mt-28"}>{group(1)}</Container>
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
                {/* Just the name since 2026-10-02 (owner): the line under it, shown as a card opened, is gone. */}
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
 * reads as data and doesn't outshout the heading — and a short list of details. It opens once the words are well on
 * screen (owner, 2026-10-01: hover-only left the column looking empty) — the centred group glides up to make room —
 * and then stays; hovering, focusing or tapping the pair before then opens it too. It follows the open card, so
 * moving from GPS to Dash cameras swaps it. Sample values — no longer marked "Example" on the page since 2026-10-01
 * (owner) — so they must stay plainly illustrative, never a real unit, position or event; hidden from screen readers
 * while closed.
 */
function Readout({ system, active }: { system: SafetySystem; active: boolean }) {
  const readout = system.readout;
  const grey = "text-ink/70";
  // The closed row is 0px tall, which an IntersectionObserver still reports; the margin waits until it's 15% of
  // the screen up from the bottom, so the opening is seen rather than happening below the fold.
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const visible = seen || active;
  return (
    <div
      ref={ref}
      aria-hidden={!visible}
      inert={!visible}
      className={cx(
        "grid transition-[grid-template-rows,opacity] duration-700 ease-premium motion-reduce:transition-none",
        visible ? "grid-rows-[1fr] opacity-100 delay-300" : "grid-rows-[0fr] opacity-0",
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
            <p className={cx("text-[13px]", grey)}>{readout.label}</p>
            <p className="mt-1.5 text-[2.5rem] font-light leading-none tracking-[-0.035em] tabular-nums">
              {readout.figure}
              {readout.unit && (
                <span className={cx("ml-1.5 text-[17px] font-normal tracking-normal", grey)}>{readout.unit}</span>
              )}
            </p>
            <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-y-1.5 text-[15px] leading-normal">
              {readout.rows.map((row) => (
                <Fragment key={row.label}>
                  <dt className={grey}>{row.label}</dt>
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
