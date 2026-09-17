import { Container } from "@/components/ui";
import { applyLink, quoteLink } from "@/lib/site";
import { AudiencePanel } from "./AudiencePanel";

/**
 * The site's two audiences, as a split of the page rather than two cards: from `md` this parent paints both
 * halves edge to edge and the Container keeps the text on the page grid, so the seam lands exactly on the
 * container's midpoint. On phones the panels stack and paint themselves.
 */
// Draft copy — swap in approved wording when it's ready.
export function AudienceSplit() {
  return (
    <section
      aria-label="Ship with us or drive for us"
      className="bg-paper md:bg-[linear-gradient(to_right,var(--color-mist)_0_50%,var(--color-ink)_50%_100%)]"
    >
      <Container className="grid md:grid-cols-2">
        <AudiencePanel
          tone="light"
          eyebrow="Ship with us"
          title="Dry van truckload, handled with care."
          body="Tell us where it's going and what it weighs. We'll get back to you with a quote."
          cta={quoteLink}
        />
        <AudiencePanel
          tone="dark"
          eyebrow="Drive for us"
          title="Watch your bonus grow in real time."
          body="Our driver app tracks your bonus live. The application is short, and HR calls you back."
          cta={applyLink}
        />
      </Container>
    </section>
  );
}
