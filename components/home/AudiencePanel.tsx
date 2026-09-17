import { Button } from "@/components/ui";
import { cx } from "@/lib/cx";

type AudiencePanelProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  tone: "light" | "dark";
};

/**
 * One half of the homepage "Ship With Us" / "Drive For Us" split — a band, not a card.
 * The two halves sit flush against each other and bleed to the screen edges: on phones they stack and
 * each pulls its background out past the page gutter, and from `md` the parent paints both halves
 * (see AudienceSplit) so this one only carries the gutter that keeps text off the seam.
 */
export function AudiencePanel({ eyebrow, title, body, cta, tone }: AudiencePanelProps) {
  const dark = tone === "dark";

  return (
    <article
      className={cx(
        // Negative margin cancels the Container's padding, so the background reaches the screen edge
        // while the text stays on the page's grid.
        "-mx-5 px-5 sm:-mx-8 sm:px-8 md:mx-0 md:px-0",
        dark ? "bg-ink text-paper md:bg-transparent" : "bg-mist text-ink md:bg-transparent",
      )}
    >
      <div
        className={cx(
          "flex min-h-[24rem] flex-col justify-between py-14 sm:py-20",
          dark ? "md:pl-10 lg:pl-16" : "md:pr-10 lg:pr-16",
        )}
      >
        <div>
          <p className={cx("text-sm font-semibold", dark ? "text-paper/60" : "text-ink/60")}>{eyebrow}</p>
          <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
          <p className={cx("mt-4 max-w-md text-lg", dark ? "text-paper/70" : "text-ink/70")}>{body}</p>
        </div>

        <div className="mt-10">
          <Button href={cta.href} variant={dark ? "primary" : "dark"} size="lg">
            {cta.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
