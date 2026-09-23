import Image from "next/image";
import { cx } from "@/lib/cx";
import { site } from "@/lib/site";

const files = {
  full: { src: "/logo.svg", width: 764, height: 192 }, // star + "itrucking" wordmark
  icon: { src: "/logo-icon.svg", width: 248, height: 248 }, // star only
  light: { src: "/logo-light.svg", width: 764, height: 192 }, // star + white wordmark, for dark backgrounds
} as const;

type LogoProps = {
  variant?: keyof typeof files;
  /** Pass "" when a parent link already carries the accessible name. */
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
};

/** Brand logo. Sizes to its container's width — set the width on the wrapper or via className. */
export function Logo({ variant = "full", alt = site.name, loading, className }: LogoProps) {
  const file = files[variant];
  return (
    <Image
      src={file.src}
      width={file.width}
      height={file.height}
      alt={alt}
      loading={loading}
      unoptimized
      draggable={false}
      className={cx("block h-auto w-full select-none", className)}
    />
  );
}
