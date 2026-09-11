import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Request a Quote" };

export default function QuotePage() {
  return (
    <PagePlaceholder
      eyebrow="Get a Quote"
      title="Request a Quote"
      description="This page is being built. The quote form will ask for origin, destination, weight, freight type, and contact info."
    />
  );
}
