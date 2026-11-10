import Link from "next/link";
import { Container, Logo } from "@/components/ui";
import { applyLink, company, footerGroups, quoteLink, site } from "@/lib/site";
import { CopyrightYear } from "./CopyrightYear";

/** The footer's three text styles, and no others. */
const headingClass = "text-[0.8125rem] font-semibold leading-snug text-ink";
const lineClass = "text-[0.8125rem] leading-snug text-ink/80";
const linkClass = `${lineClass} transition-colors duration-300 hover:text-ink`;
const fineClass = "text-xs leading-relaxed text-ink/70";

/** Each column: its heading and its lines, each a link or plain text. */
type Line = { label: string; href?: string; external?: boolean };
type Column = { heading: string; lines: Line[] };

/**
 * Site footer, on white since 2026-10-05 (owner: "make the footer white to balance out the page").
 *
 * "A", pure Apple (the builder, 2026-11-10, of three mock-ups: "go with A, pure Apple and remove copy from the
 * footer"; the brief was to cut the footer's seven text styles to three and make it Apple-like). Four columns of
 * small type: Shipping, Company, Contact and Find us. Three styles only: the column heading (13px semibold, ink), the
 * line under it (13px regular, ink at 80%) and the fine print (12px, ink at 70%), all Geist. Get a quote and Apply now
 * are links in the Shipping and Company columns; the phone number, the email and the two social pages are plain links
 * in Contact. Replaces "B" (2026-10-13), which led with the phone number at 76px, the email at 24px with a copy
 * button, round social links, 22px page links and two ring buttons. The one hairline over the bottom row stays. Contact
 * details from the FMCSA record (lib/site.ts → `company`); the email and the two social links there are stand-ins.
 */
export function Footer() {
  const columns: Column[] = [
    ...footerGroups.map((group) => ({ heading: group.label, lines: [...group.links] })),
    {
      heading: "Contact",
      lines: [
        company.phone,
        company.email,
        ...company.socials.map((social) => ({ label: social.name, href: social.href, external: true })),
      ],
    },
    { heading: "Find us", lines: company.address.map((label) => ({ label })) },
  ];
  // The two asks close their columns: a shipper's under Shipping, a driver's under Company, next to Careers.
  columns[0].lines.push(quoteLink);
  columns[1].lines.push(applyLink);

  return (
    <footer className="bg-paper text-ink">
      <Container>
        {/* The homepage's step, 64px on phones and 70px from `sm`, from the footer's top edge to the headings. Two
            columns below `md`, four from `md`. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 pb-12 pt-[3.875rem] sm:pt-[4.25rem] md:grid-cols-4">
          {/* Below `sm` Contact and Find us have a row each: in half a phone's width the email broke inside a word. */}
          {columns.map((column, i) => (
            <div key={column.heading} className={i >= 2 ? "min-w-0 max-sm:col-span-2" : "min-w-0"}>
              <p className={headingClass}>{column.heading}</p>
              <ul className="mt-3 space-y-1.5">
                {column.lines.map((line) => (
                  <li key={line.label}>
                    {line.href ? (
                      line.href.startsWith("/") ? (
                        <Link href={line.href} className={linkClass}>
                          {line.label}
                        </Link>
                      ) : (
                        <a
                          href={line.href}
                          {...(line.external
                            ? { target: "_blank", rel: "noreferrer", "aria-label": `${site.name} on ${line.label}` }
                            : {})}
                          className={`${linkClass} [overflow-wrap:anywhere]`}
                        >
                          {line.label}
                        </a>
                      )
                    ) : (
                      <span className={lineClass}>{line.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Not built yet: Privacy Policy and Terms of Service. */}
        <div className="flex flex-col-reverse gap-4 border-t border-ink/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:pb-7">
          <p className={`${fineClass} flex flex-wrap gap-x-5 gap-y-0.5`}>
            <span>
              © <CopyrightYear built={new Date().getFullYear()} /> {company.legalName}
            </span>
            <span>USDOT {company.usdot}</span>
            <span>{company.mc}</span>
            {/* The credit GeoNames' licence asks for (CC BY 4.0): the quote form's ZIP → city list is theirs (public/zip). */}
            <span>
              ZIP code data:{" "}
              <a href="https://www.geonames.org" rel="noreferrer" className="underline underline-offset-2 transition-colors duration-300 hover:text-ink">
                GeoNames
              </a>
            </span>
          </p>
          <Link href="/" aria-label={`${site.name} home`} className="block w-24 shrink-0">
            <Logo alt="" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
