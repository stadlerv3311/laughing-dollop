import Link from "next/link";
import { Fragment, ViewTransition } from "react";
import { Container, FlyArrow, Reveal, RiseLabel } from "@/components/ui";
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
 * full story on the right, then the milestones (now 1, 70+, 48) as a short route that draws itself (StoryRoute,
 * 2026-09-29: white marks at a light weight, orange only on the rider and the last stop; until then the marks were
 * 115px with two in orange). The link was the site's solid black button from 2026-10-02 (owner: make the call to action
 * more evident; it was a thin white ring on the ink) and is a text link since 2026-10-05. Only Read our full story links to About.
 *
 * Half the logo's star in orange sat behind it on the ink (owner's pick "B" of four mock-ups, 2026-09-30); it went with
 * the black on 2026-10-02, as the safety band's did — on white it read as a pink blot.
 */
export function StoryTeaser() {
  return (
    // Shares its name with the About page's opening: following "Read our full story" morphs this band up
    // into it (2026-09-24). Only that link's `story-open` navigation plays it — see STORY_BAND in lib/story.ts.
    <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
    <section
      aria-labelledby="story-teaser-title"
      // About's section for the header's filling line (Header → `data-nav-section`).
      data-nav-section={aboutLink.href}
      // No bottom space of its own since it went white (2026-10-02): Why work with us follows on the same white, and its
      // top space alone keeps them apart — both together left about 256px of blank page. The top space is 70px from
      // tablets up since the same day (owner: move it up to about 70px; it had the chapter openers' 128px), the same as
      // the safety band's bottom space. Since 2026-10-05 it's set so the headline's ink sits as far under the dark band
      // as "Tracked trucks." sits under the hero (owner: "space out so the distances are equal"; 85, 102 and 120px at
      // phone, tablet and laptop widths — it was 96 under the dark band at 1440). Geist's capitals sit a hair lower
      // than Archivo's, hence 63/79/94 rather than the safety band's 64/80/96.
      className="relative isolate overflow-hidden bg-paper pt-[3.9375rem] text-ink sm:pt-[4.9375rem] lg:pt-[5.875rem]"
    >
      <Container>
        <Reveal>
          {/* Centred since 2026-10-02 (owner), like the safety band, the numbers and Ship with us above it, with the
              link under the rule instead of on the right. */}
          <div className="flex flex-col items-center text-center">
            <div>
              {/* In Geist, not the Archivo headline face, since 2026-10-05 (owner: "change it to geist"); the About page's
                  copy of it follows since 2026-10-06. No "Our story" label over it since 2026-10-02 (owner: remove), like the safety band. Both lines full ink, like the safety band's heading (owner, 2026-10-02: the grey looked washed out);
                  "rule" still lights orange. */}
              <StoryHeadline
                id="story-teaser-title"
                lines={story.headline}
                accent={story.headlineAccent}
                light
                solid
                large
                sans
              />
              {/* The rule on its own in full ink (owner, 2026-10-02: the orange "rule" asked "what rule?" and the answer
                  was lost in the grey paragraph), so the eye goes from the orange word straight to what it is. Straight
                  under the headline and toned down to 18/20px since 2026-10-05 (owner: cleaner; the grey setup line over
                  it went and it was 24px). Regular weight, not semibold, since the same day (owner: "remove bold"), and 3px smaller again (15/17px). In Geist, like the milestone lines under it, since the same day too (owner:
                  "change its shrift"; it was Archivo). The margins here and on the link (and the route's) give three even 48px
                  gaps from ink to ink — headline to rule, rule to link, link's underline to the road (owner, same day: "even
                  out the spacing"; they were 39, 42 and 80px at 1440). The road then came down 10px, to 58. */}
              <p className="mx-auto mt-[2.0625rem] text-balance font-normal text-[0.9375rem] leading-snug text-ink sm:text-[1.0625rem]">
                {/* Each part kept whole, so a narrow screen breaks between them, never inside one. */}
                {story.rule.map((part, i) => (
                  <Fragment key={part}>
                    {i > 0 && " "}
                    <span className="inline-block">{part}</span>
                  </Fragment>
                ))}
              </p>
            </div>
            {/* A text link in the safety band's Get a quote style since 2026-10-05 (owner: "make this button in get a
                quote style"; it was the solid black pill): underlined label and a small arrow, with the shared link hover
                (words roll, arrow flies through). 20px, 3px over the safety band's (owner, same day). */}
            <Link
              href={aboutLink.href}
              transitionTypes={[STORY_OPEN]}
              className="group mt-[2.375rem] inline-flex items-center gap-1.5 text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <RiseLabel>Read our full story</RiseLabel>
              <FlyArrow className="size-3.5" />
            </Link>
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
