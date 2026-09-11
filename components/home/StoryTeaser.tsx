import Link from "next/link";
import { StoryMilestones } from "@/components/about";
import { Container, Reveal } from "@/components/ui";
import { aboutLink } from "@/lib/site";
import { story } from "@/lib/story";

/** Homepage card with the short company story. The whole card links to the About page. */
export function StoryTeaser() {
  return (
    <section aria-labelledby="story-teaser-title" className="bg-paper pb-24 sm:pb-32">
      <Container>
        <Reveal>
          <article className="group relative grid gap-12 rounded-[2rem] bg-ink p-8 text-paper transition-colors duration-500 hover:bg-black sm:p-12 md:grid-cols-[1.15fr_1fr] md:gap-16 lg:p-16">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-paper/70">
                <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                Our story
              </p>
              <h2 id="story-teaser-title" className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {story.headline}
              </h2>
              <p className="mt-4 max-w-lg text-lg text-paper/70">{story.summary}</p>

              {/* The link's ::after covers the whole card (above the timeline), so clicking anywhere on it opens About. */}
              <Link
                href={aboutLink.href}
                className="mt-10 inline-flex items-center gap-2 text-lg font-semibold outline-none after:absolute after:inset-0 after:z-10 after:rounded-[2rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-brand"
              >
                Read our full story
                <svg viewBox="0 0 16 16" aria-hidden className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Hidden on phones to keep the card short — the About page always shows the timeline. */}
            <StoryMilestones milestones={story.milestones} tone="dark" className="hidden self-center md:block" />
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
