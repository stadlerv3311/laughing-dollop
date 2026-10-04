"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Container,
  Reveal,
  chapterHeadingClass,
  chapterY,
  labelClass,
} from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, applyRoutes, whyWorkWithUs, type WorkSeat } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
/** How long a card has to stay open before the reasons follow it, so sweeping across the cards doesn't flicker them. */
const FOLLOW_MS = 120;

/**
 * Why work with us — the homepage's careers section and the end of the page (owner, 2026-09-30, version "A1" of the
 * careers mock-ups). It took over from Why drive for us, the rolling slogans and the apply cards.
 *
 * The label and heading (the story paragraph beside the heading came out on 2026-10-01, owner), then pictures that
 * open up with words beside them that follow the open one, as in the safety band. The pictures are the apply cards, unchanged except that they
 * no longer link anywhere: a card opens on hover, focus or tap, and the five reasons beside it roll to that job. The
 * black Apply now under the cards came out (owner, 2026-09-30); since 2026-10-01 an "Apply now" link closes the
 * reasons column instead (ApplyLink), on the same screen as the cards.
 *
 * Grey and black only — orange stays with Our story (owner, 2026-09-30). The heading rises in, and on a job change
 * only "Why ___ stay." and the reasons move. From `xl` the cards and reasons share a row (reasons on columns 8–12);
 * below that the reasons go under the cards, and below `md` the cards are a short row where only the open one is
 * captioned. Copy in lib/site.ts → `whyWorkWithUs` (draft for the office and shop).
 */
