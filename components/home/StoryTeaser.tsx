import { ViewTransition } from "react";
import { Container, InteractiveHoverButton, Reveal, chapterHeadingClass, chapterY, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { aboutLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

/**
 * Homepage band with the short company story — the page's one dark passage, edge to edge rather than a card
 * floating in white. It sits between Ship with us and the driver slogans — the hinge between the shipper and
 * driver halves (moved up from the end of the page 2026-09-24).
 *
 * Layout "2c" (owner's pick from three mock-ups, 2026-09-25): the headline and summary on the left with Read our
 * full story on the right, then a hairline and the three milestones as big marks — 1, DOT, 48 — set like the
 * numbers band near the top of the page. Orange only on the marks (the logo's `brand`), never on the button: it's
 * the site's thin white ring (DECISIONS.md → Brand orange). Only Read our full story links to About.
 */
export function StoryTeaser() {
  return (
    // Shares its name with the About page's dark opening: following "Read our full story" morphs this band up
    // into it (2026-09-24). Only that link's `story-open` navigation plays it — see STORY_BAND in lib/story.ts.
    <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
    <section aria-labelledby="story-teaser-title" data-header-theme="dark" className={cx("bg-ink text-paper", chapterY)}>
      <Container>
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
            <div>
              <p className={cx(labelClass, "text-paper/70")}>Our story</p>
              <h2
                id="story-teaser-title"
                className={cx("mt-4", chapterHeadingClass)}
              >
                {story.headline.map((line) => (
                  <span key={line} className="block text-balance">
                    {line}
                  </span>
                ))}
              </h2>
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
          <ol className="mt-14 grid gap-12 border-t border-paper/15 pt-12 sm:mt-20 sm:grid-cols-3 sm:gap-10 sm:pt-14">
            {story.milestones.map((milestone) => (
              <li key={milestone.title}>
                <p
                  aria-hidden
                  className={cx(
                    "text-[4.5rem] font-medium leading-[0.9] tracking-[-0.06em] sm:text-[clamp(4rem,8vw,7.5rem)]",
                    milestone.accent ? "text-brand" : "text-paper",
                  )}
                >
                  {milestone.mark}
                </p>
                <h3 className="mt-6 text-sm text-paper/70">{milestone.title}</h3>
                <p className="mt-2 max-w-[20rem] text-pretty leading-relaxed">{milestone.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
    </ViewTransition>
  );
}
