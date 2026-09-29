import { Reveal } from "./Reveal";

export type Step = { title: string; body: string };

/**
 * "What happens next" (owner, 2026-09-28, from the Samsara review): the steps after a form, so nobody has to guess
 * what pressing the button leads to. Numbered circles on one hairline, three across from `sm`, stacked on phones;
 * the first circle is filled, as the step you're on. Used under the quote form and on the careers page. Steps say
 * only what the site already promises — no timings until the owner confirms them.
 */
export function NextSteps({ title = "What happens next", steps, className }: { title?: string; steps: readonly Step[]; className?: string }) {
  return (
    <section aria-label={title} className={className}>
      <Reveal>
        <h2 className="text-sm font-semibold text-ink/70">{title}</h2>
        <ol className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative border-t border-ink/12 pt-8">
              <span
                aria-hidden
                className={
                  i === 0
                    ? "absolute -top-3.5 left-0 grid size-7 place-items-center rounded-full bg-ink text-xs font-medium text-paper"
                    : "absolute -top-3.5 left-0 grid size-7 place-items-center rounded-full border border-ink/40 bg-paper text-xs font-medium"
                }
              >
                {i + 1}
              </span>
              <h3 className="text-lg font-medium tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-1.5 max-w-[18rem] text-pretty leading-relaxed text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
