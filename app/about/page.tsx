import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Timeline } from "@/components/about";
import { Container, InteractiveHoverButton, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, quoteLink } from "@/lib/site";
import { STORY_BAND, STORY_OPEN, story } from "@/lib/story";

export const metadata: Metadata = { title: "About" };

/** Quiet label on the left of the story and timeline: the content leads, not the heading. */
const sideLabelClass = cx(labelClass, "text-ink/70");
/** Label on the left, content across the rest. */
const splitClass = "grid gap-5 md:grid-cols-[1fr_2fr] md:gap-12";

/**
 * About page (2026-09-24, owner chose the beats after an outside review): alternating mass and thin — loud type on dark,
 * the facts row inside it under a hairline, the story as six short titled blocks, the timeline sideways on scroll (2026-09-25), and a closing line over two cards, shippers and careers (2026-09-28). The headline is "The map got bigger. The rule didn't." (owner,
 * 2026-09-28), and the close answers it with where it started. The dark
 * band is the opening (owner, 2026-09-24; it was the close at first). The gaps are uneven on purpose. A photo beat
 * between the facts and the story is left out until a real photo exists. Copy, timeline and facts are in lib/story.ts (draft). Team, fleet and safety
 * record are still to come.
 */
export default function AboutPage() {
  return (
    <>
      {/* The page's one dark mass, at the top (owner, 2026-09-24: moved up from the close). The homepage story
          band morphs into it when you come from its "Read our full story" link. */}
      <ViewTransition name={STORY_BAND} share={{ [STORY_OPEN]: "story-open", default: "none" }} default="none">
      <section data-header-theme="dark" className="bg-ink pb-16 pt-36 text-paper sm:pb-20 sm:pt-44">
        <Container>
          {/* Headline left, lede right on its last line (after Koto on Mobbin, 2026-09-25): the band was all on the
              left with nothing across from it. */}
          <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <p className={cx(labelClass, "text-paper/70")}>About</p>
              <h1 className="mt-4 text-[2.75rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
                {/* One line each, as the owner set it; they wrap on their own only on narrow phones. */}
                {story.headline.map((line) => (
                  <span key={line} className="block text-balance">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            <p className="max-w-[28rem] text-pretty text-lg leading-relaxed text-paper/70 lg:pb-2">{story.lede}</p>
          </Reveal>
          {/* The facts close the dark band under a hairline (after MasterClass and Koto on Mobbin, 2026-09-28) — they
              used to sit alone on the white under it, with empty dark above and empty white below. */}
          <Reveal delay={0.1}>
            <dl className="mt-16 grid grid-cols-2 border-t border-paper/15 sm:mt-20 lg:grid-cols-4">
              {story.facts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={cx(
                    "pt-6 pr-4",
                    i % 2 === 1 && "border-l border-paper/15 pl-4 sm:pl-6",
                    i >= 2 && "mt-6 border-t border-paper/15 lg:mt-0 lg:border-t-0",
                    i === 2 && "lg:border-l lg:pl-6",
                  )}
                >
                  <dt className="text-sm text-paper/60">{fact.label}</dt>
                  <dd className="mt-1.5 text-lg font-medium leading-snug tracking-[-0.015em]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>
      </ViewTransition>

      <Container>
        <section aria-labelledby="about-story" className={cx(splitClass, "pt-20 sm:pt-24")}>
          <Reveal>
            <h2 id="about-story" className={sideLabelClass}>
              Our story
            </h2>
          </Reveal>
          {/* Six short blocks, two across, each under a hairline (after Patreon's and Büro's chapters on Mobbin,
              2026-09-25) — it was one long column of text. */}
          <ol className="grid gap-x-12 gap-y-12 sm:grid-cols-2 sm:gap-y-16">
            {story.chapters.map((chapter, i) => (
              <li key={chapter.title}>
                <Reveal delay={(i % 2) * 0.06} className="border-t border-ink/12 pt-6">
                  <p className="text-sm tabular-nums text-ink/50">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">{chapter.title}</h3>
                  <p className="mt-3 text-pretty leading-[1.75] text-ink/70">{chapter.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

      </Container>

      {/* Full-bleed, so the strip can run past the Container's edges as it slides (components/about/Timeline.tsx). */}
      {story.timeline.length > 0 && <Timeline entries={story.timeline} />}

      {/* The close, on white now that the dark band is at the top: a hairline, where it started, and the two CTAs. */}
      <section aria-labelledby="about-closing" className="pb-24 sm:pb-32">
        <Container>
          <Reveal className="border-t border-ink/12 pt-20 sm:pt-24">
            <h2
              id="about-closing"
              className="max-w-[18ch] text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]"
            >
              {story.origin}
            </h2>
          </Reveal>
          {/*
            One door for each audience (2026-09-28, from the Samsara review): shippers on white, jobs on ink, side by
            side from md. It used to be the two buttons in a row, with nothing saying who each was for.
          */}
          <Reveal delay={0.1} className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-ink/10 p-8 sm:p-10">
              <p className={sideLabelClass}>Shippers</p>
              <h3 className="mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] sm:text-4xl">Have a load to move?</h3>
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
              <h3 className="mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] sm:text-4xl">Come work with us.</h3>
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
