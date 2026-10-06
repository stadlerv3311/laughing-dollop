"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Container, Reveal, chapterHeadingClass, sectionHeadingClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyRoutes, equipmentGroups, whyWorkWithUs, type WorkSeat } from "@/lib/site";
import { Pair, usePairVideos } from "./CardPair";

const EASE = [0.22, 1, 0.36, 1] as const;
/** How long a card has to stay open before the reasons follow it, so sweeping across the cards doesn't flicker them. */
const FOLLOW_MS = 120;

/** The job cards left to right with each job's reasons, in the page's order (lib/site.ts → `whyWorkWithUs.order`). */
const JOBS = whyWorkWithUs.order.flatMap((job) => {
  const card = applyRoutes.find((route) => route.job === job);
  const seat = (whyWorkWithUs.seats as readonly WorkSeat[]).find((item) => item.job === job);
  return card && seat ? [{ card, seat }] : [];
});
/** The card that starts open. */
const START = Math.max(
  0,
  JOBS.findIndex(({ seat }) => seat.job === whyWorkWithUs.open),
);

/**
 * Why work with us — the homepage's careers section (owner, 2026-09-30, version "A1" of the careers mock-ups). It
 * took over from Why drive for us, the rolling slogans and the apply cards. Its ask is the black band right under it
 * (ApplyBand, since 2026-10-05); the underlined Apply now that closed this section until then is gone.
 *
 * The heading, centred and with no label over it since 2026-10-05 (owner; the story paragraph beside it came out on
 * 2026-10-01), the two shop rows, then the careers block, centred since 2026-10-05 (owner, "A" of three mock-ups):
 * "Why ___ stay." as a centred heading, the three job cards across the full width under it, and the open job's five
 * reasons in a row beneath with every sentence in view. The dispatcher is on the
 * left, the driver in the middle and open first, the technician on the right (owner). The pictures are the apply
 * cards, which don't link anywhere: a card opens on hover, focus or tap, and the sentence and reasons roll to that
 * job. Until then the cards sat on columns 1–7 with the reasons beside them, one sentence open at a time.
 *
 * Grey and black only — orange stays with Our story (owner, 2026-09-30). The heading rises in, and on a job change
 * only "Why ___ stay." and the reasons move. The reasons are five columns from `xl`, three and two from `md`, and one
 * column on phones, where the cards are a short row and only the open one is captioned. Copy in lib/site.ts →
 * `whyWorkWithUs` (draft for the office and shop).
 *
 * Between the heading and the job cards, two rows of shop pictures: the trucks people will drive and fix. The shop
 * pair (Maintenance on record and New equipment) moved here from the safety band (owner, 2026-10-03), sat under the
 * job cards until 2026-10-05 ("move this on the top"), and was split in two the same day (owner): Lease to own beside
 * New equipment, pictures in columns 1–7 and words in 8–12, then Maintenance on record beside Our shop, mirrored.
 * Each row is a sliding pair (CardPair). Copy in lib/site.ts → `equipmentGroups` (draft).
 */
