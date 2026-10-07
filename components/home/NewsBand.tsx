import Link from "next/link";
import { Container, FlyArrow, Reveal, RiseLabel, labelClass, sectionHeadingClass, sectionTop } from "@/components/ui";
import { cx } from "@/lib/cx";
import { visibleNewsPosts } from "@/lib/news";
import { newsLink } from "@/lib/site";

/** How many posts the homepage shows. */
const SHOWN = 3;

const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * The homepage's news block, between the Apply band and the footer (owner, 2026-10-07: "lets add news block in between
 * footer and work with us"). On white, so the page ends black (the ask), white (news), white (footer): the heading with
 * All news beside it, then the three newest posts as square grey cards, which is what keeps the block apart from the
 * footer's lists of links on the same white. Each card has the day, the headline and a sentence or two. The cards
 * don't link anywhere: there are no pages for single posts yet, and only All news goes to /news.
 *
 * Grey and black only. The posts are in lib/news.ts and are SAMPLES for now, so the block shows while developing and
 * renders nothing in a production build until there is a real post (see `visibleNewsPosts`).
 *
 * The space under the cards and the footer's own top space add up to one section step (64, 80, 96px), the same as
 * the space over the heading.
 */
export function NewsBand() {
  const posts = visibleNewsPosts().slice(0, SHOWN);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="news-title" className={cx("bg-paper pb-0 text-ink sm:pb-2.5 lg:pb-[1.625rem]", sectionTop)}>
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 id="news-title" className={sectionHeadingClass}>
            News
          </h2>
          <Link
            href={newsLink.href}
            className="group inline-flex items-center gap-1.5 text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <RiseLabel>All news</RiseLabel>
            <FlyArrow className="size-3.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 lg:mt-12">
          <ul className="grid gap-4 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={`${post.date}-${post.title}`} className="flex">
                <article className="flex w-full flex-col bg-cloud p-8 lg:min-h-[19rem]">
                  <time dateTime={post.date} className={cx(labelClass, "text-ink/70")}>
                    {day.format(new Date(`${post.date}T00:00:00Z`))}
                  </time>
                  {/* From `lg`, three across, the words sit at the card's foot, so cards of different lengths line up along
                      the bottom. Narrower than that the cards stack, each as tall as its words. */}
                  <h3 className="mt-10 font-display text-2xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance lg:mt-auto lg:pt-10">
                    {post.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-pretty text-ink/70">{post.summary}</p>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
