"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { INTRO } from "@/components/intro/timeline";
import { useIntroProgress } from "@/components/providers";
import { Button, Container, Logo } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, careersNav, primaryNav, quoteLink, site, trackLink } from "@/lib/site";
import { CareersPanel } from "./CareersPanel";
import { MenuToggle, MobileMenu } from "./MobileMenu";

const EASE = [0.22, 1, 0.36, 1] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function navItemClass(active: boolean, small = false) {
  return cx(
    "relative inline-flex items-center gap-1.5 py-2 font-medium transition-colors duration-300",
    small ? "text-sm" : "text-[15px]",
    active ? "text-ink" : "text-ink/70 hover:text-ink",
    "after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand after:transition-transform after:duration-500 after:ease-premium",
    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
  );
}

type NavItemProps = { href: string; active: boolean; small?: boolean; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>;

function NavItem({ href, active, small, children, ...rest }: NavItemProps) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={navItemClass(active, small)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * Fixed site header (Lucid-style): transparent at the top, frosted white once you scroll,
 * slides away on scroll down and drops back on scroll up. Careers opens a panel that drops
 * from under the bar. On the homepage the logo and nav stay hidden until the intro lands them.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const intro = useIntroProgress();
  const { scrollY } = useScroll();

  const [introDone, setIntroDone] = useState(() => intro.get() >= INTRO.navStart);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoOpacity = useTransform(intro, (p) => (p >= INTRO.flyEnd ? 1 : 0));
  const navOpacity = useTransform(intro, [INTRO.navStart, 1], [0, 1]);
  const navY = useTransform(intro, [INTRO.navStart, 1], [-14, 0]);

  useMotionValueEvent(intro, "change", (p) => setIntroDone(p >= INTRO.navStart));

  useMotionValueEvent(scrollY, "change", (y) => {
    const introFinished = intro.get() >= 1;
    setSolid(introFinished && y > 12);
    if (!introFinished || careersOpen || mobileOpen) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? y;
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 160);
  });

  useEffect(() => {
    if (!careersOpen && !mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCareersOpen(false);
      setMobileOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setCareersOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [careersOpen, mobileOpen]);

  const closeAll = () => {
    setCareersOpen(false);
    setMobileOpen(false);
  };
  const closeCareers = () => setCareersOpen(false);
  const careersActive = careersNav.some((link) => isActive(pathname, link.href));

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
        initial={isHome ? false : { y: "-100%" }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
        onMouseLeave={closeCareers}
      >
        <div
          className={cx(
            "relative transition-[background-color,backdrop-filter] duration-500",
            solid || careersOpen ? "bg-paper/85 backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <Container className="flex h-18 items-center gap-8">
            <Link
              href="/"
              aria-label={`${site.name} home`}
              onClick={closeAll}
              onMouseEnter={closeCareers}
              className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {/* The intro's flying logo lands exactly on this element. */}
              <motion.div data-intro-logo-target style={{ opacity: logoOpacity }} className="w-[132px] sm:w-[148px]">
                <Logo alt="" loading="eager" />
              </motion.div>
            </Link>

            <motion.nav
              aria-label="Main"
              style={{ opacity: navOpacity, y: navY }}
              className={cx("hidden flex-1 items-center justify-center gap-8 lg:flex", !introDone && "pointer-events-none")}
            >
              {primaryNav.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  active={isActive(pathname, link.href)}
                  onMouseEnter={closeCareers}
                  onClick={closeAll}
                >
                  {link.label}
                </NavItem>
              ))}
              <button
                type="button"
                aria-expanded={careersOpen}
                aria-controls="careers-panel"
                onMouseEnter={() => setCareersOpen(true)}
                onClick={() => setCareersOpen((open) => !open)}
                className={navItemClass(careersActive)}
              >
                Careers
                <svg viewBox="0 0 12 12" aria-hidden className={cx("size-3 transition-transform duration-500 ease-premium", careersOpen && "rotate-180")}>
                  <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <NavItem
                href={trackLink.href}
                active={isActive(pathname, trackLink.href)}
                small
                onMouseEnter={closeCareers}
                onClick={closeAll}
              >
                {trackLink.label}
              </NavItem>
            </motion.nav>

            <motion.div
              style={{ opacity: navOpacity, y: navY }}
              className={cx("ml-auto flex items-center gap-3 lg:ml-0", !introDone && "pointer-events-none")}
              onMouseEnter={closeCareers}
            >
              {/* Breakpoint visibility lives on wrappers — Button's own inline-flex would override `hidden`. */}
              <div className="hidden lg:block">
                <Button href={quoteLink.href} variant="outline" onClick={closeAll}>
                  {quoteLink.label}
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button href={applyLink.href} onClick={closeAll}>
                  {applyLink.label}
                </Button>
              </div>
              <MenuToggle open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)} />
            </motion.div>
          </Container>

          <AnimatePresence>
            {careersOpen && <CareersPanel links={careersNav} pathname={pathname} onNavigate={closeAll} />}
          </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {careersOpen && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-40 bg-ink/10 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <MobileMenu open={mobileOpen} pathname={pathname} onNavigate={closeAll} />
    </>
  );
}
