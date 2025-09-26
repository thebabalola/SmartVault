"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { 
  ArrowRight, 
  DollarSign, 
  Globe, 
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
       <section className="pt-20 bg-gradient-to-br from-[#213046] via-[#1a5ba8] to-[#EFAC20] text-white relative overflow-hidden">
         {/* Animated background elements */}
         <div className="absolute inset-0 opacity-10">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#49ABFE] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#EFAC20] drop-shadow-lg">
                  Smart Vault <span className="text-[#49ABFE] drop-shadow-2xl">DeFi</span>
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
                  className="group bg-[#49ABFE] text-[#213046] px-6 py-2 rounded-xl font-bold text-base hover:bg-[#9DCCED] transition-all duration-300 flex items-center justify-center border-2 border-transparent hover:border-[#9DCCED]"
                >
                  Start Earning 
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="group border-2 border-white text-white px-4 py-1.5 rounded-lg font-medium text-sm hover:bg-white hover:text-[#213046] transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Right Side - Hero Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image 
                  src="/hero-img.png" 
                  alt="Smart Vault DeFi platform for automated yield generation" 
                  width={800}
                  height={600}
                  className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-2xl"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#49ABFE]/20 to-transparent rounded-2xl -z-10 blur-xl"></div>
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

      {/* How It Works Section - Updated with Circles and Modern Layout */}
      <section id="how-it-works" className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#213046] mb-4 leading-tight">
                How Smart Vault Works
            </h2>
              <p className="text-base md:text-lg text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed font-medium">
                Our ERC-4626 compliant vaults automatically invest your assets in yield-generating strategies, 
                giving you passive returns without the complexity of manual DeFi management.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#49ABFE] to-[#EFAC20] mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          
             {/* Modern Step Process with Circles */}
          <div className="relative">
            {/* Connection Lines - Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#49ABFE]/30 via-[#9DCCED]/50 to-[#EFAC20]/30 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
              {[
                { 
                  icon: Wallet, 
                  title: "Deposit", 
                  desc: "Connect your wallet and deposit ERC-20 tokens",
                  color: "from-[#49ABFE] to-[#9DCCED]",
                  step: "01"
                },
                { 
                  icon: BarChart3, 
                  title: "Auto-Invest", 
                  desc: "Vault automatically deploys to yield strategies",
                  color: "from-[#9DCCED] to-[#49ABFE]",
                  step: "02"
                },
                { 
                  icon: TrendingUp, 
                  title: "Earn Yield", 
                  desc: "Watch your assets grow with automated returns",
                  color: "from-[#49ABFE] to-[#9DCCED]",
                  step: "03"
                },
                { 
                  icon: DollarSign, 
                  title: "Withdraw", 
                  desc: "Redeem your shares for assets + yield anytime",
                  color: "from-[#9DCCED] to-[#49ABFE]",
                  step: "04"
                }
              ].map(({ icon: Icon, title, desc, color, step }) => (
                <div key={title} className="flex flex-col items-center text-center group">
                  {/* Step Number */}
                  <div className="text-[#49ABFE]/30 text-lg font-bold mb-4">{step}</div>
                  
                  {/* Circular Icon Container */}
                  <div className="relative mb-6">
                    {/* Outer Ring */}
                    <div className={`w-32 h-32 bg-gradient-to-br ${color} rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                      {/* Inner Glow Effect */}
                      <div className="absolute inset-2 bg-white/20 rounded-full"></div>
                      
                      {/* Icon */}
                      <Icon size={48} className="text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-white/60 transition-colors duration-300"></div>
                    </div>
                    
                  </div>
                  
                  {/* Content */}
                  <div className="max-w-xs">
                    <h3 className="text-xl md:text-2xl font-bold text-[#213046] mb-4">{title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-base">{desc}</p>
                  </div>
                  
                  {/* Connection Dot for Mobile */}
                  <div className="lg:hidden w-2 h-2 bg-[#49ABFE] rounded-full mt-8 mb-4"></div>
                </div>
              ))}
            </div>
          </div>
                    
          {/* Call-to-Action */}
          <AnimatedSection className="text-center mt-16">
            <div className="relative max-w-2xl mx-auto">
              {/* Blurred Background */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl border-2 border-gray-200/50"></div>
              
              {/* Content Container */}
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold text-[#213046] mb-4">Ready to Start Earning?</h3>
                <p className="text-gray-600 mb-6">Join other users already earning passive yield with Smart Vault</p>
                <Link 
                  href="/vault"
                  className="inline-flex items-center bg-[#213046] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#213046]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now 
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section - Enhanced Layout */}
      <section id="problem" className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-blue-50 to-[#144489]/5 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#49ABFE]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#EFAC20]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#213046] mb-4">
              The Traditional Vault Problem
            </h2>
            <p className="text-[#49ABFE] text-base md:text-lg font-bold mb-4">
              Traditional approaches offer no growth - just storage and complexity
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-[#EA4E2A] to-[#EA4E2A]/80 mx-auto rounded-full"></div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Storage Only",
                desc: "Purely for storage and safety. Your money stays locked and untouched until you withdraw.",
                accent: "from-[#EA4E2A] to-[#EA4E2A]/90"
              },
              {
                icon: DollarSign,
                title: "No Growth",
                desc: "If you put in $100, you only get $100 back. No returns, no yield, no growth.",
                accent: "from-[#EA4E2A] to-[#EA4E2A]/90"
              }
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${accent} rounded-full flex items-center justify-center mr-4 shadow-md`}>
                      <Icon size={24} className="text-white" />
                  </div>
                    <h3 className="text-lg font-bold text-[#213046]">{title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-[#213046] to-[#49ABFE] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Vault Solution
            </h2>
            <p className="text-[#49ABFE] text-lg font-semibold">
              Automated DeFi made simple and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex justify-center items-center">
              <Image 
                src="/section-img.png" 
                alt="Traditional DeFi complexity illustration" 
                width={400}
                height={320}
                className="w-full max-w-sm lg:max-w-md rounded-2xl shadow-2xl"
              />
                  </div>
                  
            <div className="bg-gradient-to-br from-[#49ABFE] to-[#9DCCED] text-[#213046] rounded-2xl p-8 shadow-lg max-w-md mx-auto lg:mx-0">
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

      {/* Features Section - Enhanced Grid Layout */}
      <section className="py-20 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#49ABFE] rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-4 border-[#EFAC20] rounded-full"></div>
          <div className="absolute bottom-40 left-32 w-12 h-12 border-4 border-[#49ABFE] rounded-full"></div>
          <div className="absolute bottom-20 right-40 w-24 h-24 border-4 border-[#EFAC20] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#213046] mb-6">
              Why Choose Smart Vault?
            </h2>
            <p className="text-[#49ABFE] text-lg md:text-xl font-semibold mb-4">
              Built on industry standards with user experience in mind
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#49ABFE] to-[#EFAC20] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "ERC-4626 Compliant",
                desc: "Built on the industry standard for tokenized vaults, ensuring interoperability and security.",
                color: "text-[#144489]"
              },
              {
                icon: Lock,
                title: "Secure & Audited",
                desc: "Smart contracts deployed on Arbitrum Stylus with comprehensive security measures.",
                color: "text-[#144489]"
              },
              {
                icon: TrendingUp,
                title: "Automated Yield",
                desc: "Your assets work 24/7 generating returns through optimized DeFi strategies.",
                color: "text-[#144489]"
              },
              {
                icon: Globe,
                title: "Multi-Asset Support",
                desc: "Deposit various ERC-20 tokens and earn yield across different asset classes.",
                color: "text-[#144489]"
              },
              {
                icon: BarChart3,
                title: "Transparent Returns",
                desc: "Track your vault performance and yield generation with real-time analytics.",
                color: "text-[#144489]"
              }
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-start space-x-4">
                <Icon size={24} className={`${color} mt-1 flex-shrink-0`} />
                <div>
                  <h3 className="text-lg font-bold text-[#213046] mb-2">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA Section */}
          <AnimatedSection className="mt-20">
            <div className="text-center bg-gradient-to-r from-[#213046] to-[#49ABFE] rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Start Your DeFi Journey Today</h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join the future of automated yield generation with Smart Vaults ERC-4626 compliant vaults
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/vault"
                  className="bg-white text-[#213046] px-6 py-2 rounded-lg font-medium text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Launch App
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium text-base hover:bg-white hover:text-[#213046] transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
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