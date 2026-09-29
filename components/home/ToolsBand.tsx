import Image from "next/image";
import { Container, Reveal } from "@/components/ui";
import { tools, toolsLine } from "@/lib/site";

/**
 * The tools we run on (owner, 2026-09-29, option B2 of a mock-up): one quiet line, then the five companies' logos
 * centred in a row — Samsara, Fleetio, Volvo, Datatruck, OnRamp. It closes the safety band and sits inside the same
 * pinned section, so Ship with us still slides up over both. The logos keep their own colours; each one's height is
 * set so they look the same size. No captions under them, so the row can't read as a client list or as an
 * endorsement (Fleetio's logo terms), and no link out. Copy and list in lib/site.ts → `tools`.
 *
 * Only 40px under the logos from `lg` (2026-09-29): Ship with us follows straight on and takes 40px less off its own
 * top, so its ask sits centred between the logos and the dark band below.
 */
export function ToolsBand() {
  return (
    <section aria-label="The tools we run on" className="bg-paper pb-16 sm:pb-20 lg:pb-10">
      <Container>
        <Reveal className="text-center">
          <p className="text-[15px] text-ink/70">{toolsLine}</p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 lg:gap-x-18">
            {tools.map((tool) => (
              <li key={tool.name}>
                <Image
                  src={tool.src}
                  alt={tool.name}
                  width={tool.width}
                  height={tool.height}
                  style={{ height: tool.display, width: "auto" }}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
