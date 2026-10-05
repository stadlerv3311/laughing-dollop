import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import { Timeline } from "@/components/about";
import { StoryHeadline } from "@/components/home/StoryHeadline";
import { Container, HalfStar, InteractiveHoverButton, Reveal, inkDepthClass, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, quoteLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

export const metadata: Metadata = { title: "About" };

/** Quiet label on the close's cards. */
const sideLabelClass = cx(labelClass, "text-ink/70");

/**
 * About page. The opening is the owner's "B" (2026-10-01): the safety band's dark look with one picture across the
 * edge where the black turns white, and the story in a few lines beside it. Then the sideways timeline (2026-09-25) and
 * the two cards, shippers and careers (2026-09-28). The headline is "The map got bigger. The rule didn't." (owner,
 * 2026-09-28). The six titled story blocks and the facts row came out on 2026-10-01. What follows the opening is still
 * open: the owner wants two screens in all. Copy and timeline are in lib/story.ts (draft).
 */
export default function AboutPage() {
  return (
    <>
      {/*
        The opening (owner's "B", 2026-10-01, from mock-ups after a Mobbin pass): the safety band's look — the ink with
        its depth, the orange outline star, the two-tone heading rising in — then one picture that sits across the
        edge where the black turns white, about a third of the way down it, with the short story beside it on the
        white. The black block alone is marked dark for the header, and it's what the homepage story band morphs into
        from "Read our full story".
      */}
      <section aria-labelledby="about-heading">
        <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
          <div
            data-header-theme="dark"
            className={cx(
              "relative isolate overflow-hidden bg-ink pt-36 text-paper sm:pt-40",
              inkDepthClass,
              // Room under the lede, plus what the picture overlaps: 30% of its height — about a fifth of the
              // screen's width while it runs full width, 8rem beside the story from lg.
              "pb-[calc(3.5rem+20vw)] lg:pb-[calc(3.5rem+8rem)]",
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

        <Container className="relative -mt-[20vw] lg:-mt-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
            {/* An AI-made stand-in (owner's generated pictures, 2026-10-01) — no caption, so nothing reads it as a
                photo from our history. */}
            <Reveal className="relative aspect-[3/2] overflow-hidden bg-ink lg:col-span-7 lg:aspect-[680/430]">
              <Image
                src="/images/about-truck-front.jpg"
                alt="A white ITrucking truck and trailer on a desert highway"
                fill
                priority
                sizes="(min-width: 75rem) 42rem, (min-width: 64rem) 58vw, 100vw"
                className="object-cover object-[58%_center]"
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5 lg:self-end lg:pl-10">
              <h2 className="font-display font-semibold text-[1.75rem] leading-[1.12] tracking-[-0.03em]">{story.origin}</h2>
              <p className="mt-4 max-w-[26rem] text-pretty leading-relaxed text-ink/70">{story.opening}</p>
              <a
                href="#about-timeline"
                className="mt-6 inline-block border-b border-ink/50 pb-0.5 font-medium transition-colors duration-300 hover:border-ink"
              >
                How we got here
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Full-bleed, so the strip can run past the Container's edges as it slides (components/about/Timeline.tsx). */}
      {story.timeline.length > 0 && <Timeline entries={story.timeline} />}

      {/* The close, on white: one door for each audience. Its line "It started with one truck." moved up beside the
          opening's picture (2026-10-01), so the cards close the page on their own; the timeline's own bottom space
          keeps them apart from it. */}
      <section aria-label="Ship or drive with us" className="pb-24 sm:pb-32">
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
