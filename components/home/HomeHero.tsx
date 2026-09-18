import { Container, Reveal, RotatingSlogan } from "@/components/ui";
import { driverSlogans } from "@/lib/site";

/**
 * The homepage's opening line, at the very top of the page (moved above the photo band 2026-09-17).
 * It carries the clearance for the fixed header, since it's the first thing in the flow.
 *
 * The headline itself rolls through the slogans (2026-09-17) — there's no fixed headline above them any more,
 * so `driverSlogans[0]` is the page's h1 for crawlers and screen readers. Keep that one descriptive.
 *
 * The quiet "Five questions to apply" link that used to sit under the headline was dropped the same day, when
 * the three apply cards moved in directly below and said the same thing three times over.
 */
// Draft copy — swap in approved wording when it's ready.
export function HomeHero() {
  return (
    <section id="content" className="bg-paper pt-18">
      <Container className="pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20">
        <Reveal>
          {/*
            Every slogan is written to roughly the same length, so each one fills the same number of lines
            and the band never reserves a blank line under the short ones. Check that when editing the copy.
          */}
          <RotatingSlogan
            as="h1"
            slogans={driverSlogans}
            hold={4.5}
            className="text-balance text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
