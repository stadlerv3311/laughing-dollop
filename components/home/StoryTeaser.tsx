import { ViewTransition } from "react";
import { Container, InteractiveHoverButton, Reveal, chapterY, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { aboutLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";
import { StoryHeadline } from "./StoryHeadline";
import { StoryRoute } from "./StoryRoute";

/**
 * Homepage band with the short company story — the page's one dark passage, edge to edge rather than a card
 * floating in white. It sits between Ship with us and the driver slogans — the hinge between the shipper and
 * driver halves (moved up from the end of the page 2026-09-24).
 *
 * Layout "2c" (owner's pick from three mock-ups, 2026-09-25): the headline and summary on the left with Read our
 * full story on the right, then the three milestones — 1, DOT, 48 — as a short route that draws itself (StoryRoute,
 * 2026-09-29: white marks at a light weight, orange only on the rider and the last stop; until then the marks were
 * 115px with two in orange). The button is the site's thin white ring (DECISIONS.md → Brand orange). Only Read our
 * full story links to About.
 */
export function StoryTeaser() {
  return (
    // Shares its name with the About page's dark opening: following "Read our full story" morphs this band up
    // into it (2026-09-24). Only that link's `story-open` navigation plays it — see STORY_BAND in lib/story.ts.
    <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
    {/* The faint light in the top-left corner (story band review point 06): about 4% lighter than ink, gone by the
        middle. */}
    <section
      aria-labelledby="story-teaser-title"
      data-header-theme="dark"
      className={cx(
        "bg-ink bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_srgb,var(--color-paper)_4%,var(--color-ink))_0%,var(--color-ink)_55%)] text-paper",
        chapterY,
      )}
    >
      <Container>
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
            <div>
              <p className={cx(labelClass, "text-paper/70")}>Our story</p>
              <StoryHeadline id="story-teaser-title" lines={story.headline} accent={story.headlineAccent} className="mt-4" />
              <p className="mt-6 max-w-[38rem] text-pretty text-lg leading-relaxed text-paper/70">{story.summary}</p>
            </div>
            <InteractiveHoverButton
              href={aboutLink.href}
              transitionTypes={[STORY_OPEN]}
              text="Read our full story"
              size="lg"
              variant="ghostLight"
              // From lg it spans the header's Get a quote + Apply now pair, edge to edge (owner, 2026-09-28) — the
              // from xl the header pair is a fixed width (`--width-header-cta` in app/globals.css); below xl it sizes to its
              // labels, which measured 16.2rem at 1100px.
              className="w-full sm:w-72 lg:w-[16.2rem] xl:w-[calc(2*var(--width-header-cta)+0.75rem)]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <StoryRoute milestones={story.milestones} />
        </Reveal>
      </Container>
    </section>
    </ViewTransition>
  );
}
