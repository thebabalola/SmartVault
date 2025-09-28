"use client";

import React from 'react';
import { useUserVault } from '../../hooks/useUserVault';

interface VaultInfoProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
}

const VaultInfo: React.FC<VaultInfoProps> = ({ vaultAddress, vaultIndex }) => {
  const {
    vaultInfo,
    name,
    symbol,
    decimals,
    totalAssets,
    totalSupply,
    userBalance,
    userValue,
    asset,
    aaveAllocation,
    compoundAllocation,
    uniswapAllocation,
    isPaused,
    maxDeposit,
    maxWithdraw,
    maxMint,
    maxRedeem,
    apy
  } = useUserVault(vaultAddress);

  const formatAddress = (addr: string): string => {
    if (!addr) return "N/A";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const calculateUserPercentage = () => {
    if (parseFloat(totalSupply) === 0) return "0.00";
    return ((parseFloat(userBalance) / parseFloat(totalSupply)) * 100).toFixed(2);
  };

  const getVaultStatus = () => {
    if (isPaused) return { status: 'Paused', color: 'red' };
    if (parseFloat(totalAssets) === 0) return { status: 'Empty', color: 'gray' };
    return { status: 'Active', color: 'green' };
  };

  const vaultStatus = getVaultStatus();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#213046] mb-2">
          Vault Information - {name} #{vaultIndex + 1}
        </h3>
        <p className="text-gray-600">Detailed vault statistics and configuration</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Basic Information Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h4 className="text-xl font-bold text-blue-800 mb-4">
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-blue-600 font-medium">Name</span>
                <p className="text-lg font-bold text-blue-900">{name}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-blue-600 font-medium">Symbol</span>
                <p className="text-lg font-bold text-blue-900">{symbol}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-blue-600 font-medium">Decimals</span>
                <p className="text-lg font-bold text-blue-900">{decimals}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-blue-600 font-medium">Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  vaultStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                  vaultStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {vaultStatus.status}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <span className="text-sm text-blue-600 font-medium">Vault Address</span>
              <p className="font-mono text-sm font-bold text-blue-900 mt-1">{formatAddress(vaultAddress)}</p>
            </div>
          </div>

          {/* Financial Data Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h4 className="text-xl font-bold text-green-800 mb-4">
              Financial Data
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">Total Assets</span>
                <p className="text-lg font-bold text-green-900">{totalAssets} tokens</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">Total Supply</span>
                <p className="text-lg font-bold text-green-900">{totalSupply} {symbol}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">Your Balance</span>
                <p className="text-lg font-bold text-green-900">{userBalance} {symbol}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">Your Value</span>
                <p className="text-lg font-bold text-green-900">${userValue}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">Your Share %</span>
                <p className="text-lg font-bold text-green-900">{calculateUserPercentage()}%</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-green-600 font-medium">APY</span>
                <p className="text-lg font-bold text-green-700">{apy}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Protocol Allocations Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
            <h4 className="text-xl font-bold text-purple-800 mb-4">
              Protocol Allocations
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-600 font-medium">Aave (Lending)</span>
                <span className="font-bold text-purple-900">{aaveAllocation} tokens</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-600 font-medium">Compound (Lending)</span>
                <span className="font-bold text-purple-900">{compoundAllocation} tokens</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-600 font-medium">Uniswap (Liquidity)</span>
                <span className="font-bold text-purple-900">{uniswapAllocation} tokens</span>
              </div>
              <div className="border-t border-purple-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-bold">Total Allocated</span>
                  <span className="font-bold text-purple-900">
                    {(parseFloat(aaveAllocation) + parseFloat(compoundAllocation) + parseFloat(uniswapAllocation)).toFixed(2)} tokens
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Limits Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <h4 className="text-xl font-bold text-orange-800 mb-4">
              Transaction Limits
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-orange-600 font-medium">Max Deposit</span>
                <p className="text-sm font-bold text-orange-900">{maxDeposit} assets</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-orange-600 font-medium">Max Withdraw</span>
                <p className="text-sm font-bold text-orange-900">{maxWithdraw} assets</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-orange-600 font-medium">Max Mint</span>
                <p className="text-sm font-bold text-orange-900">{maxMint} shares</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-orange-600 font-medium">Max Redeem</span>
                <p className="text-sm font-bold text-orange-900">{maxRedeem} shares</p>
              </div>
            </div>
          </div>

          {/* Asset Information Card */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Asset Information
            </h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Underlying Asset</span>
                <p className="font-mono text-sm font-bold text-gray-900">{formatAddress(asset)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-gray-600 font-medium">Asset Type</span>
                  <p className="text-sm font-bold text-gray-900">ERC-20 Token</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600 font-medium">Vault Type</span>
                  <p className="text-sm font-bold text-gray-900">ERC-4626 Compliant</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Vault Info Raw Data (if available) */}
      {vaultInfo ? (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Raw Vault Data</h4>
          <div className="text-xs font-mono text-gray-600 break-all">
            <pre>{JSON.stringify(vaultInfo, null, 2)}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VaultInfo;
