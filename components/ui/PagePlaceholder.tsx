import { PageOpening } from "./PageOpening";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

/** Temporary page body for routes that exist in the nav but aren't built yet: the shared opening and nothing under it. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-heading" className="pb-32">
      <PageOpening id="page-heading" lines={[title]} lede={description} />
    </section>
  );
}
