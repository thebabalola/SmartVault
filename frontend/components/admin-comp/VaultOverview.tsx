"use client";

import React from 'react';

interface VaultData {
  id: number;
  owner: string;
  name: string;
  asset: string;
  amount: number;
  timestamp: string;
  apy?: number;
  yield?: number;
}

interface VaultOverviewProps {
  vaults: VaultData[];
  totalVaults: number;
  totalAssets: number;
  totalUsers: number;
  totalYield: number;
}

const VaultOverview: React.FC<VaultOverviewProps> = ({
  vaults,
  totalVaults,
  totalAssets,
  totalUsers,
  totalYield
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number, asset: string) => {
    if (asset === 'ETH') {
      return `${amount} ETH`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vaults</p>
              <p className="text-3xl font-bold text-[#213046]">{totalVaults}</p>
              <p className="text-xs text-green-600 mt-1">+12 this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-[#213046]">${(totalAssets / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1">+5.2% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-[#213046]">{totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">+8 this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Yield</p>
              <p className="text-3xl font-bold text-green-600">${(totalYield / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-600 mt-1">+2.1% this week</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vaults Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#213046] flex items-center">
            <span className="mr-2">📊</span>
            Recent Vault Activity
          </h3>
          <button className="text-[#49ABFE] hover:text-[#1a5ba8] font-medium">
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vault</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Asset</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">APY</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {vaults.map((vault) => (
                <tr key={vault.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#49ABFE] rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🏦</span>
                      </div>
                      <span className="font-medium text-gray-800">{vault.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {formatAddress(vault.owner)}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vault.asset}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-800">
                      {formatAmount(vault.amount, vault.asset)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-green-600 font-medium">
                      {vault.apy ? `${vault.apy}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{vault.timestamp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VaultOverview;
