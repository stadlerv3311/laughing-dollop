import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/**
 * One news post as a square grey card: the day, the headline and a sentence or two. The homepage's news block shows
 * three of these (NewsBand) and the news page lists every post but the newest this way, under the black one (NewsLead).
 * Grey and black only. A card is not a link: there are no pages for single posts.
 *
 * `as` is the headline's level: h3 under the homepage block's own "News" heading, h2 on the news page, where the
 * posts come straight under the page's h1.
 */
export function NewsCard({ post, as: Heading = "h3" }: { post: NewsPost; as?: "h2" | "h3" }) {
  return (
    <article className="flex w-full flex-col bg-cloud p-8 lg:min-h-[19rem]">
      <time dateTime={post.date} className={cx(labelClass, "text-ink/70")}>
        {formatNewsDate(post.date)}
      </time>
      {/* From `lg`, three across, the words sit at the card's foot, so cards of different lengths line up along
          the bottom. Narrower than that the cards stack, each as tall as its words. */}
      <Heading className="mt-10 font-display text-2xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance lg:mt-auto lg:pt-10">
        {post.title}
      </Heading>
      <p className="mt-3 leading-relaxed text-pretty text-ink/70">{post.summary}</p>
    </article>
  );
}
