import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";
import { careersNav } from "@/lib/site";

export const metadata: Metadata = { title: careersNav[0].label };

export default function DriversPage() {
  return (
    <PagePlaceholder
      eyebrow="Careers"
      title={careersNav[0].label}
      description="This page is being built. It will have a short application: five short questions, then HR calls you back."
    />
  );
}
