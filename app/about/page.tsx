import type { Metadata } from "next";
import { ViewTransition } from "react";
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
 * a thin facts row, the story in a speaking voice, a thin timeline, and a closing line with the CTAs. The headline is "The map got bigger. The rule didn't." (owner,
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
      <section data-header-theme="dark" className="bg-ink pb-20 pt-36 text-paper sm:pb-24 sm:pt-44">
        <Container>
          <Reveal>
            <p className={cx(labelClass, "text-paper/70")}>About</p>
            <h1 className="mt-4 text-[2.75rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[5rem]">
              {/* One line each, as the owner set it; they wrap on their own only on narrow phones. */}
              {story.headline.map((line) => (
                <span key={line} className="block text-balance">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-paper/70">{story.lede}</p>
          </Reveal>
        </Container>
      </section>
      </ViewTransition>

      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 border-b border-ink/12 lg:grid-cols-4">
            {story.facts.map((fact, i) => (
              <div
                key={fact.label}
                className={cx(
                  "py-5 pr-4",
                  i % 2 === 1 && "border-l border-ink/12 pl-4 sm:pl-6",
                  i >= 2 && "border-t border-ink/12 lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-6",
                )}
              >
                <dt className="text-sm text-ink/70">{fact.label}</dt>
                <dd className="mt-1.5 text-lg font-medium leading-snug tracking-[-0.015em]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <section aria-labelledby="about-story" className={cx(splitClass, "pt-24 sm:pt-32")}>
          <Reveal>
            <h2 id="about-story" className={sideLabelClass}>
              Our story
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="max-w-[36rem] space-y-5 text-lg leading-[1.75] text-ink/70">
            {story.paragraphs.map((paragraph, i) => (
              <p key={paragraph} className={cx(i === 0 && "text-ink")}>
                {paragraph}
              </p>
            ))}
          </Reveal>
        </section>

        {story.timeline.length > 0 && (
          <section aria-labelledby="about-timeline" className={cx(splitClass, "pt-20 sm:pt-28")}>
            <Reveal>
              <h2 id="about-timeline" className={sideLabelClass}>
                Timeline
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              {/* Same vertical hairline and orange dots as the homepage story band's timeline. */}
              <ol className="max-w-[36rem] space-y-7 border-l border-ink/15 pl-8 leading-relaxed">
                {story.timeline.map((entry) => (
                  <li key={entry.year} className="relative flex gap-6">
                    <span
                      aria-hidden
                      className="absolute -left-[calc(2rem+5.5px)] top-2 size-2.5 rounded-full bg-brand ring-4 ring-paper"
                    />
                    <span className="w-12 shrink-0 font-medium tabular-nums">{entry.year}</span>
                    <span className="text-ink/70">
                      <span className="font-medium text-ink">{entry.title}</span> {entry.text}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>
        )}
      </Container>

      {/* The close, on white now that the dark band is at the top: a hairline, where it started, and the two CTAs. */}
      <section aria-labelledby="about-closing" className="mt-20 pb-24 sm:mt-28 sm:pb-32">
        <Container>
          <Reveal className="border-t border-ink/12 pt-20 sm:pt-24">
            <h2
              id="about-closing"
              className="max-w-[18ch] text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]"
            >
              {story.origin}
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <InteractiveHoverButton href={quoteLink.href} text={quoteLink.label} size="lg" variant="ink" className="sm:w-48" />
              <InteractiveHoverButton href={applyLink.href} text={applyLink.label} size="lg" variant="ghostDark" className="sm:w-48" />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
