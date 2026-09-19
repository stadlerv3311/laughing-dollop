import { ApplyRoutes, DriverSlogans, HomeHero, SafetyBand, ShipWithUs, StoryTeaser, TrustBar } from "@/components/home";
import { TruckIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* The intro plays as a fixed overlay on top of the hero, then fades away to reveal it. */}
      <TruckIntro>
        <HomeHero />
      </TruckIntro>
      <DriverSlogans />
      <ApplyRoutes />
      <ShipWithUs />
      {/* The numbers are the divider between the two photo bands (2026-09-18) — no colour change. */}
      <TrustBar />
      <SafetyBand />
      <StoryTeaser />
    </>
  );
}
