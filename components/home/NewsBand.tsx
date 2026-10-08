import Link from "next/link";
import { NewsCards } from "@/components/news";
import { Container, FlyArrow, Reveal, RiseLabel, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { visibleNewsPosts } from "@/lib/news";
import { newsLink } from "@/lib/site";

/** How many posts the homepage shows. */
const SHOWN = 3;

/**
 * The homepage's news block, straight after the story and before Why work with us (owner, 2026-10-07: "maybe after
 * about us part ?", "about us then news about us work good as one block", "thats works as an good pre history for
 * work with us part"): where we come from, then what is new, then the careers half. It began the same day as the
 * page's last block, between the Apply band and the footer, and read as an afterthought there.
 *
 * The heading centred, like the story's over it and Why work with us's under it, with All news centred under the
 * cards (owner, 2026-10-08, two arrows on a screenshot: the heading from the left to the middle, the link from the
 * right to under the cards). Between them the three newest posts as one row of picture cards that open one at a
 * time, the job cards of Why work with us with the words beside the open picture (NewsCards, which has the owner's drawing in
 * words). One row, so the block is short (owner, same day, of three zigzag rows: "i dont want this to take so much
 * space. maybe give it same thing that this block has ?"). Before it, in order: three grey cards with a picture
 * across the top of each, lines with no pictures ("plain text doesnt work"), three rows with a small picture changing
 * sides. The posts don't link anywhere: there are no pages for single posts, and only All news goes to /news, where
 * every post is listed.
 *
 * The posts are in lib/news.ts and are unconfirmed drafts for now, so the block shows while developing and
 * renders nothing in a production build until there is a real post (see `visibleNewsPosts`).
 *
 * No line over or under it (owner, 2026-10-08: "lets fix distances between blocks also remove divider"; a hairline
 * closed it until then). The gaps are the page's own, measured to the letters: the heading as far under the story's
 * last line as Why work with us's is under this block (120px at laptop width, 102 and 85 narrower, the same top
 * padding as that section), the cards one inner step under the heading's baseline (70px, 64 on phones), All news
 * 48px under the cards, and no padding at the foot, since the next section brings its own 120.
 */
export function NewsBand() {
  const posts = visibleNewsPosts().slice(0, SHOWN);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="news-title" className="bg-paper pt-[4.5rem] text-ink sm:pt-[5.5rem] lg:pt-[6.5625rem]">
      <Container>
        <div>
          <Reveal>
            <h2 id="news-title" className={cx(sectionHeadingClass, "text-center")}>
              News
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-[3.5625rem] sm:mt-[3.8125rem] lg:mt-[3.6875rem]">
            <NewsCards posts={posts} />
          </Reveal>

          <Reveal delay={0.15} className="mt-[2.9375rem] flex justify-center">
            <Link
              href={newsLink.href}
              className="group inline-flex items-center gap-1.5 text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <RiseLabel>All news</RiseLabel>
              <FlyArrow className="size-3.5" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
