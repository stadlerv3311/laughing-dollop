"use client";

import { useLenis } from "lenis/react";
import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, ViewTransition, type CSSProperties, type RefObject } from "react";
import { labelClass } from "@/components/ui";
import { cx } from "@/lib/cx";
import { QUOTE_BAND, QUOTE_OPEN, quoteLink } from "@/lib/site";
import type { StateCode } from "@/lib/us-states";
import { QuoteBar } from "./QuoteBar";
import { ShipRouteMap } from "./ShipRouteMap";

/** Remembers, for the visit, that the band has had its landing pause. */
const LANDED_KEY = "itr-ship-landed";
/**
 * How long the page holds on the band after landing: one sweep of the wave (24% of its 8s, 1.92s, globals.css) and a
 * beat after it (owner, 2026-10-05: stop "while that wave is going"; it was 2000, which let go as the wave left).
 */
const HOLD_MS = 2400;

/**
 * The shipper half's closing ask, full screen since 2026-10-02 (owner, from three rounds of mock-ups): "Have a load to
 * move?" in the middle of the screen with one big Get a quote button under it, over the dot map of the lower 48 filling
 * the band. The button opens into the quote form (QuoteBar), the ZIPs light their states on the map (ShipRouteMap),
 * and the quote sends from here. The paragraph under the heading came out (owner). The heading is 72px from tablets
 * up — a size over the other band headings, and a clear step under the hero's 84–120px, so the band reads as the
 * hero's answer rather than a second hero (owner, 2026-10-02).
 *
 * It's the site's quote form: every Get a quote button (lib/site.ts → `/#quote`) brings the visitor here and opens
 * it — on the homepage by gliding down, from another page by opening the homepage at the band. See useQuoteLinks.
 *
 * The first time the page scrolls down to it in a visit, it lands: the scroll glides the band up to the top of the
 * screen, holds there for one sweep of the map's white wave, and lets go (owner: "the screen stops on Ship with us,
 * one wave as a break, then go down"). Never again that visit, never on the way up, and not under reduced motion.
 *
 * On phones the map sits between the heading and the button instead of behind them.
 *
 * Before: a centred column about 675px tall — label, heading, one line, and a three-field bar that opened the quote page
 * — over a faint decorative map (2026-09-24 to 2026-10-02; on black since 2026-10-02).
 */
