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
 */
const shell =
  "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-ink/15 bg-paper text-center font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const sizes = { sm: "w-32 p-2", lg: "h-14 px-7 text-base" };

function Inner({ text }: { text: string }) {
  return (
    <>
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0 motion-reduce:transition-none">
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-paper opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-focus-visible:-translate-x-1 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        <span>{text}</span>
        <span>→</span>
      </span>
      <span
        aria-hidden
        className="absolute left-[20%] top-[40%] size-2 rounded-lg bg-ink transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:size-full group-hover:scale-[1.8] group-focus-visible:left-0 group-focus-visible:top-0 group-focus-visible:size-full group-focus-visible:scale-[1.8] motion-reduce:transition-none"
      />
    </>
  );
}

type Common = { text?: string; size?: keyof typeof sizes; className?: string };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function InteractiveHoverButton(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { text = "Button", size = "sm", className, ...linkProps } = props;
    return (
      <Link className={cx(shell, sizes[size], className)} {...linkProps}>
        <Inner text={text} />
      </Link>
    );
  }
  const { text = "Button", size = "sm", className, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={cx(shell, sizes[size], className)} {...buttonProps}>
      <Inner text={text} />
    </button>
  );
}
