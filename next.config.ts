import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder otherwise makes Next.js guess the wrong project root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
