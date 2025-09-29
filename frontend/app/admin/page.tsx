"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import { Building2, DollarSign, Users, TrendingUp, BarChart3, Link, Shield, User } from 'lucide-react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useVaultFactory } from "../../hooks/useVaultFactory";
import { VAULT_FACTORY_ADDRESS } from "../../constants/contractAddresses";
const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

const AdminDashboard = () => {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, setIsPending] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false); // Removed - admin access restriction disabled
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  // VaultFactory integration
  const {
    totalVaults,
    protocolAddresses: contractProtocolAddresses,
    deployerAdmin,
    adminCount,
    isCurrentUserAdmin,
    setAaveAddress,
    setCompoundAddress,
    setUniswapAddress,
    setWethAddress,
    addAdmin,
    removeAdmin,
    isPending: contractPending
  } = useVaultFactory();

  const [newAddresses, setNewAddresses] = useState({
    aave: '',
    compound: '',
    uniswap: '',
    weth: '',
    newAdmin: '',
    removeAdmin: ''
  });

  // Admin stats using real contract data
  const adminStats = {
    totalVaults: totalVaults || 0,
    totalAssets: 0, // This would come from UserVault contracts
    totalUsers: 0, // This would be calculated from unique vault owners
    totalYield: 0, // This would be calculated from all vaults
    aaveAllocation: 0,
    compoundAllocation: 0,
    uniswapAllocation: 0
  };


  useEffect(() => {
    // Check if connected address is admin
    const checkAdminStatus = async () => {
      if (!isConnected || !address) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        // Check if admin data is loaded from contract
        if (isCurrentUserAdmin === undefined) {
          // Still loading admin status from contract
          return;
        }

        // Admin status is now available via isCurrentUserAdmin from useVaultFactory
        // No need to store in local state since access restriction is disabled
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isConnected, address, isCurrentUserAdmin]);

  const handleProtocolAddressUpdate = async (protocol: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const address = newAddresses[protocol as keyof typeof newAddresses];
    if (!address || address.length !== 42) {
      alert('Please enter a valid address');
      return;
    }

    try {
      setIsPending(true);
      
      // Call the appropriate contract function based on protocol
      switch (protocol) {
        case 'aave':
          await setAaveAddress(address);
          break;
        case 'compound':
          await setCompoundAddress(address);
          break;
        case 'uniswap':
          await setUniswapAddress(address);
          break;
        case 'weth':
          await setWethAddress(address);
          break;
        default:
          throw new Error('Unknown protocol');
      }
      
      // Clear the input
      setNewAddresses(prev => ({ ...prev, [protocol]: '' }));
      alert(`${protocol} address updated successfully!`);
    } catch (error) {
      console.error('Error updating protocol address:', error);
      alert(`Error updating ${protocol} address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const adminAddress = newAddresses.newAdmin;
    if (!adminAddress || adminAddress.length !== 42) {
      alert('Please enter a valid admin address');
      return;
    }

    try {
      setIsPending(true);
      await addAdmin(adminAddress);
      
      // Clear the input
      setNewAddresses(prev => ({ ...prev, newAdmin: '' }));
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert(`Error adding admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const adminAddress = newAddresses.removeAdmin;
    if (!adminAddress || adminAddress.length !== 42) {
      alert('Please enter a valid admin address');
      return;
    }

    try {
      setIsPending(true);
      await removeAdmin(adminAddress);
      
      // Clear the input
      setNewAddresses(prev => ({ ...prev, removeAdmin: '' }));
      alert('Admin removed successfully!');
    } catch (error) {
      console.error('Error removing admin:', error);
      alert(`Error removing admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPending(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: { 
    id: string; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    isActive: boolean; 
    onClick: (id: string) => void 
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
      }`}
    >
      <Icon className="mr-2 w-4 h-4" />
      {label}
    </button>
  );

  // Show loading state while checking admin status
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49ABFE] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Admin access restriction removed - anyone can view the admin page
  // Only admin functions will be restricted based on isCurrentUserAdmin

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-24">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#213046] mb-2 flex items-center">
            <span className="mr-3">👑</span>
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage Smart Vault Factory and Protocol Settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 p-2 sm:p-3 bg-white rounded-2xl shadow-sm">
          <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="protocols" label="Protocols" icon={Link} isActive={activeTab === 'protocols'} onClick={setActiveTab} />
          <TabButton id="admins" label="Admins" icon={User} isActive={activeTab === 'admins'} onClick={setActiveTab} />
          <TabButton id="vaults" label="Vaults" icon={Building2} isActive={activeTab === 'vaults'} onClick={setActiveTab} />
          <TabButton id="users" label="Users" icon={Users} isActive={activeTab === 'users'} onClick={setActiveTab} />
          <TabButton id="settings" label="Settings" icon={Shield} isActive={activeTab === 'settings'} onClick={setActiveTab} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Vaults</p>
                    <p className="text-3xl font-bold text-[#213046]">{adminStats.totalVaults}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assets</p>
                    <p className="text-3xl font-bold text-[#213046]">${adminStats.totalAssets}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-[#213046]">{adminStats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Yield</p>
                    <p className="text-3xl font-bold text-green-600">${adminStats.totalYield}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#213046] mb-6">Protocol Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <div>
                      <span className="font-semibold text-gray-800">Aave (Lending)</span>
                      <p className="text-xs text-gray-700 font-mono font-medium">
                        {contractProtocolAddresses.aave === "0x0000000000000000000000000000000000000000" 
                          ? "Not configured" 
                          : `${contractProtocolAddresses.aave.slice(0, 6)}...${contractProtocolAddresses.aave.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contractProtocolAddresses.aave === "0x0000000000000000000000000000000000000000" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {contractProtocolAddresses.aave === "0x0000000000000000000000000000000000000000" ? "Not Set" : "Active"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <div>
                      <span className="font-semibold text-gray-800">Compound (Lending)</span>
                      <p className="text-xs text-gray-700 font-mono font-medium">
                        {contractProtocolAddresses.compound === "0x0000000000000000000000000000000000000000" 
                          ? "Not configured" 
                          : `${contractProtocolAddresses.compound.slice(0, 6)}...${contractProtocolAddresses.compound.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contractProtocolAddresses.compound === "0x0000000000000000000000000000000000000000" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {contractProtocolAddresses.compound === "0x0000000000000000000000000000000000000000" ? "Not Set" : "Active"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                    <div>
                      <span className="font-semibold text-gray-800">Uniswap (Liquidity Pools)</span>
                      <p className="text-xs text-gray-700 font-mono font-medium">
                        {contractProtocolAddresses.uniswap === "0x0000000000000000000000000000000000000000" 
                          ? "Not configured" 
                          : `${contractProtocolAddresses.uniswap.slice(0, 6)}...${contractProtocolAddresses.uniswap.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contractProtocolAddresses.uniswap === "0x0000000000000000000000000000000000000000" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {contractProtocolAddresses.uniswap === "0x0000000000000000000000000000000000000000" ? "Not Set" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Protocols Tab */}
        {activeTab === 'protocols' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#213046] mb-6">Protocol Address Management</h2>
              <div className="space-y-6">
                {Object.entries(contractProtocolAddresses).map(([protocol, address]) => (
                  <div key={protocol} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 capitalize">{protocol} Protocol</h3>
                      <div className="text-right">
                        <span className="text-sm text-gray-600 font-medium">Current:</span>
                        <code className="block text-xs bg-gray-200 px-2 py-1 rounded mt-1 text-gray-800 font-medium">
                          {address === "0x0000000000000000000000000000000000000000" ? "Not set" : `${address.slice(0, 6)}...${address.slice(-4)}`}
                        </code>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder={`Enter ${protocol} address (0x...)`}
                        value={newAddresses[protocol as keyof typeof newAddresses]}
                        onChange={(e) => setNewAddresses(prev => ({
                          ...prev,
                          [protocol]: e.target.value
                        }))}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#49ABFE] focus:ring-2 focus:ring-[#49ABFE]/10 placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
                        disabled={!isConnected}
                      />
                      <button
                        onClick={() => handleProtocolAddressUpdate(protocol)}
                        disabled={isPending || contractPending || !isConnected}
                        className="bg-[#49ABFE] text-white px-6 py-2 rounded-lg hover:bg-[#1a5ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending || contractPending ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#213046] mb-6">Admin Management</h2>
              
              {/* Current Admin Info */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-[#213046] mb-4">Current Admin Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Deployer Admin</p>
                    <p className="font-mono text-sm text-gray-800 font-medium">{deployerAdmin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Admins</p>
                    <p className="text-lg font-semibold text-[#49ABFE]">{adminCount}</p>
                  </div>
                </div>
              </div>

              {/* Add Admin */}
              <div className="mb-8 p-4 bg-green-50 rounded-xl">
                <h3 className="text-lg font-semibold text-[#213046] mb-4">Add New Admin</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Address
                    </label>
                    <input
                      type="text"
                      value={newAddresses.newAdmin || ''}
                      onChange={(e) => setNewAddresses(prev => ({ ...prev, newAdmin: e.target.value }))}
                      placeholder="0x..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-medium"
                    />
                  </div>
                  <button
                    onClick={() => handleAddAdmin()}
                    disabled={isPending || !newAddresses.newAdmin}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Adding...' : 'Add Admin'}
                  </button>
                </div>
              </div>

              {/* Remove Admin */}
              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="text-lg font-semibold text-[#213046] mb-4">Remove Admin</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Address to Remove
                    </label>
                    <input
                      type="text"
                      value={newAddresses.removeAdmin || ''}
                      onChange={(e) => setNewAddresses(prev => ({ ...prev, removeAdmin: e.target.value }))}
                      placeholder="0x..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABFE] focus:border-transparent text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-medium"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin()}
                    disabled={isPending || !newAddresses.removeAdmin}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Removing...' : 'Remove Admin'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vaults Tab */}
        {activeTab === 'vaults' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#213046] mb-6">Recent Vaults</h2>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-600">
                  <p className="font-medium">No vaults created yet</p>
                  <p className="text-sm text-gray-500">Vaults will appear here once users start creating them</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#213046] mb-6">User Management</h2>
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
                <p className="text-gray-600">User management features coming soon...</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#213046] mb-6">Admin Settings</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Factory Contract</h3>
                  <p className="text-sm text-gray-600 mb-2">VaultFactory Address:</p>
                  <code className="block bg-gray-200 px-3 py-2 rounded text-sm font-mono text-gray-800 font-medium">{VAULT_FACTORY_ADDRESS}</code>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Network</h3>
                  <p className="text-sm text-gray-600">Arbitrum Sepolia Testnet (Chain ID: {ARBITRUM_SEPOLIA_CHAIN_ID})</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer scrollToSection={() => {}} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
