import { ViewTransition } from "react";
import { Container, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_CARD, QUOTE_OPEN } from "@/lib/site";
import { QuoteBar } from "./QuoteBar";

/**
 * The shipper half's closing ask (rebuilt 2026-09-24). It sits after the safety band — the proof — and before
 * the dark story band, so it no longer needs its own photo: the page has already shown the trucks. A centred
 * column on white, set in the safety band's type — same label, heading and body styles — so the two read as one
 * shipper block, with padding kept tight so the cluster doesn't float (docs/DECISIONS.md → Homepage section
 * look). Label, heading, one short paragraph, then the quote bar (since 2026-09-25; it was a lone Get a quote button).
 *
 * Until 2026-09-24 this was a photo-and-text band mirroring the safety band (photo left with the rounded arrow
 * edge, the mountain-road shot); the two identical layouts in a row blurred together.
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  return (
    // From `lg` its top padding is short by the 40px the tools band keeps under its logos (2026-09-29), so the ask sits
    // centred between the logos and the dark band.
    // Shares its name with the Quote page: the quote bar's Get a quote grows this card into it (2026-09-24).
    <ViewTransition name={QUOTE_CARD} share={{ [QUOTE_OPEN]: "quote-open", default: "none" }} default="none">
    <section aria-labelledby="ship-with-us" className="bg-paper py-14 text-center sm:py-16 lg:pt-8 lg:pb-18">
      <Container>
        <Reveal className="mx-auto max-w-[52rem]">
          <p className={cx(labelClass, "text-ink/70")}>Ship with us</p>

          {/* The hero already names the freight (2026-09-24), so this heading is just the ask. */}
          {/* A step above the other band headings (2026-09-29): it's the shipper half's one ask, and at the band
              headings' size it looked lost in the sheet's white on the way back up. */}
          <h2
            id="ship-with-us"
            className="mt-4 text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[3.25rem] lg:text-[clamp(3rem,4.4vw,4rem)]"
          >
            Have a load to move?
          </h2>

          <p className="mx-auto mt-6 max-w-[40rem] text-pretty text-[17px] leading-relaxed text-ink/70 sm:text-lg">
            Tell us where it&rsquo;s going and when it&rsquo;s ready, and we&rsquo;ll come back with a quote.
            Every load runs in a dry van, so there&rsquo;s nothing else to choose.
          </p>

          <QuoteBar />
        </Reveal>
      </Container>
    </section>
    </ViewTransition>
  );
}
