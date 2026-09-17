import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "dark" | "outline" | "glass";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-[background-color,color,box-shadow,filter,transform] duration-300 ease-premium active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// White on #FF3000 is 3.70:1 — it only passes WCAG AA as large text, so primary
// buttons are always 19px bold. See docs/ARCHITECTURE.md → Orange contrast rules.
const variants: Record<Variant, string> = {
  primary: "bg-brand text-paper text-[19px] font-bold hover:brightness-[0.92]",
  dark: "bg-ink text-paper text-base font-semibold hover:bg-black",
  outline: "text-ink text-base font-semibold ring-1 ring-inset ring-ink/20 hover:ring-ink/60",
  // Frosted pill for use over photos and the header — matches the header's nav pill.
  glass:
    "bg-paper/55 text-ink text-base font-semibold ring-1 ring-inset ring-ink/10 shadow-[0_8px_32px_rgb(37_37_37/0.08)] backdrop-blur-xl backdrop-saturate-150 hover:bg-paper/85",
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
