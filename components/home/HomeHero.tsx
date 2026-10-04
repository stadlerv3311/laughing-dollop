"use client";

import { easeOut, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { INTRO } from "@/components/intro/timeline";
import { useIntroProgress } from "@/components/providers";
import { Container, InteractiveHoverButton } from "@/components/ui";
import { applyLink, homeSupport, quoteLink } from "@/lib/site";
import { HeroHeadline } from "./HeroHeadline";

// How long the loop rests on the empty road between the truck's passes: 8s of clip + 2s = one pass every ~10s.
const EMPTY_ROAD_MS = 2000;

/**
 * The homepage's opening screen (rebuilt 2026-09-23 after the United Carriers hero on Mobbin). A top-down drone
 * loop fills the screen: a forest highway on the left fifth of the frame, one truck driving up it, and calm forest
 * across the rest, where the text sits (new loop 2026-09-24 — the first one had the road dead centre, which fought
 * the right-hand text column). Shipper-first since 2026-09-24 (trial): the h1 lighting up word by word as the
 * intro hands over ("A fleet you can trust. A load you can see.", fixed since 2026-10-02; HeroHeadline), one supporting line, then
 * Get a quote (solid) over Apply now (a thin white ring).
 * The oversized DRIVE. word that sat along the bottom left was removed with the driver h1. On scroll the footage
 * zooms in a touch and darkens. The loop is AI-generated (Grok), upscaled to 1080p — see docs/DECISIONS.md →
 * Hero media.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const intro = useIntroProgress();

  // The words light up right after the header logo settles (straight away on every page but the homepage).
  const [lit, setLit] = useState(false);
  useMotionValueEvent(intro, "change", (v) => {
    if (v >= INTRO.litAt) setLit(true);
  });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (intro.get() >= INTRO.litAt) setLit(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [intro]);

  // On the homepage's first open the text block comes down the screen after the truck and stops in place (see
  // HomeIntro); everywhere else progress is already 1, so it just sits there.
  const blockY = useTransform(intro, [...INTRO.blockIn], [INTRO.blockDrop, "0vh"], { ease: easeOut });
  const blockOpacity = useTransform(intro, [INTRO.blockIn[0], INTRO.blockIn[0] + 0.25], [0, 1]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // No darkening as it scrolls away (owner, 2026-10-01: keep the green film as it is); only the slow push-in.
  // The scroll cue comes in with the text block and is gone after the first bit of scrolling.
  const cueFade = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const cueOpacity = useTransform(() => Math.min(blockOpacity.get(), cueFade.get()));
  const lenis = useLenis();
  const scrollOn = () => {
    const next = sectionRef.current?.offsetHeight ?? window.innerHeight;
    if (lenis) lenis.scrollTo(next);
    else window.scrollTo({ top: next, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Started by hand, not with `autoPlay`: React leaves `muted` out of the server HTML, and browsers only autoplay
  // muted video. Paused while off screen, and never played for reduced-motion visitors (they keep the poster).
  // Not a native `loop`: each pass ends on the empty road and holds there for EMPTY_ROAD_MS before starting over, so
  // the truck crosses about once every ten seconds instead of almost constantly (owner, 2026-09-24). The drone is
  // still and the clip's last frame dissolves into its first, so the hold and the restart don't show.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    video.muted = true;
    let visible = false;
    let holding = false;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const onEnded = () => {
      holding = true;
      hold = setTimeout(() => {
        holding = false;
        video.currentTime = 0;
        if (visible) video.play().catch(() => {});
      }, EMPTY_ROAD_MS);
    };
    video.addEventListener("ended", onEnded);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !holding) video.play().catch(() => {});
      else if (!visible) video.pause();
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("ended", onEnded);
      clearTimeout(hold);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="content"
      data-header-theme="dark"
      // The film shows through the header: no dark glass bar here (Header.tsx).
      data-header-glass="none"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-paper"
    >
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={reduceMotion ? undefined : { scale: videoScale }}>
        <video
          ref={videoRef}
          data-hero-video
          // From lg the road (18–25% across the clip) runs right beside the 1.5× headline (2026-10-02): framed 70% across,
          // not centred, so the headline's "A" keeps a clear gap from it — centred, it touched the road at 1280px wide.
          className="h-full w-full object-cover object-[20%_50%] lg:object-[70%_50%]"
          src="/videos/home-hero-forest.mp4"
          poster="/images/home-hero-forest.jpg"
          muted
          playsInline
          preload="auto"
        />
      </motion.div>

      {/*
        Scrims: a light overall dim, a band at the top for the header, and a rise from the bottom under the big
        word. The forest is dark already, so they stay gentle.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(12_12_12/.45)_0%,rgb(12_12_12/0)_22%),linear-gradient(to_top,rgb(12_12_12/.6)_0%,rgb(12_12_12/0)_45%),linear-gradient(rgb(12_12_12/.18),rgb(12_12_12/.18))]"
      />
      {/*
        From lg, a soft fade darkens only the right half, under the text column — a surface for the type without a
        card or blur. The road on the left stays at full strength.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_left,rgb(12_12_12/.38)_0%,rgb(12_12_12/.28)_32%,rgb(12_12_12/0)_60%)] lg:block"
      />

      <Container className="flex flex-1 flex-col pt-32 pb-6 sm:pb-8 lg:pb-10">
        <div className="flex flex-1 items-center">
          {/*
            From lg the block's right edge lines up with the header's Apply now. Until 2026-10-02 the line and the
            stacked buttons sat exactly in the header's CTA column (`--width-header-cta` × 2 plus the gap); side by side
            they need two 14rem buttons, so the column is 28.75rem now.
          */}
          {/*
            From lg the headline is set large and runs left of the column into the open forest, its right edge on the
            column's right edge, while the supporting line and buttons stay in the column (owner, 2026-09-24: the
            middle of the screen felt empty with the headline at button width). 1.5× since 2026-10-02 (owner): 84px at lg,
            108px at xl, 120px at 2xl (72px at xl from 2026-09-29, 60 before). On phones it grows only as far as each line
            still fits on one line (36px at 375px wide, 28px before).
          */}
          <motion.div
            className="max-w-[34rem] lg:ml-auto lg:flex lg:max-w-none lg:flex-col lg:items-end"
            style={{ y: blockY, opacity: blockOpacity }}
          >
            <HeroHeadline
              lit={lit}
              className="text-balance text-[clamp(1.75rem,9.6vw,4.125rem)] font-medium leading-[1.08] tracking-[-0.035em] lg:w-max lg:text-[5.25rem] lg:leading-[1.02] lg:tracking-[-0.045em] xl:text-[6.75rem] 2xl:text-[7.5rem]"
            />
            {/* Two 14rem buttons and their gap from lg (2026-10-02), so the dot clears each label; the header's pair
                width, which they used to match, is too narrow for two side by side at this size. */}
            <div className="lg:w-[28.75rem]">
              {/* Headline, line and buttons as one tight block (owner, 2026-10-02): 16 / 20px apart, 24 / 20 before
                  the 1.5× headline (32px under the headline from lg). */}
              {/* Full white with the headline since 2026-10-02 (owner: "go white on the hero"; it was at 80%). */}
              <p className="mt-4 text-pretty leading-relaxed text-paper lg:mt-5">{homeSupport}</p>
              {/*
                Get a quote solid, Apply now as a thin white ring beside it — one row at every size since 2026-10-02
                (owner; from lg they were stacked). From sm a fixed 14rem each, so the dot, 20% in, clears the label;
                on phones they share the width, with more room left of the label so the dot still clears it.
              */}
              <div className="mt-5 flex gap-3">
                <InteractiveHoverButton
                  href={quoteLink.href}
                  text={quoteLink.label}
                  size="lg"
                  className="min-w-0 flex-1 max-sm:pr-4 max-sm:pl-10 sm:w-56 sm:flex-none"
                />
                <InteractiveHoverButton
                  href={applyLink.href}
                  text={applyLink.label}
                  size="lg"
                  variant="ghostLight"
                  className="min-w-0 flex-1 max-sm:pr-4 max-sm:pl-10 sm:w-56 sm:flex-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/*
          Scroll cue (owner, 2026-09-25: make it clear the page goes on, so people scroll instead of leaving). A
          thin line with a dot running down it; tapping it scrolls to the next section. Still for reduced motion.
        */}
        <motion.button
          type="button"
          onClick={scrollOn}
          style={{ opacity: cueOpacity }}
          className="group mx-auto mt-10 flex flex-col items-center gap-2.5 text-sm font-medium text-paper/70 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:mt-6"
        >
          Scroll
          <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-paper/25">
            {reduceMotion ? (
              <span className="absolute inset-x-0 top-0 h-3 bg-paper" />
            ) : (
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-paper"
                animate={{ y: ["-100%", "340%"] }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
              />
            )}
          </span>
        </motion.button>
      </Container>
    </section>
  );
}
