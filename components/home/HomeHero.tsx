"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIntroProgress } from "@/components/providers";
import { Button, Container } from "@/components/ui";
import { applyLink, homeHeadline } from "@/lib/site";

const HEADLINE_WORDS = `${homeHeadline.lead} ${homeHeadline.tail}`.split(" ");

/**
 * The homepage's opening screen (rebuilt 2026-09-23 after the United Carriers hero on Mobbin). A top-down drone
 * loop of our truck on a forest highway fills the screen; the road runs down the middle, so the words sit on the
 * calm forest either side of it. One oversized decorative word, DRIVE., along the bottom left (Archivo at its
 * widest — the only place that face is used), and the approved line as the h1 on the right, its words lighting up
 * one by one as the intro hands over. On scroll the footage zooms in a touch and darkens, and the big word drifts
 * up slower than the page. The loop is AI-generated (Grok) and baked to loop seamlessly — see docs/DECISIONS.md →
 * Hero media.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const intro = useIntroProgress();

  // The words light up once the intro is almost gone (straight away when there's no intro).
  const [lit, setLit] = useState(false);
  useMotionValueEvent(intro, "change", (v) => {
    if (v >= 0.9) setLit(true);
  });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (intro.get() >= 0.9) setLit(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [intro]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

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
          className="h-full w-full object-cover"
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
      <motion.div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(12_12_12)]" style={{ opacity: shade }} />

      <Container className="flex flex-1 flex-col pt-32 pb-6 sm:pb-8 lg:pb-10">
        <div className="flex flex-1 items-center">
          {/*
            From lg the block sits in the header's CTA column: its left edge lines up with Get a Quote and its right
            edge with Apply To Drive (the pair is 2 × 9.5rem + a 0.75rem gap from xl; about 18.1rem below xl, where
            the buttons size to their labels — see Header.tsx).
          */}
          <div className="max-w-[34rem] lg:ml-auto lg:w-[18.1rem] xl:w-[19.75rem]">
            <h1 className="text-balance text-[clamp(1.75rem,6.5vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:text-[1.75rem] xl:text-[2rem]">
              {HEADLINE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="transition-opacity duration-700 ease-premium motion-reduce:transition-none"
                  style={{ opacity: lit ? 1 : 0.22, transitionDelay: lit ? `${i * 70}ms` : "0ms" }}
                >
                  {word}{" "}
                </span>
              ))}
            </h1>
            <Button href={applyLink.href} variant="light" size="lg" className="mt-8 w-full sm:w-auto sm:px-9 lg:mt-10 lg:w-full">
              Apply to drive
              <span aria-hidden>→</span>
            </Button>
          </div>
        </div>

        <motion.p
          aria-hidden
          style={reduceMotion ? undefined : { y: wordY }}
          className="-mb-[0.1em] select-none font-display text-[20vw] font-bold uppercase leading-[0.8] tracking-[-0.02em] [font-stretch:125%] sm:text-[15vw] lg:text-[8.6vw]"
        >
          Drive.
        </motion.p>
      </Container>
    </section>
  );
}
