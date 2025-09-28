"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { 
  Zap, 
  Copy, 
  Check, 
  TrendingUp, 
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import MANNA_ABI from "../../constants/ABIs/smartvault.json";
import { VAULT_FACTORY_ADDRESS } from "../../constants/contractAddresses";

// Contract Configuration
const MANNA_CONTRACT_ADDRESS = VAULT_FACTORY_ADDRESS;

interface TipTransaction {
  from: string;
  amount: string;
  timestamp: string;
  hash: string;
}

interface TipPanelProps {
  isConnected: boolean;
  isWrongNetwork: boolean;
  onSwitchNetwork: () => void;
}

const TipPanel: React.FC<TipPanelProps> = ({
  isConnected,
  isWrongNetwork,
  onSwitchNetwork
}) => {
  const { address } = useAccount();
  const [tipAmount, setTipAmount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState<string>("0xA421d9AE4945C63D4353F74a689a55813F993603");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentTips, setRecentTips] = useState<TipTransaction[]>([]);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

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

  const handleQuickTip = (amount: string | number) => {
    setTipAmount(amount.toString());
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
      setTransactionStatus("Please switch to Arbitrum Sepolia testnet.");
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

  const canSendTip = tipAmount && creatorAddress && creatorAddress.length === 42 && !isTransferPending;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Network Warning */}
      {isWrongNetwork && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="text-amber-600 mr-3" size={20} />
            <span className="text-amber-800 font-medium">Please switch to Arbitrum Sepolia testnet</span>
          </div>
          <button 
            onClick={onSwitchNetwork}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Switch Network
          </button>
        </div>
      )}

      {/* Creator Info Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#49ABFE] to-[#9DCCED] flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
          <h2 className="text-xl font-bold text-[#213046] mb-1">Artist Kim (김작가)</h2>
          <p className="text-gray-600 mb-2 text-sm">@artist_kim_seoul</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Independent illustrator bringing Seoul stories to life. Creating webtoons that bridge cultures. 감사합니다! ✨
          </p>
        </div>

        {/* Creator Balance Display */}
        <div className={`bg-gradient-to-r from-[#213046] to-[#49ABFE] text-white p-6 rounded-xl text-center mb-6 transition-all duration-1000 ${balanceAnimation ? 'scale-105 ring-4 ring-[#EFAC20]/30' : ''}`}>
          <p className="text-sm opacity-90 mb-1">Creator Balance</p>
          <p className="text-2xl font-bold mb-1">
            ₩{Math.floor(parseFloat(formatBalance(creatorBalance as bigint))).toLocaleString()} KRW-S
          </p>
          <p className="text-xs opacity-75">Updates in real-time from Arbitrum Sepolia</p>
          {balanceAnimation && (
            <p className="text-[#49ABFE] text-sm mt-2 font-medium">✨ Just received your tip!</p>
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
        <h2 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
          <Zap className="mr-3 text-[#49ABFE]" size={24} />
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
          <label htmlFor="creatorAddress" className="block text-sm font-bold text-[#213046] mb-3">
            Creator Wallet Address
          </label>
          <input
            type="text"
            id="creatorAddress"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-[#49ABFE] transition-colors text-lg font-semibold text-gray-900 placeholder:text-gray-500 placeholder:font-medium"
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
          <label htmlFor="amount" className="block text-sm font-bold text-[#213046] mb-3">
            Gift Amount (KRW-S)
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-[#49ABFE] transition-colors text-lg font-semibold text-gray-900 placeholder:text-gray-500 placeholder:font-medium"
            placeholder="Enter amount (e.g., 1000)"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            disabled={false}
          />
        </div>

        {/* Quick Tip Buttons */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[#213046] mb-4">Quick Tips:</p>
          <div className="grid grid-cols-3 gap-3">
            {[1000, 5000, 10000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickTip(amount)}
                disabled={false}
                className="px-4 py-3 border-2 border-[#49ABFE] text-[#49ABFE] rounded-lg hover:bg-[#49ABFE] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base"
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
          className="w-full bg-[#49ABFE] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
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
          <h3 className="text-xl font-bold text-[#213046] mb-4 flex items-center">
            <TrendingUp className="mr-2 text-[#49ABFE]" size={24} />
            Recent Gifts
          </h3>
          <div className="space-y-3">
            {recentTips.map((tip) => (
              <div key={`tip-${tip.timestamp}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#49ABFE] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🎉</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tip.from}</p>
                    <p className="text-sm text-gray-500">{tip.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#213046]">₩{parseInt(tip.amount).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">KRW-S</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-4 relative overflow-hidden shadow-2xl border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-[#213046]/5 to-[#EFAC20]/5"></div>
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-[#213046] mb-2">Tip Sent Successfully!</h3>
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
    </div>
  );
};

export default TipPanel;
