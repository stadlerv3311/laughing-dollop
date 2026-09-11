"use client";

import { useLenis } from "lenis/react";
import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useIntroProgress } from "@/components/providers";
import { Logo } from "@/components/ui";
import { cx } from "@/lib/cx";
import { easeInOutCubic, INTRO, lerp, range } from "./timeline";
import type { SceneFrame } from "./TruckScene";

// three.js only loads in the browser, and only on the homepage.
const TruckScene = dynamic(() => import("./TruckScene"), { ssr: false });

let webglSupported: boolean | undefined;
function detectWebGL() {
  if (webglSupported === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupported = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupported = false;
    }
  }
  return webglSupported;
}
const subscribeNever = () => () => {};

// The intro plays once per visit: coming back to the homepage later goes straight to the content.
// A reload or a new visit plays it again.
let playedThisVisit = false;

type TruckIntroProps = {
  /**
   * What the top of the page shows whenever the intro isn't playing: after it has played and scrolled out
   * of sight (so scrolling back up lands here instead of replaying it), on repeat visits, and when it's skipped.
   */
  children: ReactNode;
};

/**
 * Homepage scroll intro: a truck drives down a desert highway. The camera drops from an aerial
 * to the grille, flies around to the trailer's side and stops on the logo. The truck drives off
 * into the sunset while the logo stays on screen, the sunset fades to white, and the logo glides
 * into the header. Once it has played and scrolled out of sight it's swapped for `children`.
 * Skipped entirely — `children` show straight away — for reduced-motion visitors, browsers
 * without WebGL, and repeat homepage views in the same visit.
 */
export function TruckIntro({ children }: TruckIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Read once on mount, so marking it played below doesn't cut off the intro that's on screen.
  const [alreadyPlayed] = useState(() => playedThisVisit);
  const [finished, setFinished] = useState(false);
  // Where the page content sat on screen right before the swap, so it can be held in place.
  const contentTopBeforeSwap = useRef<number | null>(null);

  const intro = useIntroProgress();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const webgl = useSyncExternalStore(subscribeNever, detectWebGL, () => null);
  // False while hydrating, so the first client render matches the server HTML (the intro). useReducedMotion
  // reads the setting immediately, which would otherwise swap in the photo mid-hydration and fail it.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const skip = alreadyPlayed || webgl === false || (hydrated && reduceMotion === true);
  const showMedia = skip || finished;

  useEffect(() => {
    playedThisVisit = true;
  }, []);

  const inView = useInView(sectionRef);
  const { scrollY, scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!showMedia) intro.set(p);
  });

  // Once the page content reaches the top of the screen the intro has played and its stage is fully
  // out of sight, so it can be swapped for the media without anything visibly changing.
  useMotionValueEvent(scrollY, "change", () => {
    // The page content is the section right after this one.
    const content = sectionRef.current?.nextElementSibling;
    if (showMedia || !content) return;
    const top = content.getBoundingClientRect().top;
    if (top > 0) return;
    contentTopBeforeSwap.current = top;
    setFinished(true);
  });

  // The section shrinks from several screens to the media's height, so scroll by the difference to keep
  // the content exactly where it was. Lenis gets the new position too, or its smoothing would pull it back.
  useLayoutEffect(() => {
    const before = contentTopBeforeSwap.current;
    const content = sectionRef.current?.nextElementSibling;
    if (!finished || before === null || !content) return;
    contentTopBeforeSwap.current = null;
    const target = window.scrollY + content.getBoundingClientRect().top - before;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      window.scrollTo(0, target);
    }
  }, [finished, lenis]);

  useEffect(() => {
    intro.set(showMedia ? 1 : scrollYProgress.get());
    return () => intro.set(1);
  }, [showMedia, intro, scrollYProgress]);

  // Called by the 3D scene every frame, right after the camera moves.
  const handleFrame = ({ logo: projected, anchor }: SceneFrame) => {
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    const cue = cueRef.current;
    const logo = logoRef.current;
    if (!stage || !overlay || !cue || !logo) return;

    const p = scrollYProgress.get();
    overlay.style.opacity = String(range(p, INTRO.whitenStart, INTRO.whitenEnd));
    cue.style.opacity = String(1 - range(p, 0.01, 0.08));

    // Start on top of the 3D trailer logo, stay put while the truck drives away, then glide into the header's logo slot.
    const settle = easeInOutCubic(range(p, INTRO.logoSwapEnd, INTRO.driveStart));
    let x = lerp(projected.x, anchor.x, settle);
    let y = lerp(projected.y, anchor.y, settle);
    let width = lerp(projected.width, anchor.width, settle);
    const fly = easeInOutCubic(range(p, INTRO.flyStart, INTRO.flyEnd));
    const slot = document.querySelector<HTMLElement>("[data-intro-logo-target]");
    if (slot && fly > 0) {
      const stageBox = stage.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      x = lerp(x, slotBox.left - stageBox.left, fly);
      y = lerp(y, slotBox.top - stageBox.top, fly);
      width = lerp(width, slotBox.width, fly);
    }

    // Fades in exactly over the 3D logo, which then switches off, so the handoff is invisible.
    // Once it lands, the header's own logo takes over.
    const opacity = p >= INTRO.flyEnd ? 0 : range(p, INTRO.logoSwapStart, INTRO.logoSwapEnd);
    logo.style.opacity = String(opacity);
    logo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${width / logo.offsetWidth})`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={
        showMedia
          ? undefined
          : {
              height: `${INTRO.screens * 100}svh`,
              // Let the page content slide up over the (by then all-white) stage as the logo lands,
              // instead of scrolling through a screen of empty white first.
              marginBottom: "-30svh",
            }
      }
    >
      {showMedia ? (
        children
      ) : (
        <div ref={stageRef} aria-hidden className="sticky top-0 h-svh w-full overflow-hidden bg-[#eee8e0]">
          {webgl && (
            <div className="absolute inset-0">
              <TruckScene
                progress={scrollYProgress}
                active={inView}
                onReady={() => setReady(true)}
                onFrame={handleFrame}
              />
            </div>
          )}

          <div
            className={cx(
              "pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700",
              ready ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="w-12 animate-[spin_6s_linear_infinite]">
              <Logo variant="icon" alt="" loading="eager" />
            </div>
          </div>

          <div ref={cueRef} className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">Scroll</span>
            <span className="h-10 w-px overflow-hidden bg-ink/15">
              <span className="block h-1/2 w-px animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-ink" />
            </span>
          </div>

          <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-paper opacity-0" />

          {/* Drawn large and scaled down so it stays sharp at every size. */}
          <div ref={logoRef} className="pointer-events-none absolute left-0 top-0 w-[1600px] origin-top-left opacity-0">
            <Logo alt="" loading="eager" />
          </div>
        </div>
      )}
    </section>
  );
}
