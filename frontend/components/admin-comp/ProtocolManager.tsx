"use client";

import React, { useState } from 'react';

interface ProtocolManagerProps {
  protocolAddresses: Record<string, string>;
  onAddressUpdate: (protocol: string, address: string) => void;
}

const ProtocolManager: React.FC<ProtocolManagerProps> = ({
  protocolAddresses,
  onAddressUpdate
}) => {
  const [isPending, setIsPending] = useState(false);
  const [newAddresses, setNewAddresses] = useState<Record<string, string>>({
    aave: '',
    compound: '',
    uniswap: '',
    weth: ''
  });

  const protocols = [
    { key: 'aave', name: 'Aave Lending Pool', icon: '🏦', description: 'Decentralized lending protocol' },
    { key: 'compound', name: 'Compound Comptroller', icon: '🔄', description: 'Money market protocol' },
    { key: 'uniswap', name: 'Uniswap Router', icon: '🔄', description: 'Decentralized exchange' },
    { key: 'weth', name: 'WETH Address', icon: '💎', description: 'Wrapped Ethereum token' }
  ];

  const handleAddressUpdate = async (protocol: string) => {
    const address = newAddresses[protocol];
    if (!address || address.length !== 42) {
      alert('Please enter a valid address');
      return;
    }

    try {
      setIsPending(true);
      onAddressUpdate(protocol, address);
      setNewAddresses(prev => ({ ...prev, [protocol]: '' }));
    } catch (error) {
      console.error('Error updating protocol address:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#213046] mb-6 flex items-center">
          <span className="mr-3">🔗</span>
          Protocol Address Management
        </h2>
        
        <div className="space-y-6">
          {protocols.map((protocol) => (
            <div key={protocol.key} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{protocol.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{protocol.name}</h3>
                    <p className="text-sm text-gray-600">{protocol.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Current Address</p>
                  <code className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                    {protocolAddresses[protocol.key] || 'Not set'}
                  </code>
                </div>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={`Enter ${protocol.name} address (0x...)`}
                  value={newAddresses[protocol.key]}
                  onChange={(e) => setNewAddresses(prev => ({
                    ...prev,
                    [protocol.key]: e.target.value
                  }))}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                />
                <button
                  onClick={() => handleAddressUpdate(protocol.key)}
                  disabled={isPending || !newAddresses[protocol.key]}
                  className="bg-[#49ABFE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isPending ? 'Updating...' : 'Update Address'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolManager;
