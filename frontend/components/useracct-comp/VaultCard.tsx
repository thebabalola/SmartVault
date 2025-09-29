"use client";

import React from 'react';
import { useUserVault } from '../../hooks/useUserVault';

interface VaultCardProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
  onManageClick?: (vaultAddress: `0x${string}`, vaultIndex: number) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ vaultAddress, vaultIndex, onManageClick }) => {
  const {
    name,
    userValue,
    apy,
    isPending
  } = useUserVault(vaultAddress);

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleManageClick = () => {
    if (onManageClick) {
      onManageClick(vaultAddress, vaultIndex);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer" onClick={handleManageClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#49ABFE] rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-lg">🏦</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{name} #{vaultIndex + 1}</p>
            <p className="text-sm text-gray-500 font-mono">{formatAddress(vaultAddress)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-[#213046]">
            {isPending ? "Loading..." : `$${userValue}`}
          </p>
          <p className="text-sm text-green-600">
            {isPending ? "Loading yield..." : `+${apy} APY`}
          </p>
          <p className="text-xs text-[#49ABFE] hover:text-[#1a5ba8] transition-colors">Click Manage to view details</p>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
