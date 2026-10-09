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
 * are buttons: focus opens one, a click or tap plays or pauses its clip — how touch screens play them. Below `sm` the
 * cards stack, every one open — or, with `phoneRow`, stand side by side as two tall 9:16 cards, like a row of Shorts
 * (a trial on the services pair only, the builder, 2026-10-09: on phones nearly every block was one picture on top of
 * another, then words). From `lg` the widths assume the pair spans 7 of 12 columns. Square corners, no box.
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
  phoneRow = false,
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
  /** Below `sm`, the two cards side by side and tall instead of stacked. */
  phoneRow?: boolean;
  reduceMotion: boolean;
  videos: RefObject<Map<string, HTMLVideoElement>>;
  play: (name: string) => void;
  pause: (name: string) => void;
}) {
  return (
    <ul
      onMouseEnter={() => onActive?.(true)}
      onMouseLeave={() => {
        onOpen(start);
        onActive?.(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onActive?.(false);
      }}
      // The tighter 0.625rem gap inside a pair (owner, 2026-09-28); the open card takes up the difference, so the
      // closed one keeps its place on the column lines.
      className={cx("flex gap-2.5 sm:aspect-[1/0.92] sm:flex-row", !phoneRow && "flex-col")}
    >
      {cards.map((system, i) => {
        const isOpen = open === i;
        return (
          <li
            key={system.name}
            onMouseEnter={() => {
              onOpen(i);
              if (!reduceMotion) play(system.name);
            }}
            onMouseLeave={() => pause(system.name)}
            className={cx(
              "relative sm:aspect-auto sm:min-w-0 sm:basis-0 sm:transition-[flex-grow,flex-basis] sm:duration-700 sm:ease-premium motion-reduce:transition-none",
              phoneRow ? "aspect-9/16 min-w-0 flex-1" : "aspect-4/3",
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
                  sizes={phoneRow ? "(width >= 64rem) 45vw, (width >= 40rem) 100vw, 50vw" : "(width >= 64rem) 45vw, 100vw"}
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
                  // Half the width to stand in, so the name sits closer to the corner and a size down.
                  phoneRow && "max-sm:inset-x-3.5 max-sm:bottom-3.5",
                )}
              >
                <span
                  className={cx(
                    "block text-balance font-display font-semibold text-xl leading-tight tracking-[-0.03em] lg:text-[1.375rem]",
                    phoneRow && "max-sm:text-[1.0625rem]",
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
