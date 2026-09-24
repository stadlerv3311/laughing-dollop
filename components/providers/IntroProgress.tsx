"use client";

import { motionValue, type MotionValue } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared 0 → 1 progress of the homepage's opening logo moment.
 * HomeIntro writes it as the logo fades in and settles; Header and HomeHero read it to know when
 * it has landed. Every other page sits at 1 ("intro finished").
 */
const IntroProgressContext = createContext<MotionValue<number> | null>(null);

export function IntroProgressProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [progress] = useState(() => motionValue(pathname === "/" ? 0 : 1));

  return <IntroProgressContext.Provider value={progress}>{children}</IntroProgressContext.Provider>;
}

export function useIntroProgress() {
  const progress = useContext(IntroProgressContext);
  if (!progress) throw new Error("useIntroProgress must be used inside <IntroProgressProvider>");
  return progress;
}
