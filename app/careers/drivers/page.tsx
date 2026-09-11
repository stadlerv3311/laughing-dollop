import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Drive For Us" };

export default function DriversPage() {
  return (
    <PagePlaceholder
      eyebrow="Careers"
      title="Drive For Us"
      description="This page is being built. It will have a short application — HR calls you back."
    />
  );
}
