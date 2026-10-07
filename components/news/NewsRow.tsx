import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/**
 * One news post as a line of the news page's "Earlier" list: the day, the headline and the sentence or two, side by
 * side from `lg` and stacked below it, under a hairline. The smallest of the page's three sizes (NewsLead, NewsCard,
 * this). Not a link: there are no pages for single posts.
 */
export function NewsRow({ post }: { post: NewsPost }) {
  return (
    <article className="border-t border-ink/10 py-7 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:py-9">
      <time dateTime={post.date} className={cx(labelClass, "block text-ink/70 lg:col-span-2 lg:pt-1.5")}>
        {formatNewsDate(post.date)}
      </time>
      <h3 className="mt-2 font-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance lg:col-span-5 lg:mt-0 lg:text-2xl">
        {post.title}
      </h3>
      <p className="mt-3 leading-relaxed text-pretty text-ink/70 lg:col-span-5 lg:mt-0">{post.summary}</p>
    </article>
  );
}
