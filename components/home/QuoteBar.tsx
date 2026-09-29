"use client";

import { useRouter } from "next/navigation";
import { Fragment, useId, type FormEvent } from "react";
import { InteractiveHoverButton } from "@/components/ui";
import { QUOTE_OPEN, quoteLink } from "@/lib/site";

const FIELDS = [
  { name: "pickup", label: "Pickup", placeholder: "City or ZIP", type: "text" },
  { name: "delivery", label: "Delivery", placeholder: "City or ZIP", type: "text" },
  // Owner, 2026-09-25: Pickup date instead of Weight. Weight is still asked on the quote page.
  { name: "date", label: "Pickup date", type: "date" },
] as const satisfies readonly { name: string; label: string; type: string; placeholder?: string }[];

/**
 * Ship with us's quote bar (owner's pick "3c", 2026-09-25): the paragraph's "where it's going and when it's ready"
 * as three fields — Pickup, Delivery and Pickup date — then Get a quote, which opens `/quote` with them filled in
 * (`?pickup=…&delivery=…&date=…`) and grows the card into the page as before. All
 * optional: an empty bar just opens the quote page. Nothing is checked here; the quote form does that.
 *
 * One pill from `sm`, cells split by short hairlines; on phones the fields stack in a rounded card with the button full
 * width under them. The button is the site's black one — no orange (DECISIONS.md → Brand orange). Without
 * JavaScript it's a plain GET form to the same address.
 */
export function QuoteBar() {
  const router = useRouter();
  const baseId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim()) params.set(key, value.trim());
    }
    const query = params.toString();
    router.push(query ? `${quoteLink.href}?${query}` : quoteLink.href, { transitionTypes: [QUOTE_OPEN] });
  }

  return (
    <form
      action={quoteLink.href}
      method="get"
      onSubmit={handleSubmit}
      aria-label="Start a quote"
      className="mx-auto mt-10 flex max-w-[56rem] flex-col gap-2 rounded-3xl border border-ink/10 bg-ink/[0.03] p-2 text-left sm:flex-row sm:items-center sm:rounded-full"
    >
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center">
        {FIELDS.map((field, i) => (
          <Fragment key={field.name}>
          {/* Its own element, not a border on the cell: a border on a rounded cell curves at the ends. */}
          {i > 0 && <span aria-hidden className="mx-4 h-px bg-ink/10 sm:mx-0 sm:h-8 sm:w-px" />}
          <label
            htmlFor={`${baseId}-${field.name}`}
            // The whole cell is the target; its shade is the focus mark, since the input itself has no outline.
            className="flex flex-1 cursor-text flex-col rounded-2xl px-4 py-3 transition-colors focus-within:bg-ink/[0.05] sm:rounded-full sm:px-7"
          >
            <span className="text-[13px] font-medium text-ink/70">{field.label}</span>
            <input
              id={`${baseId}-${field.name}`}
              name={field.name}
              type={field.type}
              // An empty date input shows "mm/dd/yyyy" in full ink; grey it like the other fields' hints until a
              // date is picked.
              data-empty={field.type === "date" ? "true" : undefined}
              onInput={
                field.type === "date"
                  ? (event) => (event.currentTarget.dataset.empty = String(!event.currentTarget.value))
                  : undefined
              }
              placeholder={"placeholder" in field ? field.placeholder : undefined}
              autoComplete="off"
              maxLength={60}
              className="mt-0.5 w-full min-w-0 bg-transparent text-base text-ink sm:text-[17px] outline-none placeholder:text-ink/40 data-[empty=true]:text-ink/40"
            />
          </label>
          </Fragment>
        ))}
      </div>
      <InteractiveHoverButton
        type="submit"
        text={quoteLink.label}
        size="lg"
        variant="ink"
        className="w-full shrink-0 sm:w-52"
      />
    </form>
  );
}
