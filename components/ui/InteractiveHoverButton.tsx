import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * A pill whose label slides out on hover while a small ink dot grows to fill it, bringing the same label back in
 * white with an arrow (integrated 2026-09-24 from a shadcn snippet, adapted to this codebase: `cx` instead of
 * `cn`, the ink/paper tokens instead of shadcn's background/primary, and a text arrow instead of lucide-react,
 * matching `Button`). Used for the homepage hero's Get a Quote (2026-09-24). Pass `href` to render a Next.js
 * link, omit it for a <button>; every CTA on the site is a link. Keyboard focus plays the same swap as hover.
 *
 * `size="sm"` is the snippet's original fixed 8rem pill; `size="lg"` matches `Button`'s lg height and padding and
 * leaves the width to `className`, so it can line up with other buttons.
 *
 * `size="md"` is the header's 44px pair: the dot sits a fixed 12px in and the label gets a little more room on the
 * left, so the dot never touches a long label like "Apply To Drive".
 *
 * `variant="solid"` is white with an ink dot that fills it ink; `variant="glass"` (the hero's Drive with us) is a
 * matte, frosted pill for dark photos and film, with a white dot that fills it white and brings the label back in
 * ink. The header's pair uses the rest: `ghostLight` (a thin white ring, no fill — over dark bands), `ghostDark`
 * (the same in ink, over light sections) and `ink` (solid black, whose white dot fills it white).
 */
const shell =
  "group relative inline-flex cursor-pointer items-center whitespace-nowrap justify-center overflow-hidden rounded-full border text-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const sizes = {
  sm: { shell: "w-32 p-2", dot: "left-[20%]" },
  md: { shell: "h-11 pl-6 pr-5 text-base", dot: "left-3" },
  lg: { shell: "h-14 px-7 text-base", dot: "left-[20%]" },
};
type Size = keyof typeof sizes;

const variants = {
  solid: { shell: "border-ink/15 bg-paper text-ink", swap: "text-paper", dot: "bg-ink" },
  glass: { shell: "border-paper/25 bg-paper/10 text-paper backdrop-blur-md", swap: "text-ink", dot: "bg-paper" },
  ghostLight: { shell: "border-paper/45 bg-transparent text-paper", swap: "text-ink", dot: "bg-paper" },
  ghostDark: { shell: "border-ink bg-transparent text-ink", swap: "text-paper", dot: "bg-ink" },
  ink: { shell: "border-ink bg-ink text-paper", swap: "text-ink", dot: "bg-paper" },
};
type Variant = keyof typeof variants;

function Inner({ text, variant, size }: { text: string; variant: Variant; size: Size }) {
  return (
    <>
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0 motion-reduce:transition-none">
        {text}
      </span>
      <span
        aria-hidden
        className={cx(
          "absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-focus-visible:-translate-x-1 group-focus-visible:opacity-100 motion-reduce:transition-none",
          variants[variant].swap,
        )}
      >
        <span>{text}</span>
        <span>→</span>
      </span>
      <span
        aria-hidden
        className={cx(
          "absolute top-[40%] size-2 rounded-lg transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:size-full group-hover:scale-[1.8] group-focus-visible:left-0 group-focus-visible:top-0 group-focus-visible:size-full group-focus-visible:scale-[1.8] motion-reduce:transition-none",
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
