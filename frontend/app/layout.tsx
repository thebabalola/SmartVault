import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  fallback: ["system-ui", "Arial", "sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Vault DeFi - Automated Yield Generation on Arbitrum",
  description: "Maximize your DeFi returns with ERC-4626 compliant Smart Vaults on Arbitrum Sepolia. Automated yield generation with institutional-grade strategies and transparent fee structures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} antialiased font-sans`}
        style={{
          fontFamily: `var(--font-urbanist), system-ui, Arial, sans-serif`,
        }}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
