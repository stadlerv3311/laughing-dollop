import { Button, Container, Reveal } from "@/components/ui";
import { quoteLink } from "@/lib/site";

/**
 * The shipper half's closing ask (rebuilt 2026-09-24). It sits after the safety band — the proof — and before
 * the dark story band, so it no longer needs its own photo: the page has already shown the trucks. A centred
 * column on the soft off-white `mist` surface — the one section between white bands that changes background,
 * so it reads as its own quiet beat between the white safety band and the dark story (docs/DECISIONS.md →
 * Homepage section look). Label with a small orange mark, the heading, one short paragraph, Get a Quote.
 *
 * Until 2026-09-24 this was a photo-and-text band mirroring the safety band (photo left with the rounded arrow
 * edge, the mountain-road shot); the two identical layouts in a row blurred together.
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  return (
    <section aria-labelledby="ship-with-us" className="bg-mist py-20 text-center sm:py-24 lg:py-28">
      <Container>
        <Reveal className="mx-auto max-w-[42.5rem]">
          <p className="inline-flex items-center gap-3 text-sm font-semibold text-ink/70">
            {/* A mark, not text, so it's clear of the small-orange-text rule. */}
            <span aria-hidden className="h-0.5 w-5 bg-brand" />
            Ship with us
          </p>

          {/*
            The page's h1 is a driver line, so this is the only heading that says what the business
            actually sells — keep the freight terms in it (docs/DECISIONS.md → Open).
          */}
          <h2
            id="ship-with-us"
            className="mt-4 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[2.25rem] lg:text-[clamp(1.75rem,2.5vw,2.25rem)]"
          >
            Dry van truckload, handled with care.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg text-ink/70">
            Tell us where it&rsquo;s going and what it weighs, and we&rsquo;ll come back with a quote. Every
            load runs in a dry van, so there&rsquo;s nothing else to choose.
          </p>

          {/* The one loud thing in the section: a step up from the shared button size, close to the text. */}
          <Button href={quoteLink.href} size="lg" className="mt-8 px-9 text-lg!">
            {quoteLink.label}
            <span aria-hidden>→</span>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
