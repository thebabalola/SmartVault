"use client";

import React, { useState } from 'react';
import { useUserVault } from '../../hooks/useUserVault';
import { ArrowUp, Users, Check } from 'lucide-react';

interface ShareTransferProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
}

const ShareTransfer: React.FC<ShareTransferProps> = ({ vaultAddress }) => {
  const {
    symbol,
    userBalance,
    transferShares,
    transferFromShares,
    approveShares,
    isPending
  } = useUserVault(vaultAddress);

  const [transferType, setTransferType] = useState<'transfer' | 'transferFrom' | 'approve'>('transfer');
  const [transferData, setTransferData] = useState({
    to: '',
    from: '',
    amount: '',
    spender: ''
  });

  const handleTransfer = async () => {
    if (!transferData.to || !transferData.amount || parseFloat(transferData.amount) <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      switch (transferType) {
        case 'transfer':
          // In VaultFactory mode, this withdraws from your vault
          const confirmTransfer = confirm(
            `This will withdraw ${transferData.amount} ${symbol} from your vault. ` +
            `The recipient (${transferData.to}) will need to deposit this amount to their own vault. ` +
            `Continue?`
          );
          
          if (!confirmTransfer) return;
          
          await transferShares(transferData.to, transferData.amount);
          alert('Amount withdrawn from your vault. Recipient can now deposit to their vault.');
          break;
        case 'transferFrom':
          if (!transferData.from) {
            alert('Please enter sender address');
            return;
          }
          await transferFromShares(transferData.from, transferData.to, transferData.amount);
          break;
        case 'approve':
          if (!transferData.spender) {
            alert('Please enter spender address');
            return;
          }
          await approveShares(transferData.spender, transferData.amount);
          break;
      }
      setTransferData({ to: '', from: '', amount: '', spender: '' });
    } catch (error) {
      console.error('Error performing transfer:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTransferDescription = () => {
    switch (transferType) {
      case 'transfer':
        return 'Withdraw from your vault (recipient needs to deposit to their vault)';
      case 'transferFrom':
        return 'Not supported in VaultFactory mode - use direct transfer instead';
      case 'approve':
        return 'Not supported in VaultFactory mode - vaults are managed directly';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Transfer Type Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Transfer Type</h4>
          <div className="space-y-2">
            <button
              onClick={() => setTransferType('transfer')}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                transferType === 'transfer'
                  ? 'border-[#49ABFE] bg-blue-50 text-[#49ABFE]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <ArrowUp className={`w-6 h-6 mr-3 ${transferType === 'transfer' ? 'text-[#49ABFE]' : 'text-gray-600'}`} />
                <div>
                  <div className="font-medium">Direct Transfer</div>
                  <div className={`text-sm ${transferType === 'transfer' ? 'text-blue-600' : 'text-gray-500'}`}>Transfer your own shares</div>
                </div>
              </div>
            </button>
            <button
              disabled
              className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-left cursor-not-allowed opacity-60"
            >
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-500">Transfer From</div>
                  <div className="text-sm text-gray-400">Not supported in VaultFactory mode</div>
                </div>
              </div>
            </button>
            <button
              disabled
              className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-left cursor-not-allowed opacity-60"
            >
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-500">Approve</div>
                  <div className="text-sm text-gray-400">Not supported in VaultFactory mode</div>
                </div>
              </div>
            </button>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{getTransferDescription()}</p>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Transfer Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({symbol})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <button
                onClick={() => setTransferData(prev => ({ ...prev, amount: userBalance }))}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Max
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: {userBalance} {symbol}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {transferType === 'transfer' ? 'To Address' : 
               transferType === 'transferFrom' ? 'To Address' : 'Spender Address'}
            </label>
            <input
              type="text"
              value={transferType === 'approve' ? transferData.spender : transferData.to}
              onChange={(e) => setTransferData(prev => ({ 
                ...prev, 
                [transferType === 'approve' ? 'spender' : 'to']: e.target.value 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
              placeholder="0x..."
            />
          </div>

          {transferType === 'transferFrom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Address
              </label>
              <input
                type="text"
                value={transferData.from}
                onChange={(e) => setTransferData(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                placeholder="0x..."
              />
            </div>
          )}

          <button
            onClick={handleTransfer}
            disabled={isPending || !transferData.amount || parseFloat(transferData.amount) <= 0}
            className="w-full bg-[#49ABFE] text-white py-2 px-4 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Processing...' : 
             transferType === 'transfer' ? 'Transfer Shares' :
             transferType === 'transferFrom' ? 'Transfer From' : 'Approve Shares'}
          </button>
        </div>
      </div>

      {/* Current Balance */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-semibold text-gray-900 mb-3">Your Share Balance</h5>
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900">{userBalance}</span>
          <span className="text-lg text-gray-700 font-medium ml-2">{symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default ShareTransfer;
