"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Reveal, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";

/**
 * The news page's "See more" (owner, 2026-10-07, a box drawn under the cards and a picture of the mock-up's rows:
 * "lets add se more here. and use list after pressing see more"). A pill under the cards; pressing it swaps it for
 * the heading "Earlier" and the rest of the posts as a list (`children`, NewsRow lines), which fades up in its place.
 *
 * One way: there is nothing to close. The list is in the page from the start, only hidden, so the posts are in the
 * HTML. Focus moves to the heading when it opens, since the button it was on is gone; the page doesn't scroll.
 */
export function NewsMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      {!open && (
        <div className="mt-10 flex justify-center lg:mt-12">
          <Button variant="outline" onClick={() => setOpen(true)}>
            See more
          </Button>
        </div>
      )}
      <div hidden={!open} className="mt-16 sm:mt-20 lg:mt-24">
        <Reveal>
          <h2 ref={heading} tabIndex={-1} className={cx(sectionHeadingClass, "outline-none")}>
            Earlier
          </h2>
          <div className="mt-7 lg:mt-10">{children}</div>
        </Reveal>
      </div>
    </>
  );
}