// Draft copy — swap in approved wording when it's ready.
export function ShipWithUs() {
  const ref = useRef<HTMLElement>(null);
  const [pickup, setPickup] = useState<StateCode | null>(null);
  const [delivery, setDelivery] = useState<StateCode | null>(null);
  // "City, ST" for each pin, when the ZIP is in the list (lib/zip.ts); the state's name otherwise.
  const [cities, setCities] = useState<{ pickup: string | null; delivery: string | null }>({ pickup: null, delivery: null });
  const [ride, setRide] = useState(0);
  const [sweep, setSweep] = useState(0);
  const [openRequest, setOpenRequest] = useState(0);
  // Whether the quote button has been pressed: the map's demo trips stop and only the wave stays.
  const [formOpen, setFormOpen] = useState(false);
  // The heading waits dimmed for the landing's wave, then lights with it; "lit" when there's no landing to wait for.
  const [heading, setHeading] = useState<HeadingState>("waiting");
  const still = useReducedMotion() ?? false;
  const inView = useInView(ref);

  const onStates = useCallback((from: StateCode | null, to: StateCode | null, fromCity: string | null, toCity: string | null) => {
    setPickup(from);
    setDelivery(to);
    setCities((now) => (now.pickup === fromCity && now.delivery === toCity ? now : { pickup: fromCity, delivery: toCity }));
  }, []);
  const onSent = useCallback(() => setRide((n) => n + 1), []);
  const requestOpen = useCallback(() => setOpenRequest((n) => n + 1), []);
  const disarm = useLandingPause(
    ref,
    () => {
      setSweep((n) => n + 1);
      setHeading("wave");
    },
    () => setHeading("lit"),
  );
  const skip = useCallback(() => {
    disarm();
    setHeading("lit");
  }, [disarm]);
  useQuoteLinks(ref, skip, requestOpen);

  return (
    // Shares its name with the Services page's closing card: that card's Get a quote grows it into this band
    // (2026-10-08). Only that link's `quote-open` navigation plays it; see QUOTE_BAND in lib/site.ts.
    <ViewTransition name={QUOTE_BAND} share={{ [QUOTE_OPEN]: "quote-open", default: "none" }} default="none">
    <section
      ref={ref}
      // Get a quote's anchor (lib/site.ts). The scroll itself is useQuoteLinks', so it lands right with the slide-over.
      id="quote"
      aria-labelledby="ship-with-us"
      data-header-theme="dark"
      // No nav link's section: the empty mark takes the header's filling line off the safety band's items as this
      // sheet slides over them (Header → `data-nav-section`).
      data-nav-section=""
      // No scroll anchoring: as the form opens, the centred heading moves up, and the browser would scroll the page
      // up after it (180px on a phone), pulling the band's top off the screen's.
      className="relative isolate flex min-h-svh [overflow-anchor:none] flex-col items-center justify-center overflow-hidden bg-ink px-5 pt-26 pb-8 text-center text-paper sm:px-8 md:pt-22 md:pb-12"
    >
      <ShipRouteMap
        pickup={pickup}
        delivery={delivery}
        pickupCity={cities.pickup}
        deliveryCity={cities.delivery}
        ride={ride}
        sweep={sweep}
        playing={inView}
        demo={!formOpen}
        className="relative order-2 my-7 aspect-[960/613] w-full md:absolute md:inset-x-[2vw] md:top-22 md:bottom-4 md:order-none md:my-0 md:aspect-auto md:w-auto"
      />

      {/* A soft pool of ink behind the heading, so the dots and the wave never run through the words. */}
      <div className="relative z-10 order-1 max-w-[64rem] before:absolute before:-inset-x-[12%] before:-inset-y-12 before:-z-10 before:bg-[radial-gradient(closest-side,rgb(37_37_37/0.92)_45%,transparent)]">
        <p className={cx(labelClass, "text-paper/70")}>Ship with us</p>
        {/* A size up from the other band headings (owner: "give it more weight"), held at 72px so it stays under the hero's. */}
        <h2
          id="ship-with-us"
          className="mt-3.5 font-display font-semibold text-[3rem] leading-none tracking-[-0.03em] text-balance sm:text-[4.5rem]"
          style={still ? undefined : headingWaveStyle(heading)}
        >
          Have a load to move?
        </h2>
      </div>

      <div className="relative z-10 order-3 flex w-full justify-center md:mt-11">
        <QuoteBar onStates={onStates} onSent={onSent} openRequest={openRequest} onOpenChange={setFormOpen} />
      </div>
    </section>
    </ViewTransition>
  );
}

type HeadingState = "waiting" | "wave" | "lit";

/**
 * The heading's one white wave (owner, 2026-10-05: "when you scroll down there is 1 white wave"). It waits at 35% white
 * until the landing, then lights to full white from left to right as the map's wave passes behind it — timed to the
 * wave (ship-wave in app/globals.css: the band crosses the map in 1.92s, and passes the heading's middle stretch about
 * 0.75–1.2s in) — and stays lit. The text is a clip of a gradient twice and a half its width, white on the left and
 * dim on the right, slid from its dim end to its white end. Under reduced motion, or with no landing to wait for (a
 * Get a quote link, a page opened past the band, a later visit), it's plain white.
 */
function headingWaveStyle(state: HeadingState): CSSProperties {
  return {
    color: "transparent",
    backgroundImage:
      "linear-gradient(90deg, rgb(255 255 255) 0%, rgb(255 255 255) 40%, rgb(255 255 255 / 0.35) 60%, rgb(255 255 255 / 0.35) 100%)",
    backgroundSize: "250% 100%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundPosition: state === "waiting" ? "100% 0" : "0% 0",
    transition: state === "wave" ? "background-position 0.5s linear 0.72s" : undefined,
  };
}

