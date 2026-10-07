import type { Metadata } from "next";
import { NewsCard, NewsLead, NewsMore, NewsRow } from "@/components/news";
import { Container, PageOpening, PagePlaceholder, Reveal, sectionBottom } from "@/components/ui";
import { cx } from "@/lib/cx";
import { visibleNewsPosts } from "@/lib/news";

export const metadata: Metadata = { title: "News" };

/** How many posts show as cards under the newest one (two rows of three); any older than that wait behind See more. */
const CARDS = 6;

/** One or two older posts fill the row; from three on they go three across. Written out so Tailwind sees each class. */
const columns = ["", "", "lg:grid-cols-2", "lg:grid-cols-3"];

/**
 * The news page (owner, 2026-10-07, picking from three mock-ups: "lets do B combine with C combine. Latest big and
 * next smaller"): the newest post big on a black panel, the next six under it as the homepage block's grey cards.
 * Any older than those sit behind a See more pill under the cards, which opens them as a list of lines, "Earlier"
 * (owner, same day: "lets add se more here. and use list after pressing see more"). So the page steps down in three
 * sizes, and stays short however many posts there are. Every post is read here in full, a date, a headline and a sentence or two; there are no pages for single posts.
 *
 * The posts come from lib/news.ts. While they are all samples a production build has none to show, and the page
 * stays the "being built" placeholder it was.
 *
 * It closes on the hairline the homepage's news block closes on, so the grey cards don't run into the footer.
 */
export default function NewsPage() {
  const [latest, ...older] = visibleNewsPosts();
  const cards = older.slice(0, CARDS);
  const earlier = older.slice(CARDS);

  if (!latest) {
    return <PagePlaceholder title="News" description="This page is being built. Company news and updates will go here." />;
  }

  return (
    <section aria-labelledby="news-heading">
      <PageOpening id="news-heading" lines={["News"]} lede="What's new at ITrucking Solutions." />
      <Container>
        <div className={cx("mt-16 border-b border-ink/10 sm:mt-[4.375rem]", sectionBottom)}>
          <Reveal>
            <NewsLead post={latest} />
          </Reveal>
          {cards.length > 0 && (
            <Reveal delay={0.1} className="mt-4">
              <ul className={cx("grid gap-4", columns[Math.min(cards.length, 3)])}>
                {cards.map((post) => (
                  <li key={`${post.date}-${post.title}`} className="flex">
                    <NewsCard post={post} as="h2" />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {earlier.length > 0 && (
            <NewsMore>
              <ul>
                {earlier.map((post) => (
                  <li key={`${post.date}-${post.title}`}>
                    <NewsRow post={post} />
                  </li>
                ))}
              </ul>
            </NewsMore>
          )}
        </div>
      </Container>
    </section>
  );
}
