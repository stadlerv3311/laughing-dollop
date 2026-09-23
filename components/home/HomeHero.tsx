import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { applyLink, homeHeadline, homeLede } from "@/lib/site";

/**
 * The homepage's opening screen (rebuilt 2026-09-23 as a cinematic full-bleed hero, after a Mobbin review
 * against Waabi and Aurora). The truck photo is shown at full strength — no white wash — and a dark scrim
 * rises from the bottom so the white headline reads over the road. The top of the frame stays clear sky, so
 * the site header (dark logo, glass pills) sits over it unchanged. One action only: the headline speaks to
 * drivers, so Apply to drive is the button, and Get a Quote stays in the header. The numbers that used to sit
 * here moved into the trust bar below (docs/DECISIONS.md → Hero media).
 */
// Draft copy — the h1 is the owner's approved line; the lede is not.
export function HomeHero() {
  return (
    <section id="content" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-paper">
      <Image
        src="/images/home-hero-desert.jpg"
        alt="An ITrucking tractor and dry van trailer on a desert highway at dusk"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-10 animate-hero-settle object-cover object-[64%_40%] motion-reduce:animate-none lg:object-[100%_40%]"
      />
      {/*
        Scrims for the words: one rising from the bottom, one from the left where the headline sits. The top
        right stays clear, so the rig and the header's sky are untouched.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(12_12_12/.9)_0%,rgb(12_12_12/.66)_32%,rgb(12_12_12/.22)_60%,rgb(12_12_12/0)_78%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgb(12_12_12/.5)_0%,rgb(12_12_12/.25)_40%,rgb(12_12_12/0)_62%)] [mask-image:linear-gradient(to_bottom,transparent_15%,black_55%)] lg:block"
      />

      {/* The scrimmed lower part is dark, so the header switches to its light logo while that passes under it. */}
      <div aria-hidden data-header-theme="dark" className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]" />

      <Container className="flex flex-1 flex-col justify-end pt-32 pb-10 sm:pb-14 lg:pb-16">
        <div className="animate-hero-rise motion-reduce:animate-none">
          <h1 className="max-w-[13ch] text-balance text-[clamp(2.75rem,6.4vw,6.25rem)] font-medium leading-[0.94] tracking-[-0.05em] lg:max-w-[15ch]">
            {homeHeadline.lead} {homeHeadline.tail}
          </h1>

          <div className="mt-10 flex flex-col gap-6 border-t border-paper/20 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-12">
            <p className="max-w-md text-base leading-relaxed text-paper/80 sm:text-lg">{homeLede}</p>
            <Button
              href={applyLink.href}
              variant="light"
              size="lg"
              className="w-full shrink-0 sm:w-auto sm:px-9"
            >
              Apply to drive
              <span aria-hidden>→</span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
