import { heroLines, type HeroLine } from "@/lib/site";

type HeroHeadlineProps = {
  /** Set by HomeHero once the intro hands over; the words light up one by one. */
  lit: boolean;
  className?: string;
};

/**
 * The homepage h1: "A fleet you can trust. A load you can see.", all in full white since 2026-10-02 (owner: "go white
 * on the hero"; "A … you can …" was dimmed to 60% before). The words light up in reading order as the intro hands
 * over, then it stays put.
 *
 * Fixed since 2026-10-02 (owner: "remove changing", so every visitor sees the same hero). From 2026-09-29 it rolled
 * through four pairs every few seconds, the nouns and verbs turning over like an odometer.
 */
export function HeroHeadline({ lit, className }: HeroHeadlineProps) {
  return (
    <h1 className={className}>
      {heroLines.map((line, l) => (
        <Line key={l} line={line} lit={lit} firstWord={l * 5} />
      ))}
    </h1>
  );
}

function Line({ line, lit, firstWord }: { line: HeroLine; lit: boolean; firstWord: number }) {
  // The words light up in reading order as the intro hands over: 30ms apart, 0.4s each, so the whole line is white
  // about 0.7s after it starts (owner, 2026-10-05; it was 70ms and 0.7s each, about 1.3s).
  const word = (n: number, content: string) => (
    <span
      className="transition-opacity duration-400 ease-premium motion-reduce:transition-none"
      style={{ opacity: lit ? 1 : 0.22, transitionDelay: lit ? `${(firstWord + n) * 30}ms` : "0ms" }}
    >
      {content}
    </span>
  );

  return (
    <span className="block">
      {word(0, "A")} {word(1, line.noun)} {word(2, "you can")} {word(3, line.verb)}
      {word(4, ".")}
    </span>
  );
}
