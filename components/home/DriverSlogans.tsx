import { Container, Reveal, RotatingSlogan, sectionY } from "@/components/ui";
import { driverSlogans } from "@/lib/site";

/**
 * The rolling slogans, as a smaller line under the safety band, heading the driver block (moved 2026-09-21). They were the page's h1 until the
 * photo hero took a fixed one; now they're a paragraph, so the h1 no longer changes under a screen reader.
 * The apply cards follow directly. The space under it is the page's normal section step (2026-09-29, spacing audit
 * point 01: at 48px the slogan and "Where you'd fit." read as one block), and it's set in medium like every other
 * heading so it doesn't outrank the one under it.
 */
export function DriverSlogans() {
  return (
    <div className="bg-paper">
      <Container className={sectionY}>
        <Reveal>
          {/*
            Every slogan is written to roughly the same length, so each one fills the same number of lines
            and the band never reserves a blank line under the short ones. Check that when editing the copy.
          */}
          <RotatingSlogan
            slogans={driverSlogans}
            hold={4.5}
            className="text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em]"
          />
        </Reveal>
      </Container>
    </div>
  );
}
