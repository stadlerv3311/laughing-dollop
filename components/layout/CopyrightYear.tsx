"use client";

import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/**
 * The year in the footer's copyright line. The pages are built ahead of time, so `built` is the year of the build;
 * the browser's own year takes its place once it is there, and the line can't fall a year behind on a site that
 * wasn't rebuilt after New Year.
 */
export function CopyrightYear({ built }: { built: number }) {
  return useSyncExternalStore(
    subscribeNever,
    () => new Date().getFullYear(),
    () => built,
  );
}
