"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { flushSync } from "react-dom";
import { FlyArrow, RiseLabel } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { Service } from "@/lib/services";
import { quoteLink } from "@/lib/site";

/** How long a service holds the stage before the next takes it. The fill's keyframes run for as long (inline below). */
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
 * The Services page's stage (the builder, 2026-10-08: "1 big stage card then 3 smaller .then when you choose
 * different card that card is getting the stage with its text"): one big card with a service's picture, and its name
 * and words on the picture, and the three services as smaller cards under it. Choosing a small card sends it up: it
 * grows into the stage (a view transition, where the browser has them) and its words come in. The card of the service
 * on the stage goes dark and keeps its name and a line.
 *
 * With a mouse, from laptop width, the stage also moves on by itself every five seconds while that line fills, the
 * header's filling line again. Pointing anywhere at the block, or tabbing into it, holds it; moving away lets it go
 * on. On touch screens and smaller ones it changes only when a card is tapped, since nothing there can hold it, and
 * the words sit under the picture instead of on it. Reduced-motion visitors get no timer and no growing, just the swap.
 *
 * Every service's words are in the page whichever one shows; the two that don't are `inert`.
 */
export function ServiceStage({ services }: { services: readonly Service[] }) {
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
    const timer = setTimeout(() => setOpen((now) => (now + 1) % services.length), CYCLE);
    return () => clearTimeout(timer);
  }, [running, open, services.length]);

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
        {services.map((service, index) => {
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
                {/* Dark from the left and from the foot, where the words sit. */}
                <div
                  aria-hidden
                  className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgb(0_0_0/0.78),rgb(0_0_0/0.45)_42%,transparent_72%),linear-gradient(to_top,rgb(0_0_0/0.4),transparent_45%)] lg:block"
                />
              </div>
              {/* Under the picture below `lg`; on the picture's lower left from `lg`, rising in a moment after it. */}
              <div
                className={cx(
                  "pt-5 lg:absolute lg:bottom-11 lg:left-11 lg:max-w-[31rem] lg:pt-0 lg:transition-[opacity,translate] lg:ease-premium motion-reduce:transition-none",
                  active
                    ? "lg:translate-y-0 lg:opacity-100 lg:delay-300 lg:duration-700"
                    : "lg:translate-y-4 lg:opacity-0 lg:duration-200",
                )}
              >
                <h2 className="font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance lg:text-[2.75rem] lg:leading-[1.06]">
                  {service.name}
                </h2>
                <p className="mt-3 text-pretty text-[17px] leading-relaxed text-ink/70 lg:mt-3.5 lg:text-paper/85">
                  {service.detail}
                </p>
                <div className="mt-6">
                  <Link
                    href={quoteLink.href}
                    className="group inline-flex items-center gap-1.5 text-[17px] font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    <RiseLabel>{quoteLink.label}</RiseLabel>
                    <FlyArrow className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-2 lg:mt-3 lg:gap-3">
        {services.map((service, index) => {
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
                  "group relative block aspect-[5/4] w-full overflow-hidden bg-ink text-left text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:aspect-[2.2/1]",
                  active ? "cursor-default" : "cursor-pointer",
                )}
              >
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
                <span aria-hidden className="absolute inset-x-0 top-1/3 bottom-0 bg-linear-to-t from-black/70 to-transparent" />
                {/* Geist on phones, where the card is too small for the wide face (it starts at 22px). */}
                <span className="absolute inset-x-2.5 bottom-3 text-[13px] font-medium leading-[1.2] sm:inset-x-5 sm:bottom-5 sm:font-display sm:text-[1.375rem] sm:font-semibold sm:leading-[1.15] sm:tracking-[-0.03em]">
                  {service.name}
                </span>
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
