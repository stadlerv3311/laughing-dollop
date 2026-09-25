import type { Metadata } from "next";
import { ViewTransition } from "react";
import { QuoteForm } from "@/components/quote";
import { Container, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_CARD, QUOTE_OPEN, quoteLink } from "@/lib/site";

export const metadata: Metadata = {
  title: quoteLink.label,
  description: "Request a dry van quote: pick the pickup and delivery states on the map, add a few load details and we’ll get back to you.",
};

export default function QuotePage() {
  return (
    // The homepage's Ship with us card grows into this page when you come from its Get a quote button.
    <ViewTransition name={QUOTE_CARD} share={{ [QUOTE_OPEN]: "quote-open", default: "none" }} default="none">
    <section className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <Container>
        <div className="max-w-2xl">
          <p className={cx(labelClass, "text-ink/70")}>{quoteLink.label}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">Where&rsquo;s your load going?</h1>
          <p className="mt-5 text-lg text-ink/70">
            Click the pickup and delivery states on the map, or type a city or ZIP. Add a few details about the load and
            we&rsquo;ll get back to you with a price.
          </p>
        </div>
        <QuoteForm className="mt-12 sm:mt-16" />
      </Container>
    </section>
    </ViewTransition>
  );
}
