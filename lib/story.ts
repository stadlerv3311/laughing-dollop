// DRAFT company history — placeholder copy written 2026-09-10 so the layout could be built.
// Only two facts come from the FMCSA SAFER record: the Citrus Heights, CA base and the for-hire
// interstate operating authority. Everything else is made up. Replace it with the real story
// (see docs/DECISIONS.md → Open). The homepage story card and the About page both read from here.

export type Milestone = {
  title: string;
  text: string;
};

type Story = {
  headline: string;
  /** Short version for the homepage card. */
  summary: string;
  /** Full version for the About page. */
  paragraphs: string[];
  milestones: Milestone[];
};

export const story: Story = {
  headline: "It started with one truck.",
  summary:
    "We started in Citrus Heights, California, with one truck and a simple rule: show up when we say we will, keep the freight safe and treat drivers the way we’d want to be treated. The map got bigger. The rule didn’t.",
  paragraphs: [
    "ITrucking Solutions started in Citrus Heights, California, with one truck and a driver who knew the job from behind the wheel. The idea was simple: show up when we say we will, keep the freight safe and treat the people doing the driving the way we’d want to be treated.",
    "Shippers noticed. One load turned into a weekly lane, and weekly lanes turned into long-term partners. We earned our own operating authority as a for-hire interstate carrier and built a team of drivers and dispatchers who still pick up the phone.",
    "Today we haul dry van freight across 48 states. The map is a lot bigger than it was on day one, but the rule hasn’t changed.",
  ],
  milestones: [
    { title: "Where it started", text: "One truck and one driver out of Citrus Heights, California." },
    { title: "Our own authority", text: "Registered with the U.S. DOT as a for-hire interstate carrier." },
    { title: "Today", text: "Dry van freight moving across 48 states." },
  ],
};
