"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Site-wide smooth (eased) wheel scrolling. Turned off for visitors who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduceMotion, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
