import type { Metadata } from "next";
import { NewsLead, NewsMore, NewsRow, NewsZigzag } from "@/components/news";
import { Container, PageOpening, PagePlaceholder, Reveal, sectionBottom } from "@/components/ui";
import { cx } from "@/lib/cx";
import { visibleNewsPosts } from "@/lib/news";

export const metadata: Metadata = { title: "News" };

/** How many posts show with their pictures under the newest one, a row each; any older than that wait behind See more. */
const CARDS = 4;

/**
 * The news page (owner, 2026-10-07, picking from three mock-ups: "lets do B combine with C combine. Latest big and
 * next smaller"): the newest post big on a black panel, the next four under it a row each, the picture changing sides
 * from row to row, on the page's white (NewsZigzag, which tells how it got there the same day: six grey cards, a
 * bento, no grey, four small in a row, then this).
 * Any older than those sit behind a See more pill under the cards, which opens them as a list of lines, "Earlier"
 * (owner, same day: "lets add se more here. and use list after pressing see more"). So the page steps down in three
 * sizes, and stays short however many posts there are. Every post is read here in full, a date, a headline and a sentence or two; there are no pages for single posts.
 *
 * The posts come from lib/news.ts. While they are all unconfirmed drafts a production build has none to show, and the page
 * stays the "being built" placeholder it was.
 *
 * No line under the heading (owner, same day, crossed out on a screenshot): the posts say what the page is.
 *
 * It closes on the hairline the homepage's news block closes on, so the posts don't run into the footer.
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
      <PageOpening id="news-heading" lines={["News"]} />
      <Container>
        <div className={cx("mt-16 border-b border-ink/10 sm:mt-[4.375rem]", sectionBottom)}>
          <Reveal>
            <NewsLead post={latest} />
          </Reveal>
          {cards.length > 0 && (
            <Reveal delay={0.1} className="mt-8 sm:mt-10 lg:mt-12">
              <NewsZigzag posts={cards} />
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
