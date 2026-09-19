import Image from "next/image";
import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { applyLink, homeHeadline, homeLede, quoteLink } from "@/lib/site";

/**
 * The homepage's opening screen (rebuilt 2026-09-18 from the owner's "2a" design reference): a light split — the
 * words on white on the left, our truck climbing I-80 through the Sierra in a panel on the right. The header
 * is the site's own and sits over it unchanged; the owner asked for it not to move.
 *
 * Laid out two ways:
 * - `xl` up: the photo panel takes the right 52% and runs the full height of the screen, under the header's
 *   buttons. Not from `lg`: a 1024px screen leaves a panel too narrow for the rig and cuts the trailer's logo.
 * - Below `xl`: the header clearance, then the photo, then the words.
 */
// Draft copy — swap in approved wording when it's ready. The h1 is the owner's approved line; the lede is not.
export function HomeHero() {
  return (
    <section id="content" className="relative bg-paper xl:min-h-svh">
      {/*
        The photo is lifted a touch — slightly lighter and less saturated — so it sits with the white page.
        Below `xl` the height follows the width (112vw, capped at 46% of the screen), so the slice of photo is
        always wide enough to hold the whole rig, trailer logo included. In the panel the rig spans about
        25–68% of the photo's width; the crop leans left so, on a screen tall enough to narrow the slice, the
        cab's nose goes before the trailer's logo does.
      */}
      <div className="relative mt-18 h-[min(112vw,max(300px,46svh))] overflow-hidden xl:absolute xl:inset-y-0 xl:right-0 xl:mt-0 xl:h-auto xl:w-[52%]">
        <Image
          src="/images/home-hero-sierra.jpg"
          alt="An ITrucking dry van climbing a mountain highway through pine forest at dawn"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1280px) 52vw, 100vw"
          className="object-cover object-[42%_60%] brightness-110 contrast-[.94] saturate-[.82] xl:object-[41%_50%]"
        />
      </div>

      <Container className="relative pt-8 pb-14 sm:pt-12 xl:pt-[clamp(8rem,21vh,12rem)] xl:pb-24">
        <div className="xl:w-[48%] xl:pr-12">
          <div className="max-w-[540px]">
            <p className="flex items-center gap-2.5 text-sm font-semibold text-ink/55">
              <span aria-hidden className="size-[7px] rounded-full bg-brand" />
              I-80, Sierra Nevada
            </p>
            <h1 className="mt-5 text-pretty text-[clamp(2.2rem,3.9vw,3.5rem)] font-medium leading-[0.96] tracking-[-0.045em]">
              {homeHeadline.lead} <span className="text-ink/55">{homeHeadline.tail}</span>
            </h1>
            <p className="mt-6 max-w-[430px] leading-relaxed text-ink/70">
              {homeLede}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href={applyLink.href} variant="dark" size="lg">
                Apply to drive
              </Button>
              {/* Ink, not orange: orange text this small fails contrast (ARCHITECTURE.md → Orange contrast rules). */}
              <Link
                href={quoteLink.href}
                className="border-b border-ink/25 pb-0.5 font-semibold transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
