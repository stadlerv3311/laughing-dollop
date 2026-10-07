// News posts, as the homepage's news block shows them (and /news will, once it's built).
//
// PLACEHOLDERS: the three posts below are samples written to try the layout, not news. Who writes the posts and where
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
];

/** The posts a visitor may see, newest first: everything while developing, only approved posts in production. */
export function visibleNewsPosts(): NewsPost[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return newsPosts.filter((post) => showDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date));
}
