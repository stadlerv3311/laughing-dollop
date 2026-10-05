import { Container, CountUp, Reveal } from "@/components/ui";
import { cx } from "@/lib/cx";
import { companyStats, site } from "@/lib/site";

/**
 * Homepage band of company numbers that fill up as it scrolls into view. Since 2026-10-02 (owner) one centred row of
 * five: the two main numbers as bookends — years in business opens, on-time delivery closes — with loads, miles and
 * states set smaller between them. Numbers in full ink, labels in the lighter ink under them; no box, no background,
 * no lines, and no "meaning" lines under the numbers any more. Labels share one bottom line, so the small numbers
 * sit level with the big ones' feet. Below `lg` the two main numbers take the first row and the three small ones the
 * second (this replaced the phones' rolling strip of the small three), lined up along their tops there. The small labels
 * are one word; the main two spell out their claim ("In business", "On-time delivery").
 *
 * Earlier: two groups, years and miles large on the left and the rest smaller on the right (2026-09-23).
 *
 * Since 2026-10-02 it sits inside the safety band (owner; it was straight under the hero from 2026-09-21) — between
 * its two pictures, at its foot from 2026-10-03 (the shop pair moved to Why work with us), and between the services
 * and road pairs again since 2026-10-05 — so it has no padding of its own: SafetyBand's `between` slot spaces it.
 */
export function TrustBar() {
  return (
    <section aria-label={`${site.name} in numbers`} className="bg-paper">
      <Container>
        <dl className="grid grid-cols-6 items-start gap-x-4 gap-y-10 text-center sm:gap-x-6 lg:grid-cols-5 lg:items-end">
          {companyStats.map((stat, index) => (
            // Label first for screen readers (a dt before its dd), number shown first with `order`.
            <Reveal
              key={stat.label}
              delay={index * 0.08}
              className={cx(
                "flex flex-col items-center gap-3 lg:order-none lg:col-span-1",
                stat.main ? "order-first col-span-3" : "col-span-2",
              )}
            >
              <dt className="order-2 text-sm text-ink/70 sm:text-base">{stat.label}</dt>
              <dd
                className={cx(
                  "order-1 font-display font-semibold leading-none tracking-[-0.03em]",
                  stat.main
                    ? "text-[3rem] sm:text-[4rem] lg:text-[clamp(3.5rem,5.2vw,4.75rem)]"
                    : // Sized so "32M+" and "125K+" fit a third of a 320px phone, and a fifth of the row from lg.
                      "text-[1.375rem] sm:text-[2rem] lg:text-[clamp(2rem,2.6vw,2.75rem)]",
                )}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
