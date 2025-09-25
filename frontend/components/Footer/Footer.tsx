"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, BookOpen, Github } from "lucide-react";

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
              <span className="text-xl font-bold">Smart Vault DeFi</span>
            </div>
            <p className="text-[#9DCCED] text-sm leading-relaxed mb-4">
              Automated yield generation through ERC-4626 compliant Smart Vaults on Arbitrum.
              Maximize your DeFi returns with institutional-grade strategies and transparent fee structures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/user-profile"
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors"
                >
                  Live Demo
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('roadmap')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors"
                >
                  Roadmap
                </button>
              </li>
              <li>
                <Link 
                  href="/user-profile"
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors"
                >
                  User Profile
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('market')}
                  className="text-[#9DCCED] hover:text-[#49ABFE] transition-colors"
                >
                  Market Opportunity
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/thebabalola/manna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  <Github size={16} />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/presentation/d/1qKJidCy1NT8JviqDgs9dH36ehSE499nY/edit?usp=sharing&ouid=100528488557506058575&rtpof=true&sd=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  <FileText size={16} />
                  <span>Pitch Deck</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/document/d/1I5fVrMsMLdSgmz3cI8YoEI8o7y8vWkBMGKT31-908u8/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Concept Document</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#49ABFE] mt-8 pt-8">
          <div className="text-center">
            <p className="text-[#9DCCED] text-sm">
              © 2025 Smart Vault DeFi. All rights reserved. Built on Arbitrum Sepolia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
