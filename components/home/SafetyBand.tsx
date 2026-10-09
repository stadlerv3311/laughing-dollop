"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { Container, FlyArrow, Reveal, RiseLabel, sectionTop } from "@/components/ui";
import { cx } from "@/lib/cx";
import { services, servicesGroup } from "@/lib/services";
import {
  fleetMapLink,
  pairCards,
  quoteLink,
  safetyGroups,
  safetyPitch,
  safetySystems,
  servicesLink,
  type NavLink,
  type SafetySystem,
} from "@/lib/site";
import { Pair, usePairVideos } from "./CardPair";
import { StoryHeadline } from "./StoryHeadline";

/** The band's heading, run on as one line (owner's wording, 2026-10-02; it was "We know truck and trailer location / and last service."). */
const SAFETY_HEADLINE = ["Tracked trucks.", "Proven service."];

/**
 * What we haul and how we look after it (2026-09-18; services since 2026-10-05). It answers the shipper's two
 * questions — "what do you do?" and "is my load safe with you?" — so it sits straight under the hero, as proof before
 * the ask: Ship with us and its Get a Quote follow it, sliding up over it from `lg` (SlideOverStack).
 *
 * A zigzag again since 2026-10-05 (owner picked idea A of the services report): the heading with a one-line pitch,
 * then the services pair (CardPair) in columns 1–7 with its words, the list of services and Get a quote in 8–12; the
 * numbers band (`between`, TrustBar); then the road pair — GPS and dash cameras — mirrored, in columns 6–12 with its
 * words in 1–5. Below `lg` each picture sits over its words. Square corners and no box (DECISIONS.md → Homepage
 * section look). Copy in lib/services.ts and lib/site.ts → `safetyGroups` / `safetyPitch` (draft).
 *
 * The first zigzag (2026-09-28, owner's sketch) had the road pair first and the shop pair — Maintenance on record and
 * New equipment — stepping down on the right. The shop pair moved to Why work with us on 2026-10-03 (owner), and the
 * services pair took the zigzag's first place two days later, so the band says what we do before how we watch it.
 *
 * All on white since 2026-10-02 (owner: the black top half — heading and road pair on ink, 2026-09-30 — made the band
 * read as two sections). The orange half star went with the black.
 *
 * The road clips are placeholders until the owner sends our own footage — the GPS one is Samsara's and must not go
 * live (docs/DECISIONS.md → Safety band). The services stills are AI stand-ins (lib/services.ts).
 *
 * `between` sits between the two pairs (the numbers band). It brings its own Container and no padding; 70px from each
 * picture to it and from the road pair to the band's foot (owner, 2026-10-02, after trying 80; 64px on phones).
 */
