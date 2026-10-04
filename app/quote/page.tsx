import { redirect } from "next/navigation";
import { quoteLink } from "@/lib/site";

/**
 * The quote lives in the homepage's Ship with us band since 2026-10-02 (owner: no separate quote page), so an old
 * `/quote` link or bookmark lands there with the form open. Until then this page held the full quote form.
 */
export default function QuotePage() {
  redirect(quoteLink.href);
}
