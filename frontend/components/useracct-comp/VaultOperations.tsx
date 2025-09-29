"use client";

import React, { useState } from 'react';
import { useUserVault } from '../../hooks/useUserVault';
import { DollarSign, ArrowDown, ArrowUp, Coins, ArrowLeftRight } from 'lucide-react';

interface VaultOperationsProps {
  vaultAddress: `0x${string}`;
  vaultIndex: number;
}

const VaultOperations: React.FC<VaultOperationsProps> = ({ vaultAddress, vaultIndex }) => {
  const {
    name,
    symbol,
    userBalance,
    userValue,
    maxDeposit,
    maxWithdraw,
    maxMint,
    maxRedeem,
    deposit,
    withdraw,
    mint,
    redeem,
    isPending
  } = useUserVault(vaultAddress);

  const [operation, setOperation] = useState<'deposit' | 'withdraw' | 'mint' | 'redeem'>('deposit');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');

  const handleOperation = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      let txHash: string;
      
      switch (operation) {
        case 'deposit':
          txHash = await deposit(amount);
          break;
        case 'withdraw':
          txHash = await withdraw(amount);
          break;
        case 'mint':
          if (!receiver) {
            alert('Please enter receiver address for minting');
            return;
          }
          txHash = await mint(amount);
          break;
        case 'redeem':
          if (!receiver) {
            alert('Please enter receiver address for redeeming');
            return;
          }
          txHash = await redeem(amount);
          break;
        default:
          throw new Error('Invalid operation');
      }
      
      setAmount('');
      setReceiver('');
      alert(`Transaction submitted successfully! Hash: ${txHash}`);
    } catch (error) {
      console.error('Error performing operation:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getMaxAmount = () => {
    switch (operation) {
      case 'deposit':
        return maxDeposit;
      case 'withdraw':
        return maxWithdraw;
      case 'mint':
        return maxMint;
      case 'redeem':
        return maxRedeem;
      default:
        return '0.00';
    }
  };

  const getOperationDescription = () => {
    switch (operation) {
      case 'deposit':
        return 'Deposit assets into the vault to receive shares';
      case 'withdraw':
        return 'Withdraw assets from the vault by burning shares';
      case 'mint':
        return 'Mint new shares for a specific receiver';
      case 'redeem':
        return 'Redeem shares for underlying assets';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#213046] flex items-center mb-2">
          <DollarSign className="mr-2 w-5 h-5 text-[#49ABFE]" />
          Vault Operations - {name} #{vaultIndex + 1}
        </h3>
        <p className="text-gray-600">Manage your vault deposits and withdrawals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Operation Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Select Operation</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOperation('deposit')}
              className={`p-3 rounded-lg border-2 transition-all ${
                operation === 'deposit'
                  ? 'border-[#49ABFE] bg-blue-50 text-[#49ABFE]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900'
              }`}
            >
              <div className="text-center">
                <ArrowDown className="w-6 h-6 mb-1 mx-auto" />
                <div className="font-medium">Deposit</div>
              </div>
            </button>
            <button
              onClick={() => setOperation('withdraw')}
              className={`p-3 rounded-lg border-2 transition-all ${
                operation === 'withdraw'
                  ? 'border-[#49ABFE] bg-blue-50 text-[#49ABFE]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900'
              }`}
            >
              <div className="text-center">
                <ArrowUp className="w-6 h-6 mb-1 mx-auto" />
                <div className="font-medium">Withdraw</div>
              </div>
            </button>
            <button
              onClick={() => setOperation('mint')}
              className={`p-3 rounded-lg border-2 transition-all ${
                operation === 'mint'
                  ? 'border-[#49ABFE] bg-blue-50 text-[#49ABFE]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900'
              }`}
            >
              <div className="text-center">
                <Coins className="w-6 h-6 mb-1 mx-auto" />
                <div className="font-medium">Mint</div>
              </div>
            </button>
            <button
              onClick={() => setOperation('redeem')}
              className={`p-3 rounded-lg border-2 transition-all ${
                operation === 'redeem'
                  ? 'border-[#49ABFE] bg-blue-50 text-[#49ABFE]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900'
              }`}
            >
              <div className="text-center">
                <ArrowLeftRight className="w-6 h-6 mb-1 mx-auto" />
                <div className="font-medium">Redeem</div>
              </div>
            </button>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{getOperationDescription()}</p>
          </div>
        </div>

        {/* Operation Form */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Operation Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <button
                onClick={() => setAmount(getMaxAmount())}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Max
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max: {getMaxAmount()} {operation === 'deposit' || operation === 'withdraw' ? 'assets' : 'shares'}
            </p>
          </div>

          {(operation === 'mint' || operation === 'redeem') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receiver Address
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                placeholder="0x..."
              />
            </div>
          )}

          <button
            onClick={handleOperation}
            disabled={isPending || !amount || parseFloat(amount) <= 0}
            className="w-full bg-[#49ABFE] text-white py-2 px-4 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Processing...' : `${operation.charAt(0).toUpperCase() + operation.slice(1)}`}
          </button>
        </div>
      </div>

      {/* Current Balance */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-semibold text-gray-900 mb-3">Your Vault Position</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-700 font-medium">Shares:</span>
            <span className="ml-2 font-bold text-gray-900">{userBalance} {symbol}</span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Value:</span>
            <span className="ml-2 font-bold text-gray-900">${userValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultOperations;