/** The band's top in the page, ignoring the slide-over's lift (offsets don't see transforms). */
function pageTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
  return top;
}

/**
 * The landing: once its top is in the upper half of the screen on the way down, the scroll glides it to the top and
 * holds for HOLD_MS, `onLand` starting the wave, then gives the scroll back. Once a visit; skipped under reduced motion
 * and when the page opens already past it (`onSkip`, also on a later visit). Returns `disarm`, for when the visitor is
 * sent here on purpose.
 */
function useLandingPause(ref: RefObject<HTMLElement | null>, onLand: () => void, onSkip: () => void) {
  const still = useReducedMotion() ?? false;
  const armed = useRef(true);

  const disarm = useCallback(() => {
    armed.current = false;
    try {
      sessionStorage.setItem(LANDED_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(LANDED_KEY)) {
        armed.current = false;
        onSkip();
      }
    } catch {
      // No storage: it lands once per page load instead.
    }
    // Once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLenis((lenis) => {
    const element = ref.current;
    if (!armed.current || still || !element) return;
    const target = pageTop(element);
    const distance = target - lenis.scroll;
    if (distance <= 0) {
      armed.current = false;
      onSkip();
      return;
    }
    if (lenis.direction !== 1 || distance > window.innerHeight * 0.5) return;

    disarm();
    lenis.scrollTo(target, {
      duration: 0.9,
      lock: true,
      force: true,
      onComplete: () => {
        lenis.stop();
        onLand();
        setTimeout(() => lenis.start(), HOLD_MS);
      },
    });
  });

  return disarm;
}

/** Whether a link is Get a quote's (`/#quote`, lib/site.ts). */
function isQuoteLink(href: string) {
  const url = new URL(href, window.location.href);
  const target = new URL(quoteLink.href, window.location.href);
  return url.origin === target.origin && url.pathname === target.pathname && url.hash === target.hash;
}

/**
 * Every Get a quote button on the site lands here with the form open (owner, 2026-10-02). On the homepage a click on
 * one is caught before Next.js and Lenis act on it, and the page glides down to the band (1.2s) and opens the form —
 * from the hero, the header or anywhere else. From another page the link opens the homepage at `/#quote`, and the
 * band is put at the top of the screen at once and the form opened. Either way the landing pause is spent: the
 * visitor came here on purpose. A new-tab click (⌘, Ctrl, Shift, middle button) is left to the browser.
 */
function useQuoteLinks(ref: RefObject<HTMLElement | null>, disarm: () => void, onOpen: () => void) {
  const lenis = useLenis();
  const still = useReducedMotion() ?? false;

  const go = useCallback(
    (immediate: boolean) => {
      const element = ref.current;
      if (!element || !lenis) return;
      disarm();
      lenis.resize();
      const target = pageTop(element);
      if (Math.abs(target - lenis.scroll) < 2) {
        onOpen();
        return;
      }
      lenis.scrollTo(target, { immediate: immediate || still, duration: 1.2, lock: true, force: true, onComplete: onOpen });
    },
    [ref, lenis, still, disarm, onOpen],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || !isQuoteLink(link.href)) return;
      event.preventDefault();
      // After the rest of this click: Lenis's own jump to the anchor, and the phone menu closing (it holds the scroll).
      setTimeout(() => go(false));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [go]);

  // Arrived from another page's Get a quote.
  useEffect(() => {
    if (!lenis || window.location.hash !== new URL(quoteLink.href, window.location.href).hash) return;
    const frame = requestAnimationFrame(() => {
      // The address goes back to plain `/`, so a reload doesn't open the form again.
      window.history.replaceState(window.history.state, "", window.location.pathname);
      go(true);
    });
    return () => cancelAnimationFrame(frame);
    // Once, when Lenis is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);
}
