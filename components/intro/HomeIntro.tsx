"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useIntroProgress } from "@/components/providers";
import { INTRO } from "./timeline";

// Plays once per visit: coming back to the homepage later in the same visit shows the logo already settled.
// A reload or a new visit plays it again.
let playedThisVisit = false;

/**
 * Homepage's opening logo moment. Renders nothing itself — it just drives the shared `useIntroProgress` value
 * from 0 to 1 over `INTRO.duration` (about a second). `Header` reads it to fade and settle its own logo into
 * place (no separate flying copy — the header's logo is the one that animates) and to bring the nav to full
 * opacity; `HomeHero` reads it to light up the headline right after. The hero video underneath needs nothing
 * from this: it's always rendered and shows straight away, so there's no wait and no white flash.
 * Skipped (the logo just appears settled) for reduced-motion visitors and repeat homepage views in the same
 * visit.
 */
export function HomeIntro() {
  const intro = useIntroProgress();
  const reduceMotion = useReducedMotion();
  // Read once on mount, so marking it played below doesn't affect the play already under way.
  const [alreadyPlayed] = useState(() => playedThisVisit);

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
    const controls = animate(intro, 1, { duration: INTRO.duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [alreadyPlayed, reduceMotion, intro]);

  return null;
}
