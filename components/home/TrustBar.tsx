import { Container, CountUp, Reveal } from "@/components/ui";
import { companyStats, site } from "@/lib/site";

/**
 * Homepage band of company numbers that fill up as it scrolls into view. Three of them: two plus one on phones, one row from `lg`.
 * Hairlines above and below set the band off — the numbers carry themselves at this size and don't need a box.
 *
 * It sits straight under the hero, above Ship with us (moved 2026-09-21). The hero's photo ends flush on the band,
 * so the top padding keeps it off the hairline. Below `lg` Ship with us opens on its text and its own padding;
 * from `lg` its photo sits higher, so `lg:pb-3` tops that up and the photo
 * below sits about as far from the lower hairline as the hero does from the upper one.
 */
export function TrustBar() {
  return (
    <section aria-label={`${site.name} in numbers`} className="bg-paper pt-16 sm:pt-20 lg:pt-12 lg:pb-3">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 border-y border-ink/10 py-12 sm:gap-x-10 lg:grid-cols-3">
          {companyStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col-reverse gap-2">
              <dt className="text-sm text-ink/60 sm:text-base">{stat.label}</dt>
              {/* Stepped sizes keep "125,000+" inside its column from 320px phones up. */}
              <dd className="text-[2rem] font-semibold leading-none tracking-[-0.035em] sm:text-5xl lg:text-[3.25rem]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
