import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "apply" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-[background-color,color,box-shadow,transform] duration-300 ease-premium active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// Black and outlined-black since 2026-09-19 (owner): the orange buttons were replaced site-wide, so orange is
// left for the logo, the active marks and small accents. Both variants share one type size, so a pair of
// them sized alike reads as a matched set.
const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-black",
  // Apply To Drive only: black at rest, brand orange on hover (owner, 2026-09-19). White on orange is 3.70:1,
  // under AA for 16px text, but only while hovered — at rest it's white on black.
  apply: "bg-ink text-paper hover:bg-brand",
  // A light fill under the ring, so it still reads over the intro scene and photos.
  outline: "bg-paper/70 text-ink ring-[1.5px] ring-inset ring-ink backdrop-blur-xl hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7",
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = StyleProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type NativeButtonProps = StyleProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

/** Pill button. Pass `href` to render a Next.js link, omit it for a <button>. */
export function Button(props: LinkButtonProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", size = "md", className, children, ...linkProps } = props;
    return (
      <Link className={cx(base, variants[variant], sizes[size], className)} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", size = "md", className, children, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={cx(base, variants[variant], sizes[size], className)} {...buttonProps}>
      {children}
    </button>
  );
}
