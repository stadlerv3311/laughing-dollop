import type { Metadata } from "next";
import { ViewTransition } from "react";
import { SplitCard, StoryLine } from "@/components/about";
import { StoryHeadline } from "@/components/home/StoryHeadline";
import { Container, Reveal } from "@/components/ui";
import { applyLink, quoteLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

export const metadata: Metadata = { title: "About" };

/**
 * About page. The opening is the headline and the lede on white, set like the homepage's story band (owner,
 * 2026-10-06: "remove black band on about screen. and make the text look like on the main screen"); until then it was
 * the owner's "B" (2026-10-01), a dark band. Then the story down one line with a dot for each stop and one picture
 * frame to a chapter (owner, same day, from a second sketch: StoryLine; nothing in it stands still since later that
 * day), which took the place of the pinned route
 * (StoryChapters, from the first sketch), itself after the short story row and the sideways timeline (2026-09-25), and
 * the two
 * cards, shippers and careers (2026-09-28). The headline is "The map got bigger. The rule didn't." (owner,
 * 2026-09-28). The six titled story blocks and the facts row came out on 2026-10-01. What follows the opening is still
 * open: the owner wants two screens in all. Copy and timeline are in lib/story.ts (draft).
 */
export default function AboutPage() {
  return (
    <>
      {/*
        The opening, on white since 2026-10-06 (owner: no black band, and the text like the homepage's). It's the
        homepage story band's heading as it is there (StoryTeaser): centred, in Geist, both lines full ink, 64px from
        laptops, "rule" lighting orange once the line has landed, and no label over it. The lede sits where the band
        has the rule, in the same small ink line. The ink with its depth and the orange outline star (HalfStar) went
        with the black, as they did on the homepage. Still what the homepage band morphs into from "Read our full
        story". The site's step under the lede, then the story's first picture.
      */}
      <section aria-labelledby="about-heading">
        <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
          {/* The top space puts the headline's letters one site step (64px on phones, 70px from `sm`) under the
              header's buttons (owner, 2026-10-06: "fix the spacing"; it was 92, 109 and 114px at phone, tablet and
              laptop widths, the dark band's space, which read as a hole once the band was white). */}
          <div className="bg-paper pt-[7.25rem] pb-16 text-center sm:pt-[7.5625rem] sm:pb-[4.375rem] lg:pt-[7.25rem]">
            <Container>
              <StoryHeadline
                as="h1"
                id="about-heading"
                lines={story.headline}
                accent={story.headlineAccent}
                light
                solid
                large
                sans
              />
              <p className="mx-auto mt-[2.0625rem] max-w-[36rem] text-balance text-[0.9375rem] leading-snug text-ink sm:text-[1.0625rem]">
                {story.lede}
              </p>
            </Container>
          </div>
        </ViewTransition>
      </section>

      {/* The story down one line: a dot for each stop, a picture frame for each chapter, sides swapping (StoryLine). */}
      {story.timeline.length > 0 && <StoryLine entries={story.timeline} landing />}

      {/* The close, on a black band since 2026-10-07 (owner, a red box drawn round the two cards from one edge of the
          screen to the other: "i want this in a black band. to balance black in the middle. but it doesnt need an
          full page band"): the story's second chapter is on black, so the page now goes white, black, white, black
          and ends on the white footer. It's as tall as the cards and its own space, not a screen like the homepage's
          black bands, with the story band's space inside it (100px from `lg`, the site's step below). The header
          goes light over it. On white until then. */}
      <section aria-label="Ship or drive with us" data-header-theme="dark" className="bg-ink py-16 sm:py-[4.375rem] lg:py-[6.25rem]">
        <Container>
          {/*
            One door for each audience (2026-09-28, from the Samsara review), side by side from lg: shippers and jobs.
            Each card is cut on a slant, white above and black below, the two mirrored, with the underlined arrow
            link under its words and a road in its black wedge (owner, 2026-10-07: SplitCard). Until then a white card and an outlined black one,
            each with a pill; square corners since earlier the same day.
          */}
          <Reveal className="grid gap-4 lg:grid-cols-2">
            <SplitCard
              title="Have a load to move?"
              text="Tell us where it’s going and what it weighs, and we’ll come back with a price."
              link={quoteLink}
            />
            <SplitCard
              title="Come work with us."
              text="On the road, in the office or in the shop. Answer a few short questions, and HR calls you back."
              link={applyLink}
              flip
            />
          </Reveal>
        </Container>
      </section>
      {/* From `lg` the band's lower edge gets what its upper edge has: 100px of black under the cards and 100px of
          white over the footer's labels (owner, 2026-10-07: "and the same on the footer"). The footer brings 70px of
          its own on every page, so this adds the other 30. Below `lg` the band's step and the footer's already match. */}
      <div aria-hidden className="hidden h-[1.875rem] bg-paper lg:block" />
    </>
  );
}
