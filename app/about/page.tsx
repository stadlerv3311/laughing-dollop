import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="About"
      title="About ITrucking Solutions"
      description="This page is being built. It will cover our story, team, fleet, and safety record."
    />
  );
}
