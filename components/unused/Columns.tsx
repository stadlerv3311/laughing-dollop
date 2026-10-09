import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * The site's invisible column grid — for content that should line up across sections without hand-matched
 * widths. 12 columns / 24px gutters from `desktop` (1200px), 8 / 20px from `sm`, 4 / 16px on phones. Put this
 * inside a `Container` (it doesn't set its own margins) and size children with `col-span-*` / `col-start-*`.
 */
export function Columns({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cx("grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-5 desktop:grid-cols-12 desktop:gap-6", className)}
      {...props}
    />
  );
}
