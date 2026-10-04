import type { Metadata } from "next";
import { JobApplication } from "@/components/careers";

export const metadata: Metadata = {
  title: "Drive for us",
  description: "Class A dry van driver jobs at ITrucking Solutions. A few short questions, then HR calls you back.",
};

/** The careers page's driver Apply now lands here: the application for the driver job, starting with the name. */
export default function DriversPage() {
  return (
    <JobApplication initialJob="driver" />
  );
}
