import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Request a dry van quote: pick the pickup and delivery states on the map, add a few load details, and we'll get back to you.",
};

export default function QuotePage() {
  return (
    <section className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <Container>
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            Get a Quote
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">Where&apos;s your load going?</h1>
          <p className="mt-5 text-lg text-ink/70">
            Click the pickup and delivery states on the map, or type a city or ZIP. Add a few details about the load and
            we&apos;ll get back to you with a price.
          </p>
        </div>
        <QuoteForm className="mt-12 sm:mt-16" />
      </Container>
    </section>
  );
}
