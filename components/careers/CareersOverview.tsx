import Image from "next/image";
import { Container, InteractiveHoverButton, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, applyRoutes } from "@/lib/site";

/**
 * The careers page (owner, 2026-09-25: Careers and Apply now should show the jobs, what each one is and why to take
 * it, before the application). An opening on white (dark until 2026-10-06), then one section per job — photo on one side, the job
 * on the other, alternating — each ending in Apply now, which opens the application on that job. Copy is in
 * lib/site.ts → applyRoutes (draft). The row of three jump links under the opening came out on 2026-10-01 (owner): the
 * opening names the three jobs already, and the jobs start right under it.
 */
export function CareersOverview() {
  return (
    <>
      {/* On white since 2026-10-06 (owner: "remove black band"), as the About page's opening went the same day; it was
          the ink band with white type. The top space puts the label's letters one site step (64px on phones, 70px from
          `sm`) under the header's buttons, and the jobs start the same step under the lede. Centred since the same
          day (owner: "move the want to work with us to the center"); the label and the lede are centred with the
          headline so the three still read as one block. */}
      <section className="bg-paper pt-[7.3125rem] text-ink sm:pt-[7.6875rem] lg:pt-[7.5625rem]">
        <Container>
          <Reveal className="text-center">
            <p className={cx(labelClass, "text-ink/70")}>Careers</p>
            <h1 className="mx-auto mt-4 max-w-[14ch] text-balance font-display font-semibold text-[2.75rem] leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5rem]">
              {/* "Come work with us." until 2026-10-06 (owner: "change header line to want to work with us ?"). */}
              Want to work with us?
            </h1>
            <p className="mx-auto mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-ink/70">
              On the road, in the office or in the shop. Pick the job that fits, answer a few short questions, and HR
              calls you back. No résumé, no uploads.
            </p>
          </Reveal>

        </Container>
      </section>

      <div className="bg-paper pt-16 pb-20 sm:pt-[4.375rem] sm:pb-28">
        <Container>
          {/* "How applying works" sat here 2026-09-28 to 10-01 (owner removed it: the opening already says it). */}
          <div className="grid gap-24 sm:gap-32">
            {applyRoutes.map((route, i) => (
              <section
                key={route.job}
                id={route.job}
                aria-labelledby={`${route.job}-title`}
                // Clears the fixed header when a jump link lands here.
                className="grid scroll-mt-28 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20"
              >
                <Reveal className={cx(i % 2 === 1 && "md:order-2")}>
                  <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-ink md:aspect-4/5">
                    <Image
                      src={route.image.src}
                      alt={route.image.alt}
                      fill
                      loading={i === 0 ? "eager" : "lazy"}
                      sizes="(width >= 48rem) 50vw, 100vw"
                      style={route.image.position ? { objectPosition: route.image.position } : undefined}
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <p className={cx(labelClass, "text-ink/60")}>{route.role}</p>
                  <h2
                    id={`${route.job}-title`}
                    className="mt-4 text-balance font-display font-semibold text-[2.25rem] leading-[1.05] tracking-[-0.03em] sm:text-5xl"
                  >
                    {route.title}
                  </h2>
                  <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-ink/70">{route.summary}</p>

                  <h3 className="mt-10 text-sm font-semibold">Why here</h3>
                  <ul className="mt-3">
                    {route.reasons.map((reason) => (
                      <li key={reason.title} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                        <span className="font-medium">{reason.title}</span>
                        <span className="text-ink/70">{reason.body}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <InteractiveHoverButton
                      href={route.href}
                      text={applyLink.label}
                      size="lg"
                      variant="ink"
                      className="w-full sm:w-56"
                    />
                    <span className="text-sm text-ink/50">About a minute</span>
                  </div>
                </Reveal>
              </section>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
