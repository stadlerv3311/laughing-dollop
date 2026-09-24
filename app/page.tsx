import { ApplyRoutes, DriverSlogans, HomeHero, SafetyBand, ShipWithUs, StoryTeaser, TrustBar } from "@/components/home";
import { HomeIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* Drives the header logo's fade-in and the hero headline's light-up on load; renders nothing itself. */}
      <HomeIntro />
      <HomeHero />
      {/* The numbers straight under the hero, then the two shipper bands (what we haul, how it's looked
          after), then the driver slogans and the apply cards together (2026-09-21). */}
      <TrustBar />
      <ShipWithUs />
      <SafetyBand />
      <DriverSlogans />
      <ApplyRoutes />
      <StoryTeaser />
    </>
  );
}
