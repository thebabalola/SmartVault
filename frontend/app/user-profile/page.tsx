"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useSwitchChain } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MANNA_ABI from "../../constants/ABIs/manna.json";
import { 
  User, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Copy, 
  Check, 
  TrendingUp, 
  Heart, 
  Gift, 
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  ChevronRight,
  Activity,
  Calendar,
  Star,
  Users,
  AlertCircle,
  Loader2,
  Zap,
  Clock
} from 'lucide-react';

// Contract Configuration
const MANNA_CONTRACT_ADDRESS = "0x89A2C29B55Fb31E5739682f5b9aE3a004E7a1a54" as `0x${string}`;
const CREATOR_ADDRESS = "0xA421d9AE4945C63D4353F74a689a55813F993603" as `0x${string}`;
const KAIA_BAOBAB_CHAIN_ID = 1001; // Kaia Testnet

interface TipTransaction {
  from: string;
  amount: string;
  timestamp: string;
  hash: string;
}

const UserProfile = () => {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [animationClass, setAnimationClass] = useState('');
  const [tipAmount, setTipAmount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState<string>(CREATOR_ADDRESS);
  const [transactionStatus, setTransactionStatus] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [recentTips, setRecentTips] = useState<TipTransaction[]>([]);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Sarah Chen',
    username: '@sarah_seoul',
    email: 'sarah.chen@example.com',
    bio: 'K-culture enthusiast supporting amazing Korean creators. Love webtoons, K-pop, and indie artists! 🇰🇷✨',
    location: 'Seoul, South Korea',
    joinDate: 'March 2024',
    avatar: '👩‍💼'
  });

  const mockStats = {
    totalGifted: 125000,
    creatorsSupported: 18,
    giftsSent: 47,
    favoriteCreators: 12
  };

  const mockTransactions = [
    { id: 1, creator: 'Artist Kim', amount: 5000, date: '2024-08-25', type: 'gift' },
    { id: 2, creator: 'Webtoon Studio', amount: 10000, date: '2024-08-24', type: 'gift' },
    { id: 3, creator: 'Musician Lee', amount: 3000, date: '2024-08-23', type: 'gift' },
    { id: 4, creator: 'Streamer Park', amount: 8000, date: '2024-08-22', type: 'gift' }
  ];

  const mockCreators = [
    { name: 'Artist Kim', category: 'Illustration', avatar: '🎨', gifted: 15000 },
    { name: 'Musician Lee', category: 'Music', avatar: '🎵', gifted: 12000 },
    { name: 'Webtoon Studio', category: 'Comics', avatar: '📚', gifted: 25000 },
    { name: 'Streamer Park', category: 'Gaming', avatar: '🎮', gifted: 8000 }
  ];

  const userAddress = "0x742d35Cc6Bb1332046c003e036Cd2Da7d2E2aD7C";

  // Read creator's KRW-S balance
  const { data: creatorBalance, refetch: refetchCreatorBalance } = useReadContract({
    address: MANNA_CONTRACT_ADDRESS,
    abi: MANNA_ABI,
    functionName: 'balanceOf',
    args: [creatorAddress as `0x${string}`],
    query: {
      enabled: !!creatorAddress && creatorAddress.length === 42,
    },
  });

  // Read user's KRW-S balance
  const { data: userBalance } = useReadContract({
    address: MANNA_CONTRACT_ADDRESS,
    abi: MANNA_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  // Write function to transfer KRW-S
  const { writeContract, isPending: isTransferPending, data: writeData } = useWriteContract();



  useEffect(() => {
    // Trigger entrance animations on load
    setAnimationClass('animate-fadeInUp');
  }, []);

  // Handle successful transaction when writeData changes
  useEffect(() => {
    if (writeData && typeof writeData === 'object' && 'hash' in writeData) {
      // Transaction was submitted successfully
      setTransactionStatus("Tip sent successfully! 🎉");
      setShowSuccess(true);
      setBalanceAnimation(true);
      
      // Add to recent tips
      const newTip: TipTransaction = {
        from: formatAddress(address),
        amount: tipAmount,
        timestamp: new Date().toLocaleTimeString(),
        hash: (writeData as { hash: string })?.hash || "Transaction completed"
      };
      setRecentTips(prev => [newTip, ...prev.slice(0, 4)]);
      
      setTipAmount("");
      refetchCreatorBalance();
      
      setTimeout(() => {
        setTransactionStatus("");
        setShowSuccess(false);
        setBalanceAnimation(false);
      }, 5000);
    }
  }, [writeData, tipAmount, address, refetchCreatorBalance]);



  const handleSave = () => {
    setIsEditing(false);
    // Add save animation
    setAnimationClass('animate-pulse');
    setTimeout(() => setAnimationClass(''), 1000);
  };

  const formatBalance = (balance: bigint | undefined): string => {
    if (!balance) return "0";
    return formatUnits(balance, 18);
  };

  const getUserBalanceDisplay = (): string => {
    if (!userBalance) return "0";
    return Math.floor(parseFloat(formatBalance(userBalance as bigint))).toLocaleString();
  };



  const formatAddress = (addr: string | undefined): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyCreatorAddress = async () => {
    await navigator.clipboard.writeText(creatorAddress);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const copyUserAddress = async () => {
    await navigator.clipboard.writeText(userAddress);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const handleQuickTip = (amount: string | number) => {
    setTipAmount(amount.toString());
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: KAIA_BAOBAB_CHAIN_ID });
    } catch (error: unknown) {
      console.error("Failed to switch network:", error);
      setTransactionStatus("Failed to switch network. Please switch to Kaia Baobab manually.");
    }
  };

  const handleTip = async () => {
    if (!tipAmount || !creatorAddress) {
      setTransactionStatus("Please enter a valid amount and creator address.");
      return;
    }

    if (creatorAddress.length !== 42 || !creatorAddress.startsWith('0x')) {
      setTransactionStatus("Please enter a valid creator wallet address.");
      return;
    }

    if (!isConnected) {
      setTransactionStatus("Please connect your wallet first.");
      return;
    }

    if (isWrongNetwork) {
      setTransactionStatus("Please switch to Kaia Baobab testnet.");
      return;
    }

    if (!writeContract) {
      setTransactionStatus("Wallet not ready. Please try again.");
      return;
    }

    try {
      const amountInWei = parseUnits(tipAmount, 18);
      
      // Check if user has sufficient balance
      if (userBalance && amountInWei > (userBalance as bigint)) {
        setTransactionStatus("Insufficient balance. Please check your KRW-S balance.");
        return;
      }

      // This will trigger the wallet popup
      writeContract({
        address: MANNA_CONTRACT_ADDRESS,
        abi: MANNA_ABI,
        functionName: 'transfer',
        args: [creatorAddress as `0x${string}`, amountInWei],
      });
      
      setTransactionStatus("Transaction submitted! Please confirm in your wallet.");
      
    } catch (error: unknown) {
      console.error("Error sending tip:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };



  const isWrongNetwork = isConnected && chain?.id !== KAIA_BAOBAB_CHAIN_ID;
  const canSendTip = tipAmount && creatorAddress && creatorAddress.length === 42 && !isTransferPending;

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; isActive: boolean; onClick: (id: string) => void }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-[#144489] text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:text-[#144489] hover:bg-gray-100 hover:scale-102'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-24">
        {/* Network Warning */}
        {isWrongNetwork && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="text-amber-600 mr-3" size={20} />
              <span className="text-amber-800 font-medium">Please switch to Kaia Baobab testnet</span>
            </div>
            <button 
              onClick={handleSwitchNetwork}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Switch Network
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`bg-white rounded-2xl shadow-lg p-6 sticky top-32 transform transition-all duration-500 ${animationClass}`}>
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#EFAC20] to-[#f4c050] flex items-center justify-center text-4xl hover:scale-110 transform transition-all duration-300 cursor-pointer shadow-lg">
                    {userData.avatar}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 transform">
                    <Camera size={14} className="text-[#144489]" />
                  </button>
                </div>
                
                <div className="space-y-2">
                                  <h1 className="text-xl font-bold text-[#144489]">{userData.name}</h1>
                <p className="text-[#EFAC20] font-medium text-sm">{userData.username}</p>
                <p className="text-xs text-gray-600">{userData.bio}</p>
                </div>
              </div>



              {/* Wallet Info */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Wallet Address</p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-mono text-gray-800">{formatAddress(userAddress)}</span>
                  <button 
                    onClick={copyUserAddress}
                    className="p-1 hover:bg-white rounded transition-all hover:scale-110 transform"
                  >
                    {isAddressCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                  </button>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full border-2 border-[#EFAC20] text-[#EFAC20] font-medium py-3 rounded-lg hover:bg-[#EFAC20] hover:text-white transition-all hover:shadow-lg transform hover:scale-105"
                >
                  <Edit3 className="inline mr-2" size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 p-2 sm:p-3 bg-white rounded-2xl shadow-sm">
              <TabButton id="profile" label="Profile" icon={User} isActive={activeTab === 'profile'} onClick={setActiveTab} />
                              <TabButton id="tip" label="Gift Creator" icon={Zap} isActive={activeTab === 'tip'} onClick={setActiveTab} />
              <TabButton id="activity" label="Activity" icon={Activity} isActive={activeTab === 'activity'} onClick={setActiveTab} />
              <TabButton id="creators" label="Creators" icon={Users} isActive={activeTab === 'creators'} onClick={setActiveTab} />
              <TabButton id="settings" label="Settings" icon={Settings} isActive={activeTab === 'settings'} onClick={setActiveTab} />
            </div>

            {/* Tip Creator Tab */}
            {activeTab === 'tip' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Creator Info Panel */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#EFAC20] to-[#f4c050] flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#144489] mb-1">Artist Kim (김작가)</h2>
                    <p className="text-gray-600 mb-2 text-sm">@artist_kim_seoul</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Independent illustrator bringing Seoul stories to life. Creating webtoons that bridge cultures. 감사합니다! ✨
                    </p>
                  </div>

                  {/* Creator Balance Display */}
                  <div className={`bg-gradient-to-r from-[#144489] to-[#1a5ba8] text-white p-6 rounded-xl text-center mb-6 transition-all duration-1000 ${balanceAnimation ? 'scale-105 ring-4 ring-[#EFAC20]/30' : ''}`}>
                    <p className="text-sm opacity-90 mb-1">Creator Balance</p>
                    <p className="text-2xl font-bold mb-1">
                      ₩{Math.floor(parseFloat(formatBalance(creatorBalance as bigint))).toLocaleString()} KRW-S
                    </p>
                    <p className="text-xs opacity-75">Updates in real-time from Kaia Baobab</p>
                    {balanceAnimation && (
                      <p className="text-[#EFAC20] text-sm mt-2 font-medium">✨ Just received your tip!</p>
                    )}
                  </div>

                  {/* Creator Address */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Creator Wallet</p>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-mono text-gray-700">
                        {creatorAddress ? formatAddress(creatorAddress) : "Enter address above"}
                      </span>
                      <button 
                        onClick={copyCreatorAddress}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={!creatorAddress}
                      >
                        {isAddressCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tip Panel */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#144489] mb-6 flex items-center">
                    <Zap className="mr-3 text-[#EFAC20]" size={24} />
                    Send Gift (KRW-S)
                  </h2>

                  {/* User Balance Display */}
                  {isConnected && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Check className="text-green-600 mr-2" size={20} />
                          <span className="text-green-700 font-medium">Your Balance</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ₩{getUserBalanceDisplay()} KRW-S
                        </span>
                      </div>
                    </div>
                  )}



                  {/* Creator Address Input */}
                  <div className="mb-6">
                    <label htmlFor="creatorAddress" className="block text-sm font-bold text-[#144489] mb-3">
                      Creator Wallet Address
                    </label>
                    <input
                      type="text"
                      id="creatorAddress"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#144489] focus:border-[#144489] transition-colors text-lg font-semibold text-gray-900 placeholder-gray-600"
                      placeholder="Enter creator's wallet address (0x...)"
                      value={creatorAddress}
                      onChange={(e) => setCreatorAddress(e.target.value as string)}
                      disabled={false}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the wallet address of the creator you want to tip
                    </p>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-bold text-[#144489] mb-3">
                      Gift Amount (KRW-S)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#144489] focus:border-[#144489] transition-colors text-lg font-semibold text-gray-900 placeholder-gray-600"
                      placeholder="Enter amount (e.g., 1000)"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      disabled={false}
                    />
                  </div>

                  {/* Quick Tip Buttons */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-[#144489] mb-4">Quick Tips:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[1000, 5000, 10000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleQuickTip(amount)}
                          disabled={false}
                          className="px-4 py-3 border-2 border-[#EFAC20] text-[#EFAC20] rounded-lg hover:bg-[#EFAC20] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base"
                        >
                          ₩{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Send Tip Button */}
                  <button
                    onClick={handleTip}
                    disabled={!canSendTip}
                    className="w-full bg-[#144489] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                  >
                    {isTransferPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Confirming in wallet...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2" size={20} />
                        Send Tip
                      </>
                    )}
                  </button>

                  {/* Transaction Status */}
                  {transactionStatus && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      transactionStatus.includes("successfully") || transactionStatus.includes("🎉")
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : transactionStatus.includes("failed") || transactionStatus.includes("insufficient") || transactionStatus.includes("rejected")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      <p className="font-medium">{transactionStatus}</p>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                {recentTips.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                                          <h3 className="text-xl font-bold text-[#144489] mb-4 flex items-center">
                        <TrendingUp className="mr-2 text-[#EFAC20]" size={24} />
                        Recent Gifts
                      </h3>
                    <div className="space-y-3">
                                              {recentTips.map((tip) => (
                          <div key={`tip-${tip.timestamp}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#EFAC20] rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm">🎉</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{tip.from}</p>
                              <p className="text-sm text-gray-500">{tip.timestamp}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#144489]">₩{parseInt(tip.amount).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">KRW-S</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#144489] flex items-center">
                      <User className="mr-3 text-[#EFAC20]" size={24} />
                      Personal Information
                    </h2>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all hover:scale-105 transform flex items-center"
                        >
                          <Save size={16} className="mr-1" />
                          Save
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all hover:scale-105 transform flex items-center"
                        >
                          <X size={16} className="mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Display Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#144489] focus:ring-4 focus:ring-[#144489]/10 transition-all text-gray-800 placeholder-gray-500"
                            placeholder="Enter your display name"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-lg">{userData.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Username</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.username}
                            onChange={(e) => setUserData({...userData, username: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#144489] focus:ring-4 focus:ring-[#144489]/10 transition-all text-gray-800 placeholder-gray-500"
                            placeholder="@yourusername"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-lg">{userData.username}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#144489] focus:ring-4 focus:ring-[#144489]/10 transition-all text-gray-800 placeholder-gray-500"
                            placeholder="your.email@example.com"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-lg">{userData.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.location}
                            onChange={(e) => setUserData({...userData, location: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#144489] focus:ring-4 focus:ring-[#144489]/10 transition-all text-gray-800 placeholder-gray-500"
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-lg flex items-center">
                            <Globe size={16} className="mr-2 text-gray-500" />
                            {userData.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Member Since</label>
                        <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-lg flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          {userData.joinDate}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Bio</label>
                        {isEditing ? (
                          <textarea
                            value={userData.bio}
                            onChange={(e) => setUserData({...userData, bio: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#144489] focus:ring-4 focus:ring-[#144489]/10 transition-all resize-none text-gray-800 placeholder-gray-500"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{userData.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#144489] mb-6 flex items-center">
                    <TrendingUp className="mr-2 text-[#EFAC20]" size={24} />
                    Activity Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all">
                      <Gift className="mx-auto mb-2 text-[#144489]" size={24} />
                      <p className="text-2xl font-bold text-[#144489]">{mockStats.giftsSent}</p>
                      <p className="text-sm text-gray-600">Gifts Sent</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl hover:shadow-md transition-all">
                      <Heart className="mx-auto mb-2 text-[#EFAC20]" size={24} />
                      <p className="text-2xl font-bold text-[#EFAC20]">₩{(mockStats.totalGifted / 1000)}K</p>
                      <p className="text-sm text-gray-600">Total Gifted</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all">
                      <Users className="mx-auto mb-2 text-green-600" size={24} />
                      <p className="text-2xl font-bold text-green-600">{mockStats.creatorsSupported}</p>
                      <p className="text-sm text-gray-600">Creators Supported</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all">
                      <Star className="mx-auto mb-2 text-purple-600" size={24} />
                      <p className="text-2xl font-bold text-purple-600">{mockStats.favoriteCreators}</p>
                      <p className="text-sm text-gray-600">Favorites</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#144489] mb-6 flex items-center">
                    <Activity className="mr-2 text-[#EFAC20]" size={24} />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {mockTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all hover:scale-102 transform">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#EFAC20] rounded-full flex items-center justify-center mr-4">
                            <Gift className="text-white" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Gifted {tx.creator}</p>
                            <p className="text-sm text-gray-500">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#144489]">₩{tx.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">KRW-S</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Creators Tab */}
            {activeTab === 'creators' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#144489] mb-6 flex items-center">
                    <Heart className="mr-2 text-[#EFAC20]" size={24} />
                    Supported Creators
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockCreators.map((creator, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all hover:scale-102 transform">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{creator.avatar}</div>
                            <div>
                              <p className="font-semibold text-gray-800">{creator.name}</p>
                              <p className="text-sm text-gray-500">{creator.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#144489]">₩{creator.gifted.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total Gifted</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#144489] mb-6 flex items-center">
                    <Settings className="mr-2 text-[#EFAC20]" size={24} />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <Bell className="mr-3 text-[#144489]" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">Notifications</p>
                          <p className="text-sm text-gray-500">Manage your notification preferences</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <Shield className="mr-3 text-[#144489]" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">Privacy & Security</p>
                          <p className="text-sm text-gray-500">Control your privacy settings</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <CreditCard className="mr-3 text-[#144489]" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">Payment Methods</p>
                          <p className="text-sm text-gray-500">Manage wallets and payment options</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-4 relative overflow-hidden shadow-2xl border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-[#144489]/5 to-[#EFAC20]/5"></div>
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-[#144489] mb-2">Tip Sent Successfully!</h3>
              <p className="text-gray-600 mb-4">Your support arrived instantly to the creator</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>Arrived in seconds</span>
                </div>
                <div className="flex items-center">
                  <Zap size={16} className="mr-1" />
                  <span>Zero waiting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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