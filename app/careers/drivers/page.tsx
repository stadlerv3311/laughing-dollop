import type { Metadata } from "next";
import { DriverApplication } from "@/components/careers";
import { Container } from "@/components/ui";
import { careersNav } from "@/lib/site";

export const metadata: Metadata = {
  title: careersNav[0].label,
  description: "Class A dry van driver jobs at ITrucking Solutions. A few short questions, then HR calls you back.",
};

export default function DriversPage() {
  return (
    <section className="pb-20 pt-24 max-lg:min-h-svh sm:pb-28 sm:pt-28 lg:pb-32">
      <Container>
        <DriverApplication />
      </Container>
    </section>
  );
}
