import Link from "next/link";
import { FlyArrow, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, newsHref, type NewsPost } from "@/lib/news";

/**
 * One news post as a line of the news page's "Earlier" list, every post older than the three on the stage: the day, the
 * headline and the sentence or two, side by side from `lg` and stacked below it, under a hairline. The whole line
 * opens the post's own page (since 2026-10-09): the headline is the link, stretched over the line, and the arrow at
 * the line's right end flies through when it is pointed at or tabbed to.
 */
export function NewsRow({ post }: { post: NewsPost }) {
  return (
    <article className="group relative border-t border-ink/10 py-7 pr-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:py-9 lg:pr-0">
      <time dateTime={post.date} className={cx(labelClass, "block text-ink/70 lg:col-span-2 lg:pt-1.5")}>
        {formatNewsDate(post.date)}
      </time>
      <h3 className="mt-2 font-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance lg:col-span-5 lg:mt-0 lg:text-2xl">
        <Link
          href={newsHref(post)}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 leading-relaxed text-pretty text-ink/70 lg:col-span-4 lg:mt-0">{post.summary}</p>
      <span className="absolute top-8 right-0 lg:static lg:col-span-1 lg:mt-2 lg:justify-self-end">
        <FlyArrow className="block size-3.5" />
      </span>
    </article>
  );
}
