import Link from "next/link";
import { Container, InteractiveHoverButton, Logo, labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, company, footerGroups, quoteLink, site } from "@/lib/site";

/**
 * Site footer, on ink (dark since 2026-09-24, owner — it was the off-white `mist` surface), so it matches the
 * story band and reads as the page's closing dark block. Marked dark so the header uses its light logo if the
 * footer ever passes under it.
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
    <footer data-header-theme="dark" className="bg-ink text-paper">
      <Container>
        <div className="grid gap-12 pb-14 pt-16 sm:pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-28">
          <nav aria-label="Footer" className="grid grid-cols-2 gap-6 lg:col-span-7">
            {footerGroups.map((group) => (
              <div key={group.label}>
                <p className={cx(labelClass, "text-paper/70")}>{group.label}</p>
                <ul className="mt-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-[1.625rem] font-medium leading-[1.25] tracking-[-0.035em] text-paper/90 transition-colors duration-300 hover:text-paper/60 sm:text-[2rem]"
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
              <p className={cx(labelClass, "text-paper/70")}>Contact</p>
              <address className="mt-3 not-italic leading-relaxed text-paper/70">
                <a href={company.phone.href} className="text-paper transition-colors duration-300 hover:text-paper/70">
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
              <p className={cx(labelClass, "text-paper/70")}>Ship or drive with us</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <InteractiveHoverButton href={quoteLink.href} text={quoteLink.label} size="md" variant="solid" />
                <InteractiveHoverButton href={applyLink.href} text={applyLink.label} size="md" variant="ghostLight" />
              </div>
            </div>
          </div>
        </div>

        {/* Not built yet: Privacy Policy, Terms of Service, an email address and the Facebook and Instagram links. */}
        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
          <Link href="/" aria-label={`${site.name} home`} className="block w-[7.5rem]">
            <Logo variant="light" alt="" />
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
