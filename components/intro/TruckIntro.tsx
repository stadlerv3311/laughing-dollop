"use client";

import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

/**
 * Homepage scroll intro: a truck drives down the highway, the camera swings from above to
 * the trailer's side, the screen whitens around the logo, and the logo glides into the header.
 * Skipped entirely for reduced-motion visitors and browsers without WebGL.
 */
export function TruckIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const intro = useIntroProgress();
  const reduceMotion = useReducedMotion();
  const webgl = useSyncExternalStore(subscribeNever, detectWebGL, () => null);
  const skip = webgl === false || reduceMotion === true;

  const inView = useInView(sectionRef);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!skip) intro.set(p);
  });

  useEffect(() => {
    intro.set(skip ? 1 : scrollYProgress.get());
    return () => intro.set(1);
  }, [skip, intro, scrollYProgress]);

  // Called by the 3D scene every frame, right after the camera moves.
  const handleFrame = ({ logo: projected }: SceneFrame) => {
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    const cue = cueRef.current;
    const logo = logoRef.current;
    if (!stage || !overlay || !cue || !logo) return;

    const p = scrollYProgress.get();
    overlay.style.opacity = String(range(p, INTRO.whitenStart, INTRO.whitenEnd));
    cue.style.opacity = String(1 - range(p, 0.01, 0.08));

    // Start on top of the 3D trailer logo, then glide into the header's logo slot.
    let { x, y, width } = projected;
    const fly = easeInOutCubic(range(p, INTRO.flyStart, INTRO.flyEnd));
    const slot = document.querySelector<HTMLElement>("[data-intro-logo-target]");
    if (slot && fly > 0) {
      const stageBox = stage.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      x = lerp(x, slotBox.left - stageBox.left, fly);
      y = lerp(y, slotBox.top - stageBox.top, fly);
      width = lerp(width, slotBox.width, fly);
    }

    // Fades in exactly over the 3D logo while the white comes up, so the handoff is invisible.
    // Once it lands, the header's own logo takes over.
    const opacity = p >= INTRO.flyEnd ? 0 : range(p, INTRO.whitenStart, INTRO.whitenStart + 0.08);
    logo.style.opacity = String(opacity);
    logo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${width / logo.offsetWidth})`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: skip ? 0 : `${INTRO.screens * 100}svh`,
        // Let the page content slide up over the (by then all-white) stage as the logo lands,
        // instead of scrolling through a screen of empty white first.
        marginBottom: skip ? 0 : "-30svh",
      }}
    >
      {!skip && (
        <div ref={stageRef} aria-hidden className="sticky top-0 h-svh w-full overflow-hidden bg-[#e9e5e0]">
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
