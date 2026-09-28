import { Container, CountUp, Reveal } from "@/components/ui";
import { cx } from "@/lib/cx";
import { companyStats, site, type CompanyStat } from "@/lib/site";

const story = companyStats.filter((stat) => stat.group === "story");
const proof = companyStats.filter((stat) => stat.group === "proof");

/**
 * Homepage band of company numbers that fill up as it scrolls into view. Two groups since 2026-09-23 (it was one
 * flat row of five equal columns, which read like a data table): the story — years and miles — set large on the
 * left, and the proof — loads, states, on-time — set smaller on the right; both groups sit on the same bottom
 * line. From `lg` there's no line between them, just space (owner, 2026-09-25: the vertical hairline went). The
 * groups stack below `lg`, with a hairline running across between them. Numbers in full ink, labels in the
 * lighter ink under them; no box, no background — hairlines above and below.
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
        <div className="border-y border-ink/10 lg:flex">
          <StatGroup
            stats={story}
            className="grid-cols-2 py-12 lg:w-[40%] lg:shrink-0 lg:py-14 lg:pr-10"
            // Big enough to lead the band, small enough that "32M+" keeps to half the group from 320px up.
            numberClassName="text-[3rem] sm:text-[4rem] lg:text-[clamp(3.5rem,5.2vw,4.75rem)]"
            startDelay={0}
          />
          <StatGroup
            stats={proof}
            // From lg the three hug the right edge (the last one ends on the Container's edge, under Apply now) and
            // stand further off the big two on wide screens (owner, 2026-09-25: separate the
            // groups more, move the three right, but not past the edge).
            // The safety band's photo starts on this same line (SafetyBand.tsx repeats these sums), so keep them in step.
            className="border-ink/10 max-sm:hidden sm:grid-cols-3 sm:border-t sm:py-12 lg:flex lg:flex-1 lg:justify-between lg:border-t-0 lg:py-14 lg:pl-10 xl:pl-24 2xl:pl-[10.5rem]"
            // Sized so "125,000+" fits half a phone's width and a third of the group from `sm` up.
            numberClassName="text-[1.875rem] sm:text-[2.25rem] lg:text-[clamp(2rem,2.6vw,2.75rem)]"
            startDelay={story.length * 0.08}
          />
          <StatWheel stats={proof} />
        </div>
      </Container>
    </section>
  );
}

function StatGroup({
  stats,
  className,
  numberClassName,
  startDelay,
}: {
  stats: CompanyStat[];
  className: string;
  numberClassName: string;
  startDelay: number;
}) {
  return (
    <dl className={cx("grid content-end items-end gap-x-6 gap-y-10 sm:gap-x-10", className)}>
      {stats.map((stat, index) => (
        <Reveal key={stat.label} delay={startDelay + index * 0.08} className="flex flex-col-reverse gap-3">
          <dt className="text-sm text-ink/70 sm:text-base">{stat.label}</dt>
          <dd className={cx("font-medium leading-none tracking-[-0.045em]", numberClassName)}>
            <CountUp value={stat.value} suffix={stat.suffix} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

/**
 * Phones only (owner, 2026-09-25): the three smaller numbers share one row as an endless loop instead of wrapping
 * onto a row of their own. The strip runs to the screen edges and fades out at both, so numbers roll in and out
 * rather than being cut off. No count-up here — the copies come round again and would restart from zero. Screen
 * readers get one plain list; the moving strip is hidden from them. With reduced motion it stands still and
 * swipes instead.
 */
function StatWheel({ stats }: { stats: CompanyStat[] }) {
  return (
    <div className="border-t border-ink/10 py-12 sm:hidden">
      <dl className="sr-only">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>
              {stat.value.toLocaleString("en-US")}
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
      <div
        aria-hidden
        className="-mx-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-x-auto"
      >
        <div className="flex w-max animate-stat-wheel motion-reduce:animate-none">
          {[0, 1].map((copy) =>
            stats.map((stat) => (
              <div key={`${copy}-${stat.label}`} className="flex shrink-0 flex-col gap-3 pl-5 pr-7">
                <span className="text-[1.875rem] font-medium leading-none tracking-[-0.045em]">
                  {stat.value.toLocaleString("en-US")}
                  {stat.suffix}
                </span>
                <span className="text-sm text-ink/70">{stat.label}</span>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
