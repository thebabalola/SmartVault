"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, BookOpen, Github } from "lucide-react";

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-[#144489] text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/manna-logo.png" alt="Manna logo" width={32} height={32} />
              <span className="text-xl font-bold">Manna (만나)</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Bridging global passion to Korean creativity through instant, transparent KRW-S payments. 
              Supporting Korean webtoon artists, musicians, streamers, and educators worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/user-profile"
                  className="text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  Live Demo
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('roadmap')}
                  className="text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  Roadmap
                </button>
              </li>
              <li>
                <Link 
                  href="/user-profile"
                  className="text-gray-300 hover:text-[#EFAC20] transition-colors"
                >
                  User Profile
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('market')}
                  className="text-gray-300 hover:text-[#EFAC20] transition-colors"
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
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Manna (만나). All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
