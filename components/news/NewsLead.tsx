import Image from "next/image";
import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/**
 * The newest post on the news page, big: a square black panel the width of the page, "Latest" and the day along the
 * top, the headline at the chapter size along the foot and the sentence or two beside it (under it below `lg`). The
 * older posts follow on white, a row each (NewsZigzag). Black, white and grey only, and not a link: there are no pages for
 * single posts.
 *
 * With a picture (`post.image`; owner, 2026-10-07: "use this for twelve new trucks on news page") the panel splits in
 * two from `lg`: the words keep the black half, the headline a size down with the sentence under it, and the picture
 * fills the other half edge to edge, undimmed. Below `lg` the picture sits on top. The words never go over the
 * picture, so they read the same whatever the picture is. It has no alt text: it is a stand-in until the owner says
 * otherwise (see lib/news.ts), so nothing describes it as the event.
 */
export function NewsLead({ post }: { post: NewsPost }) {
  const top = (
    <div className={cx(labelClass, "flex justify-between gap-4 text-paper/70")}>
      <span>Latest</span>
      <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
    </div>
  );

  if (post.image) {
    return (
      <article className="bg-ink text-paper lg:grid lg:min-h-[32.5rem] lg:grid-cols-2">
        <div className="relative aspect-[3/2] lg:order-last lg:aspect-auto">
          <Image src={post.image} alt="" fill priority sizes="(width >= 80rem) 600px, (width >= 64rem) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col p-8 lg:p-12">
          {top}
          <h2 className="mt-auto pt-16 font-display text-[2rem] leading-[1.06] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:pt-24">
            {post.title}
          </h2>
          <p className="mt-5 max-w-[26rem] leading-relaxed text-pretty text-paper/70 lg:text-[17px]">{post.summary}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex min-h-[23.75rem] flex-col bg-ink p-8 text-paper lg:min-h-[28.75rem] lg:p-12">
      {top}
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
