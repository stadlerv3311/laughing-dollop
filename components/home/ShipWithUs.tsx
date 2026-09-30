import { ViewTransition } from "react";
import { Container, Reveal, chapterHeadingClass, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_CARD, QUOTE_OPEN, shipProof } from "@/lib/site";
import { QuoteBar } from "./QuoteBar";
import { ShipRouteMap } from "./ShipRouteMap";

/**
 * The shipper half's closing ask (rebuilt 2026-09-24). It sits after the safety band — the proof — and before
 * the dark story band, so it no longer needs its own photo: the page has already shown the trucks. A centred
 * column on white, set in the safety band's type — same label, heading and body styles — so the two read as one
 * shipper block, with padding kept tight so the cluster doesn't float (docs/DECISIONS.md → Homepage section
 * look). Label, heading, one short paragraph, then the quote bar (since 2026-09-25; it was a lone Get a quote button)
 * and, since 2026-09-29, a quiet proof line of three figures under it, over a faint dot map of the lower 48 from `lg`
 * (ShipRouteMap).
 *
 * Until 2026-09-24 this was a photo-and-text band mirroring the safety band (photo left with the rounded arrow
 * edge, the mountain-road shot); the two identical layouts in a row blurred together.
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  return (
    // From `lg` its top padding is short by the 40px the tools band keeps under its logos (2026-09-29), so the ask sits
    // centred between the logos and the dark band: 200px each side (160 + the logo row's 40 above, 200 below), about 675px
    // tall, so the map behind it has room and the ask can breathe (owner, 2026-09-29: 420px before the map, then 520,
    // then "now it's not empty, it needs more room"). Below `lg` it has no top space of its own: the logo row's bottom space
    // is the one section step between them (components/ui/spacing.ts, 2026-09-29).
    // Shares its name with the Quote page: the quote bar's Get a quote grows this card into it (2026-09-24).
    <ViewTransition name={QUOTE_CARD} share={{ [QUOTE_OPEN]: "quote-open", default: "none" }} default="none">
    <section aria-labelledby="ship-with-us" className="relative overflow-hidden bg-paper pb-16 text-center sm:pb-20 lg:pt-40 lg:pb-50">
      <ShipRouteMap />
      <Container className="relative">
        <Reveal className="mx-auto max-w-[56rem]">
          <p className={cx(labelClass, "text-ink/70")}>Ship with us</p>

          {/* The hero already names the freight (2026-09-24), so this heading is just the ask. */}
          {/* A step above the other band headings (2026-09-29): it's the shipper half's one ask, and at the band
              headings' size it looked lost in the sheet's white on the way back up. It takes the chapter size shared
              with Our story and Why drive for us (Ship with us review point 01), so the hero stays the one bigger line. */}
          <h2 id="ship-with-us" className={cx("mt-4", chapterHeadingClass)}>
            Have a load to move?
          </h2>

          {/* One line at the lead size (owner, 2026-09-29, review point 02); "dry van only" moved to the proof line. */}
          <p className="mx-auto mt-5 max-w-[40rem] text-pretty text-lg leading-relaxed text-ink/70">
            Tell us where it&rsquo;s going and when it&rsquo;s ready. We&rsquo;ll come back with a quote.
          </p>

          <QuoteBar />

          {/* Three of the numbers band's own figures, right where a shipper decides (review point 05). */}
          {/* One line from `sm`; stacked on phones, so a wrapped line never starts with a separator dot. */}
          <ul className="mt-6 flex flex-col items-center gap-y-1 text-sm text-ink/70 sm:flex-row sm:justify-center sm:gap-x-5">
            {shipProof.map((item, i) => (
              <li key={item.words} className="flex items-center gap-x-5">
                {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-ink/30 max-sm:hidden" />}
                <span>
                  <span className="font-medium text-ink">{item.figure}</span> {item.words}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
    </ViewTransition>
  );
}
