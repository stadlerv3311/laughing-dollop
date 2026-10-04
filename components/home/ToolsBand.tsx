import Image from "next/image";
import { Container, Reveal } from "@/components/ui";
import { tools } from "@/lib/site";

/**
 * The tools we run on (owner, 2026-09-29, option B2 of a mock-up): the five companies' logos centred in a row — Samsara, Fleetio, Volvo, Datatruck, OnRamp. It closes the safety band and sits inside the same
 * pinned section, so Ship with us still slides up over both. The logos keep their own colours; each one's height is
 * set so they look the same size. No captions under them, so the row can't read as a client list or as an
 * endorsement (Fleetio's logo terms), and no link out. List in lib/site.ts → `tools`. The quiet line over them ("The
 * tools we run on, every day") came out on 2026-10-02 (owner); the section's label still names the row for screen
 * readers.
 *
 * 70px under the logos from `lg` (owner, 2026-10-02, matching the 70 above them; 40 since 2026-09-29), up to where
 * Ship with us and its dot map begin. Ship with us takes the same 70px off its own top, so its ask still sits centred
 * between the logos and the dark band below.
 */
export function ToolsBand() {
  return (
    <section aria-label="The tools we run on" className="bg-paper pb-16 sm:pb-20 lg:pb-[4.375rem]">
      <Container>
        <Reveal className="text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 lg:gap-x-18">
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
