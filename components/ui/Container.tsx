import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * Full-width wrapper that holds the page's side margins. Below `desktop` (1200px) it's the ordinary
 * phone/tablet padding; from `desktop` up, content caps at 1200px and centers, so the margin is whatever's
 * left of the viewport (360px either side at a 1920px-wide screen, growing beyond that on wider screens
 * instead of the content growing) — see ARCHITECTURE.md → Layout grid.
 */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("w-full px-5 sm:px-8 desktop:mx-auto desktop:max-w-[75rem] desktop:px-0", className)} {...props} />
  );
}
