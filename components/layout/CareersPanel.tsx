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
};

/** The small glass panel that drops from under the nav pill when "Careers" is hovered or clicked. */
export function CareersPanel({ links, pathname, onNavigate }: CareersPanelProps) {
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
      <div className="grid grid-cols-2 gap-2 rounded-3xl bg-paper/80 p-2 shadow-[0_16px_48px_rgb(37_37_37/0.12)] ring-1 ring-inset ring-ink/10 backdrop-blur-xl backdrop-saturate-150">
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
                  "group flex h-full items-start justify-between gap-6 rounded-2xl bg-paper/70 p-6 ring-1 ring-inset transition-shadow duration-300",
                  active ? "ring-ink/20" : "ring-transparent hover:ring-ink/10",
                )}
              >
                <span>
                  <span className="block text-lg font-semibold">{link.label}</span>
                  {link.description && <span className="mt-1 block text-ink/70">{link.description}</span>}
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
