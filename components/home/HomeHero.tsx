import { Container, Reveal } from "@/components/ui";

/**
 * The homepage's opening line, at the very top of the page above the photo band (moved there 2026-09-17).
 * It carries the clearance for the fixed header, since it's now the first thing in the flow.
 */
// Draft copy — swap in approved wording when it's ready.
export function HomeHero() {
  return (
    <section id="content" className="bg-paper pt-18">
      <Container className="py-12 sm:py-16 lg:py-20">
        <Reveal>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Freight that moves. <span className="text-ink/60">A team that drives it.</span>
          </h1>
        </Reveal>
      </Container>
    </section>
  );
}
