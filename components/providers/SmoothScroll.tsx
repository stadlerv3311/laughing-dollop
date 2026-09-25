"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** Site-wide smooth (eased) wheel scrolling. Turned off for visitors who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduceMotion, anchors: true }}>
      <TopOnNewPage />
      {children}
    </ReactLenis>
  );
}

/**
 * Opens every new page at the top (2026-09-24). A link clicked while a wheel scroll is still gliding used to land
 * the next page partway down: Lenis kept easing toward the old page's target after Next.js had scrolled to the
 * top. Back and forward are left alone, so the browser can restore where you were.
 */
function TopOnNewPage() {
  const lenis = useLenis();
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    // Only on a page change; `lenis` is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
