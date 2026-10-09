// News posts: the homepage's news block shows the three newest, and /news lists them all.
//
// NOT CONFIRMED, NOT FOR THE LIVE SITE: the eight posts below are stand-in copy the site's builder supplied on
// 2026-10-07 to fill the layout ("use this ... to fill out news section"). It was drafted with an AI assistant from
// the company's story; the events, the numbers and the dates in it have not been confirmed by the owner, and some
// run against what the owner has said or decided (see docs/DECISIONS.md → News copy). Every post is marked `draft`,
// and drafts are left out of a production build, so none of it reaches the live site. A post loses `draft` only when
// the owner has confirmed it happened, on that date, in those words.
// (Ten at first; the bonus and the hiring posts were taken out the same day, crossed out by the builder on a screenshot.)

export type NewsPost = {
  /** The day it was posted, as YYYY-MM-DD. */
  date: string;
  title: string;
  /** One or two sentences. */
  summary: string;
  /**
   * A picture for the post, as a path under /public: on the news page's stage and its small card while the post is
   * one of the three newest (PictureStage), and on its card in the homepage's block (NewsCards). The "Earlier" list
   * shows none.
   */
  image?: string;
  /** An unconfirmed post: shown while developing, never in a production build. */
  draft?: boolean;
};

export const newsPosts: NewsPost[] = [
  {
    date: "2026-10-01",
    title: "Twelve new trucks are on the Sacramento lot",
    summary: "The latest order arrived this week and goes into service this month. Trailers from the same buy are already paired with them.",
    // STAND-IN picture (owner's builder, 2026-10-07): an aerial of a truck yard, source not confirmed, and not known to
    // be our yard or these trucks. Like the post, it must not go live. The file is kept out of the public repo.
    image: "/images/news-truck-yard.jpg",
    draft: true,
  },
  {
    date: "2026-09-15",
    title: "Shop build starts at the Sacramento yard",
    summary: "Maintenance is moving in-house. The building is underway, so trucks spend less time waiting on an outside vendor.",
    // Stock picture (Unsplash licence): a workshop, not our shop. Photo by Quilia, unsplash.com/photos/ZSz1m4JPDqU
    image: "/images/news-shop.jpg",
    draft: true,
  },
  {
    date: "2026-06-12",
    title: "Drop-and-hook added on two lanes",
    summary: "Trailers stay at the dock. We pull the loaded van and leave an empty, instead of waiting on a live unload.",
    // Stock picture (Unsplash licence): dock doors, not a customer's. Photo by Matthew Jackson, unsplash.com/photos/SJGC3NNOqU4
    image: "/images/news-dock-doors.jpg",
    draft: true,
  },
  {
    date: "2025-11-20",
    title: "Fleet passes 70 trucks and trailers",
    summary: "Most of the equipment was bought new. Dry van truckload, company trucks, all 48 states.",
    // Stock picture (Unsplash licence): a truck park from the air, not our yard. Photo by Marcin Jozwiak, unsplash.com/photos/kGoPcmpPT7c
    image: "/images/news-fleet-aerial.jpg",
    draft: true,
  },
  {
    date: "2025-08-04",
    title: "Dispatch stays in the United States",
    summary: "The board is covered here, on the same clock as the driver.",
    // Stock picture (Unsplash licence): a control desk, not our office. Photo by ThisisEngineering, unsplash.com/photos/yhCHx8Mc-Kc
    image: "/images/news-dispatch-desk.jpg",
    draft: true,
  },
  // The news page's stage takes the three newest; every older post is a line of the list under it, the two above
  // this line as well (without their pictures). These three never had one.
  {
    date: "2024-09-18",
    title: "Sacramento yard takes the truck parking",
    summary: "Drop a trailer, grab a truck, and deal with people on the lot. The yard sits near the Citrus Heights office.",
    draft: true,
  },
  {
    date: "2024-06-03",
    title: "Safety desk moves fully in-house",
    summary: "Onboarding, driver files, and compliance sit with our own safety team, not an outside service.",
    draft: true,
  },
  {
    date: "2024-03-21",
    title: "First dedicated lanes renewed for another year",
    summary: "Weekly freight that started as contract lanes is still running. Same trucks, same shippers.",
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
