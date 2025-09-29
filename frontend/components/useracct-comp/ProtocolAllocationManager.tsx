"use client";

import React, { useState } from 'react';
import { useUserVault } from '../../hooks/useUserVault';
import { Target, ChevronDown, ChevronUp } from 'lucide-react';

interface ProtocolAllocationManagerProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
}

const ProtocolAllocationManager: React.FC<ProtocolAllocationManagerProps> = ({ vaultAddress, vaultIndex }) => {
  const {
    aaveAllocation,
    compoundAllocation,
    uniswapAllocation,
    totalAssets,
    userValue,
    setProtocolAllocation,
    isPending
  } = useUserVault(vaultAddress);

  const [allocations, setAllocations] = useState({
    aave: '',
    compound: '',
    uniswap: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const protocols = [
    { key: 'aave', name: 'Aave (Lending)', color: 'blue', allocation: aaveAllocation },
    { key: 'compound', name: 'Compound (Lending)', color: 'green', allocation: compoundAllocation },
    { key: 'uniswap', name: 'Uniswap (Liquidity)', color: 'purple', allocation: uniswapAllocation }
  ];

  const handleAllocationChange = (protocol: string, value: string) => {
    setAllocations(prev => ({
      ...prev,
      [protocol]: value
    }));
  };

  const handleSaveAllocations = async () => {
    try {
      for (const [protocol, amount] of Object.entries(allocations)) {
        if (amount && parseFloat(amount) > 0) {
          await setProtocolAllocation(protocol, amount);
        }
      }
      setIsEditing(false);
      setAllocations({ aave: '', compound: '', uniswap: '' });
    } catch (error) {
      console.error('Error updating allocations:', error);
      alert(`Error updating allocations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const calculateTotalAllocation = () => {
    const current = parseFloat(aaveAllocation) + parseFloat(compoundAllocation) + parseFloat(uniswapAllocation);
    const newAllocations = parseFloat(allocations.aave || '0') + parseFloat(allocations.compound || '0') + parseFloat(allocations.uniswap || '0');
    return current + newAllocations;
  };

  const getTotalAssets = () => {
    return parseFloat(totalAssets) || 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      {/* Header with Vault Balance and Dropdown */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="mr-3 w-5 h-5 text-[#49ABFE]" />
            <div>
              <h3 className="text-xl font-bold text-[#213046]">
                Vault #{vaultIndex + 1} - Protocol Allocations
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Balance: <span className="font-semibold text-[#49ABFE]">${userValue}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#49ABFE] text-white rounded-lg hover:bg-[#1a5ba8] transition-colors text-sm"
            >
              {isEditing ? 'Cancel' : 'Manage'}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-6">

      {/* Current Allocations */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Allocations</h4>
        <div className="space-y-3">
          {protocols.map((protocol) => (
            <div key={protocol.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-4 h-4 bg-${protocol.color}-500 rounded mr-3`}></div>
                <span className="font-medium text-gray-800">{protocol.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#213046]">
                  {protocol.allocation} {protocol.allocation !== '0.00' ? 'tokens' : ''}
                </span>
                {protocol.allocation !== '0.00' && (
                  <p className="text-sm text-gray-500">
                    {((parseFloat(protocol.allocation) / getTotalAssets()) * 100).toFixed(1)}% of total
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Management */}
      {isEditing && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Set New Allocations</h4>
          <div className="space-y-3">
            {protocols.map((protocol) => (
              <div key={protocol.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {protocol.name} Allocation
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={allocations[protocol.key as keyof typeof allocations]}
                    onChange={(e) => handleAllocationChange(protocol.key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    tokens
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">Allocation Summary</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Current Total:</span>
                <span className="font-semibold text-gray-900">
                  {(parseFloat(aaveAllocation) + parseFloat(compoundAllocation) + parseFloat(uniswapAllocation)).toFixed(2)} tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">New Allocations:</span>
                <span className="font-semibold text-gray-900">
                  {(parseFloat(allocations.aave || '0') + parseFloat(allocations.compound || '0') + parseFloat(allocations.uniswap || '0')).toFixed(2)} tokens
                </span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="font-semibold text-gray-800">Total After Update:</span>
                <span className="font-bold text-gray-900">
                  {calculateTotalAllocation().toFixed(2)} tokens
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveAllocations}
            disabled={isPending || calculateTotalAllocation() > getTotalAssets()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving Allocations...' : 'Save Allocations'}
          </button>

          {calculateTotalAllocation() > getTotalAssets() && (
            <p className="text-red-600 text-sm text-center">
              ⚠️ Total allocations cannot exceed vault assets ({getTotalAssets().toFixed(2)} tokens)
            </p>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default ProtocolAllocationManager;
