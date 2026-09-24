import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * A pill whose label slides out on hover while a small ink dot grows to fill it, bringing the same label back in
 * white with an arrow (integrated 2026-09-24 from a shadcn snippet, adapted to this codebase: `cx` instead of
 * `cn`, the ink/paper tokens instead of shadcn's background/primary, and a text arrow instead of lucide-react,
 * matching `Button`). Not used on any page yet — where it goes is an open design call (docs/DECISIONS.md → Open).
 * Pass `href` to render a Next.js link, omit it for a <button>; every CTA on the site is a link.
 */
const shell =
  "group relative inline-flex w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-ink/15 bg-paper p-2 text-center font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

function Inner({ text }: { text: string }) {
  return (
    <>
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 motion-reduce:transition-none">
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-paper opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 motion-reduce:transition-none"
      >
        <span>{text}</span>
        <span>→</span>
      </span>
      <span
        aria-hidden
        className="absolute left-[20%] top-[40%] size-2 rounded-lg bg-ink transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:size-full group-hover:scale-[1.8] motion-reduce:transition-none"
      />
    </>
  );
}

type Common = { text?: string; className?: string };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function InteractiveHoverButton(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { text = "Button", className, ...linkProps } = props;
    return (
      <Link className={cx(shell, className)} {...linkProps}>
        <Inner text={text} />
      </Link>
    );
  }
  const { text = "Button", className, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={cx(shell, className)} {...buttonProps}>
      <Inner text={text} />
    </button>
  );
}
