"use client";

import Image from "next/image";
import Link from "next/link";
// Removed unused imports

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-[#213046] text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <span className="text-xl font-bold">SmartVault</span>
            </div>
            <p className="text-[#9DCCED] text-sm leading-relaxed mb-4">
              Automated yield generation through ERC-4626 compliant Smart Vaults on Arbitrum.
              Maximize your DeFi returns with institutional-grade strategies and transparent fee structures.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors text-left"
                >
                  Hero
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('problem')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors text-left"
                >
                  The Problem
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('solution')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors text-left"
                >
                  Our Solution
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors text-left"
                >
                  Why Choose Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#49ABFE] mt-8 pt-8">
          <div className="text-center">
            <p className="text-[#9DCCED] text-sm">
              © 2025 <Link href="/admin" className="text-[#49ABFE] hover:text-[#9DCCED] transition-colors font-semibold">SmartVault</Link> DeFi. All rights reserved. Built on Arbitrum Sepolia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
