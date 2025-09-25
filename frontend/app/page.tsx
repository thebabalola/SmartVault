"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Eye, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp,
  Shield,
  Lock,
  BarChart3,
  Wallet
} from 'lucide-react';

// Intersection Observer Hook
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView] as const;
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [setRef, isInView] = useInView(0.1);
  
  return (
    <div 
      ref={setRef} 
      className={`transition-all duration-1000 ease-out ${
        isInView 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function SmartVaultLandingPage() {

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-br from-[#144489] via-[#1a5ba8] to-[#EFAC20] text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EFAC20] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* DeFi-related background icons */}
        <div className="absolute inset-0 opacity-5">
          {/* Crypto/DeFi Icons */}
          <div className="absolute top-20 left-20 text-6xl">₿</div>
          <div className="absolute top-40 right-32 text-4xl">💰</div>
          <div className="absolute bottom-32 left-32 text-5xl">📈</div>
          
          {/* Vault/Security Icons */}
          <div className="absolute top-32 left-1/3 text-5xl">🔒</div>
          <div className="absolute bottom-20 right-1/4 text-4xl">🏦</div>
          
          {/* Yield/Investment Icons */}
          <div className="absolute top-1/2 right-20 text-4xl">🌱</div>
          <div className="absolute bottom-1/3 left-1/4 text-5xl">⚡</div>
          
          {/* Blockchain/Technology Icons */}
          <div className="absolute top-1/3 right-1/3 text-4xl">🔗</div>
          <div className="absolute bottom-1/2 right-1/2 text-5xl">💎</div>
          
          {/* Smart Contract Icons */}
          <div className="absolute top-1/4 right-1/4 text-4xl">📋</div>
          <div className="absolute bottom-1/4 left-1/2 text-4xl">🤖</div>
          
          {/* Global/Connection Icons */}
          <div className="absolute top-1/2 left-1/2 text-4xl">🌍</div>
          <div className="absolute bottom-1/3 right-1/3 text-5xl">🤝</div>
          
          {/* Finance Icons */}
          <div className="absolute top-1/2 left-1/4 text-4xl">💳</div>
          <div className="absolute bottom-1/4 right-1/2 text-5xl">📊</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#EFAC20] drop-shadow-lg">
                  Smart Vault <span className="text-[#EFAC20] drop-shadow-2xl">DeFi</span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-2 opacity-95 font-semibold">
                  Automated Yield Generation for Everyone
                </p>
              </div>
              
              <p className="text-base md:text-lg lg:text-xl mb-8 opacity-95 font-medium leading-relaxed">
                Deposit your assets and earn automated returns through ERC-4626 compliant vaults. 
                No complex DeFi knowledge required - just deposit and watch your money grow.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/vault"
                  className="group bg-[#EFAC20] text-[#144489] px-6 py-3 rounded-xl font-bold text-base hover:bg-[#f4c050] transition-all duration-300 flex items-center justify-center border-2 border-transparent hover:border-[#f4c050]"
                >
                  Start Earning 
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="group border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:text-[#144489] transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Right Side - Hero Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/hero-img.png" 
                  alt="Smart Vault DeFi platform for automated yield generation" 
                  className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-2xl"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#EFAC20]/20 to-transparent rounded-2xl -z-10 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Wave decoration */}
        <div className="relative">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white animate-pulse">
            <path d="M0,96L48,80C96,64,192,32,288,42.7C384,53,480,107,576,128C672,149,768,139,864,122.7C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-[#144489] mb-6 leading-tight">
              How Smart Vault Works
            </h2>
            <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Our ERC-4626 compliant vaults automatically invest your assets in yield-generating strategies, 
              giving you passive returns without the complexity of manual DeFi management.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Wallet, title: "1. Deposit", desc: "Connect your wallet and deposit ERC-20 tokens" },
              { icon: BarChart3, title: "2. Auto-Invest", desc: "Vault automatically deploys to yield strategies" },
              { icon: TrendingUp, title: "3. Earn Yield", desc: "Watch your assets grow with automated returns" },
              { icon: DollarSign, title: "4. Withdraw", desc: "Redeem your shares for assets + yield anytime" }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-[#EFAC20] to-[#f4c050] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Icon size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#144489] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-blue-50 to-[#144489]/5">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#144489] mb-4 leading-tight">
              The DeFi Complexity Problem
            </h2>
            <p className="text-[#EFAC20] text-lg font-bold text-xl">
              Traditional DeFi requires too much technical knowledge and time
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Clock,
                title: "Time Intensive",
                stat: "Hours Daily",
                desc: "Manual yield farming requires constant monitoring, rebalancing, and strategy adjustments across multiple protocols."
              },
              {
                icon: Eye,
                title: "Technical Barriers",
                stat: "Complex Setup",
                desc: "Average users can't navigate complex DeFi protocols, smart contract interactions, and yield optimization strategies."
              },
              {
                icon: DollarSign,
                title: "High Gas Costs",
                stat: "Expensive",
                desc: "Frequent transactions and manual rebalancing result in high gas fees that eat into your potential returns."
              }
            ].map(({ icon: Icon, title, stat, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-4 shadow-md">
                    <Icon size={28} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#144489] mb-1">{title}</h3>
                    <p className="text-red-600 font-bold text-2xl">{stat}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-[#144489] to-[#1a5ba8] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Vault Solution
            </h2>
            <p className="text-[#EFAC20] text-lg font-semibold">
              Automated DeFi made simple and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-[#EFAC20]">Traditional DeFi</h3>
              <div className="space-y-4">
                <div className="flex items-center py-3 border-b border-white/20">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                  <span>Manual strategy management</span>
                </div>
                <div className="flex items-center py-3 border-b border-white/20">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                  <span>High gas costs for rebalancing</span>
                </div>
                <div className="flex items-center py-3 border-b border-white/20">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                  <span>Complex protocol interactions</span>
                </div>
                <div className="flex items-center py-3 border-b border-white/20">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                  <span>Technical knowledge required</span>
                </div>
                <div className="flex items-center py-3 font-bold text-lg">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                  <span>Time-intensive process</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EFAC20] to-[#f4c050] text-[#144489] rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Smart Vault Platform</h3>
              <div className="space-y-4">
                <div className="flex items-center py-3 border-b border-[#144489]/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span>Automated strategy deployment</span>
                </div>
                <div className="flex items-center py-3 border-b border-[#144489]/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span>Optimized gas usage</span>
                </div>
                <div className="flex items-center py-3 border-b border-[#144489]/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span>Simple deposit interface</span>
                </div>
                <div className="flex items-center py-3 border-b border-[#144489]/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span>No technical knowledge needed</span>
                </div>
                <div className="flex items-center py-3 font-bold text-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span>Set-and-forget investing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#144489] mb-4">
              Why Choose Smart Vault?
            </h2>
            <p className="text-[#EFAC20] text-lg font-semibold">
              Built on industry standards with user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "ERC-4626 Compliant",
                desc: "Built on the industry standard for tokenized vaults, ensuring interoperability and security."
              },
              {
                icon: Lock,
                title: "Secure & Audited",
                desc: "Smart contracts deployed on Arbitrum Stylus with comprehensive security measures."
              },
              {
                icon: Zap,
                title: "Automated Yield",
                desc: "Your assets work 24/7 generating returns through optimized DeFi strategies."
              },
              {
                icon: Globe,
                title: "Multi-Asset Support",
                desc: "Deposit various ERC-20 tokens and earn yield across different asset classes."
              },
              {
                icon: BarChart3,
                title: "Transparent Returns",
                desc: "Track your vault performance and yield generation with real-time analytics."
              },
              {
                icon: Users,
                title: "Community Driven",
                desc: "Governed by the community with decentralized decision-making for vault strategies."
              }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-[#144489] rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#144489] mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract Info Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-[#144489] to-[#1a5ba8] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Live on Arbitrum Sepolia
            </h2>
            <p className="text-[#EFAC20] text-lg font-semibold mb-12">
              Contract Address: 0x89a2c29b55fb31e5739682f5b9ae3a004e7a1a54
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Network", value: "Arbitrum Sepolia" },
                { label: "Chain ID", value: "421614" },
                { label: "Standard", value: "ERC-4626" },
                { label: "Status", value: "Live" }
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-sm text-gray-300 mb-2">{label}</p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <a 
                href="https://sepolia.arbiscan.io/address/0x89a2c29b55fb31e5739682f5b9ae3a004e7a1a54"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#EFAC20] text-[#144489] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f4c050] transition-all duration-300"
              >
                View on Arbiscan
                <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <AnimatedSection>
        <Footer scrollToSection={scrollToSection} />
      </AnimatedSection>
    </div>
  );
}