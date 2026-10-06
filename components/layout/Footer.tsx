import Link from "next/link";
import { Container, InteractiveHoverButton, Logo, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, company, footerGroups, quoteLink, site } from "@/lib/site";

/**
 * Site footer, on white since 2026-10-05 (owner: "make the footer white to balance out the page"). It was ink from
 * 2026-09-24, to match the story band; once the homepage got a black Apply now screen as its last band, a black footer
 * under it made 1,405px of black in a row at the foot of the page. White, the page ends black band, white footer, the
 * same turn it makes everywhere else. Before 2026-09-24 it was the off-white `mist` surface.
 *
 * "F2b" (owner, 2026-10-01, after mock-ups of a giant wordmark — turned down — and three sizes of big links; Samara on
 * Mobbin): the pages as two groups of big links on the left, at 32px — a step under the page's 40px section headings,
 * so the footer closes the page rather than starting a new chapter. On the right: how to reach us, then Get a quote
 * and Apply now. The columns started on hairlines (Zaro on Mobbin) until the owner kept only the bottom one, same day
 * (kept on 2026-10-02, when every other thin divider went). Under it all a thin row with the logo, the legal name and the USDOT and MC numbers. Contact details from
 * the FMCSA record (lib/site.ts → `company`).
 */
export function Footer() {
  return (
    <footer className="bg-paper text-ink">
      <Container>
        {/* The homepage's step, 64px on phones and 70px from `sm`: from the footer's top edge to the labels' letters, and
            from the buttons to the hairline (owner, 2026-10-05: the gaps have to match the page's; it was 64 → 80 →
            112px over the labels and 56 → 64 → 80px under the buttons). */}
        <div className="grid gap-12 pb-16 pt-[3.6875rem] sm:pb-[4.375rem] sm:pt-[4.0625rem] lg:grid-cols-12 lg:gap-x-6">
          <nav aria-label="Footer" className="grid grid-cols-2 gap-6 lg:col-span-7">
            {footerGroups.map((group) => (
              <div key={group.label}>
                <p className={cx(labelClass, "text-ink/70")}>{group.label}</p>
                <ul className="mt-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block font-display font-semibold text-[1.625rem] leading-[1.25] tracking-[-0.03em] text-ink transition-colors duration-300 hover:text-ink/60 sm:text-[2rem]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="grid content-start gap-10 lg:col-span-5 lg:pl-10">
            <div>
              <p className={cx(labelClass, "text-ink/70")}>Contact</p>
              <address className="mt-3 not-italic leading-relaxed text-ink/70">
                <a href={company.phone.href} className="text-ink transition-colors duration-300 hover:text-ink/70">
                  {company.phone.label}
                </a>
                {company.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div>
              <p className={cx(labelClass, "text-ink/70")}>Ship or drive with us</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <InteractiveHoverButton href={quoteLink.href} text={quoteLink.label} size="md" variant="ink" />
                <InteractiveHoverButton href={applyLink.href} text={applyLink.label} size="md" variant="ghostDark" />
              </div>
            </div>
          </div>
        </div>

        {/* Not built yet: Privacy Policy, Terms of Service, an email address and the Facebook and Instagram links. */}
        <div className="flex flex-col gap-4 border-t border-ink/10 py-6 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
          <Link href="/" aria-label={`${site.name} home`} className="block w-[7.5rem]">
            <Logo alt="" />
          </Link>
          <p className="flex flex-col gap-1 sm:flex-row sm:gap-7">
            <span>
              © {new Date().getFullYear()} {company.legalName}
            </span>
            <span>USDOT {company.usdot}</span>
            <span>{company.mc}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
