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
              <span className="text-gray-700 font-medium">Name:</span>
              <span className="font-bold text-gray-900">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Symbol:</span>
              <span className="font-bold text-gray-900">{symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Decimals:</span>
              <span className="font-bold text-gray-900">{decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                vaultStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                vaultStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {vaultStatus.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Vault Address:</span>
              <span className="font-mono text-sm font-bold text-gray-900">{formatAddress(vaultAddress)}</span>
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Financial Data</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Total Assets:</span>
              <span className="font-bold text-gray-900">{totalAssets} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Total Supply:</span>
              <span className="font-bold text-gray-900">{totalSupply} {symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Your Balance:</span>
              <span className="font-bold text-gray-900">{userBalance} {symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Your Value:</span>
              <span className="font-bold text-gray-900">${userValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Your Share %:</span>
              <span className="font-bold text-gray-900">{calculateUserPercentage()}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">APY:</span>
              <span className="font-bold text-green-700">{apy}</span>
            </div>
          </div>
        </div>

        {/* Protocol Allocations */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Protocol Allocations</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Aave:</span>
              <span className="font-bold text-gray-900">{aaveAllocation} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Compound:</span>
              <span className="font-bold text-gray-900">{compoundAllocation} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Uniswap:</span>
              <span className="font-bold text-gray-900">{uniswapAllocation} tokens</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-700 font-bold">Total Allocated:</span>
              <span className="font-bold text-gray-900">
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
              <span className="text-gray-700 font-medium">Max Deposit:</span>
              <span className="font-bold text-gray-900">{maxDeposit} assets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Max Withdraw:</span>
              <span className="font-bold text-gray-900">{maxWithdraw} assets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Max Mint:</span>
              <span className="font-bold text-gray-900">{maxMint} shares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Max Redeem:</span>
              <span className="font-bold text-gray-900">{maxRedeem} shares</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Asset Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Underlying Asset:</span>
              <span className="font-mono text-sm font-bold text-gray-900">{formatAddress(asset)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Asset Type:</span>
              <span className="font-bold text-gray-900">ERC-20 Token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Vault Type:</span>
              <span className="font-bold text-gray-900">ERC-4626 Compliant</span>
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
