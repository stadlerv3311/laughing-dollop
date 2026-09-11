import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Fleet Map" };

export default function FleetMapPage() {
  return (
    <PagePlaceholder
      eyebrow="Fleet Map"
      title="Where our trucks are"
      description="This page is being built. It will show roughly where our trucks are on the road, refreshed about once an hour — no login needed."
    />
  );
}
