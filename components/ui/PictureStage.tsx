"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { cx } from "@/lib/cx";
import { labelClass } from "./typography";

/** One thing the stage can show: a service on the Services page, a post on the news page. */
export type StageItem = {
  id: string;
  /** Its heading on the stage and the words on its small card. */
  name: string;
  /** The sentence or two under the heading. */
  detail: string;
  /** A short line over the heading and on the card: a news post's day. */
  label?: ReactNode;
  /** Its picture, on the stage and on its card; black without one. `position` keeps the right part in view. */
  image?: { src: string; position?: string };
};

/** How long an item holds the stage before the next takes it. The fill's keyframes run for as long (inline below). */
const CYCLE = 5000;
/** The stage moves on by itself only where a pointer can hold it: a mouse, from laptop width. */
const POINTER = "(hover: hover) and (width >= 64rem)";
/** From here the words sit on the picture and a chosen card grows into the stage. Tailwind's `lg`. */
const WIDE = "(width >= 64rem)";
/** The view-transition name the chosen card and the stage share while one grows into the other (app/globals.css). */
const GROW = "service-stage";

const subscribePointer = (onChange: () => void) => {
  const query = window.matchMedia(POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The stage: built for the Services page and used again for the news page's three newest posts (the builder,
 * 2026-10-09, on a picture of the Services one: "use te shame solution on news screen"). On Services (the builder, 2026-10-08: "1 big stage card then 3 smaller .then when you choose
 * different card that card is getting the stage with its text"): one big card with a service's picture, and its name
 * and words on a white panel in the picture's corner, and the three services as smaller cards under it. Choosing a small card sends it up: it
 * grows into the stage (a view transition, where the browser has them) and its words come in. The card of the service
 * on the stage goes dark and keeps its name and a line.
 *
 * With a mouse, from laptop width, the stage also moves on by itself every five seconds while that line fills, the
 * header's filling line again. Pointing anywhere at the block, or tabbing into it, holds it; moving away lets it go
 * on. On touch screens and smaller ones it changes only when a card is tapped, since nothing there can hold it, and
 * the words sit under the picture instead of on it. Reduced-motion visitors get no timer and no growing, just the swap.
 *
 * Every item's words are in the page whichever one shows; the ones that don't are `inert`.
 *
 * `headlines` is for names that are sentences, a news post's: the heading and the cards' words a size down, and the
 * cards taller below `lg`, so three lines fit on them.
 */
export function PictureStage({ items, headlines = false }: { items: readonly StageItem[]; headlines?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLElement | null)[]>([]);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(0);
  const [held, setHeld] = useState(false);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduceMotion = useReducedMotion();
  const pointer = useSyncExternalStore(subscribePointer, () => window.matchMedia(POINTER).matches, () => false);
  const running = pointer && inView && !held && reduceMotion === false;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setOpen((now) => (now + 1) % items.length), CYCLE);
    return () => clearTimeout(timer);
  }, [running, open, items.length]);

  function choose(index: number) {
    if (index === open) return;
    const card = cards.current[index];
    const layer = layers.current[index];
    const grows =
      card && layer && reduceMotion !== true && "startViewTransition" in document && window.matchMedia(WIDE).matches;
    if (!grows) {
      setOpen(index);
      return;
    }
    // The small card is the old picture and the stage's layer the new one, under one name, so the browser grows the
    // one into the other. The layer skips its own fade for the moment, or it would arrive see-through.
    const root = document.documentElement;
    root.classList.add("service-staging");
    card.style.viewTransitionName = GROW;
    const growing = document.startViewTransition(() => {
      card.style.viewTransitionName = "";
      layer.style.viewTransitionName = GROW;
      layer.style.transition = "none";
      flushSync(() => setOpen(index));
    });
    growing.finished.finally(() => {
      layer.style.viewTransitionName = "";
      layer.style.transition = "";
      root.classList.remove("service-staging");
    });
  }

  const letGo = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={letGo}
    >
      {/* Below `lg` the three lie in one grid cell, so the block is as tall as the longest of them and the cards
          under it never move when the stage changes. */}
      <div className="relative grid lg:block lg:aspect-[2.15/1] lg:overflow-hidden lg:bg-ink lg:text-paper">
        {items.map((service, index) => {
          const active = index === open;
          return (
            <article
              key={service.id}
              ref={(el) => {
                layers.current[index] = el;
              }}
              inert={!active}
              className={cx(
                "col-start-1 row-start-1 transition-[opacity,visibility] duration-500 lg:absolute lg:inset-0 lg:duration-700 lg:ease-premium motion-reduce:transition-none",
                active ? "opacity-100" : "invisible opacity-0",
              )}
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-ink sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
                {service.image && (
                  <Image
                    src={service.image.src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(width >= 75rem) 1200px, 100vw"
                    // It eases back from a slight zoom for as long as it has the stage, so the picture is never still.
                    className={cx(
                      "object-cover lg:transition-transform lg:duration-[6000ms] lg:ease-linear motion-reduce:transform-none motion-reduce:transition-none",
                      active ? "lg:scale-100" : "lg:scale-105",
                    )}
                    style={{ objectPosition: service.image.position }}
                  />
                )}
              </div>
              {/* Under the picture below `lg`. From `lg` on a white panel in the picture's lower left corner, rising in
                  a moment after it: the picture is left as it is, with nothing darkened under the words (the builder,
                  2026-10-08: "lets remove the blackened sides"), and white words can't be read on a row of white
                  trailers, so the words bring their own ground. No Get a quote here since the same day (the builder:
                  "remove get a quote from the picture"); the header and the page's closing band have it. */}
              <div
                className={cx(
                  "pt-5 lg:absolute lg:bottom-0 lg:left-0 lg:max-w-[33rem] lg:bg-paper lg:py-8 lg:pl-9 lg:pr-10 lg:text-ink lg:transition-[opacity,translate] lg:ease-premium motion-reduce:transition-none",
                  active
                    ? "lg:translate-y-0 lg:opacity-100 lg:delay-300 lg:duration-700"
                    : "lg:translate-y-4 lg:opacity-0 lg:duration-200",
                )}
              >
                {service.label && <p className={cx(labelClass, "mb-2 text-ink/70 lg:mb-2.5")}>{service.label}</p>}
                <h2
                  className={cx(
                    "font-display font-semibold tracking-[-0.03em] text-balance",
                    headlines
                      ? "text-[1.5rem] leading-[1.12] lg:text-[1.875rem] lg:leading-[1.1] xl:text-[2.125rem]"
                      : "text-[1.75rem] leading-[1.1] lg:text-[2.25rem] lg:leading-[1.06] xl:text-[2.75rem]",
                  )}
                >
                  {service.name}
                </h2>
                <p className="mt-3 text-pretty text-[17px] leading-relaxed text-ink/70 lg:mt-3.5">
                  {service.detail}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Nothing to choose between with one item, so no cards. */}
      <ul className={cx("mt-6 grid grid-cols-3 gap-2 lg:mt-3 lg:gap-3", items.length < 2 && "hidden")}>
        {items.map((service, index) => {
          const active = index === open;
          return (
            <li key={service.id}>
              <button
                ref={(el) => {
                  cards.current[index] = el;
                }}
                type="button"
                aria-pressed={active}
                onClick={() => choose(index)}
                className={cx(
                  "group relative block w-full overflow-hidden bg-ink text-left text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  headlines ? "aspect-[4/5] sm:aspect-[3/2] lg:aspect-[2.2/1]" : "aspect-[5/4] sm:aspect-[2.2/1]",
                  active ? "cursor-default" : "cursor-pointer",
                )}
              >
                {service.image && (
                  <Image
                    src={service.image.src}
                    alt=""
                    fill
                    sizes="(width >= 75rem) 392px, 33vw"
                    className={cx(
                      "object-cover transition-[opacity,scale] duration-700 ease-premium motion-reduce:transition-none",
                      active ? "opacity-15" : "group-hover:scale-[1.04]",
                    )}
                    style={{ objectPosition: service.image.position }}
                  />
                )}
                {/* The shade under the words: the lower two thirds for a name, the whole card for a headline. */}
                <span
                  aria-hidden
                  className={cx(
                    "absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent",
                    headlines ? "top-0 from-black/80 via-black/55" : "top-1/3 from-black/70",
                  )}
                />
                {headlines ? (
                  // The day from `sm`, and the headline in Geist until `lg`, where the card is wide enough for the
                  // wide face. Cut at five lines, three from `sm`, in case a headline runs long.
                  <span className="absolute inset-x-2.5 bottom-3 sm:inset-x-4 sm:bottom-4 lg:inset-x-5 lg:bottom-5">
                    {service.label && (
                      <span className="mb-1 hidden text-[13px] font-medium text-paper/80 sm:block lg:mb-1.5">{service.label}</span>
                    )}
                    <span className="line-clamp-5 text-[13px] font-medium leading-[1.25] sm:line-clamp-3 sm:text-[15px] lg:font-display lg:text-[1.1875rem] lg:font-semibold lg:leading-[1.2] lg:tracking-[-0.03em]">
                      {service.name}
                    </span>
                  </span>
                ) : (
                  // Geist on phones, where the card is too small for the wide face (it starts at 22px).
                  <span className="absolute inset-x-2.5 bottom-3 text-[13px] font-medium leading-[1.2] sm:inset-x-5 sm:bottom-5 sm:font-display sm:text-[1.375rem] sm:font-semibold sm:leading-[1.15] sm:tracking-[-0.03em]">
                    {service.name}
                  </span>
                )}
                {/* The line: filling while the timer runs, whole while the stage is held or the timer is off. */}
                <span
                  aria-hidden
                  className={cx(
                    "absolute inset-x-0 bottom-0 h-[3px] bg-paper/20 transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                >
                  {active && (
                    <span
                      key={running ? "filling" : "whole"}
                      className={cx("block h-full origin-left bg-paper", running && "animate-service-fill")}
                      style={running ? { animationDuration: `${CYCLE}ms` } : undefined}
                    />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
