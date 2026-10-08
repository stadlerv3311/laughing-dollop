"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FlyArrow, Reveal, RiseLabel, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";

/**
 * The news page's "See more" (owner, 2026-10-07, a box drawn under the cards and a picture of the mock-up's rows:
 * "lets add se more here. and use list after pressing see more"). A button under the cards; pressing it swaps it for
 * the heading "Earlier" and the rest of the posts as a list (`children`, NewsRow lines), which fades up in its place.
 * Under the list a second one, See less, puts it away again (owner, same day, a box drawn under the last line: "now
 * we need an button to move it back").
 *
 * Both are the site's underlined arrow link, not a pill (owner, same day: "lets change the button. not the pill. use
 * another one we use on the page"): the words roll and the arrow flies through on hover, as on All news and Get a
 * quote. The arrow is turned to point down on See more and up on See less, since these open and close what is here
 * and go nowhere.
 *
 * The list is in the page from the start, only hidden, so the posts are in the HTML. Focus follows the press, since
 * the button it was on is gone: to the heading on opening (the page doesn't scroll), and back to See more on closing,
 * which is brought to the middle of the screen, as the page under the reader has just got shorter.
 */
/** The arrow link's look on a button. The 8px above and below make it 44px tall to press. */
const buttonClass =
  "group inline-flex cursor-pointer items-center gap-1.5 py-2 text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export function NewsMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const more = useRef<HTMLButtonElement>(null);
  // Nothing is focused or scrolled on the first render, only after a press.
  const pressed = useRef(false);

  useEffect(() => {
    if (!pressed.current) return;
    if (open) {
      heading.current?.focus({ preventScroll: true });
      return;
    }
    more.current?.focus({ preventScroll: true });
    more.current?.scrollIntoView({ block: "center" });
  }, [open]);

  const toggle = () => {
    pressed.current = true;
    setOpen((now) => !now);
  };

  return (
    <>
      {!open && (
        <div className="mt-8 flex justify-center lg:mt-10">
          <button ref={more} type="button" onClick={toggle} className={buttonClass}>
            <RiseLabel>See more</RiseLabel>
            <FlyArrow className="size-3.5 rotate-135" />
          </button>
        </div>
      )}
      <div hidden={!open} className="mt-16 sm:mt-20 lg:mt-24">
        <Reveal>
          <h2 ref={heading} tabIndex={-1} className={cx(sectionHeadingClass, "outline-none")}>
            Earlier
          </h2>
          <div className="mt-7 lg:mt-10">{children}</div>
        </Reveal>
        {/* The last line's own space below it and this make the gap See more has under the cards. */}
        <div className="mt-1 flex justify-center">
          <button type="button" onClick={toggle} className={buttonClass}>
            <RiseLabel>See less</RiseLabel>
            <FlyArrow className="size-3.5 -rotate-45" />
          </button>
        </div>
      </div>
    </>
  );
}
