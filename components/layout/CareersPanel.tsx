"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { cx } from "@/lib/cx";
import type { NavLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type CareersPanelProps = {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
  /**
   * Matches what's under the header: "light" over light sections, "dark" over plain dark bands (the story band,
   * About's opening), "glass" — clear frosted glass — over a full-screen picture (the homepage hero).
   */
  tone?: "light" | "dark" | "glass";
};

/**
 * The small glass panel that drops from under the nav pill when "Careers" is hovered or clicked. Light glass over
 * light sections; dark glass with white type over dark bands, and clear frosted glass over a full-screen picture
 * (2026-09-24 — it used to turn the header and itself white over the hero, which looked out of place).
 */
export function CareersPanel({ links, pathname, onNavigate, tone = "light" }: CareersPanelProps) {
  // Both dark tones take white type; they differ only in how much of the page shows through.
  const dark = tone !== "light";
  return (
    <motion.div
      id="careers-panel"
      // Padding, not margin, above the panel: the gap stays part of the header, so moving the pointer down doesn't close it.
      className="absolute top-full w-[40rem] pt-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div
        className={cx(
          "grid grid-cols-2 gap-2 rounded-3xl p-2 ring-1 ring-inset backdrop-blur-xl backdrop-saturate-150",
          tone === "glass" && "bg-ink/25 shadow-[0_16px_48px_rgb(0_0_0/0.25)] ring-paper/15 backdrop-blur-2xl",
          tone === "dark" && "bg-ink/80 shadow-[0_16px_48px_rgb(0_0_0/0.35)] ring-paper/10",
          tone === "light" && "bg-paper/80 shadow-[0_16px_48px_rgb(37_37_37/0.12)] ring-ink/10",
        )}
      >
        {links.map((link, index) => {
          const active = pathname.startsWith(link.href);
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: EASE }}
            >
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group flex h-full items-start justify-between gap-6 rounded-2xl p-6 ring-1 ring-inset transition-shadow duration-300",
                  tone === "glass" ? "bg-paper/10 text-paper" : dark ? "bg-paper/5 text-paper" : "bg-paper/70",
                  dark
                    ? active ? "ring-paper/25" : "ring-transparent hover:ring-paper/15"
                    : active ? "ring-ink/20" : "ring-transparent hover:ring-ink/10",
                )}
              >
                <span>
                  <span className="block text-lg font-semibold">{link.label}</span>
                  {link.description && (
                    <span className={cx("mt-1 block", dark ? "text-paper/70" : "text-ink/70")}>{link.description}</span>
                  )}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="mt-1.5 size-4 shrink-0 text-brand transition-transform duration-500 ease-premium group-hover:translate-x-1"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
