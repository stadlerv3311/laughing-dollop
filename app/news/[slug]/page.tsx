import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsChooser } from "@/components/news";
import { Container, Reveal, labelClass, sectionBottom } from "@/components/ui";
import { cx } from "@/lib/cx";
import { findNewsPost, formatNewsDate, visibleNewsPosts } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

/** Only the posts a visitor may see have a page; any other address under /news is the 404 page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return visibleNewsPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findNewsPost(slug);
  return post ? { title: post.title, description: post.summary } : {};
}

/**
 * Shown in place of an article nobody has written, on a draft post only, so the page's layout can be judged. Drafts
 * are left out of a production build, so these lines never reach the live site. They say what they are and nothing
 * about the company: we don't make news up (docs/DECISIONS.md → News copy).
 */
const PLACEHOLDER = [
  "Placeholder text. The article for this post has not been written yet, and these lines only show how a written one will sit on the page: how wide a paragraph runs, how much air it has, and where it ends.",
  "A second placeholder paragraph, a little shorter than the first, so the space between two of them can be seen.",
  "A third one. When the article is written and confirmed, it goes in this post's body in lib/news.ts and these lines go away.",
];

/**
 * One news post's own page (the builder, 2026-10-09: "on news page we need page for opened articles ... if you press
 * on article it opens the article page. and on right side o the page we can choose the article"). The article on the
 * left: its day, its headline, its picture if it has one, the post's sentence or two as the opening lines, then the
 * article's paragraphs. On the right the list of every post (NewsChooser), the one being read marked, which stays in
 * view while the article scrolls. Below `lg` the list follows the article.
 *
 * The headline starts where the other inner pages' headlines do, one site step under the header's buttons, but on the
 * left and a size down (40px, 48 from `lg`): it is a sentence beside a list, not a page's one-word name.
 *
 * No alt text or caption on the picture: the pictures are stock or stand-ins, not pictures of the events (see
 * lib/news.ts). It closes on the hairline the news page closes on.
 */
export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = findNewsPost(slug);
  if (!post) notFound();

  const paragraphs = post.body ?? (post.draft ? PLACEHOLDER : []);

  return (
    <div className="bg-paper pt-[7.1875rem] text-ink sm:pt-[7.5625rem] lg:pt-[7.25rem]">
      <Container>
        <div
          className={cx(
            "border-b border-ink/10 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-x-16 xl:gap-x-20",
            sectionBottom,
          )}
        >
          <Reveal>
            <article aria-labelledby="news-post-title">
              <time dateTime={post.date} className={cx(labelClass, "block text-ink/70")}>
                {formatNewsDate(post.date)}
              </time>
              <h1
                id="news-post-title"
                className="mt-4 text-balance font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[2.5rem] lg:text-5xl lg:leading-[1.05]"
              >
                {post.title}
              </h1>
              {post.image && (
                <div className="relative mt-8 aspect-[3/2] overflow-hidden bg-ink sm:aspect-[16/9] lg:mt-10">
                  <Image src={post.image} alt="" fill priority sizes="(width >= 75rem) 816px, (width >= 64rem) 62vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="mt-8 max-w-[42rem] lg:mt-10">
                <p className="text-pretty text-xl leading-[1.5] font-medium sm:text-[1.375rem]">{post.summary}</p>
                {paragraphs.map((paragraph, index) => (
                  <p key={paragraph} className={cx("text-pretty text-[17px] leading-relaxed text-ink/70", index === 0 ? "mt-7" : "mt-5")}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
          <Reveal
            delay={0.1}
            className="mt-14 border-t border-ink/10 pt-10 sm:mt-16 lg:mt-0 lg:border-t-0 lg:pt-0"
          >
            {/* It holds its place under the header, and scrolls inside itself when the list is taller than the screen. */}
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto">
              <NewsChooser posts={visibleNewsPosts()} current={post} />
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
