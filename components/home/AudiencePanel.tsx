import { Button } from "@/components/ui";
import { cx } from "@/lib/cx";

type AudiencePanelProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  tone: "light" | "dark";
};

/** One half of the homepage "Ship With Us" / "Drive For Us" split. */
export function AudiencePanel({ eyebrow, title, body, cta, tone }: AudiencePanelProps) {
  const dark = tone === "dark";

  return (
    <article
      className={cx(
        "flex h-full min-h-[26rem] flex-col justify-between rounded-[2rem] p-8 sm:p-10",
        dark ? "bg-ink text-paper" : "bg-mist text-ink",
      )}
    >
      <div>
        <p
          className={cx(
            "flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]",
            dark ? "text-paper/70" : "text-ink/70",
          )}
        >
          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="mt-6 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
        <p className={cx("mt-4 max-w-md text-lg", dark ? "text-paper/70" : "text-ink/70")}>{body}</p>
      </div>

      <div className="mt-10">
        <Button href={cta.href} variant={dark ? "primary" : "dark"} size="lg">
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
