import { Button, Container, Reveal, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { quoteLink } from "@/lib/site";

/**
 * The shipper half's closing ask (rebuilt 2026-09-24). It sits after the safety band — the proof — and before
 * the dark story band, so it no longer needs its own photo: the page has already shown the trucks. A centred
 * column on white, set in the safety band's type — same label, heading and body styles — so the two read as one
 * shipper block, with padding kept tight so the cluster doesn't float (docs/DECISIONS.md → Homepage section
 * look). Label, heading, one short paragraph, Get a Quote.
 *
 * Until 2026-09-24 this was a photo-and-text band mirroring the safety band (photo left with the rounded arrow
 * edge, the mountain-road shot); the two identical layouts in a row blurred together.
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  return (
    <section aria-labelledby="ship-with-us" className="bg-paper py-14 text-center sm:py-16 lg:py-18">
      <Container>
        <Reveal className="mx-auto max-w-[42.5rem]">
          <p className={cx(labelClass, "text-ink/70")}>Ship with us</p>

          {/* The hero already names the freight (2026-09-24), so this heading is just the ask. */}
          <h2
            id="ship-with-us"
            className={cx("mt-4", sectionHeadingClass)}
          >
            Have a load to move?
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-pretty leading-relaxed text-ink/70">
            Tell us where it&rsquo;s going and what it weighs, and we&rsquo;ll come back with a quote. Every
            load runs in a dry van, so there&rsquo;s nothing else to choose.
          </p>

          {/* The one loud thing in the section: a step up from the shared button size, close to the text. */}
          <Button href={quoteLink.href} size="lg" className="mt-8 px-9 text-lg!">
            {quoteLink.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
