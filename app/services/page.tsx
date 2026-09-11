import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <PagePlaceholder
      eyebrow="Services"
      title="Dry Van & Truckload"
      description="This page is being built. It will list our dry van truckload service."
    />
  );
}
