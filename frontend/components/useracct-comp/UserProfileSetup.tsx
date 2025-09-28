"use client";

import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface UserProfileSetupProps {
  userAddress: string;
  onProfileComplete: (username: string, bio: string) => void;
  isConnected: boolean;
}

const UserProfileSetup: React.FC<UserProfileSetupProps> = ({
  userAddress,
  onProfileComplete,
  isConnected
}) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (username.length === 0) {
      alert('Please enter a username');
      return;
    }

    if (username.length > 20) {
      alert('Username must be 20 characters or less');
      return;
    }

    if (bio.length > 30) {
      alert('Bio must be 30 characters or less');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // This will be handled by the parent component
      await onProfileComplete(username, bio);
    } catch (error) {
      console.error('Error setting up profile:', error);
      alert('Error setting up profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (addr: string | undefined): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#49ABFE] to-[#9DCCED] flex items-center justify-center text-4xl">
              🏦
            </div>
            <h1 className="text-2xl font-bold text-[#213046] mb-2">Welcome to Smart Vault</h1>
            <p className="text-gray-600">Set up your profile to get started</p>
          </div>

          {/* Wallet Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Connected Wallet</p>
            <p className="text-sm font-mono text-gray-800">{formatAddress(userAddress)}</p>
          </div>

          {/* Profile Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username (max 20 chars)"
                maxLength={20}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                disabled={!isConnected || isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {username.length}/20 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself (max 30 chars)"
                maxLength={30}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 transition-all resize-none placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                disabled={!isConnected || isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {bio.length}/30 characters
              </p>
            </div>

            {!isConnected && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium text-sm">
                  Please connect your wallet to continue
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isConnected || isSubmitting || username.length === 0}
              className="w-full bg-[#49ABFE] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up profile...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={18} />
                  Complete Setup
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your profile will be stored on-chain</li>
              <li>• You&apos;ll be able to create Smart Vaults</li>
              <li>• Start earning yield automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetup;
