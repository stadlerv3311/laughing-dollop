"use client";

import { easeOut, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { INTRO } from "@/components/intro/timeline";
import { useIntroProgress } from "@/components/providers";
import { Container, InteractiveHoverButton, Logo } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, careersLink, primaryNav, quoteLink, site, fleetMapLink } from "@/lib/site";
import { MenuToggle, MobileMenu } from "./MobileMenu";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Only phones hide the bar on scroll down; bigger screens keep the CTAs in view. Tailwind's `sm` breakpoint. */
const PHONE_QUERY = "(width < 40rem)";

/** Where the header's logo sits, from the top of the screen — the point checked against dark bands. */
const HEADER_MID = 36;

/** The band marked `data-header-theme="dark"` under the header, if any, so the logo and CTAs switch to light. */
function darkBandUnder() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]')).find((band) => {
    const { top, bottom } = band.getBoundingClientRect();
    return top <= HEADER_MID && bottom >= HEADER_MID;
  });
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

type NavItemProps = { href: string; active: boolean; light: boolean; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>;

function NavItem({ href, active, light, children, ...rest }: NavItemProps) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={navItemClass(active, light)} {...rest}>
      {active && <ActiveMark light={light} />}
      <span className="relative">{children}</span>
    </Link>
  );
}

/**
 * Fixed site header, type only (2026-09-24, after Lightship on Mobbin; it replaced the frosted-glass pills): the
 * logo top-left, plain text links in the middle with a thin line under the current page, and the two CTAs on the
 * right as a matched pair of interactive hover buttons. Over dark bands (the hero, the story band) everything is
 * white on the film with no bar; over light sections, once the page has scrolled, a white bar with a hairline
 * fades in and everything turns ink — Get a quote outlined, Apply now solid. It stays in view as you scroll
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // On the homepage's first open the whole bar slides down from above the screen with the hero's truck, easing to a
  // stop (see HomeIntro). The logo fades in as it comes and keeps settling to its resting size for the rest.
  const dropY = useTransform(intro, [...INTRO.headerDrop], ["-100%", "0%"], { ease: easeOut });
  const logoOpacity = useTransform(intro, [0, 0.5], [0, 1]);
  const logoScale = useTransform(intro, [0, 1], [INTRO.appearScale, 1]);

  useMotionValueEvent(intro, "change", (p) => setIntroDone(p >= INTRO.litAt));

  useMotionValueEvent(scrollY, "change", (y) => {
    setOnDark(Boolean(darkBandUnder()));
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

  // A new page can open with a dark band already under the header; check once it has painted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOnDark(Boolean(darkBandUnder())));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

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
            No bar over dark bands — the film shows through the whole top edge. Over light sections, once the page
            has scrolled, a white bar with a hairline fades in behind everything so the links stay readable; it also
            shows while the phone menu is open, since the links turn dark then.
          */}
          <div
            aria-hidden
            className={cx(
              "absolute inset-0 -z-10 border-b border-ink/10 bg-paper/85 backdrop-blur-xl transition-opacity duration-500",
              (solid && !onDark) || mobileOpen ? "opacity-100" : "opacity-0",
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
                data-intro-logo-target
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
                {[...primaryNav, careersLink, fleetMapLink].map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    active={isActive(pathname, link.href)}
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
