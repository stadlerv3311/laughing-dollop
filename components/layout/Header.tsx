"use client";

import {
  AnimatePresence,
  easeOut,
  motion,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { INTRO } from "@/components/intro/timeline";
import { useIntroProgress } from "@/components/providers";
import { Container, InteractiveHoverButton, Logo } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, primaryNav, quoteLink, site } from "@/lib/site";
import { MenuToggle, MobileMenu } from "./MobileMenu";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Only phones hide the bar on scroll down; bigger screens keep the CTAs in view. Tailwind's `sm` breakpoint. */
const PHONE_QUERY = "(width < 40rem)";

/** Where the header's logo sits, from the top of the screen — the point checked against dark bands. */
const HEADER_MID = 36;

/**
 * The band marked `data-header-theme="dark"` under the header, if any, so the logo and CTAs switch to light. A band
 * marked `data-header-glass="matte"` as well (the homepage hero) gets the see-through matte bar instead of the ink one.
 */
function darkBandUnder() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]')).find((band) => {
    const { top, bottom } = band.getBoundingClientRect();
    return top <= HEADER_MID && bottom >= HEADER_MID;
  });
}

/** How far down the screen the reading line sits, as a share of its height: the section crossing it is the one you're on. */
const READING_LINE = 0.5;

/**
 * The homepage section on the reading line, as the nav link it belongs to, and how far each marked section has been
 * read. Sections are marked `data-nav-section="/services"` with their nav link's href; one marked with an empty value
 * (Ship with us) belongs to no link. A later section wins where two overlap, since that is the one on top: Ship with
 * us slides up over the pinned safety band (SlideOverStack), whose own box stays put underneath.
 */
function sectionOnReadingLine(fills: Map<string, MotionValue<number>>) {
  const line = window.innerHeight * READING_LINE;
  let current: string | null = null;
  document.querySelectorAll<HTMLElement>("[data-nav-section]").forEach((section) => {
    const { top, height } = section.getBoundingClientRect();
    if (height === 0) return;
    const href = section.dataset.navSection ?? "";
    fills.get(href)?.set(Math.min(1, Math.max(0, (line - top) / height)));
    if (top <= line && line < top + height) current = href || null;
  });
  return current;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** The round menu button's surface on phones: a thin ring over dark bands, a light frosted disc elsewhere. */
function menuButtonClass(light: boolean) {
  return cx(
    "rounded-full transition-[background-color,box-shadow] duration-300",
    light ? "ring-1 ring-inset ring-paper/45" : "bg-paper/80 ring-1 ring-inset ring-ink/10 backdrop-blur-xl",
  );
}

function navItemClass(active: boolean, light: boolean) {
  return cx(
    "relative inline-flex h-9 items-center gap-1.5 whitespace-nowrap px-3 text-[15px] font-medium transition-colors duration-300 xl:px-4",
    light
      ? active
        ? "text-paper"
        : "text-paper/70 hover:text-paper"
      : active
        ? "text-ink"
        : "text-ink/70 hover:text-ink",
  );
}

/**
 * A short line under the current page's item. There is only ever one, and it shares a `layoutId`, so when you
 * go to another page it glides across to the new item instead of jumping (the glide dates from 2026-09-19, when
 * this was a black pill).
 */
function ActiveMark({ light }: { light: boolean }) {
  return (
    <motion.span
      layoutId="nav-active-mark"
      aria-hidden
      className={cx(
        "absolute inset-x-3 bottom-0.5 h-px transition-colors duration-300 xl:inset-x-4",
        light ? "bg-paper" : "bg-ink",
      )}
      transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.9 }}
    />
  );
}

/**
 * The same line on the homepage, under the item whose section you're reading, filling from the left as you scroll
 * through it (the builder, 2026-10-08: "when you are on services block services on nav bar has a filling line
 * underneath then for every section it does the same"). A faint line the full width of the label shows how far there
 * is to go. It fades in and out as the page passes from one section to the next.
 */
