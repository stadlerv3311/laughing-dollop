import type { Metadata } from "next";
import { CareersOverview } from "@/components/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: "Jobs at ITrucking Solutions — on the road, in the office or in the shop. A few short questions, then HR calls you back.",
};

/** Where Careers and Apply now go: the three jobs, what each is and why to take it, each with its own Apply now. */
export default function CareersPage() {
  return <CareersOverview />;
}
