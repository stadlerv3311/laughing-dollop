"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { NavLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type CareersPanelProps = {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
};

/** The small panel that drops from under the header when "Careers" is hovered or clicked. */
export function CareersPanel({ links, pathname, onNavigate }: CareersPanelProps) {
  return (
    <motion.div
      id="careers-panel"
      className="absolute inset-x-0 top-full overflow-hidden bg-paper/95 backdrop-blur-xl"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <Container className="grid gap-4 pb-10 pt-4 md:grid-cols-2 lg:max-w-4xl">
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
                  "group flex h-full items-start justify-between gap-6 rounded-2xl bg-mist p-6 ring-1 ring-inset transition-shadow duration-300",
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
      </Container>
    </motion.div>
  );
}
