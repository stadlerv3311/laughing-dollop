import type { Metadata } from "next";
import { JobApplication } from "@/components/careers";

export const metadata: Metadata = {
  title: "Office and shop",
  description: "Office and shop jobs at ITrucking Solutions. A few short questions, then HR calls you back.",
};

/**
 * Office and shop: the same job application as Drive for us, for the office job — or the shop job when the careers
 * page's shop Apply now sends `?job=shop`.
 */
export default async function StaffPage({ searchParams }: { searchParams: Promise<{ job?: string | string[] }> }) {
  const { job } = await searchParams;
  return (
    <JobApplication initialJob={job === "shop" ? "shop" : "office"} />
  );
}
