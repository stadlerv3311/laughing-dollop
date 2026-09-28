import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder otherwise makes Next.js guess the wrong project root.
  turbopack: {
    root: import.meta.dirname,
  },
  // Lets another computer on the same Wi-Fi open the dev server by this Mac's address (dev only; no effect on a build).
  allowedDevOrigins: ["192.168.1.141"],
};

export default nextConfig;
