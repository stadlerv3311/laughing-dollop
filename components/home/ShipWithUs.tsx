import Image from "next/image";
import { Button, Container, SlideGroup, SlideItem } from "@/components/ui";
import { quoteLink } from "@/lib/site";

/**
 * The shipper half of the page, on its own (2026-09-18). It replaced the light/dark "Ship with us" /
 * "Drive for us" split: the three apply cards above now carry all the recruiting, so the split's dark half
 * was asking the driver a third time and this band only has one audience left to talk to.
 *
 * Photo left, text right (swapped 2026-09-19 so the page zigzags off the hero, whose photo is on the right),
 * and from `lg` the photo is absolute so it runs to the left screen edge. The angled right edge echoes the
 * logo's points; it's a clip, not a border, so nothing floats (docs/DECISIONS.md → Homepage section look).
 *
 * On first scroll into view the photo slides in from its screen edge and the text from the other side, on
 * one shared trigger so both land on the same frame (requested 2026-09-18) — see `SlideGroup`.
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  return (
    <SlideGroup aria-labelledby="ship-with-us" className="relative bg-paper lg:flex lg:min-h-[calc(33.75vw+4rem)] lg:items-center">
      {/*
        The photo is absolute from `lg`, so it can't stretch the section. Its box is 54vw wide at 16:10, so
        33.75vw tall; on wide screens that outgrew the text column and the photo ran over the numbers band's
        hairline (46px at 1920). The min-height keeps a 2rem margin above and below it, and the text centres.
      */}
      <Container className="py-16 sm:py-20 lg:py-28">
        <SlideItem from="right" className="lg:ml-auto lg:w-[46%] lg:pl-8">
          <p className="text-sm font-semibold text-ink/60">Ship with us</p>

          {/*
            The page's h1 is a driver line, so this is the only heading that says what the business
            actually sells — keep the freight terms in it (docs/DECISIONS.md → Open).
          */}
          <h2
            id="ship-with-us"
            className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            Dry van truckload, handled with care.
          </h2>

          <p className="mt-5 max-w-lg text-lg text-ink/70">
            Tell us where it&rsquo;s going and what it weighs, and we&rsquo;ll come back with a quote. Every
            load runs in a dry van, so there&rsquo;s nothing else to choose.
          </p>

          {/* The fleet's model years (requested 2026-09-21). Update the years as the fleet turns over. */}
          <p className="mt-4 max-w-lg text-lg font-medium text-ink">
            Nearly all new equipment: 2025&ndash;2026 Volvo trucks pulling brand-new 2025&ndash;2026 trailers.
          </p>

          <Button href={quoteLink.href} size="lg" className="mt-9">
            {quoteLink.label}
          </Button>
        </SlideItem>
      </Container>

      {/*
        Below `lg` this is an ordinary full-width band under the text; from `lg` it lifts out of the flow
        into the left half of the section and runs to the screen edge, so the angled edge has room to read.
      */}
      {/*
        Fixed aspect rather than the section's full height, because `object-cover` crops width to fit the
        box: tied to the section, the box got taller as the text wrapped at narrower widths and cropped the
        logo off the trailer — at 1024px it lost a third of the frame. A set ratio crops the same everywhere,
        so the whole truck stays in it. Centred vertically, which also matches the reference's inset look.
      */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:left-0 lg:top-1/2 lg:aspect-16/10 lg:h-auto lg:w-[54%] lg:-translate-y-1/2">
        {/* Starts fully off the left edge, so the photo arrives from outside the screen. */}
        <SlideItem from="left" distance="100%" className="absolute inset-0">
          <Image
            src="/images/home-hero-sierra.jpg"
            alt="An ITrucking dry van climbing a mountain highway through pine forest at dawn"
            fill
            sizes="(width >= 64rem) 54vw, 100vw"
            className="object-cover lg:[clip-path:polygon(0%_0%,90%_0%,100%_50%,90%_100%,0%_100%)]"
          />
        </SlideItem>
      </div>
    </SlideGroup>
  );
}
