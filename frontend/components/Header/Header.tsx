"use client";

import Link from "next/link";
import Image from "next/image";
import NetworkSwitcher from "./NetworkSwitcher";
import WalletOptions from "./WalletOptions";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#213046] border-b border-[#49ABFE] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={"/logo.png"} alt="logo" width={28} height={28} className="sm:w-8 sm:h-8"/>
              <span className="text-lg sm:text-xl font-bold text-white">
                SmartVault
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-[#9DCCED] hover:text-white font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/user-acct" 
              className="text-[#9DCCED] hover:text-white font-medium transition-colors"
            >
              Dashboard
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <NetworkSwitcher />
            <WalletOptions />
          </div>
        </div>
      </div>
    </header>
  );
}