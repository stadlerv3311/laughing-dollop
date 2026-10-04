import { Fragment, ViewTransition } from "react";
import { Container, InteractiveHoverButton, Reveal } from "@/components/ui";
import { aboutLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";
import { StoryHeadline } from "./StoryHeadline";
import { StoryRoute } from "./StoryRoute";

/**
 * Homepage band with the short company story, edge to edge rather than a card floating in white. On white since
 * 2026-10-02 (owner; it was the page's one dark passage, on ink with a faint light in its top-left corner): Ship with
 * us above it took the black instead. It sits between Ship with us and the driver slogans — the hinge between the shipper and
 * driver halves (moved up from the end of the page 2026-09-24).
 *
 * Layout "2c" (owner's pick from three mock-ups, 2026-09-25): the headline and summary on the left with Read our
 * full story on the right, then the three milestones — 1, DOT, 48 — as a short route that draws itself (StoryRoute,
 * 2026-09-29: white marks at a light weight, orange only on the rider and the last stop; until then the marks were
 * 115px with two in orange). The button is the site's solid black one since 2026-10-02 (owner: make the call to action
 * more evident; it was a thin white ring on the ink). Only Read our full story links to About.
 *
 * Half the logo's star in orange sat behind it on the ink (owner's pick "B" of four mock-ups, 2026-09-30); it went with
 * the black on 2026-10-02, as the safety band's did — on white it read as a pink blot.
 */
export function StoryTeaser() {
  return (
    // Shares its name with the About page's dark opening: following "Read our full story" morphs this band up
    // into it (2026-09-24). Only that link's `story-open` navigation plays it — see STORY_BAND in lib/story.ts.
    <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
    <section
      aria-labelledby="story-teaser-title"
      // No bottom space of its own since it went white (2026-10-02): Why work with us follows on the same white, and its
      // top space alone keeps them apart — both together left about 256px of blank page. The top space is 70px from
      // tablets up since the same day (owner: move it up to about 70px; it had the chapter openers' 128px), the same as
      // the safety band's bottom space.
      className="relative isolate overflow-hidden bg-paper pt-16 text-ink sm:pt-[4.375rem]"
    >
      <Container>
        <Reveal>
          {/* Centred since 2026-10-02 (owner), like the safety band, the numbers and Ship with us above it, with the
              button under the summary instead of on the right. */}
          <div className="flex flex-col items-center text-center">
            <div>
              {/* No "Our story" label over it since 2026-10-02 (owner: remove), like the safety band. Both lines full ink, like the safety band's heading (owner, 2026-10-02: the grey looked washed out);
                  "rule" still lights orange. */}
              <StoryHeadline
                id="story-teaser-title"
                lines={story.headline}
                accent={story.headlineAccent}
                light
                solid
                large
              />
              <p className="mx-auto mt-6 max-w-[38rem] text-pretty text-lg leading-relaxed text-ink/70">{story.summary}</p>
              {/* The rule on its own, larger and in full ink (owner, 2026-10-02: the orange "rule" asked "what rule?" and the
                  answer was lost in the grey paragraph), so the eye goes from the orange word straight to what it is. */}
              <p className="mx-auto mt-3 text-balance text-xl font-medium leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
                {/* Each part kept whole, so a narrow screen breaks between them, never inside one. */}
                {story.rule.map((part, i) => (
                  <Fragment key={part}>
                    {i > 0 && " "}
                    <span className="inline-block">{part}</span>
                  </Fragment>
                ))}
              </p>
            </div>
            <InteractiveHoverButton
              href={aboutLink.href}
              transitionTypes={[STORY_OPEN]}
              text="Read our full story"
              size="lg"
              variant="ink"
              // From lg it spans the header's Get a quote + Apply now pair, edge to edge (owner, 2026-09-28) — the
              // from xl the header pair is a fixed width (`--width-header-cta` in app/globals.css); below xl it sizes to its
              // labels, which measured 16.2rem at 1100px.
              className="mt-10 w-full sm:w-72 lg:w-[16.2rem] xl:w-[calc(2*var(--width-header-cta)+0.75rem)]"
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
