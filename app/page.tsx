import { ApplyRoutes, HomeHero, SafetyBand, ShipWithUs, StoryTeaser, TrustBar } from "@/components/home";
import { TruckIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* The intro plays as a fixed overlay on top of these two, then fades away to reveal them. */}
      <TruckIntro>
        <HomeHero />
        {/* Took the photo band's place on 2026-09-17 — the truck photo is the driver card now. */}
        <ApplyRoutes />
      </TruckIntro>
      <ShipWithUs />
      {/* The numbers are the divider between the two photo bands (2026-09-18) — no colour change. */}
      <TrustBar />
      <SafetyBand />
      <StoryTeaser />
    </>
  );
}
