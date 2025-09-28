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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#213046] flex items-center mb-2">
          <span className="mr-2">📊</span>
          Vault Information - {name} #{vaultIndex + 1}
        </h3>
        <p className="text-gray-600">Detailed vault statistics and configuration</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Symbol:</span>
              <span className="font-medium">{symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Decimals:</span>
              <span className="font-medium">{decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                vaultStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                vaultStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {vaultStatus.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vault Address:</span>
              <span className="font-mono text-sm">{formatAddress(vaultAddress)}</span>
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Financial Data</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Assets:</span>
              <span className="font-medium">{totalAssets} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Supply:</span>
              <span className="font-medium">{totalSupply} {symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Balance:</span>
              <span className="font-medium">{userBalance} {symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Value:</span>
              <span className="font-medium">${userValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Share %:</span>
              <span className="font-medium">{calculateUserPercentage()}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">APY:</span>
              <span className="font-medium text-green-600">{apy}</span>
            </div>
          </div>
        </div>

        {/* Protocol Allocations */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Protocol Allocations</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Aave:</span>
              <span className="font-medium">{aaveAllocation} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compound:</span>
              <span className="font-medium">{compoundAllocation} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uniswap:</span>
              <span className="font-medium">{uniswapAllocation} tokens</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">Total Allocated:</span>
              <span className="font-bold">
                {(parseFloat(aaveAllocation) + parseFloat(compoundAllocation) + parseFloat(uniswapAllocation)).toFixed(2)} tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Limits and Advanced Info */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Transaction Limits</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Max Deposit:</span>
              <span className="font-medium">{maxDeposit} assets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Withdraw:</span>
              <span className="font-medium">{maxWithdraw} assets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Mint:</span>
              <span className="font-medium">{maxMint} shares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Redeem:</span>
              <span className="font-medium">{maxRedeem} shares</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Asset Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Underlying Asset:</span>
              <span className="font-mono text-sm">{formatAddress(asset)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Asset Type:</span>
              <span className="font-medium">ERC-20 Token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vault Type:</span>
              <span className="font-medium">ERC-4626 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Info Raw Data (if available) */}
      {vaultInfo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Raw Vault Data</h4>
          <div className="text-xs font-mono text-gray-600 break-all">
            <pre>{JSON.stringify(vaultInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultInfo;
