import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/**
 * The newest post on the news page, big: a square black panel the width of the page, "Latest" and the day along the
 * top, the headline at the chapter size along the foot and the sentence or two beside it (under it below `lg`). The
 * older posts follow as grey cards (NewsCard). Black, white and grey only, and not a link: there are no pages for
 * single posts.
 */
export function NewsLead({ post }: { post: NewsPost }) {
  return (
    <article className="flex min-h-[23.75rem] flex-col bg-ink p-8 text-paper lg:min-h-[28.75rem] lg:p-12">
      <div className={cx(labelClass, "flex justify-between gap-4 text-paper/70")}>
        <span>Latest</span>
        <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
      </div>
      <div className="mt-auto pt-24 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <h2 className="font-display text-[2rem] leading-[1.06] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:col-span-8 lg:text-[3.5rem] lg:leading-[1.04]">
          {post.title}
        </h2>
        <p className="mt-5 max-w-[26rem] leading-relaxed text-pretty text-paper/70 lg:col-span-4 lg:mt-0 lg:pb-1.5 lg:text-[17px]">
          {post.summary}
        </p>
      </div>
    </article>
  );
}
