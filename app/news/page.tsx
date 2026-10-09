import type { Metadata } from "next";
import { NewsRow } from "@/components/news";
import { Container, PageOpening, PagePlaceholder, PictureStage, Reveal, sectionBottom, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, newsHref, visibleNewsPosts } from "@/lib/news";

export const metadata: Metadata = { title: "News" };

/** How many of the newest posts share the stage; the rest are the list under it. */
const STAGED = 3;

/**
 * The news page (the builder, 2026-10-09, on a picture of the Services page's stage: "use te shame solution on news
 * screen. all news after that are just a list"): the three newest posts on the Services page's stage (PictureStage),
 * one big with its picture and its day, headline and sentence on a white panel in the picture's corner, and the three
 * as smaller cards under it, each going up to the stage when it is chosen. Every older post is a line of the list
 * under that, "Earlier" (NewsRow): a day, a headline and a sentence, no picture.
 *
 * Every post opens its own page (the builder, the same day: "if you press on article it opens the article page"):
 * the post on the stage when the stage is pressed, under a Read article link, and a line of the list when the line is
 * pressed (app/news/[slug]/page.tsx). The small cards under the stage still only choose who has it.
 *
 * Before that (owner, 2026-10-07) the newest post was big on a black panel, the next four a row each with the picture
 * changing sides, and the rest behind a See more link. The list is open now: it is all that follows the stage.
 *
 * The posts come from lib/news.ts. While they are all unconfirmed drafts a production build has none to show, and the page
 * stays the "being built" placeholder it was.
 *
 * No line under the heading (owner, 2026-10-07, crossed out on a screenshot): the posts say what the page is.
 *
 * It closes on the hairline the homepage's news block closes on, so the posts don't run into the footer.
 */
export default function NewsPage() {
  const posts = visibleNewsPosts();
  const staged = posts.slice(0, STAGED);
  const earlier = posts.slice(STAGED);

  if (staged.length === 0) {
    return <PagePlaceholder title="News" description="This page is being built. Company news and updates will go here." />;
  }

  return (
    <section aria-labelledby="news-heading">
      <PageOpening id="news-heading" lines={["News"]} />
      <Container>
        <div className={cx("mt-16 border-b border-ink/10 sm:mt-[4.375rem]", sectionBottom)}>
          <Reveal>
            <PictureStage
              headlines
              linkLabel="Read article"
              items={staged.map((post) => ({
                id: post.slug,
                href: newsHref(post),
                name: post.title,
                detail: post.summary,
                label: <time dateTime={post.date}>{formatNewsDate(post.date)}</time>,
                image: post.image ? { src: post.image } : undefined,
              }))}
            />
          </Reveal>
          {earlier.length > 0 && (
            // The distance between blocks, as under the Services page's stage. The last line's own space below it
            // adds to the space above the closing hairline.
            <Reveal className="pt-[4.5rem] sm:pt-[5.5rem] lg:pt-[6.5625rem]">
              <h2 className={sectionHeadingClass}>Earlier</h2>
              <ul className="mt-7 lg:mt-10">
                {earlier.map((post) => (
                  <li key={post.slug}>
                    <NewsRow post={post} />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