function SectionMark({ fill, light }: { fill: MotionValue<number>; light: boolean }) {
  return (
    <motion.span
      aria-hidden
      className={cx(
        "absolute inset-x-3 bottom-0.5 h-px transition-colors duration-300 xl:inset-x-4",
        light ? "bg-paper/25" : "bg-ink/15",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className={cx("absolute inset-0 transition-colors duration-300", light ? "bg-paper" : "bg-ink")}
        style={{ scaleX: fill, originX: 0 }}
      />
    </motion.span>
  );
}

type NavItemProps = {
  href: string;
  active: boolean;
  /** How far its homepage section has been read, while that section is the one on screen. */
  fill?: MotionValue<number>;
  light: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

function NavItem({ href, active, fill, light, children, ...rest }: NavItemProps) {
  const reading = Boolean(fill);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={navItemClass(active || reading, light)}
      {...rest}
    >
      {active && <ActiveMark light={light} />}
      <AnimatePresence>{fill && !active && <SectionMark fill={fill} light={light} />}</AnimatePresence>
      <span className="relative">{children}</span>
    </Link>
  );
}

/**
 * Fixed site header, type only (2026-09-24, after Lightship on Mobbin; it replaced the frosted-glass pills): the
 * logo top-left, plain text links in the middle with a thin line under the current page (on the homepage, under the
 * section you're reading, filling as you scroll through it: SectionMark), and the two CTAs on the
 * right as a matched pair of interactive hover buttons. Over dark bands everything is white — on the hero's film with
 * no bar at the top and matte glass once the page has scrolled (2026-10-09), on the others over an ink frosted bar once
 * the page has scrolled (2026-10-01); over light sections a white
 * frosted bar fades in (no hairline under it since 2026-10-02) and everything turns ink — Get a quote outlined, Apply now solid. It stays in view as you scroll
 * — except on phones, where it slides away on scroll down and drops back on scroll up. Careers is a plain link
 * since 2026-09-25 (owner: remove the dropdown); it opens the job application, which covers all three jobs. During the homepage
 * intro the nav stays dimmed over the scene (full on hover) while the logo fades and settles into place —
 * see HomeIntro.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const intro = useIntroProgress();
  const { scrollY } = useScroll();

  const [introDone, setIntroDone] = useState(() => intro.get() >= INTRO.litAt);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The homepage opens on the dark hero, so start light there — otherwise the CTAs flash solid black on load
  // until the first check below runs.
  const [onDark, setOnDark] = useState(isHome);
  const [matte, setMatte] = useState(isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  // The homepage section being read, as its nav link's href, and how far through each one the page is.
  const [reading, setReading] = useState<string | null>(null);
  const fills = useMemo(() => new Map(primaryNav.map((link) => [link.href, motionValue(0)])), []);

  // On the homepage's first open the whole bar slides down from above the screen with the hero's truck, easing to a
  // stop (see HomeIntro). The logo fades in as it comes and keeps settling to its resting size for the rest.
  const dropY = useTransform(intro, [...INTRO.headerDrop], ["-100%", "0%"], { ease: easeOut });
  const logoOpacity = useTransform(intro, [0, 0.5], [0, 1]);
  const logoScale = useTransform(intro, [0, 1], [INTRO.appearScale, 1]);

  useMotionValueEvent(intro, "change", (p) => setIntroDone(p >= INTRO.litAt));

  /**
   * What's under the header right now: dark or light, the hero's film, and whether the page has scrolled. And which
   * marked section is on the reading line, for the line under its nav item.
   */
  function checkBand() {
    const band = darkBandUnder();
    setOnDark(Boolean(band));
    setMatte(band?.dataset.headerGlass === "matte");
    setSolid(intro.get() >= 1 && window.scrollY > 12);
    setReading(sectionOnReadingLine(fills));
  }

  useMotionValueEvent(scrollY, "change", (y) => {
    checkBand();
    const introFinished = intro.get() >= 1;
    setSolid(introFinished && y > 12);
    if (!introFinished || mobileOpen || !window.matchMedia(PHONE_QUERY).matches) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? y;
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 160);
  });

  // A new page can open with a dark band already under the header, and it may still be swapping in (view
  // transitions) or restoring its scroll on the first frame — so keep checking for its first second.
  useEffect(() => {
    let frame = 0;
    const until = performance.now() + 1000;
    const tick = () => {
      checkBand();
      if (performance.now() < until) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Only on a page change; `checkBand` reads the page at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Belt and braces with the scroll value above: the plain scroll event and resizing also re-check what's under
  // the header, so the bars can't be left showing the band you came from (owner, 2026-10-01: the dark glass stayed
  // on over the hero).
  useEffect(() => {
    const onChange = () => checkBand();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeAll = () => setMobileOpen(false);
  // White type and rings over dark bands, unless the phone menu is open (its sheet is light).
  const light = onDark && !mobileOpen;

  // Over the intro scene the bar is dimmed; hovering or tabbing into it (or opening a menu) brings it to full.
  const dimmed = !introDone && !mobileOpen;
  const dimClass = cx(
    "transition-opacity duration-300",
    dimmed && "opacity-60 group-hover:opacity-100 group-focus-within:opacity-100",
  );

  return (
    <>
      <motion.header
        className="group fixed inset-x-0 top-0 z-50"
        initial={isHome ? false : { y: "-100%" }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <motion.div className="relative" style={{ y: dropY }}>
          {/*
            Over light sections, once the page has scrolled, a white bar fades in behind everything so
            the links stay readable; it also shows while the phone menu is open, since the links turn dark then.
            Over dark bands the same frosted bar in ink (owner, 2026-10-01: the white logo and links ran into the
            safety band's heading as it scrolled under them). Over the homepage hero, matte glass instead: the film
            blurred behind the bar with barely a tint, so it keeps its colour (the builder, 2026-10-09: "add matte glass
            on scroll while on hero… as soon as i am off hero use same logic as now").
          */}
          <div
            aria-hidden
            className={cx(
              "absolute inset-0 -z-10 bg-paper/85 backdrop-blur-xl transition-opacity duration-500",
              (solid && !onDark) || mobileOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cx(
              "absolute inset-0 -z-10 bg-ink/85 backdrop-blur-xl transition-opacity duration-500",
              solid && onDark && !matte && !mobileOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cx(
              "absolute inset-0 -z-10 bg-ink/20 backdrop-blur-xl transition-opacity duration-500",
              solid && onDark && matte && !mobileOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <Container className="flex h-18 items-center gap-4 xl:gap-6">
            <Link
              href="/"
              aria-label={`${site.name} home`}
              onClick={closeAll}
              className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {/* Fades and settles into place as the homepage intro hands over — see HomeIntro. */}
              <motion.div
                style={{ opacity: logoOpacity, scale: logoScale }}
                className="relative w-[132px] sm:w-[148px]"
              >
                <Logo alt="" loading="eager" className={cx("transition-opacity duration-300", light && "opacity-0")} />
                {/* White wordmark over dark bands (the homepage story band). */}
                <Logo
                  variant="light"
                  alt=""
                  className={cx("absolute inset-0 transition-opacity duration-300", !light && "opacity-0")}
                />
              </motion.div>
            </Link>

            <div className={cx("hidden flex-1 justify-center lg:flex", dimClass)}>
              <nav aria-label="Main" className="flex items-center">
                {primaryNav.map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    active={isActive(pathname, link.href)}
                    fill={reading === link.href ? fills.get(link.href) : undefined}
                    light={light}
                    onClick={closeAll}
                  >
                    {link.label}
                  </NavItem>
                ))}
              </nav>
            </div>

            <div className={cx("ml-auto flex items-center gap-3 lg:ml-0", dimClass)}>
              {/* Breakpoint visibility lives on wrappers — Button's own inline-flex would override `hidden`. */}
              <div className="hidden lg:block">
                {/*
                  The two CTAs share one fixed width from `xl` (`--width-header-cta`, app/globals.css), so they
                  read as a pair — HomeHero's text column matches the pair's total width off the same variable.
                  Both are 40px tall. Between 1024 and 1280 they size to their labels, or the row runs off the
                  right edge. They play the hero buttons' dot-fill hover (InteractiveHoverButton): faint white
                  rings over dark bands (`ghostQuiet`), so they sit back and the hero's buttons lead.
                */}
                <InteractiveHoverButton
                  href={quoteLink.href}
                  text={quoteLink.label}
                  size="md"
                  variant={light ? "ghostQuiet" : "ghostDark"}
                  onClick={closeAll}
                  className="transition-colors duration-300 xl:w-[var(--width-header-cta)]"
                />
              </div>
              <div className="hidden sm:block">
                <InteractiveHoverButton
                  href={applyLink.href}
                  text={applyLink.label}
                  size="md"
                  variant={light ? "ghostQuiet" : "ink"}
                  onClick={closeAll}
                  className="transition-colors duration-300 xl:w-[var(--width-header-cta)]"
                />
              </div>
              <div className={cx("lg:hidden", menuButtonClass(light && !mobileOpen))}>
                <MenuToggle open={mobileOpen} light={light} onToggle={() => setMobileOpen((open) => !open)} />
              </div>
            </div>
          </Container>
        </motion.div>
      </motion.header>

      <MobileMenu open={mobileOpen} pathname={pathname} onNavigate={closeAll} />
    </>
  );
}
