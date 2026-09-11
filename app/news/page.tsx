import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return (
    <PagePlaceholder
      eyebrow="News"
      title="News"
      description="This page is being built. Company news and updates will go here."
    />
  );
}
