"use client";

import React, { useState } from 'react';

interface SystemSettingsProps {
  factoryAddress: string;
  networkId: number;
  onSettingsUpdate: (settings: Record<string, unknown>) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({
  factoryAddress,
  networkId,
  onSettingsUpdate
}) => {
  const [settings, setSettings] = useState({
    maxVaultsPerUser: 10,
    minDepositAmount: 100,
    maxDepositAmount: 1000000,
    protocolFee: 0.5,
    emergencyPause: false
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = (key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSettingsUpdate(settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Contract Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Factory Contract</h3>
            <p className="text-sm text-gray-600 mb-2">VaultFactory Address:</p>
            <code className="block bg-gray-200 px-3 py-2 rounded text-sm font-mono break-all">
              {factoryAddress}
            </code>
            <button className="mt-2 text-[#49ABFE] hover:text-[#1a5ba8] text-sm font-medium">
              Copy Address
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Network</h3>
            <p className="text-sm text-gray-600 mb-2">Current Network:</p>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">Arbitrum Sepolia Testnet</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Chain ID: {networkId}</p>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
          <span className="mr-3">⚙️</span>
          System Configuration
        </h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Max Vaults Per User
              </label>
              <input
                type="number"
                value={settings.maxVaultsPerUser}
                onChange={(e) => handleSettingChange('maxVaultsPerUser', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all"
                min="1"
                max="50"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of vaults a user can create</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Protocol Fee (%)
              </label>
              <input
                type="number"
                value={settings.protocolFee}
                onChange={(e) => handleSettingChange('protocolFee', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all"
                min="0"
                max="10"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">Fee percentage taken by the protocol</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Minimum Deposit Amount
              </label>
              <input
                type="number"
                value={settings.minDepositAmount}
                onChange={(e) => handleSettingChange('minDepositAmount', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum amount required for deposits</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Maximum Deposit Amount
              </label>
              <input
                type="number"
                value={settings.maxDepositAmount}
                onChange={(e) => handleSettingChange('maxDepositAmount', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum amount allowed for deposits</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Emergency Pause</h3>
              <p className="text-sm text-red-600">Pause all vault operations in case of emergency</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emergencyPause}
                onChange={(e) => handleSettingChange('emergencyPause', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            disabled={isUpdating}
            className="bg-[#49ABFE] text-white px-8 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isUpdating ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