export function WhyWorkWithUs() {
  const seats = whyWorkWithUs.seats as readonly WorkSeat[];
  const [open, setOpen] = useState(0);
  // The job the reasons show — follows `open` after a short pause.
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState(0);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    if (open === shown) return;
    const id = window.setTimeout(
      () => {
        setShown(open);
        setActive(0);
      },
      still ? 0 : FOLLOW_MS,
    );
    return () => window.clearTimeout(id);
  }, [open, shown, still]);

  const seat = seats[shown];

  return (
    <section aria-labelledby="why-work-title" className={cx("bg-paper", chapterY)}>
      <Container>
        {/* Label and heading only: the story paragraph beside them came out on 2026-10-01 (owner). */}
        <div>
          <Reveal>
            <p className={cx(labelClass, "text-ink/70")}>{whyWorkWithUs.label}</p>
          </Reveal>
          <RiseHeading id="why-work-title" lines={whyWorkWithUs.heading} className="mt-4" />
        </div>

        <div className="mt-12 grid gap-y-10 lg:mt-16 xl:grid-cols-12 xl:gap-x-6">
          <Reveal className="xl:col-span-7">
            <ul aria-label="Pick a job" className="flex h-72 gap-2 sm:h-80 sm:gap-3 md:h-[28rem] lg:h-[32rem] xl:h-[34rem]">
              {applyRoutes.map((card, i) => (
                <JobCard key={card.job} card={card} isOpen={open === i} onOpen={() => setOpen(i)} />
              ))}
            </ul>
          </Reveal>

          {/* From xl the column is as tall as the cards, so the link sits level with their foot. */}
          <Reveal
            delay={0.1}
            className="flex max-w-2xl flex-col items-start gap-10 xl:col-span-5 xl:max-w-none xl:justify-between xl:gap-8 xl:pl-10"
          >
            <Reasons seat={seat} seats={seats} active={active} onActive={setActive} still={still} />
            <ApplyLink />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/** The heading's two lines rising in from behind their own edges, like Our story's — all ink here, no accent. */
function RiseHeading({ id, lines, className }: { id: string; lines: readonly string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const still = useReducedMotion() ?? false;
  return (
    <h2 ref={ref} id={id} className={cx(chapterHeadingClass, className)}>
      {lines.map((line, i) => (
        <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block text-balance"
            initial={{ y: "120%" }}
            animate={inView ? { y: 0 } : undefined}
            transition={still ? { duration: 0 } : { duration: 0.9, delay: 0.1 + i * 0.15, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/**
 * One apply card, as on the old Where you'd fit. band — photo, dark foot, role and job, the job's line when open —
 * minus its Apply now: it's a button that opens it, not a link. Square corners, no box.
 */
function JobCard({
  card,
  isOpen,
  onOpen,
}: {
  card: (typeof applyRoutes)[number];
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <li
      className={cx(
        "relative min-w-0 basis-0 transition-[flex-grow] duration-700 ease-premium motion-reduce:transition-none",
        isOpen ? "grow-[2.4]" : "grow",
      )}
    >
      <button
        type="button"
        aria-pressed={isOpen}
        onMouseEnter={onOpen}
        onFocus={onOpen}
        onClick={onOpen}
        className="group absolute inset-0 block w-full cursor-pointer overflow-hidden bg-ink text-left text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {/* The words on the card name the button; the photo is decoration here. */}
        <Image
          src={card.image.src}
          alt=""
          fill
          loading="eager"
          sizes="(width >= 80rem) 40vw, 70vw"
          style={card.image.position ? { objectPosition: card.image.position } : undefined}
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
        />
        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

        {/* Below `md` the closed cards are too narrow for words, so only the open one is captioned. */}
        <span
          className={cx(
            "absolute inset-x-4 bottom-4 block transition-opacity duration-500 sm:inset-x-5 sm:bottom-5 lg:inset-x-7 lg:bottom-7 xl:inset-x-5 xl:bottom-5",
            !isOpen && "max-md:opacity-0",
          )}
        >
          <span className="block text-sm text-paper/80">{card.role}</span>
          <span className="mt-1 block text-xl font-medium leading-tight tracking-[-0.025em] lg:text-[1.75rem] xl:text-[1.375rem]">
            {card.title}
          </span>
          <span
            className={cx(
              "hidden overflow-hidden transition-[opacity,max-height] duration-500 ease-premium motion-reduce:transition-none md:block md:w-[24rem] md:max-w-full",
              isOpen ? "max-h-40 opacity-100 md:delay-200" : "max-h-0 opacity-0",
            )}
          >
            <span className="mt-2 block max-w-[24rem] text-pretty leading-relaxed text-paper/80">{card.body}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

/**
 * "Why ___ stay." and the open job's five reasons as rows (no dividers since 2026-10-02): titles in grey, the open row in ink with its
 * line. Hover or focus a row to open it. On a job change the word and then each row roll over, one after another.
 */
function Reasons({
  seat,
  seats,
  active,
  onActive,
  still,
}: {
  seat: WorkSeat;
  seats: readonly WorkSeat[];
  active: number;
  onActive: (i: number) => void;
  still: boolean;
}) {
  return (
    <div>
      <h3 className="text-[1.75rem] font-medium leading-[1.15] tracking-[-0.035em] sm:text-[1.875rem]">
        {/* Screen readers get the plain sentence, announced when the job changes; the rolling word is for the eye. */}
        <span className="sr-only" aria-live="polite">
          Why {seat.who} stay.
        </span>
        <span aria-hidden>
          <span className="text-ink/60">Why</span>{" "}
          <RollingWord word={seat.who} words={seats.map((s) => s.who)} still={still} />{" "}
          <span className="text-ink/60">stay.</span>
        </span>
      </h3>

      <ul className="mt-5">
        {seat.reasons.map((reason, i) => {
          const on = active === i;
          return (
            <li key={i}>
              <button
                type="button"
                aria-expanded={on}
                onMouseEnter={() => onActive(i)}
                onFocus={() => onActive(i)}
                onClick={() => onActive(i)}
                className="grid w-full cursor-pointer grid-cols-[1.75rem_minmax(0,1fr)] py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span
                  aria-hidden
                  className={cx("pt-0.5 text-[13px] tabular-nums transition-colors duration-300", on ? "text-ink" : "text-ink/40")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <Roll id={`${seat.job}-t${i}`} delay={i * 0.07} still={still}>
                    {/* The site's small-text grey (ink/70, 5.7:1), not the slogans' /60, which is for large type only. */}
                    <span
                      className={cx(
                        "block text-lg font-medium leading-snug tracking-[-0.02em] transition-colors duration-300",
                        on ? "text-ink" : "text-ink/70",
                      )}
                    >
                      {reason.title}
                    </span>
                  </Roll>
                  <span
                    className={cx(
                      "grid transition-[grid-template-rows] duration-500 ease-premium motion-reduce:transition-none",
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <span className="overflow-hidden">
                      <Roll id={`${seat.job}-b${i}`} delay={i * 0.07} still={still}>
                        <span
                          className={cx(
                            "block pt-1.5 text-[15px] leading-relaxed text-ink/70 transition-opacity duration-300",
                            on ? "opacity-100 delay-100" : "opacity-0",
                          )}
                        >
                          {reason.body}
                        </span>
                      </Roll>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The section's call to action (owner, 2026-10-01, "B" of three placements): "Apply now" at the foot of the reasons
 * column, level with the foot of the cards from `xl`, so it's on the screen where people pick a job — a row of its own
 * under the section landed about 120px below the fold on every laptop size. Set like "Why ___ stay." at the top of
 * the column, underlined, with an arrow that nudges out on hover. Just "Apply now" (owner: no "as a driver"); it opens
 * the careers page. Mocked against a row under the section and a button on the open card.
 */
function ApplyLink() {
  return (
    <Link
      href={applyLink.href}
      className="group inline-flex items-center gap-[0.3em] text-[1.75rem] font-medium leading-[1.15] tracking-[-0.035em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:text-[1.875rem]"
    >
      <span className="border-b-2 border-current">{applyLink.label}</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        className="size-[0.55em] transition-transform duration-300 ease-premium group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
      >
        <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </Link>
  );
}

/** Content that rolls up out of its slot as the next one rolls in from below, keyed by `id`. */
function Roll({ id, delay, still, children }: { id: string; delay: number; still: boolean; children: React.ReactNode }) {
  return (
    <span className="grid overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={id}
          className="[grid-area:1/1]"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={still ? { duration: 0 } : { duration: 0.55, delay, ease: EASE }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * The odometer word in "Why ___ stay.": the old word rolls up and out as the new one comes in from below, and the
 * slot eases to the new word's width so "stay." slides instead of jumping. Widths are measured from hidden copies
 * of every word, again once the web font has loaded.
 */
function RollingWord({ word, words, still }: { word: string; words: string[]; still: boolean }) {
  const sizer = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const measure = () => {
      const el = sizer.current;
      if (!el) return;
      const next: Record<string, number> = {};
      el.querySelectorAll<HTMLElement>("[data-word]").forEach((s) => {
        next[s.dataset.word ?? ""] = s.getBoundingClientRect().width;
      });
      setWidths(next);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const width = widths[word];
  return (
    <>
      {/* Stacked, not side by side: in one row the copies ran past a small phone's edge and the page scrolled sideways. */}
      <span
        ref={sizer}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex flex-col items-start whitespace-nowrap"
      >
        {words.map((w) => (
          <span key={w} data-word={w}>
            {w}
          </span>
        ))}
      </span>
      <motion.span
        className="-mb-[0.1em] inline-grid overflow-hidden pb-[0.1em] align-bottom"
        animate={width ? { width } : undefined}
        transition={still ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={word}
            className="whitespace-nowrap [grid-area:1/1]"
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-105%", opacity: 0 }}
            transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
