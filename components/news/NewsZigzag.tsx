import Image from "next/image";
import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/**
 * The news page's posts after the newest, up to four: a row to a post, the picture on one side and the day, the
 * headline and the sentence on the other, the picture changing sides from row to row, with a hairline between the
 * rows (owner, 2026-10-07, picking from two mock-ups of the same posts at a bigger size: "Lets do zigzag for now and
 * we will work on this later"). The first row has its picture on the left, since the black panel above has its own on
 * the right.
 *
 * Straight on the page's white, no box: the day and the sentence in ink at 70%, the headline in full ink (owner, same
 * day: "lets text sits directly on white, no fill ... the latest story shouts in black, the archive whispers on
 * white"). One unit, repeated the same every time; only the side changes.
 *
 * How it got here, all the same day: six grey cards; a bento of wide and narrow tiles, which without the boxes read
 * as a puzzle (owner, passing on a review: "its better but still its unclear. what goes where"); four small posts in
 * one row, which was clear and flat (owner: "is this ok to news look so boring ?"); then this.
 *
 * Under `lg` the posts stack, the picture over its words. Nothing is a link, since there are no pages for single
 * posts. No alt text on the pictures: they are stock or stand-ins, not pictures of the events (see lib/news.ts).
 */
export function NewsZigzag({ posts }: { posts: NewsPost[] }) {
  const shown = posts.slice(0, 4);

  return (
    <ul>
      {shown.map((post, i) => (
        <li key={`${post.date}-${post.title}`} className={cx(i > 0 && "mt-8 border-t border-ink/10 pt-8 sm:mt-10 sm:pt-10 lg:mt-12 lg:pt-12")}>
          <article className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12">
            {post.image && (
              <div className={cx("relative mb-5 aspect-[3/2] lg:col-span-7 lg:mb-0 lg:aspect-[16/9]", i % 2 === 1 && "lg:order-last")}>
                <Image src={post.image} alt="" fill sizes="(width >= 80rem) 680px, (width >= 64rem) 58vw, 100vw" className="object-cover" />
              </div>
            )}
            <div className={post.image ? "lg:col-span-5" : "lg:col-span-12"}>
              <time dateTime={post.date} className={cx(labelClass, "block text-ink/70")}>
                {formatNewsDate(post.date)}
              </time>
              <h2 className="mt-2 font-display text-2xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2rem] sm:leading-[1.1] lg:mt-3 xl:text-[2.5rem] xl:leading-[1.06]">
                {post.title}
              </h2>
              <p className="mt-2 max-w-[26rem] leading-relaxed text-pretty text-ink/70 sm:mt-3 sm:text-[1.0625rem]">{post.summary}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
