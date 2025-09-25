"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WalletOptions() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showOptions, setShowOptions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    digitalAssets: false,
    newWayToLogin: false
  });

  // Ensure component only renders on client side to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowOptions(false);
  };

  const toggleSection = (section: 'digitalAssets' | 'newWayToLogin') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDisconnect = () => {
    disconnect();
    setShowOptions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.wallet-options')) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOptions]);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return (
      <div className="relative wallet-options">
        <button
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-[#144489] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#144489] focus:ring-offset-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium">Loading...</span>
        </button>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="relative wallet-options">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-[#144489] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#144489] focus:ring-offset-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium">
            {address?.slice(0, 4)}...{address?.slice(-3)}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-white transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}
          >
            <path 
              d="M6 9L12 15L18 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showOptions && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-2">
              <Link
                href="/user-profile"
                onClick={() => setShowOptions(false)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative wallet-options">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-[#144489] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#144489] focus:ring-offset-2"
      >
        <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 15v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">Connect Wallet</span>
        <span className="text-xs sm:hidden">Connect</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`text-white transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}
        >
          <path 
            d="M6 9L12 15L18 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

              {showOptions && (
          <div className="absolute top-full right-0 mt-2 w-[320px] md:w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Connect Wallet</h4>
            </div>
            <div className="flex flex-col md:flex-row">
            {/* Left Column - Wallet Options */}
            <div className="w-full md:w-1/2 p-2 md:border-r border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-2 px-1">Installed</div>
              
              {/* Kaia Recommendation */}
              <div className="mb-2 p-2 bg-gradient-to-r from-[#ABFF27]/10 to-black/5 border border-[#ABFF27]/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                    <img 
                      src="/kaia.png" 
                      alt="Kaia logo" 
                      className="w-4 h-4 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-black">Recommended for Kaia</p>
                    <p className="text-xs text-gray-600">Official Klaytn wallet</p>
                  </div>
                </div>
                <a
                  href="https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1 px-2 py-1.5 bg-[#ABFF27] text-black text-xs font-medium rounded hover:bg-[#ABFF27]/80 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Install Kaia-Wallet
                </a>
              </div>
              
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#144489] focus:ring-offset-2"
                >
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {connector.name.toLowerCase().includes('walletconnect') ? (
                      <img
                        src="https://images.seeklogo.com/logo-png/43/1/walletconnect-logo-png_seeklogo-430923.png"
                        alt="WalletConnect logo"
                        className="w-6 h-6 rounded"
                      />
                    ) : connector.icon ? (
                      <img
                        src={connector.icon}
                        alt={`${connector.name} logo`}
                        className="w-6 h-6 rounded"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {connector.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {connector.name}
                  </span>
                </button>
              ))}
            </div>

                        {/* Right Column - What is a Wallet? */}
            <div className="w-full md:w-1/2 p-2">
              {/* Mobile divider */}
              <div className="md:hidden border-t border-gray-200 mb-3"></div>
              <h5 className="text-xs font-semibold text-gray-900 mb-3">What is a Wallet?</h5>
              
              {/* A Home for your Digital Assets */}
              <div className="mb-3">
                <div className="flex items-start space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-900">A Home for your Digital Assets</p>
                      <button
                        onClick={() => toggleSection('digitalAssets')}
                        className="md:hidden p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transition-transform duration-200 ${expandedSections.digitalAssets ? 'rotate-180' : ''}`}
                        >
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className={`transition-all duration-200 overflow-hidden ${expandedSections.digitalAssets ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'} md:max-h-20 md:opacity-100`}>
                      <p className="text-xs text-gray-600 mt-1">Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* A New Way to Log In */}
              <div className="mb-3">
                <div className="flex items-start space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-900">A New Way to Log In</p>
                      <button
                        onClick={() => toggleSection('newWayToLogin')}
                        className="md:hidden p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transition-transform duration-200 ${expandedSections.newWayToLogin ? 'rotate-180' : ''}`}
                        >
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className={`transition-all duration-200 overflow-hidden ${expandedSections.newWayToLogin ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'} md:max-h-20 md:opacity-100`}>
                      <p className="text-xs text-gray-600 mt-1">Instead of creating new accounts and passwords on every website, just connect your wallet.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get a Wallet Button */}
              <a
                href="https://www.youtube.com/watch?v=SQyg9pyJ1Ac"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1 px-2 py-1.5 bg-[#ABFF27] text-black text-xs font-medium rounded hover:bg-[#ABFF27]/80 transition-colors mb-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
                Get a Wallet
              </a>
              
              <a
                href="https://ethereum.org/en/wallets/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#ABFF27] hover:underline text-center block"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}