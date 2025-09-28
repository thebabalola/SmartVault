"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import { 
  Briefcase, 
  Building2, 
  Lightbulb, 
  BarChart3, 
  Plus, 
  Settings, 
  Target, 
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProfileCard from "../../components/useracct-comp/ProfileCard";
import UserProfileSetup from "../../components/useracct-comp/UserProfileSetup";
import VaultCard from "../../components/useracct-comp/VaultCard";
import VaultManagement from "../../components/useracct-comp/VaultManagement";
import ProtocolAllocationManager from "../../components/useracct-comp/ProtocolAllocationManager";
import VaultOperations from "../../components/useracct-comp/VaultOperations";
import ShareTransfer from "../../components/useracct-comp/ShareTransfer";
import VaultInfo from "../../components/useracct-comp/VaultInfo";
import { useVaultFactory } from "../../hooks/useVaultFactory";

const UserProfile = () => {
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [animationClass, setAnimationClass] = useState('');
  const [userProfile, setUserProfile] = useState<{username: string, bio: string} | null>(null);
  const [isProfileSetupComplete, setIsProfileSetupComplete] = useState(false);
  const [selectedVault, setSelectedVault] = useState<`0x${string}` | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'shareTransfer' | 'vaultManagement' | null>(null);
  const [showProTip, setShowProTip] = useState(false);

  // Helper function to format timestamp
  const formatRegistrationDate = (timestamp: number) => {
    console.log('Registration timestamp:', timestamp); // Debug log
    if (!timestamp || timestamp === 0) return "Unknown";
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get connected wallet address
  const { address, isConnected } = useAccount();
  
  // VaultFactory integration
  const {
    totalVaults,
    userVaults,
    protocolAddresses,
    isUserRegistered,
    userRegistrationTimestamp,
    registerUser,
    createVault,
    isPending,
    refetchUserVaults
  } = useVaultFactory();
  
  // Form state for creating vault
  const [vaultForm, setVaultForm] = useState({
    name: '',
    asset: 'USDC',
    amount: '',
    strategy: 'Lending (Aave + Compound)'
  });

  // Real stats from contract
  const stats = {
    activeVaults: userVaults.length,
    totalVaults: totalVaults,
    // These would come from UserVault contracts when integrated
    totalDeposited: 0,
    totalYield: 0,
    totalValue: 0
  };

  // Protocol categories based on README (for future use)
  // const protocolCategories = {
  //   'Lending': ['Aave', 'Compound'],
  //   'Liquidity Pools': ['Uniswap', 'Curve'],
  //   'Yield Farming': ['Various Farming Strategies']
  // };

  // Use connected wallet address
  const userAddress = address;




  useEffect(() => {
    // Trigger entrance animations on load
    setAnimationClass('animate-fadeInUp');
  }, []);



  const copyUserAddress = async () => {
    if (userAddress) {
    await navigator.clipboard.writeText(userAddress);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
    }
  };

  // Check if user is already registered when they connect
  useEffect(() => {
    if (isConnected && isUserRegistered) {
      setIsProfileSetupComplete(true);
      
      // Get user profile from localStorage (since contract stores hashes)
      const storedProfile = localStorage.getItem(`userProfile_${address}`);
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error parsing stored profile:', error);
          setUserProfile({ 
            username: "Registered User", 
            bio: "Profile loaded from registration" 
          });
        }
      } else {
        setUserProfile({ 
          username: "Registered User", 
          bio: "Profile loaded from registration" 
        });
      }
    }
  }, [isConnected, isUserRegistered, address]);

  const handleProfileComplete = async (username: string, bio: string) => {
    try {
      // Register the user with username and bio (contract stores hashes)
      await registerUser(username, bio);
      
      // Store the actual strings in localStorage for display
      const profileData = { username, bio };
      localStorage.setItem(`userProfile_${address}`, JSON.stringify(profileData));
      
      setUserProfile({ username, bio });
      setIsProfileSetupComplete(true);
    } catch (error) {
      console.error('Error completing profile setup:', error);
      throw error;
    }
  };

  const handleCreateVault = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isUserRegistered) {
      alert('Please register your profile first');
      return;
    }

    try {
      await createVault();
      alert('Vault created successfully!');
      refetchUserVaults();
    } catch (error) {
      console.error('Error creating vault:', error);
      alert(`Error creating vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


  // Show profile setup if not completed
  if (isConnected && !isProfileSetupComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <UserProfileSetup
          userAddress={userAddress || ""}
          onProfileComplete={handleProfileComplete}
          isConnected={isConnected}
        />
        <Footer scrollToSection={() => {}} />
      </div>
    );
  }

  // Show connect wallet message if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-24">
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔗</div>
            <h1 className="text-3xl font-bold text-[#213046] mb-4">Connect Your Wallet</h1>
            <p className="text-gray-600 mb-8">Please connect your wallet to access Smart Vault</p>
          </div>
        </div>
        <Footer scrollToSection={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              userAddress={userAddress || ""}
              isAddressCopied={isAddressCopied}
              onCopyAddress={copyUserAddress}
              animationClass={animationClass}
              userVaults={userVaults}
              isConnected={isConnected}
              userProfile={userProfile}
              registrationDate={formatRegistrationDate(userRegistrationTimestamp)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 p-2 sm:p-3 bg-white rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview' 
                    ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="mr-1 sm:mr-2 text-xs sm:text-sm">📊</span>
                <span className="hidden sm:inline">Vault Overview</span>
                <span className="sm:hidden">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'create' 
                    ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="mr-1 sm:mr-2 text-xs sm:text-sm">➕</span>
                <span className="hidden sm:inline">Create Vault</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'manage' 
                    ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="mr-1 sm:mr-2 text-xs sm:text-sm">⚙️</span>
                <span className="hidden sm:inline">Manage Assets</span>
                <span className="sm:hidden">Manage</span>
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'strategy' 
                    ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="mr-1 sm:mr-2 text-xs sm:text-sm">🎯</span>
                Strategy
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'activity' 
                    ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <span className="mr-1 sm:mr-2 text-xs sm:text-sm">📈</span>
                Activity
              </button>
            </div>

            {/* Vault Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Portfolio Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
                    <Briefcase className="mr-3 w-6 h-6 text-[#49ABFE]" />
                    Portfolio Overview
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <p className="text-2xl font-bold text-[#213046]">${stats.totalValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Value</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                      <p className="text-2xl font-bold text-green-600">${stats.totalYield.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Yield</p>
                  </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                      <p className="text-2xl font-bold text-purple-600">{stats.activeVaults}</p>
                      <p className="text-sm text-gray-600">Active Vaults</p>
                  </div>
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                      <p className="text-2xl font-bold text-yellow-600">{stats.totalVaults}</p>
                      <p className="text-sm text-gray-600">Total Vaults</p>
                    </div>
                  </div>
                </div>

                {/* Vault List */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
                    <Building2 className="mr-2 w-5 h-5 text-[#49ABFE]" />
                    Your Vaults
                  </h3>
                  {userVaults.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <Building2 className="w-16 h-16 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Vaults Created Yet</h3>
                      <p className="text-gray-500 mb-6">Create your first Smart Vault to start earning yield</p>
                        <button
                        onClick={() => setActiveTab('create')}
                        className="bg-[#49ABFE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors"
                      >
                        Create Your First Vault
                        </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userVaults.map((vault, index) => (
                        <VaultCard 
                          key={index} 
                          vaultAddress={vault} 
                          vaultIndex={index} 
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Pro Tip: How Smart Vault Works */}
                  <div className="mt-6 rounded-2xl border border-gray-200" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-blue-800 flex items-center">
                          <Lightbulb className="mr-2 w-5 h-5" />
                          Pro Tip: How Your Smart Vault Works
                        </h4>
                        <button
                          onClick={() => setShowProTip(!showProTip)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span className="mr-1 text-sm font-medium">
                            {showProTip ? 'Hide' : 'Show'} Guide
                          </span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${showProTip ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      
                      {showProTip && (
                        <div className="space-y-4 animate-fadeIn">
                          <p className="text-blue-700 font-medium">
                            Your Smart Vault automatically generates yield by deploying assets across multiple DeFi protocols. Here's how to navigate:
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                              <div>
                                <h5 className="font-semibold text-blue-800 flex items-center">
                                  <BarChart3 className="mr-2 w-4 h-4" />
                                  Overview
                                </h5>
                                <p className="text-sm text-blue-700">View your portfolio stats, total value, and all created vaults</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                              <div>
                                <h5 className="font-semibold text-blue-800 flex items-center">
                                  <Plus className="mr-2 w-4 h-4" />
                                  Create Vault
                                </h5>
                                <p className="text-sm text-blue-700">Deploy new ERC-4626 vaults with custom names and strategies</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                              <div>
                                <h5 className="font-semibold text-blue-800 flex items-center">
                                  <Settings className="mr-2 w-4 h-4" />
                                  Manage Assets
                                </h5>
                                <p className="text-sm text-blue-700">Deposit/withdraw assets, transfer shares, and configure vault settings</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                              <div>
                                <h5 className="font-semibold text-blue-800 flex items-center">
                                  <Target className="mr-2 w-4 h-4" />
                                  Strategy
                                </h5>
                                <p className="text-sm text-blue-700">Set protocol allocations (Aave, Compound, Uniswap) for yield generation</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                              <div>
                                <h5 className="font-semibold text-blue-800 flex items-center">
                                  <TrendingUp className="mr-2 w-4 h-4" />
                                  Activity
                                </h5>
                                <p className="text-sm text-blue-700">Monitor vault performance, financial data, and compliance status</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800 flex items-center">
                              <Lightbulb className="mr-2 w-4 h-4" />
                              <strong>Quick Start:</strong> Create a vault → Deposit assets → Set strategy allocations → Watch your yield grow automatically!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
              </div>
            )}

            {/* Create Vault Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
                    <span className="mr-3">➕</span>
                    Create New Vault
                    </h2>
                  
                  {!isConnected && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 font-medium">Please connect your wallet to create a vault</p>
                      </div>
                    )}

                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Vault Name</label>
                          <input
                            type="text"
                        value={vaultForm.name}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                        placeholder="e.g., My USDC Vault"
                        disabled={!isConnected}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Asset Type</label>
                      <select 
                        value={vaultForm.asset}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, asset: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all text-gray-900 font-medium"
                        disabled={!isConnected}
                      >
                        <option>USDC</option>
                        <option>USDT</option>
                        <option>ETH</option>
                        <option>DAI</option>
                      </select>
                      </div>
                      <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Initial Deposit (Optional)</label>
                          <input
                        type="number"
                        value={vaultForm.amount}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                        placeholder="0.00"
                        disabled={!isConnected}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Strategy</label>
                      <select 
                        value={vaultForm.strategy}
                        onChange={(e) => setVaultForm(prev => ({ ...prev, strategy: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all text-gray-900 font-medium"
                        disabled={!isConnected}
                      >
                        <option>Lending (Aave + Compound)</option>
                        <option>Liquidity Pools (Uniswap + Curve)</option>
                        <option>Yield Farming (Multi-Protocol)</option>
                        <option>Custom Allocation</option>
                      </select>
                    </div>
                      </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Protocol Addresses</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Aave:</span>
                        <code className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-medium">
                          {protocolAddresses.aave === "0x0000000000000000000000000000000000000000" ? "Not set" : `${protocolAddresses.aave.slice(0, 6)}...${protocolAddresses.aave.slice(-4)}`}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">Compound:</span>
                        <code className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-medium">
                          {protocolAddresses.compound === "0x0000000000000000000000000000000000000000" ? "Not set" : `${protocolAddresses.compound.slice(0, 6)}...${protocolAddresses.compound.slice(-4)}`}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">Uniswap:</span>
                        <code className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-medium">
                          {protocolAddresses.uniswap === "0x0000000000000000000000000000000000000000" ? "Not set" : `${protocolAddresses.uniswap.slice(0, 6)}...${protocolAddresses.uniswap.slice(-4)}`}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">WETH:</span>
                        <code className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-medium">
                          {protocolAddresses.weth === "0x0000000000000000000000000000000000000000" ? "Not set" : `${protocolAddresses.weth.slice(0, 6)}...${protocolAddresses.weth.slice(-4)}`}
                        </code>
                    </div>
                  </div>
                </div>

                  <button 
                    onClick={handleCreateVault}
                    disabled={!isConnected || isPending || !vaultForm.name.trim()}
                    className="w-full mt-6 bg-[#49ABFE] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Creating Vault...' : 'Create Vault'}
                  </button>
                </div>
              </div>
            )}

            {/* Manage Assets Tab */}
            {activeTab === 'manage' && (
              <div className="space-y-6 animate-fadeIn">
                {userVaults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Vaults to Manage</h3>
                    <p className="text-gray-500 mb-6">Create a vault first to access management features</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="bg-[#49ABFE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors"
                    >
                      Create Your First Vault
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Vault Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
                        <span className="mr-3">⚙️</span>
                        Manage Vaults
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Vault to Manage</label>
                        <select 
                          value={selectedVault || ''}
                          onChange={(e) => setSelectedVault(e.target.value as `0x${string}`)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 text-gray-900 font-medium"
                        >
                          <option value="">Choose a vault...</option>
                          {userVaults.map((vault, index) => (
                            <option key={vault} value={vault}>
                              Vault #{index + 1} - {vault.slice(0, 6)}...{vault.slice(-4)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Vault Management Components */}
                    {selectedVault && (
                      <div className="space-y-6">
                        <VaultOperations 
                          vaultAddress={selectedVault} 
                          vaultIndex={userVaults.indexOf(selectedVault)} 
                        />
                        
                        {/* Share Transfers - First Priority */}
                        <div className="bg-white rounded-2xl shadow-lg">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-[#213046] flex items-center">
                                <span className="mr-2">🔄</span>
                                Share Transfers - Vault #{userVaults.indexOf(selectedVault) + 1}
                  </h3>
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === 'shareTransfer' ? null : 'shareTransfer')}
                                className="px-4 py-2 bg-[#49ABFE] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors"
                              >
                                {activeDropdown === 'shareTransfer' ? 'Hide' : 'Show'} Share Transfers
                              </button>
                            </div>
                            {activeDropdown === 'shareTransfer' && (
                              <ShareTransfer 
                                vaultAddress={selectedVault} 
                                vaultIndex={userVaults.indexOf(selectedVault)} 
                              />
                            )}
                          </div>
                        </div>

                        {/* Vault Management - Optional */}
                        <div className="bg-white rounded-2xl shadow-lg">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                          <div>
                                <h3 className="text-xl font-bold text-[#213046] flex items-center">
                                  <span className="mr-2">⚙️</span>
                                  Vault Management - Vault #{userVaults.indexOf(selectedVault) + 1}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  Optional: Advanced vault configuration and control
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === 'vaultManagement' ? null : 'vaultManagement')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                {activeDropdown === 'vaultManagement' ? 'Hide' : 'Show'} Management
                              </button>
                            </div>
                            {activeDropdown === 'vaultManagement' && (
                              <VaultManagement 
                                vaultAddress={selectedVault} 
                                vaultIndex={userVaults.indexOf(selectedVault)} 
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Strategy Tab */}
            {activeTab === 'strategy' && (
              <div className="space-y-6 animate-fadeIn">
                {userVaults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Vaults to Configure</h3>
                    <p className="text-gray-500 mb-6">Create a vault first to configure protocol allocations</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="bg-[#49ABFE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors"
                    >
                      Create Your First Vault
                    </button>
                            </div>
                ) : (
                  <div className="space-y-6">
                    {userVaults.map((vault, index) => (
                      <ProtocolAllocationManager 
                        key={vault} 
                        vaultAddress={vault} 
                        vaultIndex={index} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6 animate-fadeIn">
                {userVaults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📈</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Vaults Yet</h3>
                    <p className="text-gray-500 mb-6">Create a vault first to view detailed information and activity</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="bg-[#49ABFE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors"
                    >
                      Create Your First Vault
                    </button>
                        </div>
                ) : (
                  <div className="space-y-6">
                    {userVaults.map((vault, index) => (
                      <VaultInfo 
                        key={vault} 
                        vaultAddress={vault} 
                        vaultIndex={index} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


      <Footer scrollToSection={() => {}} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .hover\:scale-110:hover {
          transform: scale(1.10);
        }
      `}</style>
    </div>
  );
};

export default UserProfile;