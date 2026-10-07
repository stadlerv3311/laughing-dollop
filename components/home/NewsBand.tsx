import Link from "next/link";
import { NewsCard } from "@/components/news";
import { Container, FlyArrow, Reveal, RiseLabel, sectionBottom, sectionHeadingClass, sectionTop } from "@/components/ui";
import { cx } from "@/lib/cx";
import { visibleNewsPosts } from "@/lib/news";
import { newsLink } from "@/lib/site";

/** How many posts the homepage shows. */
const SHOWN = 3;

/**
 * The homepage's news block, between the Apply band and the footer (owner, 2026-10-07: "lets add news block in between
 * footer and work with us"). On white, so the page ends black (the ask), white (news), white (footer): the heading with
 * All news beside it, then the three newest posts as square grey cards, which is what keeps the block apart from the
 * footer's lists of links on the same white. Each card (NewsCard, shared with the news page) has the day, the headline
 * and a sentence or two. The cards don't link anywhere: there are no pages for single posts, and only All news goes
 * to /news, where every post is listed.
 *
 * Grey and black only. The posts are in lib/news.ts and are SAMPLES for now, so the block shows while developing and
 * renders nothing in a production build until there is a real post (see `visibleNewsPosts`).
 *
 * A hairline closes the block, the footer's own rule (the one over its logo row), so the news and the footer read as
 * two things (owner, 2026-10-07, on a screenshot of the two running together: "we need to divide somehow footer from
 * news section"). A section step (64, 80, 96px) sits between the cards and the line, the same as over the heading;
 * the footer's own top space follows it.
 */
export function NewsBand() {
  const posts = visibleNewsPosts().slice(0, SHOWN);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="news-title" className={cx("bg-paper text-ink", sectionTop)}>
      <Container>
        <div className={cx("border-b border-ink/10", sectionBottom)}>
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
                  <NewsCard post={post} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
