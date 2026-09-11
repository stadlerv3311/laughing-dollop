import Image from "next/image";

type HeroMediaProps = {
  /** The photo — also the poster while a video loads, and what reduced-motion visitors see instead of it. */
  image: { src: string; alt: string };
  /** Optional muted looping clip (e.g. B-roll) shown over the photo. */
  video?: { src: string; type?: string };
};

/**
 * Full-width photo or video band under the fixed header. From `sm` up it's a wide 5:2 strip, capped so the
 * headline below still shows on the first screen. A warm sunset grade and film grain sit on top, so a video
 * dropped in later gets the same look (styles in app/globals.css).
 */
export function HeroMedia({ image, video }: HeroMediaProps) {
  return (
    <div className="pt-18">
      <div className="relative h-[62svh] min-h-80 w-full overflow-hidden bg-ink sm:aspect-[5/2] sm:h-auto sm:max-h-[calc(100svh-15rem)]">
        {/* Crop sits a little low so the truck's wheels stay in frame in the wide strip. */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-[50%_65%] saturate-[1.15]"
        />
        {video && (
          <video
            className="absolute inset-0 size-full object-cover object-[50%_65%] saturate-[1.15] motion-reduce:hidden"
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
        <div aria-hidden className="sunset-grade pointer-events-none absolute inset-0" />
        {/* Oversized so the jitter never reveals an edge. */}
        <div
          aria-hidden
          className="film-grain pointer-events-none absolute -inset-[10%] animate-[grain_0.8s_steps(1)_infinite] opacity-30 motion-reduce:animate-none"
        />
      </div>
    </div>
  );
}
