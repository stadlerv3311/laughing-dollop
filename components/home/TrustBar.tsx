import { Container, CountUp, Reveal } from "@/components/ui";
import { companyStats, site } from "@/lib/site";

/**
 * Homepage band of company numbers that fill up as it scrolls into view. Five of them since 2026-09-23 (the hero's
 * two moved down here): two columns on phones, three on tablets, one row from `lg`. Large, light numbers with small
 * labels, and hairlines above and below — the numbers carry themselves and don't need a box.
 *
 * It sits straight under the hero, above the safety band (moved 2026-09-21; the safety band replaced Ship with us
 * below it 2026-09-23). The hero ends flush on the band, so the top padding keeps it off the hairline. Below `lg`
 * the safety band opens on its text and its own padding; from `lg` its photo is centred beside the text, and
 * `lg:pb-8` keeps it clear of the lower hairline.
 */
export function TrustBar() {
  return (
    <section aria-label={`${site.name} in numbers`} className="bg-paper pt-16 sm:pt-20 lg:pt-24 lg:pb-8">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 border-y border-ink/10 py-12 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-10 lg:py-14">
          {companyStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col-reverse gap-2">
              <dt className="text-sm text-ink/60 sm:text-base">{stat.label}</dt>
              {/* Sized to the column so "125,000+" fits from 320px phones up and in a fifth of the row from `lg`. */}
              <dd className="text-[2rem] font-medium leading-none tracking-[-0.045em] sm:text-[2.75rem] lg:text-[clamp(2rem,3vw,3rem)]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
