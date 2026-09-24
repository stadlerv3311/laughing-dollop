import { cx } from "@/lib/cx";
import type { Milestone } from "@/lib/story";

type StoryMilestonesProps = {
  milestones: Milestone[];
  tone: "light" | "dark";
  className?: string;
};

/** Vertical timeline of company milestones with orange markers. */
export function StoryMilestones({ milestones, tone, className }: StoryMilestonesProps) {
  const dark = tone === "dark";

  return (
    <ol className={cx("space-y-8 border-l pl-8", dark ? "border-paper/15" : "border-ink/15", className)}>
      {milestones.map((milestone) => (
        <li key={milestone.title} className="relative">
          {/* Centered on the 1px line: 2rem padding + 1px border + half the 10px dot, minus half the line. */}
          <span
            aria-hidden
            className={cx(
              "absolute -left-[calc(2rem+5.5px)] top-1 size-2.5 rounded-full bg-brand ring-4",
              dark ? "ring-ink" : "ring-paper",
            )}
          />
          <p className={cx("text-sm font-semibold", dark ? "text-paper/70" : "text-ink/70")}>{milestone.title}</p>
          <p className="mt-2 text-lg leading-snug">{milestone.text}</p>
        </li>
      ))}
    </ol>
  );
}
