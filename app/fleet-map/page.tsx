import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";
import { fleetMapLink } from "@/lib/site";

export const metadata: Metadata = { title: fleetMapLink.label };

export default function FleetMapPage() {
  return (
    <PagePlaceholder
      eyebrow={fleetMapLink.label}
      title="Where our trucks are"
      description="This page is being built. It will show roughly where our trucks are on the road, refreshed about once an hour — no login needed."
    />
  );
}
