import { ApplyRoutes, DriverSlogans, HomeHero, SafetyBand, ShipWithUs, StoryTeaser, TrustBar } from "@/components/home";
import { HomeIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* Drives the header logo's fade-in and the hero headline's light-up on load; renders nothing itself. */}
      <HomeIntro />
      <HomeHero />
      {/* The numbers straight under the hero, then the two shipper bands — proof first (how the freight is
          looked after), then the ask (Ship with us, Get a Quote; swapped 2026-09-23) — then the driver slogans
          and the apply cards together. */}
      <TrustBar />
      <SafetyBand />
      <ShipWithUs />
      <DriverSlogans />
      <ApplyRoutes />
      <StoryTeaser />
    </>
  );
}
