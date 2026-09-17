"use client";

import { useLenis } from "lenis/react";
import { animate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useIntroProgress } from "@/components/providers";
import { Logo } from "@/components/ui";
import { advanceClock, startClock } from "./clock";
import { logoInVideo, VIDEO } from "./logoTrack";
import { lerpQuad, mapQuad, quadToMatrix3d, rectToQuad, type Quad, type Rect } from "./quad";
import { easeInOutCubic, INTRO, range } from "./timeline";

const subscribeNever = () => () => {};

// The intro plays once per visit: coming back to the homepage later goes straight to the content.
// A reload or a new visit plays it again.
let playedThisVisit = false;

/** Keys that would scroll the page. While the intro plays they skip it instead. */
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

/** Space (px) the flat logo keeps from the sides of the screen. */
const EDGE = 24;

/** Where the logo turns to face you: as tall as the painted logo's near edge, centered on it, kept on screen. */
function flatSpot([topLeft, topRight, bottomRight, bottomLeft]: Quad, aspect: number, stageWidth: number): Rect {
  const tallest = Math.max(bottomLeft.y - topLeft.y, bottomRight.y - topRight.y);
  const width = Math.min(tallest * aspect, stageWidth - EDGE * 2);
  const height = width / aspect;
  const centerX = (topLeft.x + topRight.x + bottomRight.x + bottomLeft.x) / 4;
  const centerY = (topLeft.y + topRight.y + bottomRight.y + bottomLeft.y) / 4;
  const x = Math.min(Math.max(centerX - width / 2, EDGE), stageWidth - EDGE - width);
  return { x, y: centerY - height / 2, width, height };
}

type TruckIntroProps = {
  /** The top of the page (the photo band). It's always there — the intro plays on top of it, then fades away. */
  children: ReactNode;
};

/**
 * Homepage intro that plays by itself on load: a 5-second video of our truck on a desert highway that ends on the
 * trailer's logo. A copy of the logo fades in exactly over the painted one (bent to the trailer's angle) and
 * follows it, the video fades to white while the logo turns to face you, then it glides into the header and the
 * page shows through (`INTRO.duration` in all). Scrolling, tapping, a scroll key or the Skip button jumps to the
 * end in about half a second. The header stays clickable the whole time. Skipped entirely for reduced-motion
 * visitors and repeat homepage views in the same visit; if the video can't start in time, the page just shows.
 */
