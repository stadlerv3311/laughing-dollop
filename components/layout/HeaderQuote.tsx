"use client";

import { useRouter } from "next/navigation";
import { useId, type FormEvent } from "react";
import { InteractiveHoverButton } from "@/components/ui";
import { cx } from "@/lib/cx";
import { quoteLink } from "@/lib/site";

const FIELDS = [
  { name: "pickup", label: "Pickup" },
  { name: "delivery", label: "Delivery" },
] as const;

/**
 * The header's small quote bar (owner, 2026-09-28, from the Samsara review): once the homepage hero has scrolled
 * away, Pickup and Delivery take the nav links' place, so the next step is always one field away. It opens
 * `/quote` with them filled in, the same address Ship with us's quote bar uses (`?pickup=…&delivery=…`); both are
 * optional, and the quote page checks them. From `lg` only — the Header decides when it shows. Without JavaScript
 * it's a plain GET form.
 */
export function HeaderQuote({
  className,
  inert,
  onFocusChange,
}: {
  className?: string;
  inert?: boolean;
  onFocusChange?: (focused: boolean) => void;
}) {
  const router = useRouter();
  const baseId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim()) params.set(key, value.trim());
    }
    const query = params.toString();
    router.push(query ? `${quoteLink.href}?${query}` : quoteLink.href);
  }

  return (
    <form
      action={quoteLink.href}
      method="get"
      onSubmit={handleSubmit}
      aria-label="Start a quote"
      inert={inert}
      onFocus={() => onFocusChange?.(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange?.(false);
      }}
      className={cx("flex items-center rounded-full border border-ink/10 bg-ink/[0.03] p-[3px]", className)}
    >
      {FIELDS.map((field, i) => (
        <label key={field.name} htmlFor={`${baseId}-${field.name}`} className="flex items-center">
          {/* Its own element, like the Ship with us bar's: a border on a rounded cell would curve. */}
          {i > 0 && <span aria-hidden className="h-5 w-px bg-ink/10" />}
          <span className="sr-only">{field.label}, city or ZIP</span>
          <input
            id={`${baseId}-${field.name}`}
            name={field.name}
            placeholder={field.label}
            autoComplete="off"
            maxLength={60}
            className="h-10 w-32 rounded-full bg-transparent px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/50 focus:bg-ink/[0.05] xl:w-36"
          />
        </label>
      ))}
      <InteractiveHoverButton type="submit" text={quoteLink.label} size="md" variant="ink" className="shrink-0" />
    </form>
  );
}
