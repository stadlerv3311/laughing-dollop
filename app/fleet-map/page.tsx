import type { Metadata } from "next";
import { FleetMap } from "@/components/fleet";
import { Container, PageOpening } from "@/components/ui";
import { getFleetSnapshot } from "@/lib/fleet";
import { fleetMapLink } from "@/lib/site";

export const metadata: Metadata = {
  title: fleetMapLink.label,
  description: "Roughly where ITrucking Solutions trucks are on the road, refreshed about once an hour.",
};

/** Roughly where our trucks are, on a real map. Public: no login, no load lookup (DECISIONS.md → Fleet Map). */
export default async function FleetMapPage() {
  const fleet = await getFleetSnapshot();

  return (
    <section aria-labelledby="fleet-map-heading" className="pb-20 sm:pb-28">
      {/* The shared opening (owner, 2026-10-07: "same treatment for the header as we have on about and careers"). */}
      <PageOpening
        id="fleet-map-heading"
        lines={["Where our trucks are"]}
        lede="Roughly where our trucks are on the road, refreshed about once an hour. Positions are approximate."
      />
      <Container>
        {/* The site's step under the lede, as the jobs sit under the careers opening. */}
        <div className="mt-16 sm:mt-[4.375rem]">
          {fleet.ok ? <FleetMap snapshot={fleet.snapshot} /> : <p className="text-lg text-ink/70">{fleet.message}</p>}
        </div>
      </Container>
    </section>
  );
}
