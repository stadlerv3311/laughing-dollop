import type { Metadata } from "next";
import Image from "next/image";
import { QuoteCard } from "@/components/services";
import { Container, CountUp, PageOpening, PictureStage, Reveal, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { services, servicesPage } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

const lineClass = "border-t border-ink/10 py-5 text-balance text-lg leading-snug font-medium tracking-[-0.01em]";

/**
 * The Services page (2026-10-08; a placeholder until then). It opens like the other inner pages (PageOpening), then
 * one big card with a service on it and the three services as smaller cards under it, each going up to the stage
 * when it is chosen (PictureStage, which has the builder's words for it); "How we run it" as three big numbers,
 * centred, the way the homepage sets its numbers, and two lines, each with its picture under it if it has one; and a
 * black band with one card on it, cut on a slant, that asks the homepage band's question beside its map (QuoteCard).
 * About 3,200px at laptop width, a little shorter than About.
 *
 * For a few hours the same day it was a row to each service (name, words, a small picture), the first of three
 * mock-ups; the builder then brought a mock-up of one picture following a list of the services, and this came out of
 * four takes on that (DECISIONS.md → Services page).
 *
 * Every word is in lib/services.ts (`services`, `servicesPage`), which says where the text came from and what in it
 * is still to confirm. The pictures are stand-ins, so they have no alt text and nothing calls them ours.
 */
export default function ServicesPage() {
  const { headline, lede, run, close } = servicesPage;

  return (
    <>
      <section aria-labelledby="services-heading">
        <PageOpening id="services-heading" lines={[...headline]} lede={lede} />
        <Container>
          {/* One site step under the lede (64px on phones, 70px from `sm`), as on the news page. */}
          <Reveal className="mt-16 sm:mt-[4.375rem]">
            <PictureStage items={services} />
          </Reveal>
        </Container>
      </section>

      {/* The distance between blocks, as on the homepage (the heading's letters 120px under the cards at laptop width,
          102 and 85 narrower); the numbers one inner step under the heading's baseline, and the lines a step on. */}
      <section aria-labelledby="services-run" className="pt-[4.5rem] text-center sm:pt-[5.5rem] lg:pt-[6.5625rem]">
        <Container>
          <Reveal>
            <h2 id="services-run" className={sectionHeadingClass}>
              {run.title}
            </h2>
          </Reveal>
          <dl className="mt-[3.5625rem] grid gap-x-6 gap-y-10 sm:mt-[3.8125rem] sm:grid-cols-3 lg:mt-[3.6875rem]">
            {run.numbers.map((number, index) => (
              // Label first for screen readers (a dt before its dd), number shown first with `order`: TrustBar's way.
              <Reveal key={number.label} delay={index * 0.08} className="flex flex-col items-center gap-3">
                <dt className="order-2 text-balance text-sm text-ink/70 sm:text-base">{number.label}</dt>
                <dd className="order-1 font-display text-[3rem] font-semibold leading-none tracking-[-0.03em] sm:text-[4rem] lg:text-[clamp(3.5rem,5.2vw,4.75rem)]">
                  <CountUp value={number.value} suffix={number.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
          {/* The two lines side by side from `lg`, one under the other below it, each with its picture under it if
              it has one (the builder, 2026-10-08: "add this pictures to yard in sacramento"). What to have ready for
              a quote stood beside the first picture for an hour and went the same day ("remove this"). */}
          <Reveal className="mt-16 sm:mt-[4.375rem]">
            <div className="grid gap-x-6 gap-y-10 text-left lg:grid-cols-2">
              {run.lines.map((line) => (
                <div key={line.text}>
                  <p className={cx(lineClass, !line.picture && "pb-0")}>{line.text}</p>
                  {line.picture && (
                    <div className="relative aspect-[3/2] overflow-hidden bg-cloud">
                      <Image
                        src={line.picture.src}
                        alt=""
                        fill
                        sizes="(width >= 75rem) 588px, (width >= 64rem) 50vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: line.picture.position }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The close: a black band with one card on it, cut on a slant, the question and Get a quote on its white side
          and the homepage band's live map on its black side (QuoteCard, which has the builder's words for it). 48px
          of black over and under the card from `lg`, 40 from `sm`, 32 on phones. The header goes light over the
          band. Before it, the same day: About's closing band with the words on the black; the band made taller; a
          white card on it; the homepage map's dots behind the words in grey (DECISIONS.md → Services page). */}
      <section
        aria-labelledby="services-quote"
        data-header-theme="dark"
        className="mt-[5.3125rem] bg-ink py-8 sm:mt-[6.375rem] sm:py-10 lg:mt-[7.5rem] lg:py-12"
      >
        <Container>
          <Reveal>
            <QuoteCard id="services-quote" title={close.title} />
          </Reveal>
        </Container>
      </section>
      {/* From `lg`, 100px of white over the footer's labels, as on the About page: the footer brings 70px of its
          own, so this adds the other 30. */}
      <div aria-hidden className="hidden h-[1.875rem] bg-paper lg:block" />
    </>
  );
}
