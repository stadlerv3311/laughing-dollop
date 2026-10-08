"use client";

import Image from "next/image";
import { useId, useState, useSyncExternalStore } from "react";
import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { formatNewsDate, type NewsPost } from "@/lib/news";

/** From here up the cards sit in a row and open one at a time; under it they stack, all open. */
const WIDE = "(width >= 64rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * The homepage news block's three posts (NewsBand) as the job cards of Why work with us, a bit different (owner,
 * 2026-10-07, drawing over a screenshot of those cards: "its basically same as for drivers but a bit diferent
 * #111111", "when you pres another pictuter it slides back then text appears in front of it", "then when you hover
 * over another picture"; and, of how many, "we can fit 3 if do it like this").
 *
 * From `lg` a row of three pictures the height of the job cards. One post is open: its day, headline and sentence
 * stand to the right of its picture, on the page's white. The other two are their pictures only, with the day and the
 * headline over the foot. Pointing at, tabbing to or pressing another picture slides the
 * open panel back behind its picture while the new one slides out, and its words come up once it is out. The two
 * panels trade width at the same pace, so the three pictures keep their size and only move sideways. The newest post
 * starts open, and the last one opened stays open.
 *
 * The words were on a #111111 panel for an hour, the figure in the drawing (owner, once it was built: "we can remove
 * that black and keep it white"). So no box: the day and the sentence in ink at 70%, the headline in full ink, the day
 * level with the top of the picture and the headline and sentence with its foot.
 *
 * Under `lg` there is nothing to point with and no room beside a picture, so the cards stack, every one open (owner:
 * "yes for the phone"): the picture over its words on phones, beside them (the words centred against it) from `sm`. The pictures are then not buttons.
 *
 * A closed panel is taken out of the accessibility tree and its picture's button carries the day and the headline, so
 * a screen reader hears each post once. No alt text on the pictures: they are stock or stand-ins, not pictures of the
 * events (see lib/news.ts). Nothing is a link, since there are no pages for single posts.
 */
export function NewsCards({ posts }: { posts: NewsPost[] }) {
  const shown = posts.slice(0, 3);
  const [open, setOpen] = useState(0);
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
  const id = useId();

  return (
    <ul className="flex flex-col gap-10 [--panel:20rem] sm:gap-8 lg:h-96 lg:flex-row lg:gap-3 xl:[--panel:27rem]">
      {shown.map((post, i) => {
        const isOpen = open === i;
        const panelId = `${id}-${i}`;
        const day = formatNewsDate(post.date);
        const pictureClass =
          "group relative block aspect-[2/1] w-full overflow-hidden bg-ink text-left text-paper sm:aspect-auto sm:w-2/5 sm:shrink-0 lg:w-auto lg:min-w-0 lg:flex-1 lg:basis-0";
        const picture = (
          <>
            {post.image && (
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(width >= 64rem) 600px, (width >= 40rem) 40vw, 100vw"
                className="object-cover transition-transform duration-700 ease-premium lg:group-hover:scale-[1.03]"
              />
            )}
            <span
              aria-hidden
              className={cx(
                "absolute inset-0 hidden bg-linear-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-500 motion-reduce:transition-none lg:block",
                isOpen && "opacity-0",
              )}
            />
            {/* The closed card's words, over the foot of its picture; the open one's are on its panel. */}
            <span
              className={cx(
                "absolute inset-x-5 bottom-5 hidden transition-opacity motion-reduce:transition-none lg:block",
                isOpen ? "opacity-0 duration-200" : "opacity-100 delay-300 duration-500",
              )}
            >
              <span className="block text-sm text-paper/80">{day}</span>
              <span className="mt-1 block font-display text-lg leading-tight font-semibold tracking-[-0.03em] text-balance xl:text-[1.375rem]">
                {post.title}
              </span>
            </span>
          </>
        );

        return (
          <li key={`${post.date}-${post.title}`} onMouseEnter={() => setOpen(i)} className="lg:min-w-0 lg:flex-[1_1_auto]">
            <article className="flex h-full flex-col sm:min-h-52 sm:flex-row">
              {wide ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(i)}
                  className={cx(pictureClass, "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink")}
                >
                  {picture}
                </button>
              ) : (
                <div className={pictureClass}>{picture}</div>
              )}
              <div
                id={panelId}
                className={cx(
                  "min-w-0 grow motion-reduce:transition-none lg:shrink-0 lg:grow-0 lg:overflow-hidden lg:transition-[width,visibility] lg:duration-700 lg:ease-premium",
                  isOpen ? "lg:w-[var(--panel)]" : "lg:invisible lg:w-0",
                )}
              >
                {/* As wide as the open panel all the time, so the words don't re-wrap while it slides. */}
                <div
                  className={cx(
                    "flex h-full flex-col pt-5 motion-reduce:transition-none sm:justify-center sm:pt-0 sm:pl-7 lg:w-[var(--panel)] lg:justify-start lg:px-7 lg:transition-opacity",
                    isOpen ? "lg:opacity-100 lg:delay-[450ms] lg:duration-500" : "lg:opacity-0 lg:duration-150",
                  )}
                >
                  <time dateTime={post.date} className={cx(labelClass, "block text-ink/70")}>
                    {day}
                  </time>
                  <h3 className="mt-2 font-display text-2xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance lg:mt-auto lg:pt-6 xl:text-[1.75rem] xl:leading-[1.12]">
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-[26rem] leading-relaxed text-pretty text-ink/70">{post.summary}</p>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
