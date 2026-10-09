import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
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

// Archivo for headlines (2026-10-03, owner's pick "4" of the type pairings): set wide through its width axis, like the
// lettering on a trailer, so the headlines have a voice of their own while Geist keeps the body. Used through the
// `font-display` utility in app/globals.css.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Dry van truckload and driver jobs`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

// The page draws to the screen's bottom edge on phones (2026-10-09). Without it Chrome on Android lays a strip in the
// page's background colour over the gesture bar while its toolbar shows, which read as a white band under the hero.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${archivo.variable}`}>
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