export function WhyWorkWithUs() {
  const [open, setOpen] = useState(START);
  // The job the reasons show — follows `open` after a short pause.
  const [shown, setShown] = useState(START);
  const still = useReducedMotion() ?? false;
  const { videos, play, pause } = usePairVideos();
  const [equipmentOpen, setEquipmentOpen] = useState<number[]>(() => equipmentGroups.map((group) => group.open));

  useEffect(() => {
    if (open === shown) return;
    const id = window.setTimeout(() => setShown(open), still ? 0 : FOLLOW_MS);
    return () => window.clearTimeout(id);
  }, [open, shown, still]);

  const seat = JOBS[shown].seat;

  return (
    // One step all the way down the section, 64px on phones and 70px from `sm`, measured to the letters (owner,
    // 2026-10-05: "fix this spacing", "it has to match other parts"). The top space puts the heading's ink that far
    // under the story band's last line; earlier the same day it matched "Tracked trucks." under the hero instead (88,
    // 106 and 123px at phone, tablet and laptop widths), which left the heading nearly twice as far from the story as
    // from its own pictures. The foot is the same step from the last line of the reasons to the black Apply band, the
    // space the logo row leaves over Ship with us (the chapter step left 136px there on a laptop).
    <section
      aria-labelledby="why-work-title"
      className="bg-paper pt-[3.1875rem] pb-[3.625rem] sm:pt-14 sm:pb-[3.875rem] lg:pt-[3.4375rem]"
    >
      <Container>
        {/* The heading alone, centred like the safety band's and Our story's (owner, 2026-10-05: "center this text and
            remove why work with us" — the label over it went). The section is still named by the heading. */}
        <RiseHeading id="why-work-title" lines={whyWorkWithUs.heading} className="text-center" />

        {/* The shop pictures open the section, under the heading, as two rows (owner, 2026-10-05): Lease to own and New
            equipment with the pictures on the left in columns 1–7 and the words in 8–12, then Maintenance on record and
            Our shop mirrored, words on the left in 1–5 — the safety band's zigzag and its step between rows. */}
        {equipmentGroups.map((group, row) => {
          const flip = row % 2 === 1;
          return (
            <div
              key={group.title}
              className={cx(
                "grid gap-y-10 lg:grid-cols-12 lg:gap-x-6",
                // Under the heading the step runs from its baseline, so the margin is the step less the line's foot.
                row === 0 ? "mt-[3.5625rem] sm:mt-[3.8125rem] lg:mt-[3.6875rem]" : "mt-16 sm:mt-[4.375rem]",
              )}
            >
              <Reveal className={cx("lg:row-start-1", flip ? "lg:col-start-6 lg:col-end-13" : "lg:col-start-1 lg:col-end-8")}>
                <Pair
                  cards={group.cards}
                  start={group.open}
                  open={equipmentOpen[row]}
                  onOpen={(i) => setEquipmentOpen((all) => all.map((was, r) => (r === row ? i : was)))}
                  reduceMotion={still}
                  videos={videos}
                  play={play}
                  pause={pause}
                />
              </Reveal>
              <Reveal
                delay={0.1}
                className={cx(
                  "lg:row-start-1 lg:self-center",
                  flip ? "lg:col-start-1 lg:col-end-6 lg:pr-10" : "lg:col-start-8 lg:col-end-13 lg:pl-10",
                )}
              >
                <div className="max-w-[28rem]">
                  <h3 className="text-balance font-display font-semibold text-[1.5rem] leading-[1.12] tracking-[-0.03em] sm:text-[1.75rem]">
                    {group.title}
                  </h3>
                  <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink/70">{group.body}</p>
                </div>
              </Reveal>
            </div>
          );
        })}
        {/* The step between the two shop rows, measured to the sentence's ink: 64px on phones, 70px from `sm` (owner,
            2026-10-05: "fix the spacing, it has to match other parts" — it was 112px to the box, 120px to the ink,
            against 70 everywhere else in the section). Centred (owner, 2026-10-05): the sentence, the cards across all
            twelve columns, the reasons in a row, so the page's left-right zigzag ends where the subject turns to
            people. */}
        <div className="mt-[3.625rem] sm:mt-[3.875rem]">
          <Reveal>
            <WhyHeading
              who={seat.who}
              words={JOBS.map((job) => job.seat.who)}
              from={JOBS.length > 1 ? shown / (JOBS.length - 1) : 0.5}
              still={still}
            />
            {/* The same step again, from the sentence's baseline to the cards (owner, 2026-10-05: "fix this gap too";
                it was 40px to the box, 50px to the baseline). */}
            <ul aria-label="Pick a job" className="mt-14 flex h-72 gap-2 sm:mt-[3.75rem] sm:h-80 sm:gap-3 md:h-96">
              {JOBS.map(({ card }, i) => (
                <JobCard key={card.job} card={card} isOpen={open === i} onOpen={() => setOpen(i)} />
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <Reasons seat={seat} still={still} />
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
          sizes="(width >= 80rem) 45vw, 70vw"
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
          <span className="mt-1 block font-display font-semibold text-xl leading-tight tracking-[-0.03em] lg:text-[1.75rem] xl:text-[1.375rem]">
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
 * "Why ___ stay.", centred over the job cards at the size of a section heading (30px in the reasons column until
 * 2026-10-05), all in ink. On a job change the word rolls over.
 */
function WhyHeading({ who, words, from, still }: { who: string; words: string[]; from: number; still: boolean }) {
  return (
    <h3 className={cx(sectionHeadingClass, "relative text-center")}>
      {/* Screen readers get the plain sentence, announced when the job changes; the rolling word is for the eye. */}
      <span className="sr-only" aria-live="polite">
        Why {who} stay.
      </span>
      {/* All ink since 2026-10-05 (owner: "text color make it black"); "Why" and "stay." were ink/60 around the word. */}
      <span aria-hidden>
        Why <RollingWord word={who} words={words} from={from} still={still} /> stay.
      </span>
    </h3>
  );
}

/**
 * The open job's five reasons in a row under the cards, each with its sentence in view (owner, 2026-10-05; they were
 * rows beside the cards with one sentence open at a time, so four of five were behind a hover or a tap). Five columns
 * from `xl`, three and then two centred under them from `md`, one column on phones. The words stay left-aligned: the
 * block is centred, the sentences aren't. On a job change each column rolls over, one after another.
 */
function Reasons({ seat, still }: { seat: WorkSeat; still: boolean }) {
  return (
    <ul className="mt-8 grid gap-x-6 gap-y-7 md:grid-cols-6 xl:mt-9 xl:grid-cols-5">
      {seat.reasons.map((reason, i) => (
        <li key={i} className={cx("md:col-span-2 xl:col-span-1", i === 3 && "md:col-start-2 xl:col-start-auto")}>
          {/* The site's small-text grey (ink/70, 5.7:1); the numbers were ink/40 beside closed rows. */}
          <span aria-hidden className="block text-[13px] tabular-nums text-ink/70">
            {String(i + 1).padStart(2, "0")}
          </span>
          <Roll id={`${seat.job}-t${i}`} delay={i * 0.07} still={still}>
            <span className="mt-2 block text-lg font-medium leading-snug tracking-[-0.02em]">{reason.title}</span>
          </Roll>
          <Roll id={`${seat.job}-b${i}`} delay={i * 0.07} still={still}>
            <span className="block pt-2 text-[15px] leading-relaxed text-ink/70">{reason.body}</span>
          </Roll>
        </li>
      ))}
    </ul>
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
 * The odometer word in "Why ___ stay.", underlined like the site's arrow links: the old word rolls up and out as the new one comes
 * in from below while the line under it runs out and fills in again, and the slot eases to the new word's width so
 * "stay." slides instead of jumping. `from` is where the picked card sits in the row, 0 (left) to 1 (right), and sets
 * the side the line fills from. Widths are measured from hidden copies
 * of every word, again once the web font has loaded.
 */
function RollingWord({ word, words, from, still }: { word: string; words: string[]; from: number; still: boolean }) {
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
      {/* The line under the word, as under the Apply now link this section then had (owner, 2026-10-05: "use the same
          logic as apply now has"; RiseLabel's line): a 2px
          line in the text's colour, hung just under the line box so the heading is no taller. On a job change it runs
          out as the old word leaves and fills in under the new one (owner, same day: "make so the line fills out
          too"), following the slot's width as it eases. The fill starts on the side of the card that was picked
          (owner, same day): from the left for the left card, from the right for the right one, from the middle out
          to both sides for the middle one. The old line leaves the opposite way, so one seems to push the other. */}
      <span className="relative inline-block align-bottom">
        <motion.span
          // Left-aligned inside the slot: while two words share it the cell is as wide as the longer one, and the
          // heading's centring would push the shorter one off to the right and clip its end.
          className="-mb-[0.1em] inline-grid overflow-hidden pb-[0.1em] text-left align-bottom"
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
        {/* `custom` reaches the line that's leaving too, so it knows which way the new one is coming from. */}
        <AnimatePresence initial={false} custom={from}>
          <motion.span
            key={word}
            custom={from}
            className="absolute inset-x-0 top-full h-0.5 bg-current"
            style={{ originX: from }}
            variants={{
              empty: { scaleX: 0 },
              full: { scaleX: 1 },
              gone: (next: number) => ({
                scaleX: 0,
                originX: 1 - next,
                transition: still ? { duration: 0 } : { scaleX: { duration: 0.3, ease: EASE }, originX: { duration: 0 } },
              }),
            }}
            initial="empty"
            animate="full"
            exit="gone"
            transition={still ? { duration: 0 } : { duration: 0.6, delay: 0.25, ease: EASE }}
          />
        </AnimatePresence>
      </span>
    </>
  );
}
