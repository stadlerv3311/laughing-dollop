import type { Metadata } from "next";
import { ViewTransition } from "react";
import { StoryChapters } from "@/components/about";
import { StoryHeadline } from "@/components/home/StoryHeadline";
import { Container, HalfStar, InteractiveHoverButton, Reveal, inkDepthClass, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, quoteLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

export const metadata: Metadata = { title: "About" };

/** Quiet label on the close's cards. */
const sideLabelClass = cx(labelClass, "text-ink/70");

/**
 * About page. The opening is the owner's "B" (2026-10-01) without its picture (owner, 2026-10-06: "remove the picture
 * from here"): the safety band's dark look. Then the story as a route you scroll (owner, same day, from a sketch:
 * StoryChapters), which took the place of the short story row and the sideways timeline (2026-09-25), and the two
 * cards, shippers and careers (2026-09-28). The headline is "The map got bigger. The rule didn't." (owner,
 * 2026-09-28). The six titled story blocks and the facts row came out on 2026-10-01. What follows the opening is still
 * open: the owner wants two screens in all. Copy and timeline are in lib/story.ts (draft).
 */
export default function AboutPage() {
  return (
    <>
      {/*
        The opening (owner's "B", 2026-10-01, from mock-ups after a Mobbin pass): the safety band's look — the ink with
        its depth, the orange outline star, the two-tone heading rising in. Until 2026-10-06 one picture
        (about-truck-front.jpg, an AI stand-in) sat across the edge where the black turns white, with the short story
        beside it; the owner took the picture out, and the route under the band tells the story now. The black block
        alone is marked dark for the header, and it's what the homepage story band morphs into from "Read our full
        story".
      */}
      <section aria-labelledby="about-heading">
        <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
          <div
            data-header-theme="dark"
            className={cx(
              // The site's step under the lede: 64px on phones, 70px from `sm`.
              "relative isolate overflow-hidden bg-ink pt-36 pb-16 text-paper sm:pt-40 sm:pb-[4.375rem]",
              inkDepthClass,
            )}
          >
            <HalfStar />
            <Container>
              <p className={cx(labelClass, "text-paper/70")}>About</p>
              <StoryHeadline as="h1" id="about-heading" lines={story.headline} className="mt-4" />
              <p className="mt-6 max-w-[38rem] text-pretty text-lg leading-relaxed text-paper/70">{story.lede}</p>
            </Container>
          </div>
        </ViewTransition>
      </section>

      {/* The story as a route: pinned pictures, scrolling words and a line between them (StoryChapters). */}
      {story.timeline.length > 0 && <StoryChapters entries={story.timeline} />}

      {/* The close, on white: one door for each audience, the site's step under the route's last stop. */}
      <section aria-label="Ship or drive with us" className="pt-16 pb-24 sm:pt-[4.375rem] sm:pb-32">
        <Container>
          {/*
            One door for each audience (2026-09-28, from the Samsara review): shippers on white, jobs on ink, side by
            side from md. It used to be the two buttons in a row, with nothing saying who each was for.
          */}
          <Reveal className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-ink/10 p-8 sm:p-10">
              <p className={sideLabelClass}>Shippers</p>
              <h3 className="mt-3 font-display font-semibold text-[1.75rem] leading-[1.1] tracking-[-0.03em] sm:text-4xl">Have a load to move?</h3>
              <p className="mt-4 max-w-[24rem] text-pretty leading-relaxed text-ink/70">
                Tell us where it&rsquo;s going and what it weighs, and we&rsquo;ll come back with a price.
              </p>
              {/* Pinned to the card's foot, so the two buttons line up whatever the copy above them runs to. */}
              <div className="mt-10 md:mt-auto md:pt-12">
                <InteractiveHoverButton href={quoteLink.href} text={quoteLink.label} size="lg" variant="ink" className="w-full sm:w-56" />
              </div>
            </div>
            <div className="flex flex-col rounded-3xl bg-ink p-8 text-paper sm:p-10">
              <p className={cx(labelClass, "text-paper/70")}>Careers</p>
              <h3 className="mt-3 font-display font-semibold text-[1.75rem] leading-[1.1] tracking-[-0.03em] sm:text-4xl">Come work with us.</h3>
              <p className="mt-4 max-w-[24rem] text-pretty leading-relaxed text-paper/70">
                On the road, in the office or in the shop. Answer a few short questions, and HR calls you back.
              </p>
              <div className="mt-10 md:mt-auto md:pt-12">
                <InteractiveHoverButton href={applyLink.href} text={applyLink.label} size="lg" variant="ghostLight" className="w-full sm:w-56" />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
