import Link from "next/link";
import { FlyArrow, RiseLabel, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, newsHref, type NewsPost } from "@/lib/news";
import { newsLink } from "@/lib/site";

/**
 * The list a post's own page keeps on its right side (the builder, 2026-10-09: "on right side o the page we can
 * choose the article"): every post, newest first, a day and a headline each, down a hairline rail. The one being read
 * is in full ink with the rail in ink beside it; the others are in ink at 70% and open their own page. All news, under
 * the list, goes back to the news page.
 *
 * From `lg` it stays in view while the article scrolls, and scrolls by itself if there are ever more posts than fit the
 * screen. Below `lg` there is no room beside the article, so it follows it, under a hairline.
 */
export function NewsChooser({ posts, current }: { posts: NewsPost[]; current: NewsPost }) {
  return (
    <nav aria-labelledby="news-chooser-title">
      <h2 id="news-chooser-title" className={labelClass}>
        More news
      </h2>
      <ul className="mt-5 border-l border-ink/10">
        {posts.map((post) => {
          const reading = post.slug === current.slug;
          return (
            <li key={post.slug}>
              <Link
                href={newsHref(post)}
                aria-current={reading ? "page" : undefined}
                className={cx(
                  "-ml-px block border-l-2 py-2.5 pl-5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  reading ? "border-ink text-ink" : "border-transparent text-ink/70 hover:border-ink/30 hover:text-ink",
                )}
              >
                <time dateTime={post.date} className="block text-[13px]">
                  {formatNewsDate(post.date)}
                </time>
                <span className={cx("mt-0.5 block text-pretty text-[15px] leading-[1.35]", reading ? "font-semibold" : "font-medium")}>
                  {post.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={newsLink.href}
        className="group mt-7 inline-flex items-center gap-1.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <RiseLabel>All news</RiseLabel>
        <FlyArrow className="size-3" />
      </Link>
    </nav>
  );
}
