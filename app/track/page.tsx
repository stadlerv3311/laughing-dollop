import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Track a Load" };

export default function TrackPage() {
  return (
    <PagePlaceholder
      eyebrow="Track a Load"
      title="Track a Load"
      description="This page is being built. It will show a simple map of your load — no login needed."
    />
  );
}
