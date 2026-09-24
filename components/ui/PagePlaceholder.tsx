import { cx } from "@/lib/cx";
import { Container } from "./Container";
import { labelClass } from "./typography";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Temporary page body for routes that exist in the nav but aren't built yet. */
export function PagePlaceholder({ eyebrow, title, description }: PagePlaceholderProps) {
  return (
    <section className="pb-32 pt-40">
      <Container>
        <p className={cx(labelClass, "text-ink/70")}>{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">{description}</p>
      </Container>
    </section>
  );
}
