import { HomeHero, StoryTeaser, TrustBar } from "@/components/home";
import { TruckIntro } from "@/components/intro";
import { HeroMedia } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <TruckIntro>
        {/* Temporary AI-generated placeholder photo. A B-roll video will replace it — pass `video`. */}
        <HeroMedia
          image={{
            src: "/images/home-hero-placeholder.jpg",
            alt: "White ITrucking semi truck crossing a cable-stayed bridge at sunset",
          }}
        />
      </TruckIntro>
      <HomeHero />
      <TrustBar />
      <StoryTeaser />
    </>
  );
}
