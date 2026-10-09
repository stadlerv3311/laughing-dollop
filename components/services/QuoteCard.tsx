"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, ViewTransition } from "react";
import { ShipRouteMap } from "@/components/home/ShipRouteMap";
import { FlyArrow, RiseLabel, chapterHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_BAND, QUOTE_OPEN, quoteLink } from "@/lib/site";
import type { StateCode } from "@/lib/us-states";

/**
 * The states whose pins land on the black side of the card at every width from `lg`, worked out from where the map
 * is drawn below. The made-up trips keep to these, so no pin or arc ends off the card (the builder, 2026-10-08:
 * "lets make arrows only on the states that are on the card. but don change anything the main page card").
 * Work them out again if the map's size, place or turn changes.
 */
const ON_CARD: readonly StateCode[] = ["WA", "OR", "CA", "NV", "ID", "UT", "MT", "WY", "CO"];

/**
 * The Services page's closing card, on its black band (the builder, 2026-10-08: "want something like we have on about
 * screen ( 2 cards that create 1 animation ) i want one card on services that will resemble shi with us band", then,
 * of three mock-ups, "lets do 2"). One card cut on a slant, the About page's cut (SplitCard) stood on end: white on
 * the left with the homepage band's question and Get a quote as the site's underlined arrow link, black on the right
 * with that band's own map (ShipRouteMap), alive the way it is there while its button is closed: the light sweeping
 * the dots and made-up trips coming and going, with no names or numbers. The map is drawn wider than its side, so the
 * card shows the Pacific coast and the west and lets the east run off the edge. It starts far enough right of the
 * cut that Washington's corner and coast are clear of the white (the builder, same day: "move the map inside the card
 * just a bit to the right so we can se the border. of wa"). From `lg` it is drawn larger than the card, 105% of its
 * width, with that corner kept where it was, and its dots are brighter than on the homepage (the builder, later:
 * "please zoom in the map but keep it in borders. also make the dots a bit brighter"). It is also turned six degrees
 * about that corner, the east end up, and set higher, so the northern border runs nearly level near the card's top
 * where the projection has it sloping down to the east; and the question and the link sit well inside the card's padding, so that the three distances
 * down the white side are one: the card's top edge to the question's capitals, the question's last line to the link's
 * letters, and the link's baseline to the card's foot, 123px each (the builder, arrows drawn on a screenshot: "fix the
 * text on the card also rotate the map just a bit and move it a bit higher", then "move text closer like 10 more
 * pixels", then "move those towards each other for another 15 pixels. or use ux/ui skills in order to deffine what
 * distance there needs to be in order to it not feel empty bu roomy. so they have air"). Before that they were 90, 173
 * and 107: with the gap between them nearly twice their distance from the edges, the two read as pinned to opposite
 * corners with a hole between, where equal thirds read as one pair with air round it.
 *
 * The cut is a steep one, from 57% along the top edge to 35% along the foot, so the words have room on the white and
 * the map on the black. A thin white line runs round the card, as round About's, so the black side still reads as
 * part of a card on the black band. The link's hit area is the whole card, and hovering anywhere on it plays the
 * link's hover (`group` on the card), again as on About.
 *
 * Below `lg` there is no cut: the map across the top, the words on white under it.
 *
 * The map plays only while the card is on screen. Reduced motion gets the dots alone (ShipRouteMap).
 *
 * Following the link grows the card into the homepage's Ship with us band, the full-screen quote form (the builder,
 * same day: "an animation of expandig in to the full get a quote screen"): the two share a view-transition name, and
 * only this link's `quote-open` navigation plays it (QUOTE_BAND in lib/site.ts; `.quote-open` in app/globals.css).
 */
export function QuoteCard({ id, title }: { id: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <ViewTransition name={QUOTE_BAND} share={{ [QUOTE_OPEN]: "quote-open", default: "none" }} default="none">
    <div
      ref={ref}
      className="group relative isolate overflow-hidden bg-ink shadow-[inset_0_0_0_1px_rgb(255_255_255/0.25)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-paper lg:h-[30rem]"
    >
      <div className="relative h-64 overflow-hidden sm:h-80 lg:absolute lg:inset-0 lg:h-auto">
        <div className="absolute top-[10%] left-[6%] aspect-[960/613] w-[150%] sm:left-[10%] sm:w-[110%] lg:top-[6%] lg:left-[50.6%] lg:w-[105%] lg:origin-[5.5%_1.3%] lg:-rotate-6">
          {/* A second coat of the map's own dots: they are set faint for a whole screen of them. Being the same
              picture, it brightens the country's edge along with the rest, so the edge stands out here as it does on
              the homepage (the builder, 2026-10-08: "on services screen too borders of US have brighter dots"). */}
          <Image src="/images/us-dots.svg" alt="" fill sizes="80rem" className="select-none object-contain invert" />
          <ShipRouteMap
            pickup={null}
            delivery={null}
            ride={0}
            sweep={0}
            playing={inView}
            demo
            demoStates={ON_CARD}
            className="absolute inset-0"
          />
        </div>
      </div>
      {/* The white side. Drawn on its own, under the words, so the cut clips the white and not the link's hit area. */}
      <div
        aria-hidden
        className={cx("pointer-events-none absolute inset-0 hidden bg-paper lg:block", "[clip-path:polygon(0_0,57%_0,35%_100%,0_100%)]")}
      />
      <div className="flex flex-col justify-between gap-12 bg-paper p-8 text-ink sm:p-10 lg:absolute lg:inset-0 lg:bg-transparent lg:px-12 lg:pt-[7.125rem] lg:pb-[7.0625rem]">
        <h2 id={id} className={cx(chapterHeadingClass, "max-w-[22rem]")}>
          {title}
        </h2>
        <div>
          <Link
            href={quoteLink.href}
            transitionTypes={[QUOTE_OPEN]}
            className="inline-flex items-center gap-1.5 text-xl font-medium outline-none after:absolute after:inset-0"
          >
            <RiseLabel>{quoteLink.label}</RiseLabel>
            <FlyArrow className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
    </ViewTransition>
  );
}
