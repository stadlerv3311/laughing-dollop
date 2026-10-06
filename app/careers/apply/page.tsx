import type { Metadata } from "next";
import { JobApplication } from "@/components/careers";

export const metadata: Metadata = {
  title: "Apply now",
  description: "Apply for a job at ITrucking Solutions — on the road, in the office or in the shop. A few short questions, then HR calls you back.",
};

/** Where every Apply now outside the careers page lands: the application with no job set, so it asks which. */
export default function ApplyPage() {
  return <JobApplication />;
}
