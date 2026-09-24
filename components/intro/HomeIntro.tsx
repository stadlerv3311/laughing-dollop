"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useIntroProgress } from "@/components/providers";
import { INTRO } from "./timeline";

// Plays once per visit: coming back to the homepage later in the same visit shows everything already in place.
// A reload or a new visit plays it again.
let playedThisVisit = false;

/**
 * The homepage's opening moment. Renders nothing itself: it drives the shared `useIntroProgress` value from 0 to 1
 * in step with the hero video (`[data-hero-video]`), from the truck's cab entering the frame to the hero's text
 * landing. `Header` slides down and settles its logo off it; `HomeHero` brings its text block down and lights up
 * the headline. If the video hasn't started within `INTRO.videoTimeout`, the rest runs on a timer instead.
 * Skipped (everything just appears in place) for reduced-motion visitors, repeat homepage views in the same visit,
 * and a visit that started on another page.
 */
export function HomeIntro() {
  const intro = useIntroProgress();
  const reduceMotion = useReducedMotion();
  // Read once on mount, so marking it played below doesn't affect the play already under way.
  const [alreadyPlayed] = useState(() => playedThisVisit || intro.get() >= 1);

  useEffect(() => {
    playedThisVisit = true;
  }, []);

  useEffect(() => {
    // Not measured yet (SSR/first paint) — wait rather than guess.
    if (reduceMotion === null) return;
    if (alreadyPlayed || reduceMotion) {
      intro.set(1);
      return;
    }
    const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    let frame = 0;
    let fallback: ReturnType<typeof animate> | undefined;
    const span = INTRO.landed - INTRO.truckIn;
    const follow = () => {
      if (!video) return;
      const p = Math.min(1, Math.max(0, (video.currentTime - INTRO.truckIn) / span));
      if (p > intro.get()) intro.set(p);
      if (p < 1) frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    const timeout = setTimeout(() => {
      if (video && !video.paused && video.currentTime > 0) return;
      cancelAnimationFrame(frame);
      fallback = animate(intro, 1, { duration: INTRO.fallbackDuration, ease: "linear" });
    }, INTRO.videoTimeout);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      fallback?.stop();
    };
  }, [alreadyPlayed, reduceMotion, intro]);

  return null;
}
