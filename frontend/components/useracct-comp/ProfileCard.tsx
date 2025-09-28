"use client";

import React from 'react';
import { 
  Copy, 
  Check,
  User
} from 'lucide-react';

interface ProfileCardProps {
  userAddress: string;
  isAddressCopied: boolean;
  onCopyAddress: () => void;
  animationClass: string;
  userVaults: `0x${string}`[];
  isConnected: boolean;
  userProfile: {username: string, bio: string} | null;
  registrationDate: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userAddress,
  isAddressCopied,
  onCopyAddress,
  animationClass,
  userVaults,
  isConnected,
  userProfile,
  registrationDate
}) => {

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 sticky top-32 transform transition-all duration-500 ${animationClass}`}>
      {/* User Info Section */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#49ABFE] to-[#9DCCED] flex items-center justify-center hover:scale-110 transform transition-all duration-300 cursor-pointer shadow-lg">
          <User size={40} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#213046]">
            {userProfile?.username || 'Smart Vault User'}
          </h1>
          <p className="text-[#49ABFE] font-medium text-sm">Vaults: {userVaults.length}</p>
          <p className="text-xs text-gray-600">
            {userProfile?.bio || (isConnected ? 'Wallet Connected' : 'Connect Wallet to Create Vaults')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {registrationDate && registrationDate !== "Unknown" 
              ? `Joined: ${registrationDate}` 
              : "Registration date loading..."}
          </p>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Wallet Address</p>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-sm font-mono text-gray-800">{formatAddress(userAddress)}</span>
          <button 
            onClick={onCopyAddress}
            className="p-1 hover:bg-white rounded transition-all hover:scale-110 transform"
          >
            {isAddressCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Vault Info */}
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Total Vaults</p>
          <p className="text-2xl font-bold text-[#213046]">{userVaults.length}</p>
        </div>
        
        {userVaults.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-700">Recent Vaults</p>
            <div className="mt-2 space-y-1">
              {userVaults.slice(0, 3).map((vault, index) => (
                <div key={index} className="text-xs text-blue-600 font-mono">
                  {formatAddress(vault)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
