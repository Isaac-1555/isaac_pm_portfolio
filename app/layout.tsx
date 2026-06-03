import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MascotMount } from "@/components/mascot/MascotMount";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://isaacdani.ca"),
  title: "Isaac Daniel Sudakar | AI Engineer & Creative Technologist",
  description: "AI Engineer building intelligent products across AI strategy, creative technology, and systems engineering. Portfolio exploring the intersection of product thinking, design, and code.",
  icons: {
    icon: "/IDS.ico",
  },
  openGraph: {
    type: "website",
    url: "https://isaacdani.ca",
    siteName: "Isaac Daniel Sudakar",
    title: "Isaac Daniel Sudakar | AI Engineer & Creative Technologist",
    description: "AI Engineer building intelligent products across AI strategy, creative technology, and systems engineering. Portfolio exploring the intersection of product thinking, design, and code.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
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
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} antialiased bg-bg-base text-text-primary font-sans flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <MascotMount />
        <Footer />
      </body>
    </html>
  );
}
