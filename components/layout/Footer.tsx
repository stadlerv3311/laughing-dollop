import Link from "next/link";
import { Container, Logo } from "@/components/ui";
import { footerNav, site } from "@/lib/site";

/**
 * Site footer, on ink (dark since 2026-09-24, owner — it was the off-white `mist` surface), so it matches the
 * story band and reads as the page's closing dark block. Marked dark so the header uses its light logo if the
 * footer ever passes under it.
 */
export function Footer() {
  return (
    <footer data-header-theme="dark" className="bg-ink text-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr] md:py-20">
        <div>
          <Link href="/" aria-label={`${site.name} home`} className="inline-block w-40">
            <Logo variant="light" alt="" />
          </Link>
          <p className="mt-6 max-w-sm text-paper/70">Dry van truckload shipping, and a place to build a driving career.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
            {footerNav.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-paper/70 transition-colors duration-300 hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* Not built yet: Privacy Policy, Terms of Service, Driver FAQ, contact info, socials. */}
      <Container className="pb-8 text-sm text-paper/60">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
