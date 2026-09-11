import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Dispatch, Shop & Office Jobs" };

export default function StaffPage() {
  return (
    <PagePlaceholder
      eyebrow="Careers"
      title="Dispatch, Shop & Office"
      description="This page is being built. Dispatcher, mechanic, and office roles use the same short application."
    />
  );
}
