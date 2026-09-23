import type { Metadata } from "next";
import { Barlow, Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MascotMount } from "@/components/mascot/MascotMount";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CursorProvider } from "@/components/cursor/cursor-context";
import { Cursor } from "@/components/cursor/Cursor";
import { LenisProvider } from "@/components/scroll/LenisProvider";
import { TabTitleManager } from "@/components/layout/TabTitleManager";
import { RouteTransitionProvider } from "@/components/transitions/RouteTransitionProvider";
import Noise from "@/components/ui/Noise";

const devGothic = localFont({
  src: "./fonts/devgothic.ttf",
  weight: "400",
  variable: "--font-devgothic",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://isaacdani.ca"),
  title: "Isaac Daniel Sudakar | Software Developer & Technical Product Manager",
  description: "Software Developer & Technical Product Manager building AI-powered products across web, mobile, and intelligent automation. Portfolio exploring the intersection of AI engineering, product strategy, and full-stack development.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://isaacdani.ca",
    siteName: "Isaac Daniel Sudakar",
    title: "Isaac Daniel Sudakar | Software Developer & Technical Product Manager",
    description: "Software Developer & Technical Product Manager building AI-powered products across web, mobile, and intelligent automation. Portfolio exploring the intersection of AI engineering, product strategy, and full-stack development.",
    images: [{
      url: "/og-image.png",
      width: 2850,
      height: 1270,
      alt: "Isaac Daniel Sudakar's portfolio preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${devGothic.variable} ${hankenGrotesk.variable} ${barlow.variable}`}>
      <body
        className="antialiased bg-bg-base text-text-primary font-sans flex flex-col min-h-screen"
      >
        <CursorProvider>
          <LenisProvider>
            <Header />
            <TabTitleManager />
            <main className="relative z-10 flex-grow min-h-[100vh] bg-bg-base">
              <RouteTransitionProvider>{children}</RouteTransitionProvider>
              <Noise />
            </main>
            <MascotMount />
            <Footer />
            <Cursor />
          </LenisProvider>
        </CursorProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
