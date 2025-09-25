import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "Arial", "sans-serif"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manna (만나) - Bridging Global Passion to Korean Creativity",
            description: "Direct, instant support from global fans to Korean webtoon artists, musicians, streamers, and educators using KRW Stablecoin. Eliminate payment barriers and connect passion with prosperity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        style={{
          fontFamily: `var(--font-geist-sans), system-ui, Arial, sans-serif`,
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
