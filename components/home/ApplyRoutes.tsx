import Image from "next/image";
import Link from "next/link";
import { Container, Reveal, sectionHeadingClass } from "@/components/ui";
import { applyLink, applyRoutes } from "@/lib/site";

/**
 * Three ways into the same short application, sitting where the full-width photo band used to be
 * (requested 2026-09-17). The truck photo moved in here as the driver card, which is why this replaced
 * the band rather than joining it.
 *
 * Flat cards: a photo, a role and a line, with no box around them — no radius, no shadow, no inset panel,
 * so they sit on the page rather than floating above it (docs/DECISIONS.md → Homepage section look). The
 * photo is the card's only surface, and it's also what carries the hover.
 */
// Draft copy — swap in approved wording when it's ready.
export function ApplyRoutes() {
  return (
    <section aria-labelledby="apply-routes" className="bg-paper pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <Reveal>
          <h2 id="apply-routes" className={sectionHeadingClass}>
            Where you&rsquo;d fit.
          </h2>
          <p className="mt-3 text-ink/70">Five short questions for any of them, then HR calls you back.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 sm:mt-10">
          <ul className="grid gap-10 sm:gap-8 md:grid-cols-3">
            {applyRoutes.map((route) => (
              <li key={route.role}>
                {/*
                  The whole card is the link — a card-sized target, unlike the story band's full-width one.
                  Everything inside is presentational, so there's one tab stop per role.
                */}
                <Link
                  href={route.href}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {/*
                    Near-square from `md` up, so the three of them together stand about as tall as the 500px
                    photo band they replaced — at 3:2 they read as thumbnails under a 72px headline.
                  */}
                  <div className="relative aspect-3/2 overflow-hidden bg-ink md:aspect-square">
                    {/*
                      All three sit on the first screen, so none of them is reliably the largest paint —
                      the case Next's docs say to load eagerly rather than preload.
                    */}
                    <Image
                      src={route.image.src}
                      alt={route.image.alt}
                      fill
                      loading="eager"
                      sizes="(width >= 48rem) 33vw, (width >= 40rem) 90vw, 100vw"
                      style={route.image.position ? { objectPosition: route.image.position } : undefined}
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{route.role}</h3>
                  <p className="mt-1.5 text-ink/70">{route.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold underline decoration-ink/25 underline-offset-4 transition-colors duration-300 group-hover:decoration-brand">
                    {applyLink.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
