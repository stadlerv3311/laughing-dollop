"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { Button, Container } from "@/components/ui";
import { cx } from "@/lib/cx";
import { applyLink, careersNav, primaryNav, quoteLink, trackLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const links = [...primaryNav, ...careersNav, trackLink];

type MobileMenuProps = {
  open: boolean;
  pathname: string;
  onNavigate: () => void;
};

/** Full-screen menu for phones and tablets. Drops down from the top; the header stays above it. */
export function MobileMenu({ open, pathname, onNavigate }: MobileMenuProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = previousOverflow;
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-paper lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Container className="flex h-full flex-col overflow-y-auto pb-8 pt-28">
            <nav aria-label="Mobile">
              <ul>
                {links.map((link, index) => {
                  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + index * 0.05, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "flex items-center justify-between py-3 text-3xl font-semibold tracking-tight",
                          active ? "text-ink" : "text-ink/70",
                        )}
                      >
                        {link.label}
                        {active && <span className="size-2 rounded-full bg-brand" aria-hidden />}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              className="mt-auto grid gap-3 pt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            >
              <Button href={applyLink.href} size="lg" onClick={onNavigate}>
                {applyLink.label}
              </Button>
              <Button href={quoteLink.href} size="lg" variant="outline" onClick={onNavigate}>
                {quoteLink.label}
              </Button>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Two-line menu icon that morphs into an X. */
export function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
    >
      <motion.span
        className="absolute h-0.5 w-5 rounded-full bg-ink"
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      <motion.span
        className="absolute h-0.5 w-5 rounded-full bg-ink"
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </button>
  );
}
