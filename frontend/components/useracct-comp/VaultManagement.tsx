"use client";

import React, { useState } from 'react';
import { useUserVault } from '../../hooks/useUserVault';

interface VaultManagementProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
}

const VaultManagement: React.FC<VaultManagementProps> = ({ vaultAddress, vaultIndex }) => {
  const {
    name,
    symbol,
    decimals,
    isPaused,
    setVaultName,
    setVaultSymbol,
    setVaultDecimals,
    pauseVault,
    unpauseVault,
    isPending
  } = useUserVault(vaultAddress);

  const [vaultConfig, setVaultConfig] = useState({
    name: '',
    symbol: '',
    decimals: 18
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveConfig = async () => {
    try {
      if (vaultConfig.name) {
        await setVaultName(vaultConfig.name);
      }
      if (vaultConfig.symbol) {
        await setVaultSymbol(vaultConfig.symbol);
      }
      if (vaultConfig.decimals !== decimals) {
        await setVaultDecimals(vaultConfig.decimals);
      }
      setIsEditing(false);
      setVaultConfig({ name: '', symbol: '', decimals: 18 });
    } catch (error) {
      console.error('Error updating vault config:', error);
      alert(`Error updating vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePauseToggle = async () => {
    try {
      if (isPaused) {
        await unpauseVault();
      } else {
        await pauseVault();
      }
    } catch (error) {
      console.error('Error toggling vault pause:', error);
      alert(`Error toggling vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#213046] flex items-center">
          <span className="mr-2">⚙️</span>
          Vault #{vaultIndex + 1} Management
        </h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPaused 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
          <button
            onClick={handlePauseToggle}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isPaused
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPending ? 'Processing...' : (isPaused ? 'Unpause' : 'Pause')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Configuration */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Current Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vault Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900 font-medium">{name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900 font-medium">{symbol}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900 font-medium">{decimals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Update Configuration</h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#49ABFE] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Vault Name</label>
                <input
                  type="text"
                  value={vaultConfig.name}
                  onChange={(e) => setVaultConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                  placeholder="Enter new vault name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Symbol</label>
                <input
                  type="text"
                  value={vaultConfig.symbol}
                  onChange={(e) => setVaultConfig(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                  placeholder="Enter new symbol"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Decimals</label>
                <select
                  value={vaultConfig.decimals}
                  onChange={(e) => setVaultConfig(prev => ({ ...prev, decimals: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent text-gray-900 font-medium"
                >
                  <option value={6}>6 (USDC/USDT)</option>
                  <option value={8}>8 (BTC)</option>
                  <option value={18}>18 (ETH/DAI)</option>
                </select>
              </div>
              <button
                onClick={handleSaveConfig}
                disabled={isPending}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Click &quot;Edit&quot; to modify vault configuration</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultManagement;
