import type { Metadata } from "next";
import { StoryMilestones } from "@/components/about";
import { Container, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { story } from "@/lib/story";

export const metadata: Metadata = { title: "About" };

// Story section only for now (draft copy in lib/story.ts). Team, fleet and safety record are still to come.
export default function AboutPage() {
  return (
    <section className="pb-24 pt-40 sm:pb-32">
      <Container>
        <Reveal>
          <p className={cx(labelClass, "text-ink/70")}>About</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">{story.headline}</h1>
        </Reveal>

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <Reveal delay={0.05} className="max-w-2xl space-y-6 text-lg text-ink/70 sm:text-xl">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <StoryMilestones milestones={story.milestones} tone="light" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
