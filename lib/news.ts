// News posts: the homepage's news block shows the three newest, and /news lists them all.
//
// PLACEHOLDERS: the twelve posts below are samples written to try the layout, not news. Who writes the posts and where
// they live (files here or a CMS) isn't decided (docs/DECISIONS.md → Open items → News content). Until real posts
// replace them they are marked `draft`, and drafts are left out of a production build, so the block stays off the
// live site. Don't write a real-sounding post here without the owner's words for it.

export type NewsPost = {
  /** The day it was posted, as YYYY-MM-DD. */
  date: string;
  title: string;
  /** One or two sentences. */
  summary: string;
  /** A sample or an unapproved post: shown while developing, never in a production build. */
  draft?: boolean;
};

export const newsPosts: NewsPost[] = [
  {
    date: "2026-10-01",
    title: "Sample post: the headline goes here",
    summary: "Placeholder text. A sentence or two about the update will go here once the first posts are written.",
    draft: true,
  },
  {
    date: "2026-09-15",
    title: "Sample post: a longer headline that runs onto a second line",
    summary: "Placeholder text. This one is longer, to show how a card holds a headline of two lines and a few more words under it.",
    draft: true,
  },
  {
    date: "2026-09-01",
    title: "Sample post: a short one",
    summary: "Placeholder text. A single short sentence.",
    draft: true,
  },
  // Four more, so the news page has two full rows of cards under the newest one to look at.
  {
    date: "2026-06-12",
    title: "Sample post: a headline of ordinary length",
    summary: "Placeholder text. Two sentences of ordinary length sit here. This is the second one.",
    draft: true,
  },
  {
    date: "2025-11-20",
    title: "Sample post: an older one",
    summary: "Placeholder text. A sentence or two about the update.",
    draft: true,
  },
  {
    date: "2025-08-04",
    title: "Sample post: another short one",
    summary: "Placeholder text. A single short sentence.",
    draft: true,
  },
  {
    date: "2025-03-03",
    title: "Sample post: the last of the cards",
    summary: "Placeholder text. A sentence or two about the update will go here.",
    draft: true,
  },
  // Five more, older than the cards, so the news page's See more has a list to open.
  {
    date: "2024-12-09",
    title: "Sample post: the first line of the list",
    summary: "Placeholder text. A sentence or two about the update.",
    draft: true,
  },
  {
    date: "2024-09-18",
    title: "Sample post: a longer headline that runs onto a second line",
    summary: "Placeholder text. This one is longer, to show how a line holds a headline of two lines and a few more words beside it.",
    draft: true,
  },
  {
    date: "2024-06-03",
    title: "Sample post: a short one",
    summary: "Placeholder text. A single short sentence.",
    draft: true,
  },
  {
    date: "2024-03-21",
    title: "Sample post: a headline of ordinary length",
    summary: "Placeholder text. Two sentences of ordinary length sit here. This is the second one.",
    draft: true,
  },
  {
    date: "2024-01-15",
    title: "Sample post: the oldest one shown",
    summary: "Placeholder text. A sentence or two about the update will go here.",
    draft: true,
  },
];

const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** A post's day as a visitor reads it: "Oct 1, 2026". */
export function formatNewsDate(date: string): string {
  return day.format(new Date(`${date}T00:00:00Z`));
}

/** The posts a visitor may see, newest first: everything while developing, only approved posts in production. */
export function visibleNewsPosts(): NewsPost[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return newsPosts.filter((post) => showDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date));
}
