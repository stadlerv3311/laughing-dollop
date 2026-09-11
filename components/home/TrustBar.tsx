import { Container, CountUp, Reveal } from "@/components/ui";
import { companyStats, site } from "@/lib/site";

/** Homepage band of company numbers that fill up as it scrolls into view. 2×2 on phones, one row from `lg`. */
export function TrustBar() {
  return (
    <section aria-label={`${site.name} in numbers`} className="bg-paper pb-24 sm:pb-32">
      <Container>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-8 rounded-[2rem] bg-mist px-4 py-8 text-center sm:gap-x-6 sm:px-8 sm:py-10 lg:grid-cols-4">
          {companyStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col-reverse items-center gap-1.5">
              <dt className="text-sm text-ink/70 sm:text-base">{stat.label}</dt>
              {/* Stepped sizes keep "125,000+" inside its column from 320px phones up. */}
              <dd className="text-[1.625rem] font-semibold leading-none tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
