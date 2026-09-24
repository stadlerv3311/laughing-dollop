"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { INTRO } from "@/components/intro/timeline";
import { useIntroProgress } from "@/components/providers";
import { Container, InteractiveHoverButton } from "@/components/ui";
import { applyLink, homeHeadline, homeSupport, quoteLink } from "@/lib/site";

const LEAD_WORDS = homeHeadline.lead.split(" ");
const TAIL_WORDS = homeHeadline.tail.split(" ");

/**
 * The homepage's opening screen (rebuilt 2026-09-23 after the United Carriers hero on Mobbin). A top-down drone
 * loop fills the screen: a forest highway on the left fifth of the frame, one truck driving up it, and calm forest
 * across the rest, where the text sits (new loop 2026-09-24 — the first one had the road dead centre, which fought
 * the right-hand text column). Shipper-first since 2026-09-24 (trial): the h1 lighting up word by word as the
 * intro hands over, one supporting line, then Get a Quote (solid) over Drive with us (a thin white ring).
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

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  // Started by hand, not with `autoPlay`: React leaves `muted` out of the server HTML, and browsers only autoplay
  // muted video. Paused while off screen, and never played for reduced-motion visitors (they keep the poster).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="content"
      data-header-theme="dark"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-paper"
    >
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={reduceMotion ? undefined : { scale: videoScale }}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[20%_50%] lg:object-center"
          src="/videos/home-hero-forest.mp4"
          poster="/images/home-hero-forest.jpg"
          muted
          loop
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
      <motion.div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(12_12_12)]" style={{ opacity: shade }} />

      <Container className="flex flex-1 flex-col pt-32 pb-6 sm:pb-8 lg:pb-10">
        <div className="flex flex-1 items-center">
          {/*
            From lg the block sits in the header's CTA column: its left edge lines up with Get a Quote and its
            right edge with Apply To Drive. From xl the pair is a fixed width (`--width-header-cta`, set once in
            app/globals.css and shared with Header.tsx) plus the 0.75rem gap between them; below xl the buttons
            size to their labels instead, so 18.1rem is a measured stand-in for that width, not a derived one.
          */}
          <div className="max-w-[34rem] lg:ml-auto lg:w-[18.1rem] xl:w-[calc(2*var(--width-header-cta)+0.75rem)]">
            <h1 className="text-balance text-[clamp(1.75rem,6.5vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:text-[1.75rem] xl:text-[2rem]">
              {[LEAD_WORDS, TAIL_WORDS].map((words, line) => (
                <span key={line} className="block">
                  {words.map((word, i) => {
                    const n = line === 0 ? i : LEAD_WORDS.length + i;
                    return (
                      <span
                        key={i}
                        className="transition-opacity duration-700 ease-premium motion-reduce:transition-none"
                        style={{ opacity: lit ? 1 : 0.22, transitionDelay: lit ? `${n * 70}ms` : "0ms" }}
                      >
                        {word}{" "}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-paper/80">{homeSupport}</p>
            {/*
              Get a Quote solid, Drive with us as a thin white ring under it (side by side from sm to lg, at a fixed 14rem so
              the dot, 20% in, clears the label) — the solid one leads. The gap under the headline is the largest in the stack, so the buttons read as attached to the
              words above them.
            */}
            <InteractiveHoverButton
              href={quoteLink.href}
              text={quoteLink.label}
              size="lg"
              className="mt-5 w-full sm:w-56 lg:w-full"
            />
            <InteractiveHoverButton
              href={applyLink.href}
              text="Drive with us"
              size="lg"
              variant="ghostLight"
              className="mt-3 w-full sm:ml-3 sm:mt-5 sm:w-56 lg:ml-0 lg:mt-3 lg:w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
