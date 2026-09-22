import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { applyLink, heroStats, homeHeadline, homeLede, quoteLink } from "@/lib/site";

/**
 * The homepage's opening screen (rebuilt 2026-09-21 from the owner's "4a" design reference): the truck photo
 * fills the whole screen, and a white wash from the left keeps the words readable over it — the headline and buttons up top, the lede and two numbers along the bottom. The header is the site's own and sits over it
 * unchanged; the owner asked for it and the logo not to move.
 */
// Draft copy — swap in approved wording when it's ready. The h1 is the owner's approved line; the lede is not.
export function HomeHero() {
  return (
    <section id="content" className="relative flex min-h-svh flex-col overflow-hidden bg-paper">
      {/*
        The rig sits right of centre in the photo, clear of the words. On narrow screens the crop moves right
        so the cab stays in, and the wash turns top-to-bottom instead, since the words then sit over the photo.
      */}
      <Image
        src="/images/home-hero-desert.jpg"
        alt="An ITrucking tractor and dry van trailer on a desert highway at dusk"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="animate-hero-settle object-cover object-[66%_60%] motion-reduce:animate-none lg:object-[62%_58%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(170deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.86)_42%,rgb(255_255_255/.55)_70%,rgb(255_255_255/.2)_100%)] lg:bg-[linear-gradient(100deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.88)_26%,rgb(255_255_255/.45)_48%,rgb(255_255_255/0)_68%)]"
      />

      <Container className="relative flex flex-1 flex-col">
        <div className="max-w-[700px] animate-hero-rise pt-36 motion-reduce:animate-none lg:pt-[clamp(9rem,24vh,13rem)]">
          <h1 className="text-pretty text-[clamp(2.3rem,4.8vw,4.25rem)] font-medium leading-[0.96] tracking-[-0.048em]">
            {homeHeadline.lead} <span className="text-ink/70">{homeHeadline.tail}</span>
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={applyLink.href} variant="apply" size="lg" className="w-44">
              Apply to drive
            </Button>
            <Button href={quoteLink.href} variant="outline" size="lg" className="w-44 bg-white/80">
              Get a quote
            </Button>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-end gap-7 pt-12 pb-12 lg:gap-11 lg:pt-16 lg:pb-13">
          <p className="max-w-[420px] text-base leading-relaxed text-ink/85">{homeLede}</p>

          <dl className="flex gap-9 lg:border-l lg:border-ink/15 lg:pl-11">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-[13px] text-ink/70">{stat.label}</dt>
                <dd className="text-[28px] leading-none font-medium tracking-[-0.03em]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
