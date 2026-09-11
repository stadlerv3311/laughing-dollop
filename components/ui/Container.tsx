import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/** Centered page-width wrapper with consistent side padding. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 sm:px-8", className)} {...props} />;
}
