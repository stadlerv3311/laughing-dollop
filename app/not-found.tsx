import type { Metadata } from "next";
import Link from "next/link";
import { FlyArrow, PageOpening, Reveal, RiseLabel } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

/**
 * The 404 page (the builder, 2026-10-09: "lets build the 404 page"; the cleanup audit had found that an address the
 * site doesn't have got the framework's own black-on-white "404"). It is what any unmatched address shows, inside the
 * site's header and footer. Set like the other inner pages: the shared opening (PageOpening), then one underlined
 * arrow link home. The header and the footer already carry every other way on, so the page adds no list of links.
 *
 * Draft copy, and OUR pick: the builder asked for the page, not for these words.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="pb-32">
      <PageOpening
        id="not-found-heading"
        lines={["This page isn’t", "on the map."]}
        lede="The address may be mistyped, or the page may have moved."
      />
      {/* The link sits as far under the lede as All news sits under the homepage's news cards. */}
      <Reveal delay={0.15} className="mt-[2.9375rem] flex justify-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <RiseLabel>Back to the homepage</RiseLabel>
          <FlyArrow className="size-3.5" />
        </Link>
      </Reveal>
    </section>
  );
}
