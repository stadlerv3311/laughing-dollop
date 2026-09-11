import { Container, Reveal } from "@/components/ui";
import { applyLink, quoteLink } from "@/lib/site";
import { AudiencePanel } from "./AudiencePanel";

// Draft copy — swap in approved wording when it's ready.
export function HomeHero() {
  return (
    <section id="content" className="relative bg-paper pb-24 pt-8 sm:pb-32 sm:pt-12">
      <Container>
        <Reveal>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Freight that moves. <span className="text-ink/60">A team that drives it.</span>
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
          <Reveal delay={0.05} className="h-full">
            <AudiencePanel
              tone="light"
              eyebrow="Ship With Us"
              title="Dry van truckload, handled with care."
              body="Tell us where it's going and what it weighs. We'll get back to you with a quote."
              cta={quoteLink}
            />
          </Reveal>
          <Reveal delay={0.15} className="h-full">
            <AudiencePanel
              tone="dark"
              eyebrow="Drive For Us"
              title="Watch your bonus grow in real time."
              body="Our driver app tracks your bonus live. The application is short, and HR calls you back."
              cta={applyLink}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
