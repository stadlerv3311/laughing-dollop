import { StoryHeadline } from "@/components/home/StoryHeadline";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

/**
 * A page's opening on white: the headline centred with its lede under it, and no small label over it (the header's
 * own link is underlined right above). It's the careers page's opening (owner, 2026-10-06 and 10-07), shared since
 * 2026-10-07 (owner, of Fleet map, Services and News: "same treatment for the header as we have on about and
 * careers"): 40px on phones, 48px from `sm`, 64px from `lg`, each line rising from behind its own edge
 * (StoryHeadline), the lede fading up after it. The top space puts the headline's letters one site step (64px on
 * phones, 70px from `sm`) under the header's buttons. The About page's opening is its own: same size and rise, in
 * Geist, with an orange word.
 */
export function PageOpening({ id, lines, lede }: { id: string; lines: string[]; lede: string }) {
  return (
    <div className="bg-paper pt-[7.1875rem] text-center text-ink sm:pt-[7.5625rem] lg:pt-[7.25rem]">
      <Container>
        <StoryHeadline as="h1" id={id} lines={lines} light solid large />
        <Reveal>
          <p className="mx-auto mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-ink/70">{lede}</p>
        </Reveal>
      </Container>
    </div>
  );
}
