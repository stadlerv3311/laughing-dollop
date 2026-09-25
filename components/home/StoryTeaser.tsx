import Link from "next/link";
import { ViewTransition } from "react";
import { StoryMilestones } from "@/components/about";
import { Container, Reveal, labelClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { aboutLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

/**
 * Homepage band with the short company story — the page's one dark passage, edge to edge rather than a card
 * floating in white. Only "Read our full story" links to About (2026-09-24; the whole band used to be one big
 * invisible link — docs/DECISIONS.md → Company story). It sits
 * between Ship with us and the driver slogans — the hinge between the shipper and driver halves (moved up from
 * the end of the page 2026-09-24).
 */
export function StoryTeaser() {
  return (
    // Shares its name with the About page's dark opening: following "Read our full story" morphs this band up
    // into it (2026-09-24). Only that link's `story-open` navigation plays it — see STORY_BAND in lib/story.ts.
    <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
    <section aria-labelledby="story-teaser-title" data-header-theme="dark" className="bg-ink py-20 text-paper sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16 lg:gap-24">
            <div>
              <p className={cx(labelClass, "text-paper/70")}>Our story</p>
              <h2 id="story-teaser-title" className={cx("mt-4", sectionHeadingClass)}>
                {story.headline}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">{story.summary}</p>

              <Link
                href={aboutLink.href}
                transitionTypes={[STORY_OPEN]}
                className="group mt-10 inline-flex items-center gap-2 rounded-sm text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Read our full story
                <svg viewBox="0 0 16 16" aria-hidden className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Hidden on phones to keep the band short — the About page always shows the timeline. */}
            <StoryMilestones milestones={story.milestones} tone="dark" className="hidden md:block" />
          </div>
        </Reveal>
      </Container>
    </section>
    </ViewTransition>
  );
}
