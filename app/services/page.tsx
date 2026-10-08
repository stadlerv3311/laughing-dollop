import type { Metadata } from "next";
import { ServiceStage } from "@/components/services";
import {
  Container,
  CountUp,
  InteractiveHoverButton,
  PageOpening,
  Reveal,
  chapterHeadingClass,
  sectionHeadingClass,
} from "@/components/ui";
import { services, servicesPage } from "@/lib/services";
import { quoteLink } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

/**
 * The Services page (2026-10-08; a placeholder until then). It opens like the other inner pages (PageOpening), then
 * one big card with a service on it and the three services as smaller cards under it, each going up to the stage
 * when it is chosen (ServiceStage, which has the builder's words for it); "How we run it" as three big numbers and
 * four lines, centred, the way the homepage sets its numbers; what to have ready for a quote; and a black band as
 * tall as its words with Get a quote, the way About closes. About 2,900px at laptop width, shorter than About.
 *
 * For a few hours the same day it was a row to each service (name, words, a small picture), the first of three
 * mock-ups; the builder then brought a mock-up of one picture following a list of the services, and this came out of
 * four takes on that (DECISIONS.md → Services page).
 *
 * Every word is in lib/services.ts (`services`, `servicesPage`), which says where the text came from and what in it
 * is still to confirm. The three pictures are stand-ins, so they have no alt text and nothing calls them ours.
 */
export default function ServicesPage() {
  const { headline, lede, run, need, close } = servicesPage;

  return (
    <>
      <section aria-labelledby="services-heading">
        <PageOpening id="services-heading" lines={[...headline]} lede={lede} />
        <Container>
          {/* One site step under the lede (64px on phones, 70px from `sm`), as on the news page. */}
          <Reveal className="mt-16 sm:mt-[4.375rem]">
            <ServiceStage services={services} />
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
          <Reveal className="mt-16 sm:mt-[4.375rem]">
            <ul className="grid gap-x-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {run.lines.map((line) => (
                <li
                  key={line}
                  className="border-t border-ink/10 py-5 text-balance text-lg leading-snug font-medium tracking-[-0.01em] lg:pb-0"
                >
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="services-need" className="pt-[4.5rem] text-center sm:pt-[5.5rem] lg:pt-[6.5625rem]">
        <Container>
          <Reveal>
            <h2 id="services-need" className={sectionHeadingClass}>
              {need.title}
            </h2>
            <p className="mx-auto mt-6 max-w-[38rem] text-pretty text-lg leading-relaxed text-ink/70">{need.text}</p>
          </Reveal>
        </Container>
      </section>

      {/* The close: the ask on a black band as tall as its words and its own space, About's closing band (100px
          inside it from `lg`). The header goes light over it. The button is the hero's white Get a quote. */}
      <section
        aria-labelledby="services-quote"
        data-header-theme="dark"
        className="mt-[5.3125rem] bg-ink py-16 text-center text-paper sm:mt-[6.375rem] sm:py-[4.375rem] lg:mt-[7.5rem] lg:py-[6.25rem]"
      >
        <Container>
          <Reveal>
            <h2 id="services-quote" className={chapterHeadingClass}>
              {close.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[30rem] text-pretty text-lg leading-relaxed text-paper/70">{close.text}</p>
            <div className="mt-9">
              <InteractiveHoverButton
                href={quoteLink.href}
                text={quoteLink.label}
                variant="solid"
                size="lg"
                className="w-60"
              />
            </div>
          </Reveal>
        </Container>
      </section>
      {/* From `lg`, 100px of white over the footer's labels to match the 100px of black under the button, as on the
          About page: the footer brings 70px of its own, so this adds the other 30. */}
      <div aria-hidden className="hidden h-[1.875rem] bg-paper lg:block" />
    </>
  );
}
