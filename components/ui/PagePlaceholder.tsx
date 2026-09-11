import { Container } from "./Container";

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
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">{description}</p>
      </Container>
    </section>
  );
}