export function TruckIntro({ children }: TruckIntroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  // Read once on mount, so marking it played below doesn't cut off the intro that's on screen.
  const [alreadyPlayed] = useState(() => playedThisVisit);
  const [finished, setFinished] = useState(false);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const skipping = useRef(false);

  // Intro progress 0 → 1, shared with the header. The video's clock drives it.
  const intro = useIntroProgress();
  // 0 → 1 while skipping: fades the video to white and brings the flat logo in at its resting spot.
  const skipped = useMotionValue(0);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  // False while hydrating, so the first client render matches the server HTML (the intro). useReducedMotion
  // reads the setting immediately, which would otherwise remove the intro mid-hydration and fail it.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const skipIntro = alreadyPlayed || (hydrated && reduceMotion === true);
  const playing = !skipIntro && !finished;

  useEffect(() => {
    playedThisVisit = true;
  }, []);

  // The header reads 0 while the intro is on screen and 1 once it's done, skipped, or navigated away from.
  useEffect(() => {
    if (!playing) {
      intro.set(1);
      return;
    }
    intro.set(0);
    return () => {
      playback.current?.stop();
      intro.set(1);
    };
  }, [playing, intro]);

  const skipToEnd = useCallback(() => {
    if (skipping.current) return;
    skipping.current = true;
    const finish = () => setFinished(true);

    // Still loading: nothing has played yet, so just show the page.
    if (!startedRef.current) return finish();
    videoRef.current?.pause();

    const from = intro.get();
    if (from >= INTRO.whitenEnd) {
      const left = (1 - from) / (1 - INTRO.whitenEnd);
      playback.current = animate(intro, 1, { duration: INTRO.skipGlide * left, ease: "linear", onComplete: finish });
      return;
    }
    playback.current = animate(skipped, 1, {
      duration: INTRO.skipFade,
      ease: "linear",
      onComplete: () => {
        // Under full white now, so the clock can jump ahead unseen.
        intro.set(INTRO.whitenEnd);
        playback.current = animate(intro, 1, { duration: INTRO.skipGlide, ease: "linear", onComplete: finish });
      },
    });
  }, [intro, skipped]);

  // Starts the video by hand rather than with `autoPlay`: React leaves `muted` out of the server HTML, and browsers
  // only autoplay muted video. If it won't start in time (slow network, autoplay turned off), the page shows instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    const giveUp = () => {
      if (!startedRef.current) skipToEnd();
    };
    const timeout = window.setTimeout(giveUp, INTRO.loadTimeout * 1000);
    video.muted = true;
    video.play().catch(giveUp);
    return () => window.clearTimeout(timeout);
  }, [playing, skipToEnd]);

  // Start at the top, even if the browser restored a scroll position from before a reload.
  useEffect(() => {
    if (!playing || !started) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [playing, started, lenis]);

  // While it plays, the page doesn't scroll: scrolling, a tap or a scroll key skips to the end instead.
  // Capture phase on window, so Lenis's own wheel listener never sees the event.
  useEffect(() => {
    if (!playing) return;
    const blockScroll = (event: Event) => {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      skipToEnd();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.code === "Space" ? " " : event.key;
      if (key === "Escape") return skipToEnd();
      if (!SCROLL_KEYS.has(key)) return;
      // Space still presses a focused button or link in the header.
      if (key === " " && (event.target as Element).closest?.("a, button, input, select, textarea")) return;
      event.preventDefault();
      skipToEnd();
    };
    const options = { capture: true, passive: false };
    window.addEventListener("wheel", blockScroll, options);
    window.addEventListener("touchmove", blockScroll, options);
    window.addEventListener("pointerdown", skipToEnd, true);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("wheel", blockScroll, options);
      window.removeEventListener("touchmove", blockScroll, options);
      window.removeEventListener("pointerdown", skipToEnd, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [playing, skipToEnd]);

  // One loop per frame while the intro is on screen. It advances the clock (the video's own time while it plays,
  // then real time once the video has stopped on its last frame) and moves the logo, the white overlay, the stage
  // fade and the Skip button's progress line.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    let clock = startClock();
    let nextNudge = 0;

    const draw = () => {
      const stage = stageRef.current;
      const backdrop = backdropRef.current;
      const overlay = overlayRef.current;
      const logo = logoRef.current;
      const skip = skipRef.current;
      if (!stage || !backdrop || !overlay || !logo || !skip) return;

      const p = intro.get();
      const s = skipped.get();
      overlay.style.opacity = String(Math.max(range(p, INTRO.whitenStart, INTRO.whitenEnd), s));
      backdrop.style.opacity = String(1 - range(p, INTRO.revealStart, 1));
      skip.style.opacity = String(Math.min(1 - range(p, INTRO.whitenStart - 0.04, INTRO.whitenStart), 1 - s));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      // The video covers the stage, centered (`object-cover`): video px → stage px.
      const stageBox = stage.getBoundingClientRect();
      const scale = Math.max(stageBox.width / VIDEO.width, stageBox.height / VIDEO.height);
      const offsetX = (stageBox.width - VIDEO.width * scale) / 2;
      const offsetY = (stageBox.height - VIDEO.height * scale) / 2;
      const onStage = (quad: Quad) => mapQuad(quad, ({ x, y }) => ({ x: offsetX + x * scale, y: offsetY + y * scale }));
      const aspect = logo.offsetWidth / logo.offsetHeight;

      // Starts on the painted logo, bent to the trailer's angle, then turns flat to face you.
      // Skipping takes it to the flat spot it would reach from the video's last frame.
      const painted = onStage(logoInVideo(p * INTRO.duration));
      const unfold = easeInOutCubic(range(p, INTRO.unfoldStart, INTRO.unfoldEnd));
      let corners = lerpQuad(painted, rectToQuad(flatSpot(painted, aspect, stageBox.width)), unfold);
      if (s > 0) {
        const resting = flatSpot(onStage(logoInVideo(Infinity)), aspect, stageBox.width);
        corners = lerpQuad(corners, rectToQuad(resting), s);
      }

      // Then it glides into the header's logo slot.
      const fly = easeInOutCubic(range(p, INTRO.flyStart, INTRO.flyEnd));
      const slot = document.querySelector<HTMLElement>("[data-intro-logo-target]");
      if (slot && fly > 0) {
        const slotBox = slot.getBoundingClientRect();
        const target = { x: slotBox.left - stageBox.left, y: slotBox.top - stageBox.top, width: slotBox.width, height: slotBox.height };
        corners = lerpQuad(corners, rectToQuad(target), fly);
      }

      // Fades in over the painted logo. Once it lands, the header's own logo takes over.
      const opacity = p >= INTRO.flyEnd ? 0 : Math.max(range(p, INTRO.logoSwapStart, INTRO.logoSwapEnd), s);
      logo.style.opacity = String(opacity);
      logo.style.transform = quadToMatrix3d(logo.offsetWidth, logo.offsetHeight, corners);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = (now - last) / 1000;
      last = now;
      const video = videoRef.current;
      if (startedRef.current && !skipping.current && video) {
        const picture = { time: video.currentTime, length: video.duration, ended: video.ended, paused: video.paused };
        clock = advanceClock(clock, picture, dt);
        // The picture has stopped moving — buffering, a backgrounded tab, a phone saving power. Ask the video to
        // pick up again, but not on every frame.
        if (clock.stalled === 0) nextNudge = 0;
        if (clock.nudge && clock.stalled > nextNudge) {
          nextNudge = clock.stalled + 1;
          void video.play().catch(() => {});
        }
        intro.set(Math.min(1, clock.seconds / INTRO.duration));
        if (clock.seconds >= INTRO.duration) setFinished(true);
      }
      draw();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, intro, skipped]);

  const handlePlaying = () => {
    startedRef.current = true;
    setStarted(true);
  };

  return (
    <>
      {children}
      {playing && (
        // Under the header (z-50), so its links and buttons stay clickable while the intro plays.
        <div ref={stageRef} className="fixed inset-0 z-40 overflow-hidden">
          <div ref={backdropRef} aria-hidden className="absolute inset-0 bg-mist">
            {/* The first frame shows as the poster while the video loads. Phones get the lighter 720p file. */}
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              poster="/videos/home-intro-poster.jpg"
              onPlaying={handlePlaying}
            >
              <source src="/videos/home-intro-720.mp4" type="video/mp4" media="(max-width: 767px)" />
              <source src="/videos/home-intro-1080.mp4" type="video/mp4" />
            </video>

            <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-paper opacity-0" />
          </div>

          {/* Drawn large and shrunk onto its corners each frame, so it stays sharp at every size. */}
          <div
            ref={logoRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 aspect-[764/192] w-[1600px] origin-top-left opacity-0"
          >
            <Logo alt="" loading="eager" />
          </div>

          <button
            ref={skipRef}
            type="button"
            onClick={skipToEnd}
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink/70 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
          >
            Skip intro
            <span aria-hidden className="h-px w-16 overflow-hidden bg-ink/15">
              <span ref={barRef} className="block h-px w-full origin-left scale-x-0 bg-ink" />
            </span>
          </button>
        </div>
      )}
    </>
  );
}
