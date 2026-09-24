import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Footer, Header } from "@/components/layout";
import { IntroProgressProvider, SmoothScroll } from "@/components/providers";
import { site } from "@/lib/site";

// Geist (2026-09-24), replacing the provisional Manrope — swap here (and nowhere else) if a brand font is chosen.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Dry Van Trucking & Driver Jobs`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-svh flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <IntroProgressProvider>
          <SmoothScroll>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </IntroProgressProvider>
      </body>
    </html>
  );
}
