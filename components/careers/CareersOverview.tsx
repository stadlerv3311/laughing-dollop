import Image from "next/image";
import { Container, InteractiveHoverButton, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, applyRoutes } from "@/lib/site";

/**
 * The careers page (owner, 2026-09-25: Careers and Apply now should show the jobs, what each one is and why to take
 * it, before the application). A dark opening like About's, then one section per job — photo on one side, the job
 * on the other, alternating — each ending in Apply now, which opens the application on that job. Copy is in
 * lib/site.ts → applyRoutes (draft). The row of three jump links under the opening came out on 2026-10-01 (owner): the
 * opening names the three jobs already, and the jobs start right under it.
 */
export function CareersOverview() {
  return (
    <>
      <section data-header-theme="dark" className="bg-ink pb-16 pt-36 text-paper sm:pb-20 sm:pt-44">
        <Container>
          <Reveal>
            <p className={cx(labelClass, "text-paper/70")}>Careers</p>
            <h1 className="mt-4 max-w-[14ch] text-balance text-[2.75rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[5rem]">
              Come work with us.
            </h1>
            <p className="mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-paper/70">
              On the road, in the office or in the shop. Pick the job that fits, answer a few short questions, and HR
              calls you back. No résumé, no uploads.
            </p>
          </Reveal>

        </Container>
      </section>

      <div className="bg-paper py-20 sm:py-28">
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
                    className="mt-4 text-balance text-[2.25rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl"
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
                    <span className="text-sm text-ink/50">
                      {route.job === "driver" ? "About two minutes" : "About a minute"}
                    </span>
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
