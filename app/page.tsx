import { AudienceSplit, HomeHero, StoryTeaser, TrustBar } from "@/components/home";
import { TruckIntro } from "@/components/intro";
import { HeroMedia } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      {/* The intro plays as a fixed overlay on top of these two, then fades away to reveal them. */}
      <TruckIntro>
        <HomeHero />
        {/* Temporary AI-generated placeholder photo. A B-roll video will replace it — pass `video`. */}
        <HeroMedia
          image={{
            src: "/images/home-hero-desert.jpg",
            alt: "White ITrucking semi truck on an open desert highway at sunset",
          }}
        />
      </TruckIntro>
      <AudienceSplit />
      <TrustBar />
      <StoryTeaser />
    </>
  );
}
