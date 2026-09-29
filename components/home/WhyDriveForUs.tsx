import { Container, Reveal, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyRoutes } from "@/lib/site";

const driver = applyRoutes.find((route) => route.job === "driver");

/**
 * Why drive for us (owner, 2026-09-28: a "why work with us" section after the story band, for drivers). It opens
 * the driver half of the page, ahead of the rolling slogans and the apply cards. The reasons are the careers page's
 * driver reasons (lib/site.ts → applyRoutes), so the two never disagree and nothing new is claimed. No button: the
 * apply cards follow straight after.
 */
export function WhyDriveForUs() {
  if (!driver) return null;

  return (
    <section aria-labelledby="why-drive-title" className="bg-paper pt-20 sm:pt-28 lg:pt-32">
      <Container>
        <Reveal>
          <p className={cx(labelClass, "text-ink/60")}>Why drive for us</p>
          <h2
            id="why-drive-title"
            className="mt-4 text-[2.5rem] font-medium leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]"
          >
            <span className="block">Good trucks.</span>
            <span className="block text-balance">One kind of freight.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 grid border-t border-ink/12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {driver.reasons.map((reason, i) => (
              <li
                key={reason.title}
                className={cx(
                  "py-8 sm:pr-8 lg:py-10",
                  i > 0 && "border-t border-ink/12",
                  // Two columns: the second of each row gets a hairline on its left; the second row loses its top one only on lg.
                  i % 2 === 1 && "sm:border-l sm:pl-8",
                  i === 1 && "sm:border-t-0",
                  i >= 2 && "lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-8",
                )}
              >
                <span aria-hidden className="text-sm tabular-nums text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-medium tracking-[-0.02em]">{reason.title}</h3>
                <p className="mt-2 max-w-[20rem] text-pretty leading-relaxed text-ink/70">{reason.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
