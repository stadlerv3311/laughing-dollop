import { Container, Reveal, RotatingSlogan } from "@/components/ui";
import { driverSlogans } from "@/lib/site";

/**
 * The rolling slogans, as a smaller line straight under the hero (2026-09-18). They were the page's h1 until the
 * photo hero took a fixed one; now they're a paragraph, so the h1 no longer changes under a screen reader.
 * The apply cards follow directly, so this band only carries top space.
 */
export function DriverSlogans() {
  return (
    <div className="bg-paper">
      <Container className="pt-14 pb-10 sm:pt-16 sm:pb-12 lg:pt-20">
        <Reveal>
          {/*
            Every slogan is written to roughly the same length, so each one fills the same number of lines
            and the band never reserves a blank line under the short ones. Check that when editing the copy.
          */}
          <RotatingSlogan
            slogans={driverSlogans}
            hold={4.5}
            className="text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.025em]"
          />
        </Reveal>
      </Container>
    </div>
  );
}
