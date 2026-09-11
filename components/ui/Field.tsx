import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Shared look for text inputs and selects. Invalid controls (`aria-invalid`) get an orange ring —
 * fine for a border (3:1 needed), while the error text itself stays near-black.
 */
export const controlClass =
  "h-12 w-full rounded-xl bg-paper px-4 text-base text-ink outline-none ring-1 ring-inset ring-ink/15 transition-shadow duration-200 placeholder:text-ink/45 hover:ring-ink/30 focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-brand";

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** Label, control and error message for one form field. Give the control `id` and, when there's an error, `aria-describedby={errorId(id)}`. */
export function Field({ id, label, optional, error, className, children }: FieldProps) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-ink/70"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={errorId(id)} className="flex items-start gap-2 text-sm font-medium">
          <span
            aria-hidden
            className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold leading-none text-paper"
          >
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
}

export function errorId(id: string) {
  return `${id}-error`;
}
