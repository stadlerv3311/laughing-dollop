import Image from "next/image";

type HeroMediaProps = {
  /** The photo — also the poster while a video loads, and what reduced-motion visitors see instead of it. */
  image: { src: string; alt: string };
  /** Optional muted looping clip (e.g. B-roll) shown over the photo. */
  video?: { src: string; type?: string };
};

/**
 * Full-width photo or video band, 500px tall (set 2026-09-17). It sits below the page's opening headline
 * rather than above it, so it carries no header clearance of its own. The photo is shown straight — the warm
 * sunset grade and film grain that used to sit on top were dropped the same day (docs/DECISIONS.md → Hero media).
 */
export function HeroMedia({ image, video }: HeroMediaProps) {
  return (
    <div>
      <div className="relative h-[500px] w-full overflow-hidden bg-ink">
        {/* Crop sits a little low so the road stays in frame in the wide strip, without clipping the cab roof. */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-[50%_58%]"
        />
        {video && (
          <video
            className="absolute inset-0 size-full object-cover object-[50%_58%] motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            poster={image.src}
            aria-hidden
          >
            <source src={video.src} type={video.type ?? "video/mp4"} />
          </video>
        )}
      </div>
    </div>
  );
}
