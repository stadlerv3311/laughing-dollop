import { ApplyRoutes, DriverSlogans, HomeHero, SafetyBand, ShipWithUs, StoryTeaser, TrustBar } from "@/components/home";
import { TruckIntro } from "@/components/intro";

export default function HomePage() {
  return (
    <>
      {/* The intro plays as a fixed overlay on top of the hero, then fades away to reveal it. */}
      <TruckIntro>
        <HomeHero />
      </TruckIntro>
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
