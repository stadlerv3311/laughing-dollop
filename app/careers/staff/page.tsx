import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";
import { careersNav } from "@/lib/site";

export const metadata: Metadata = { title: `${careersNav[1].label} jobs` };

export default function StaffPage() {
  return (
    <PagePlaceholder
      eyebrow="Careers"
      title={careersNav[1].label}
      description="This page is being built. Dispatch, office and shop jobs use a few short questions, then HR calls you back."
    />
  );
}
