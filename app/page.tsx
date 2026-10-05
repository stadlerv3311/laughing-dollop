import { HomeHero, SafetyBand, ShipWithUs, SlideOverStack, StoryTeaser, ToolsBand, TrustBar, WhyWorkWithUs } from "@/components/home";
import { HomeIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* Drives the header logo's fade-in and the hero headline's light-up on load; renders nothing itself. */}
      <HomeIntro />
      <HomeHero />
      {/* The two shipper bands straight under the hero — proof first (what we haul and how the freight is looked after,
          with the numbers band between the two since 2026-10-05), then the ask (Ship with us, Get a Quote; swapped 2026-09-23). The story is the hinge
          between the shipper and driver halves (moved up 2026-09-24 — it spoke to both and gave the white
          middle a dark break; on white since 2026-10-02, when Ship with us took the black), and the page ends on Why work with us — its Apply now, then the shop pair (since 2026-10-03). */}
      {/* Ship with us slides up over the safety band on the way down (from lg) — see SlideOverStack. The logo row
          closes the safety band, so it's pinned with it (2026-09-29). Ship with us is the page's dark stop between the
          hero and the footer since 2026-10-02 (owner: the ask on black, Our story on white), so the sheet is ink. */}
      <SlideOverStack
        under={
          <>
            <SafetyBand between={<TrustBar />} />
            <ToolsBand />
          </>
        }
        over={<ShipWithUs />}
        dark
      />
      <StoryTeaser />
      {/* The careers half, in one section: why work with us, the three jobs and one Apply now (2026-09-30). */}
      <WhyWorkWithUs />
    </>
  );
}
