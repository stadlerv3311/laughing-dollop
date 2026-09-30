"use client";

import { useRouter } from "next/navigation";
import { useInView, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { InteractiveHoverButton } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_OPEN, quoteLink } from "@/lib/site";

const FIELDS = [
  { name: "pickup", label: "Pickup", placeholder: "City or ZIP", type: "text", icon: "start" },
  { name: "delivery", label: "Delivery", placeholder: "City or ZIP", type: "text", icon: "end" },
  // Owner, 2026-09-25: Pickup date instead of Weight. Weight is still asked on the quote page.
  { name: "date", label: "Pickup date", type: "date", icon: "date" },
] as const satisfies readonly {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  icon: "start" | "end" | "date";
}[];

/** Replays at most this often while someone types a place, so the dot never loops. */
const RIDE_GAP_MS = 3000;

/** Each field's small mark: a hollow dot where the load starts, a solid one where it ends, a calendar for the day. */
function FieldIcon({ icon }: { icon: (typeof FIELDS)[number]["icon"] }) {
  // Hidden between md and lg, where the bar is one row but too narrow for them.
  const className = "size-5 shrink-0 text-ink md:max-lg:hidden";
  if (icon === "date") {
    return (
      <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
        <rect x="3" y="4.5" width="14" height="12" rx="2.5" />
        <path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className}>
      <circle
        cx="10"
        cy="10"
        r="5.25"
        fill={icon === "end" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * The round → between Pickup and Delivery: the two fields are a trip, not a list (Ship with us review point 04, from
 * TravelPerk's "BCN → LGW"). A small orange dot — an accent, the brand colour's allowed size — rides the arrow once
 * each time `ride` changes. It points down on phones, where the fields stack. No dot under reduced motion.
 */
function RouteBadge({ ride, still }: { ride: number; still: boolean }) {
  return (
    <span aria-hidden className="relative flex h-0 items-center justify-center md:h-auto">
      {/* On phones the badge sits on the hairline between the stacked cells. */}
      <span className="absolute inset-x-4 h-px bg-ink/10 md:hidden" />
      <span className="relative z-10 grid size-9 place-items-center rounded-full bg-paper ring-1 ring-ink/10">
        <span className="relative flex rotate-90 items-center md:rotate-0">
          <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-5 text-ink">
            <path d="M2 6h15M13 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!still && ride > 0 && (
            <span
              key={ride}
              className="absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] size-1.5 animate-route-ride rounded-full bg-brand"
            />
          )}
        </span>
      </span>
    </span>
  );
}

/**
 * Ship with us's quote bar (owner's pick "3c", 2026-09-25): the paragraph's "where it's going and when it's ready"
 * as three fields — Pickup, Delivery and Pickup date — then Get a quote, which opens `/quote` with them filled in
 * (`?pickup=…&delivery=…&date=…`) and grows the card into the page as before. All
 * optional: an empty bar just opens the quote page. Nothing is checked here; the quote form does that.
 *
 * One pill from `md`, on white with a soft shadow so it reads as something to type into (2026-09-29, Ship with us review
 * point 03 — it was a 3% grey fill, the page's own weight); each field has a small icon and its name in ink, and Pickup
 * and Delivery are joined by the route badge. On phones the fields stack in a rounded card with the button full width
 * under them. The button is the site's black one — no orange (DECISIONS.md → Brand orange). Without JavaScript it's a
 * plain GET form to the same address.
 */
export function QuoteBar() {
  const router = useRouter();
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const still = useReducedMotion() ?? false;
  const inView = useInView(formRef, { once: true, amount: 0.6 });
  const [ride, setRide] = useState(0);
  const lastRide = useRef(0);

  function playRide() {
    const now = Date.now();
    if (now - lastRide.current < RIDE_GAP_MS) return;
    lastRide.current = now;
    setRide((n) => n + 1);
  }

  // Once, as the bar comes into view.
  useEffect(() => {
    if (inView) playRide();
  }, [inView]);

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
      ref={formRef}
      action={quoteLink.href}
      method="get"
      onSubmit={handleSubmit}
      aria-label="Start a quote"
      className="mx-auto mt-10 flex max-w-[56rem] flex-col gap-2 rounded-3xl bg-paper p-2 text-left shadow-[0_0_0_1px_rgb(37_37_37/0.08),0_1px_2px_rgb(0_0_0/0.04),0_18px_40px_-18px_rgb(0_0_0/0.28)] md:flex-row md:items-center md:rounded-full"
    >
      <div className="flex flex-1 flex-col md:flex-row md:items-center">
        {FIELDS.map((field, i) => (
          <Fragment key={field.name}>
          {i === 1 && <RouteBadge ride={ride} still={still} />}
          {/* Its own element, not a border on the cell: a border on a rounded cell curves at the ends. */}
          {i === 2 && <span aria-hidden className="mx-4 h-px bg-ink/10 md:mx-0 md:h-8 md:w-px" />}
          <label
            htmlFor={`${baseId}-${field.name}`}
            // The whole cell is the target; its shade is the focus mark, since the input itself has no outline.
            className="flex min-w-0 flex-1 cursor-text items-center gap-3 rounded-2xl px-4 py-3 transition-colors focus-within:bg-ink/[0.04] md:rounded-full md:px-5 lg:px-6"
          >
            <FieldIcon icon={field.icon} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium text-ink">{field.label}</span>
              <input
                id={`${baseId}-${field.name}`}
                name={field.name}
                type={field.type}
                // An empty date input shows "mm/dd/yyyy" in full ink; grey it like the other fields' hints until a
                // date is picked.
                data-empty={field.type === "date" ? "true" : undefined}
                onInput={(event) => {
                  if (field.type === "date") event.currentTarget.dataset.empty = String(!event.currentTarget.value);
                  // Typing a place replays the ride, a few seconds apart at most.
                  else playRide();
                }}
                placeholder={"placeholder" in field ? field.placeholder : undefined}
                autoComplete="off"
                maxLength={60}
                className={cx(
                  "mt-0.5 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-ink/50 data-[empty=true]:text-ink/50 sm:text-[17px]",
                  // Room for the whole "mm/dd/yyyy" and the picker icon; Pickup and Delivery give way instead.
                  field.type === "date" && "md:min-w-[8.25rem]",
                )}
              />
            </span>
          </label>
          </Fragment>
        ))}
      </div>
      <InteractiveHoverButton
        type="submit"
        text={quoteLink.label}
        size="lg"
        variant="ink"
        className="w-full shrink-0 md:w-52"
      />
    </form>
  );
}
