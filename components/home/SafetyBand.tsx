import Image from "next/image";
import { Container, SlideGroup, SlideItem } from "@/components/ui";
import { safetySystems } from "@/lib/site";

/**
 * How we look after the freight (2026-09-18): GPS, dash cams and maintenance records. It answers the
 * shipper's question after price — "is my load safe with you?" — so it follows Ship with us, with only the
 * numbers band between them.
 *
 * The same build as Ship with us, mirrored: photo left, text right, and from `lg` the photo runs to the left
 * screen edge with the angled edge on its right. Read together, the two bands zigzag down the page. Both are
 * white: the numbers band between them is the divider, not a background change (owner, 2026-09-18).
 *
 * A still for now. The owner wanted Samsara's product videos here, but those were downloaded from
 * samsara.com and show Samsara's demo data — see docs/DECISIONS.md → Safety band before swapping in video.
 *
 * On first scroll into view the photo slides in from its screen edge and the text from the other side, on
 * one shared trigger so both land on the same frame (requested 2026-09-18) — see `SlideGroup`.
 */
// Draft copy — swap in approved wording when it's ready.
export function SafetyBand() {
  return (
    <SlideGroup aria-labelledby="safety" className="relative bg-paper lg:flex lg:min-h-[calc(33.75vw+4rem)] lg:items-center">
      {/*
        The photo is absolute from `lg`, so it can't stretch the section. Its box is 54vw wide at 16:10, so
        33.75vw tall; on wide screens that outgrew the text column and the photo ran over the numbers band's
        hairline (46px at 1920). The min-height keeps a 2rem margin above and below it, and the text centres.
      */}
      <Container className="py-16 sm:py-20 lg:py-28">
        <SlideItem from="right" className="lg:ml-auto lg:w-[46%] lg:pl-8">
          <p className="text-sm font-semibold text-ink/60">Safety and equipment</p>

          <h2 id="safety" className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            We know where every truck and trailer is, and when each was last serviced.
          </h2>

          {/* Not numbered: these run side by side, not in order. */}
          <dl className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
            {safetySystems.map((system) => (
              <div key={system.name} className="py-5">
                <dt className="text-lg font-semibold">{system.name}</dt>
                <dd className="mt-1.5 max-w-lg text-ink/70">{system.body}</dd>
              </div>
            ))}
          </dl>
        </SlideItem>
      </Container>

      {/*
        Same box as Ship with us — a fixed 16:10 so the crop is identical at every width (see the note there)
        — pinned to the left edge instead. Below `lg` it's a full-width band under the text.
      */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:left-0 lg:top-1/2 lg:aspect-16/10 lg:h-auto lg:w-[54%] lg:-translate-y-1/2">
        {/* Starts fully off the left edge, so the photo arrives from outside the screen. */}
        <SlideItem from="left" distance="100%" className="absolute inset-0">
          <Image
            src="/images/safety-truck-front.jpg"
            alt="An ITrucking tractor and dry van trailer on a desert highway at sunrise"
            fill
            sizes="(width >= 64rem) 54vw, 100vw"
            className="object-cover lg:[clip-path:polygon(0%_0%,90%_0%,100%_50%,90%_100%,0%_100%)]"
          />
        </SlideItem>
      </div>
    </SlideGroup>
  );
}
