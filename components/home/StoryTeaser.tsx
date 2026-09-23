import Link from "next/link";
import { StoryMilestones } from "@/components/about";
import { Container, Reveal } from "@/components/ui";
import { aboutLink } from "@/lib/site";
import { story } from "@/lib/story";

/**
 * Homepage band with the short company story — the page's one dark passage, edge to edge rather than a card
 * floating in white. The whole band links to the About page (docs/DECISIONS.md → Company story).
 */
export function StoryTeaser() {
  return (
    <section aria-labelledby="story-teaser-title" data-header-theme="dark" className="group relative bg-ink py-20 text-paper sm:py-28 lg:py-36">
      <Container>
        <Reveal>
          <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] md:gap-16">
            <div>
              <p className="text-sm font-semibold text-paper/60">Our story</p>
              <h2 id="story-teaser-title" className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {story.headline}
              </h2>
              <p className="mt-4 max-w-lg text-lg text-paper/70">{story.summary}</p>

              {/* The link's ::after covers the whole band, so clicking anywhere in it opens About. */}
              <Link
                href={aboutLink.href}
                className="mt-10 inline-flex items-center gap-2 text-lg font-semibold outline-none after:absolute after:inset-0 after:z-10 focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-brand"
              >
                Read our full story
                <svg viewBox="0 0 16 16" aria-hidden className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Hidden on phones to keep the band short — the About page always shows the timeline. */}
            <StoryMilestones milestones={story.milestones} tone="dark" className="hidden self-center md:block" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
