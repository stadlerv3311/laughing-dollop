"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container, labelClass, Reveal, sectionBottom, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, applyRoutes, careersLink } from "@/lib/site";

/**
 * Three ways into the same short application, sitting where the full-width photo band used to be
 * (requested 2026-09-17). The truck photo moved in here as the driver card, which is why this replaced
 * the band rather than joining it.
 *
 * Cards that open up (owner, 2026-09-28, from the Samsara review's customer strip): from `md` the three photos
 * share one row, one of them wide and open — role, job, its line and Apply now over a dark fade at the foot —
 * the other two narrow, showing only role and job. Hovering or tabbing to a card opens it; the last one opened
 * stays open, and the driver card starts open. Below `md` they stack, every card open. Square corners and no box,
 * as before (docs/DECISIONS.md → Homepage section look). Each card is one link to its job on the careers page.
 */
// Draft copy — swap in approved wording when it's ready.
export function ApplyRoutes() {
  const [open, setOpen] = useState(0);

  return (
    <section aria-labelledby="apply-routes" className={cx("bg-paper", sectionBottom)}>
      <Container>
        <Reveal>
          {/* Labelled like every other section (2026-09-29), so it reads as a new band, not a caption to the slogan. */}
          <p className={cx(labelClass, "text-ink/70")}>Careers</p>
          <h2 id="apply-routes" className={cx("mt-4", sectionHeadingClass)}>
            Where you&rsquo;d fit.
          </h2>
          <p className="mt-3 text-ink/70">A few short questions for any of them, then HR calls you back.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 sm:mt-10">
          <ul className="flex flex-col gap-3 md:h-[28rem] md:flex-row lg:h-[32rem] xl:h-[34rem]">
            {applyRoutes.map((route, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={route.role}
                  onMouseEnter={() => setOpen(i)}
                  className={cx(
                    "relative aspect-4/3 md:aspect-auto md:min-w-0 md:transition-[flex-grow] md:duration-700 md:ease-premium motion-reduce:transition-none",
                    isOpen ? "md:grow-[2.4]" : "md:grow",
                    "md:basis-0",
                  )}
                >
                  <Link
                    href={`${careersLink.href}#${route.job}`}
                    onFocus={() => setOpen(i)}
                    className="group absolute inset-0 block overflow-hidden bg-ink text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    {/*
                      All three sit on one screen, so none of them is reliably the largest paint — the case Next's
                      docs say to load eagerly rather than preload.
                    */}
                    <Image
                      src={route.image.src}
                      alt={route.image.alt}
                      fill
                      loading="eager"
                      sizes="(width >= 48rem) 55vw, 100vw"
                      style={route.image.position ? { objectPosition: route.image.position } : undefined}
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                    />
                    <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

                    {/*
                      Fixed width for the open card's words, so they don't rewrap while the card widens; a narrow
                      card clips what it can't show, and only its role and job are visible.
                    */}
                    <span className="absolute inset-x-5 bottom-5 block sm:inset-x-7 sm:bottom-7 md:inset-x-5 md:bottom-5 lg:inset-x-7 lg:bottom-7">
                      <span className="block text-sm text-paper/80">{route.role}</span>
                      <span className="mt-1 block text-2xl font-medium leading-tight tracking-[-0.025em] sm:text-[1.75rem] md:text-xl lg:text-[1.75rem]">
                        {route.title}
                      </span>
                      <span
                        className={cx(
                          "block overflow-hidden transition-[opacity,max-height] duration-500 ease-premium motion-reduce:transition-none md:w-[24rem] md:max-w-full",
                          isOpen ? "max-h-40 opacity-100 md:delay-200" : "max-h-40 opacity-100 md:max-h-0 md:opacity-0",
                        )}
                      >
                        <span className="mt-2 block max-w-[24rem] text-pretty leading-relaxed text-paper/80">{route.body}</span>
                        {/* Looks like the site's white button; the whole card is the link. */}
                        <span className="mt-5 inline-flex h-11 items-center gap-3 rounded-full bg-paper pl-5 pr-6 text-[15px] font-semibold text-ink">
                          <span aria-hidden className="size-1.5 rounded-full bg-ink" />
                          {applyLink.label}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
