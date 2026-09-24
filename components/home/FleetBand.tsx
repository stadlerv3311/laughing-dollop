import Image from "next/image";
import { Container, Reveal } from "@/components/ui";

/**
 * The equipment half of "Safety and equipment" (2026-09-23): the safety band covers tracking, cameras and
 * maintenance, and this shows the trucks themselves — a row of new Volvos, full-bleed. It sits between the
 * safety band and Ship with us, and is deliberately a different shape from the zigzag arrow photos around it
 * (edge to edge, no clip, no box), so it reads as a pause rather than another band.
 *
 * One line in ink: above the photo below `lg`, and from `lg` up in the sky above the cabs — the sky is light and
 * even, so it needs no scrim, and the 21:9 crop (held a quarter of the way down) keeps room for it. Below `lg`
 * the whole photo shows at 16:9, then square on phones, so they see the middle five trucks at a readable size
 * rather than nine tiny ones.
 *
 * The photo is AI-generated, standing in for a real one of our yard; the fleet it shows is real (owner,
 * 2026-09-23). See docs/DECISIONS.md → Fleet band.
 */
// Draft copy — swap in approved wording when it's ready.
export function FleetBand() {
  return (
    <section aria-labelledby="fleet" className="bg-paper pt-16 sm:pt-20 lg:pt-16">
      <div className="relative">
        {/* Above the photo below `lg`; from `lg` it lifts into the sky, which the wide crop leaves room for. */}
        <Container className="pb-10 sm:pb-12 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:pb-0 lg:pt-10 xl:pt-16">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold text-ink/70">Our fleet</p>
            <h2
              id="fleet"
              className="mt-4 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[2.25rem] lg:text-[clamp(1.75rem,2.5vw,2.25rem)]"
            >
              Nearly all new: 2025–26 Volvo trucks and brand-new trailers.
            </h2>
          </Reveal>
        </Container>
        <div className="relative aspect-square sm:aspect-video lg:aspect-21/9">
          <Image
            src="/images/home-fleet.jpg"
            alt="A row of new white Volvo trucks parked side by side on an open lot under a cloudy sky"
            fill
            sizes="100vw"
            className="object-cover lg:object-[center_25%]"
          />
        </div>
      </div>
    </section>
  );
}