export function SafetyBand({ between }: { between?: ReactNode }) {
  const reduceMotion = useReducedMotion() === true;
  const { videos, play, pause } = usePairVideos();
  const road = safetyGroups[0];
  // Which card of each pair is open, and whether the road pair is being hovered, focused or tapped — kept here so
  // the words beside it can follow it (its readout, if the open card has one).
  const [servicesOpen, setServicesOpen] = useState<number>(servicesGroup.open);
  const [open, setOpen] = useState<number>(road.open);
  const [active, setActive] = useState(false);
  const hasReadout = road.systems.some((index) => safetySystems[index].readout);

  return (
    // 70px from the road pair to the logo row under it (owner, 2026-10-02; 64 on phones), the same as around the
    // numbers — not the usual section foot.
    <section aria-labelledby="safety" className={cx("bg-paper pb-16 sm:pb-[4.375rem]", sectionTop)}>
      {/* The band is two of the header's sections (`data-nav-section`, read by Header for the line that fills under a
          nav item): Services down to the numbers, then Fleet map for the road pair. Each wrapper is its own flow
          root, so the gaps between the parts stay inside one or the other and the two meet with nothing between. */}
      <div data-nav-section={servicesLink.href} className="flow-root">
        <Container>
          {/* Set like Our story's heading (owner, 2026-09-30): a two-line chapter heading, the first line in grey and
              the second in full ink, each rising in, with the pitch under it. Centred since 2026-10-02 (owner), like the
              numbers band and Ship with us, so the page holds one look. */}
          <Reveal className="text-center">
            {/* No "Safety and equipment" label over it since 2026-10-02 (owner: remove). */}
            <StoryHeadline id="safety" lines={SAFETY_HEADLINE} light inline solid large />
            <p className="mx-auto mt-6 max-w-[38rem] text-balance text-lg leading-relaxed text-ink">
              {safetyPitch}
            </p>
          </Reveal>

          {/* Up on the left: what we haul. */}
          <div className="mt-12 grid gap-y-10 sm:mt-14 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-start-1 lg:col-end-8 lg:row-start-1">
              <Pair
                cards={servicesGroup.cards}
                start={servicesGroup.open}
                open={servicesOpen}
                onOpen={setServicesOpen}
                phoneRow
                reduceMotion={reduceMotion}
                videos={videos}
                play={play}
                pause={pause}
              />
            </Reveal>
            {/* Centred on its picture from lg (owner, 2026-09-28), so neither end of the column sits empty. */}
            <Reveal delay={0.1} className="lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:self-center lg:pl-10">
              <div className="max-w-[28rem]">
                <h3 className={pairHeadingClass}>{servicesGroup.title}</h3>
                <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink/70">{servicesGroup.body}</p>
                <ul aria-label="Services" className="mt-8 space-y-4">
                  {services.map((service) => (
                    <li key={service.id}>
                      <p className="text-lg font-medium leading-snug tracking-[-0.02em]">{service.name}</p>
                      <p className="mt-1 text-pretty text-[15px] leading-relaxed text-ink/70">{service.description}</p>
                    </li>
                  ))}
                </ul>
                {/* Get a quote alone: a Services link stood beside it for a few hours on 2026-10-08 and went the same
                    day (the builder: "remove services link. they will have access to that page from the top"). */}
                <div className="mt-9">
                  <PairLink link={quoteLink} />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {between && <div className="mt-16 sm:mt-[4.375rem]">{between}</div>}
      </div>

      <div data-nav-section={fleetMapLink.href} className="flow-root">
        <Container>
          {/* Down on the right: how we watch it. */}
          <div className="mt-16 grid gap-y-10 sm:mt-[4.375rem] lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-start-6 lg:col-end-13 lg:row-start-1">
              <Pair
                cards={pairCards(road)}
                start={road.open}
                open={open}
                onOpen={setOpen}
                onActive={setActive}
                reduceMotion={reduceMotion}
                videos={videos}
                play={play}
                pause={pause}
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-start-1 lg:col-end-6 lg:row-start-1 lg:self-center lg:pr-10">
              <div className="max-w-[28rem]">
                <h3 className={pairHeadingClass}>{road.title}</h3>
                <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink/70">{road.body}</p>
                {hasReadout && <Readout system={safetySystems[road.systems[open]]} active={active} />}
                {/* Under the words about GPS, the map that shows it (the builder, 2026-10-08, a box drawn there on a
                    screenshot: "fleet map link"). */}
                <div className="mt-9">
                  <PairLink link={fleetMapLink} />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}

const pairHeadingClass =
  "text-balance font-display font-semibold text-[1.5rem] leading-[1.12] tracking-[-0.03em] sm:text-[1.75rem]";

/**
 * A link at the foot of a pair's words: a plain underlined link with an arrow and the shared link hover (RiseLabel,
 * FlyArrow), set at body size so it doesn't outshout the pair's heading. Get a quote was the first (2026-10-05) —
 * Ship with us, straight after the band, has the form, and on the homepage it catches the click and glides down to it
 * (useQuoteLinks). Fleet map under the road pair's words followed on 2026-10-08.
 */
function PairLink({ link }: { link: NavLink }) {
  return (
    <Link
      href={link.href}
      className="group inline-flex items-center gap-1.5 text-[17px] font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      <RiseLabel>{link.label}</RiseLabel>
      <FlyArrow className="size-3.5" />
    </Link>
  );
}

/**
 * What the open card's system records, under the pair's words (owner, 2026-09-28, "L1" after a round of mock-ups;
 * the scale after T1 Energy on Mobbin): a small label, one figure in a thin weight at about the heading's size — so it
 * reads as data and doesn't outshout the heading — and a short list of details. It opens once the words are well on
 * screen (owner, 2026-10-01: hover-only left the column looking empty) — the centred group glides up to make room —
 * and then stays; hovering, focusing or tapping the pair before then opens it too. It follows the open card, so
 * moving from GPS to Dash cameras swaps it. Sample values — no longer marked "Example" on the page since 2026-10-01
 * (owner) — so they must stay plainly illustrative, never a real unit, position or event; hidden from screen readers
 * while closed.
 */
function Readout({ system, active }: { system: SafetySystem; active: boolean }) {
  const readout = system.readout;
  const grey = "text-ink/70";
  // The closed row is 0px tall, which an IntersectionObserver still reports; the margin waits until it's 15% of
  // the screen up from the bottom, so the opening is seen rather than happening below the fold.
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const visible = seen || active;
  return (
    <div
      ref={ref}
      aria-hidden={!visible}
      inert={!visible}
      className={cx(
        "grid transition-[grid-template-rows,opacity] duration-700 ease-premium motion-reduce:transition-none",
        visible ? "grid-rows-[1fr] opacity-100 delay-300" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        {readout && (
          <motion.div
            key={system.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-10"
          >
            <p className={cx("text-[13px]", grey)}>{readout.label}</p>
            <p className="mt-1.5 text-[2.5rem] font-light leading-none tracking-[-0.035em] tabular-nums">
              {readout.figure}
              {readout.unit && (
                <span className={cx("ml-1.5 text-[17px] font-normal tracking-normal", grey)}>{readout.unit}</span>
              )}
            </p>
            <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-y-1.5 text-[15px] leading-normal">
              {readout.rows.map((row) => (
                <Fragment key={row.label}>
                  <dt className={grey}>{row.label}</dt>
                  <dd>{row.value}</dd>
                </Fragment>
              ))}
            </dl>
          </motion.div>
        )}
      </div>
    </div>
  );
}
