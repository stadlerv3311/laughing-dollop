import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * A pill whose label slides out on hover while a small ink dot grows to fill it, bringing the same label back in
 * white with an arrow (integrated 2026-09-24 from a shadcn snippet, adapted to this codebase: `cx` instead of
 * `cn`, the ink/paper tokens instead of shadcn's background/primary, and a text arrow instead of lucide-react,
 * matching `Button`). Used for the homepage hero's two buttons and the header's pair (2026-09-24). Pass `href` to
 * render a Next.js link, omit it for a <button>; every CTA on the site is a link. Keyboard focus plays the same
 * swap as hover.
 *
 * Sizes: `sm` is the snippet's original fixed 8rem pill; `lg` matches `Button`'s lg height and padding and leaves
 * the width to `className`, so it can line up with other buttons; `md` is the header's 40px pair, with the dot a
 * fixed 12px in and a little more room left of the label, so the dot never touches "Apply To Drive".
 *
 * Variants: `solid` is white with an ink dot that fills it ink (the hero's Get a Quote). `ghostLight` is a thin
 * white ring with no fill whose white dot fills it and brings the label back in ink (the hero's Drive with us).
 * `ghostQuiet` is a fainter, lighter-weight version for the header over dark bands, so it sits back behind the
 * hero's buttons. `ghostDark` is the ring in ink over light sections, and `ink` is solid black, filling white.
 *
 * The group is named (`group/ihb`) so only the hovered button plays: the header itself is a `group`, and a plain
 * `group-hover` would fire for every button inside it whenever the pointer is anywhere over the header.
 */
const shell =
  "group/ihb relative inline-flex cursor-pointer items-center whitespace-nowrap justify-center overflow-hidden rounded-full border text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const sizes = {
  sm: { shell: "w-32 p-2", dot: "left-[20%]" },
  md: { shell: "h-10 pl-6 pr-5 text-[15px]", dot: "left-3" },
  lg: { shell: "h-14 px-7 text-base", dot: "left-[20%]" },
};
type Size = keyof typeof sizes;

const variants = {
  solid: { shell: "border-ink/15 bg-paper font-semibold text-ink", swap: "text-paper", dot: "bg-ink" },
  ghostLight: { shell: "border-paper/45 bg-transparent font-semibold text-paper", swap: "text-ink", dot: "bg-paper" },
  ghostQuiet: { shell: "border-paper/20 bg-transparent font-medium text-paper/80", swap: "text-ink", dot: "bg-paper/80 group-hover/ihb:bg-paper group-focus-visible/ihb:bg-paper" },
  ghostDark: { shell: "border-ink bg-transparent font-semibold text-ink", swap: "text-paper", dot: "bg-ink" },
  ink: { shell: "border-ink bg-ink font-semibold text-paper", swap: "text-ink", dot: "bg-paper" },
};
type Variant = keyof typeof variants;

function Inner({ text, variant, size }: { text: string; variant: Variant; size: Size }) {
  return (
    <>
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover/ihb:translate-x-12 group-hover/ihb:opacity-0 group-focus-visible/ihb:translate-x-12 group-focus-visible/ihb:opacity-0 motion-reduce:transition-none">
        {text}
      </span>
      <span
        aria-hidden
        className={cx(
          "absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover/ihb:-translate-x-1 group-hover/ihb:opacity-100 group-focus-visible/ihb:-translate-x-1 group-focus-visible/ihb:opacity-100 motion-reduce:transition-none",
          variants[variant].swap,
        )}
      >
        <span>{text}</span>
        <span>→</span>
      </span>
      <span
        aria-hidden
        className={cx(
          "absolute top-[40%] size-2 rounded-lg transition-all duration-300 group-hover/ihb:left-0 group-hover/ihb:top-0 group-hover/ihb:size-full group-hover/ihb:scale-[1.8] group-focus-visible/ihb:left-0 group-focus-visible/ihb:top-0 group-focus-visible/ihb:size-full group-focus-visible/ihb:scale-[1.8] motion-reduce:transition-none",
          sizes[size].dot,
          variants[variant].dot,
        )}
      />
    </>
  );
}

type Common = { text?: string; size?: Size; variant?: Variant; className?: string };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function InteractiveHoverButton(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { text = "Button", size = "sm", variant = "solid", className, ...linkProps } = props;
    return (
      <Link className={cx(shell, variants[variant].shell, sizes[size].shell, className)} {...linkProps}>
        <Inner text={text} variant={variant} size={size} />
      </Link>
    );
  }
  const { text = "Button", size = "sm", variant = "solid", className, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={cx(shell, variants[variant].shell, sizes[size].shell, className)} {...buttonProps}>
      <Inner text={text} variant={variant} size={size} />
    </button>
  );
}
