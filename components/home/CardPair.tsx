"use client";

import Image from "next/image";
import { useRef, type RefObject } from "react";
import { cx } from "@/lib/cx";
import type { SafetySystem } from "@/lib/site";

/**
 * One card: its name and a clip or a still, or neither for a plain grey stand-in (the shape of `SafetySystem`, so the
 * services cards can share it).
 */
export type PairCard = Pick<SafetySystem, "name" | "video" | "crop" | "image">;

/**
 * Two cards side by side that open up like the apply cards, shared by the safety band's services and road pairs and
 * Why work with us's two shop pairs (moved there 2026-10-03, owner; split in two 2026-10-05). Hovering a card widens it and plays its clip; the clips stand paused
 * on a frame until then and pause again when the pointer leaves, and leaving the pair puts it back as it started. Cards
 * are buttons: focus opens one, a click or tap plays or pauses its clip — how touch screens play them. Hovering is the
 * mouse's alone (pointer events, since 2026-10-09): a tap also arrives as a hover just before its click, which started
 * the clip and then stopped it again.
 *
 * Below `sm` the two cards stand side by side as tall 9:16 cards, like a row of Shorts (the builder, 2026-10-09: on
 * phones nearly every block was one picture on top of another, then words; first the services pair, then Why work
 * with us's two shop pairs the same day). With `phoneSlide` they are a short row that slides instead, as Why ___
 * stay's job cards do: the open card wide and named, the closed one a narrow strip, and a tap opens it (the builder,
 * the same day, of the road pair: "the same positioning as we have on why drivers stay. sliding pictures"). Until
 * then a pair stacked on phones, every card open. From `lg` the widths assume the pair spans 7 of 12 columns. Square
 * corners, no box.
 */

/** One list of clips per section, so starting one stops whichever was playing. Keyed by card name. */
export function usePairVideos() {
  const videos = useRef<Map<string, HTMLVideoElement>>(new Map());
  const play = (name: string) =>
    videos.current.forEach((video, key) => {
      if (key === name) video.play().catch(() => {});
      else video.pause();
    });
  const pause = (name: string) => videos.current.get(name)?.pause();
  return { videos, play, pause };
}

/** `start` is the card that starts (and settles back) wide. */
export function Pair({
  cards,
  start,
  open,
  onOpen,
  onActive,
  phoneSlide = false,
  reduceMotion,
  videos,
  play,
  pause,
}: {
  cards: readonly [PairCard, PairCard];
  start: number;
  open: number;
  onOpen: (i: number) => void;
  onActive?: (on: boolean) => void;
  /** Below `sm`, a short row with the open card wide, instead of two tall cards of one width. */
  phoneSlide?: boolean;
  reduceMotion: boolean;
  videos: RefObject<Map<string, HTMLVideoElement>>;
  play: (name: string) => void;
  pause: (name: string) => void;
}) {
  return (
    <ul
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onActive?.(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        onOpen(start);
        onActive?.(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onActive?.(false);
      }}
      // The tighter 0.625rem gap inside a pair (owner, 2026-09-28); the open card takes up the difference, so the
      // closed one keeps its place on the column lines.
      // The sliding row is as tall as the job cards on a phone (WhyWorkWithUs, `h-72`).
      className={cx("flex gap-2.5 sm:aspect-[1/0.92]", phoneSlide && "max-sm:h-72")}
    >
      {cards.map((system, i) => {
        const isOpen = open === i;
        return (
          <li
            key={system.name}
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              onOpen(i);
              if (!reduceMotion) play(system.name);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") pause(system.name);
            }}
            className={cx(
              "relative min-w-0 basis-0 transition-[flex-grow,flex-basis] duration-700 ease-premium motion-reduce:transition-none",
              // On phones: the job cards' 2.4 to 1 when the pair slides, otherwise two tall cards of one width.
              phoneSlide ? (isOpen ? "max-sm:grow-[2.4]" : "max-sm:grow") : "max-sm:aspect-9/16 max-sm:grow",
              // From lg the widths snap to the section's 12-column grid (owner, 2026-09-28): a pair spans 7 columns,
              // the closed card exactly 2 and the open one 5, so a closed card stands on two whole columns. 100% is
              // the pair's width: one column is (100% − 6 gaps) / 7. The open card is the rest less the pair's own
              // 0.625rem gap: 5 columns + 5 gaps − 0.625rem.
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
                onActive?.(true);
              }}
              onClick={() => {
                onOpen(i);
                onActive?.(true);
                const video = videos.current.get(system.name);
                if (!video) return;
                if (video.paused) play(system.name);
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
                  sizes={`(width >= 64rem) 45vw, (width >= 40rem) 100vw, ${phoneSlide ? 70 : 50}vw`}
                  style={system.image.position ? { objectPosition: system.image.position } : undefined}
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                />
              ) : system.video ? (
                // `#t=0.1` so the paused clip shows a frame rather than black (Safari draws none at 0).
                <video
                  ref={(el) => {
                    if (el) videos.current.set(system.name, el);
                    else videos.current.delete(system.name);
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
              ) : (
                // No picture yet (Lease to own, Our shop): a plain grey card, just a step lighter than ink, with its name.
                <span aria-hidden className="absolute inset-0 bg-paper/10" />
              )}
              {(system.image || system.video) && (
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
              )}

              <span
                className={cx(
                  "absolute inset-x-5 bottom-5 block lg:inset-x-6 lg:bottom-6",
                  // Sliding, the closed strip is too narrow for words, so only the open card is named (as on the job
                  // cards). Otherwise half the width to stand in, so the name sits closer to the corner and a size down.
                  phoneSlide
                    ? cx("max-sm:transition-opacity max-sm:duration-500", !isOpen && "max-sm:opacity-0")
                    : "max-sm:inset-x-3.5 max-sm:bottom-3.5",
                )}
              >
                <span
                  className={cx(
                    "block text-balance font-display font-semibold text-xl leading-tight tracking-[-0.03em] lg:text-[1.375rem]",
                    !phoneSlide && "max-sm:text-[1.0625rem]",
                  )}
                >
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
