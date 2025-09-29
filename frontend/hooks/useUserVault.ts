"use client";

import { useReadContract, useWriteContract, useAccount } from "wagmi";
import VaultFactoryABI from "../constants/ABIs/smartvault.json";
import { formatUnits, parseUnits } from "viem";
import { VAULT_FACTORY_ADDRESS } from "../constants/contractAddresses";

export const useUserVault = (vaultAddress: `0x${string}` | undefined) => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, data: writeData } = useWriteContract();

  // Vault Information
  const { data: vaultOwner } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getVaultOwner',
    args: [vaultAddress as `0x${string}`],
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: vaultBalance } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getVaultBalance',
    args: [vaultAddress as `0x${string}`],
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Since we're using VaultFactory, we'll use static values for now
  // In a real implementation, these would come from the factory contract
  const name = "Vault";
  const symbol = "VAULT";
  const decimals = 18;
  const totalAssets = vaultBalance;
  const totalSupply = vaultBalance;
  const userBalance = vaultBalance;
  const asset = "0x0000000000000000000000000000000000000000" as `0x${string}`;

  // Protocol Allocations - using static values for now
  const aaveAllocation = BigInt(0);
  const compoundAllocation = BigInt(0);
  const uniswapAllocation = BigInt(0);

  // Additional Read Functions - using static values for now
  const isPaused = false;
  const maxDeposit = BigInt(0);
  const maxWithdraw = BigInt(0);
  const maxMint = BigInt(0);
  const maxRedeem = BigInt(0);

  // Write Functions
  const deposit = async (amount: string): Promise<string> => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return new Promise((resolve, reject) => {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'depositToVault',
        args: [vaultAddress as `0x${string}`, amountWei],
      }, {
        onSuccess: (hash) => resolve(hash),
        onError: (error) => reject(error)
      });
    });
  };

  const withdraw = async (amount: string): Promise<string> => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return new Promise((resolve, reject) => {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'withdrawFromVault',
        args: [vaultAddress as `0x${string}`, amountWei],
      }, {
        onSuccess: (hash) => resolve(hash),
        onError: (error) => reject(error)
      });
    });
  };

  const mint = async (shares: string): Promise<string> => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const sharesWei = parseUnits(shares, decimalsValue);

    // Mint is not directly supported in VaultFactory, using deposit instead
    return new Promise((resolve, reject) => {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'depositToVault',
        args: [vaultAddress as `0x${string}`, sharesWei],
      }, {
        onSuccess: (hash) => resolve(hash),
        onError: (error) => reject(error)
      });
    });
  };

  const redeem = async (shares: string): Promise<string> => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const sharesWei = parseUnits(shares, decimalsValue);

    // Redeem is not directly supported in VaultFactory, using withdraw instead
    return new Promise((resolve, reject) => {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'withdrawFromVault',
        args: [vaultAddress as `0x${string}`, sharesWei],
      }, {
        onSuccess: (hash) => resolve(hash),
        onError: (error) => reject(error)
      });
    });
  };

  // DeFi Strategy Functions - Not available in VaultFactory
  const deployToAave = async (amount: string) => {
    throw new Error("DeFi strategy functions not available in VaultFactory mode");
  };

  const deployToCompound = async (amount: string) => {
    throw new Error("DeFi strategy functions not available in VaultFactory mode");
  };

  const harvestFromProtocol = async (protocol: string) => {
    throw new Error("DeFi strategy functions not available in VaultFactory mode");
  };

  // Vault Management Functions - Not available in VaultFactory
  const setVaultName = async (newName: string) => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  const setVaultSymbol = async (newSymbol: string) => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  const setVaultDecimals = async (newDecimals: number) => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  const setProtocolAllocation = async (protocol: string, amount: string) => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  const pauseVault = async () => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  const unpauseVault = async () => {
    throw new Error("Vault management functions not available in VaultFactory mode");
  };

  // Share Transfer Functions - Implemented as vault balance transfers
  const transferShares = async (to: string, amount: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    // In VaultFactory mode, we simulate share transfer by withdrawing from current vault
    // and depositing to the recipient's vault (if they have one)
    // For now, we'll just withdraw the amount - the recipient would need to deposit separately
    const hash = await writeContract({
      address: VAULT_FACTORY_ADDRESS,
      abi: VaultFactoryABI,
      functionName: 'withdrawFromVault',
      args: [vaultAddress as `0x${string}`, amountWei],
    });

    return hash;
  };

  const transferFromShares = async (from: string, to: string, amount: string) => {
    throw new Error("Transfer from not supported in VaultFactory mode - use direct transfer instead");
  };

  const approveShares = async (spender: string, amount: string) => {
    throw new Error("Approval not supported in VaultFactory mode - vaults are managed directly");
  };

  // Helper Functions
  const formatVaultValue = (value: unknown) => {
    if (!value || typeof value !== 'bigint' || !decimals) return "0.00";
    return formatUnits(value, Number(decimals));
  };

  const calculateAPY = () => {
    // This would need to be calculated based on yield data
    // For now, return a placeholder
    return "5.2%";
  };

  const calculateUserValue = () => {
    if (!userBalance || !totalAssets || !totalSupply || typeof userBalance !== 'bigint' || typeof totalAssets !== 'bigint' || typeof totalSupply !== 'bigint') return "0.00";
    
    const userShares = Number(formatUnits(userBalance, Number(decimals) || 18));
    const totalShares = Number(formatUnits(totalSupply, Number(decimals) || 18));
    const totalValue = Number(formatUnits(totalAssets, Number(decimals) || 18));
    
    if (totalShares === 0) return "0.00";
    
    const userValue = (userShares / totalShares) * totalValue;
    return userValue.toFixed(2);
  };

  return {
    // Vault Information
    vaultInfo: { 
      owner: vaultOwner ? vaultOwner.toString() : null, 
      balance: vaultBalance ? vaultBalance.toString() : null 
    },
    name: "Vault",
    symbol: "VAULT",
    decimals: 18,
    
    // Financial Data
    totalAssets: formatVaultValue(vaultBalance),
    totalSupply: formatVaultValue(vaultBalance),
    userBalance: formatVaultValue(vaultBalance),
    userValue: formatVaultValue(vaultBalance),
    asset: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    
    // Protocol Allocations
    aaveAllocation: formatVaultValue(aaveAllocation),
    compoundAllocation: formatVaultValue(compoundAllocation),
    uniswapAllocation: formatVaultValue(uniswapAllocation),
    
    // Vault Status
    isPaused: isPaused || false,
    
    // Limits
    maxDeposit: formatVaultValue(maxDeposit),
    maxWithdraw: formatVaultValue(maxWithdraw),
    maxMint: formatVaultValue(maxMint),
    maxRedeem: formatVaultValue(maxRedeem),
    
    // Calculated Values
    apy: calculateAPY(),
    
    // Basic Write Functions
    deposit,
    withdraw,
    mint,
    redeem,
    deployToAave,
    deployToCompound,
    harvestFromProtocol,
    
    // Vault Management Functions
    setVaultName,
    setVaultSymbol,
    setVaultDecimals,
    setProtocolAllocation,
    pauseVault,
    unpauseVault,
    
    // Share Transfer Functions
    transferShares,
    transferFromShares,
    approveShares,
    
    // State
    isPending,
    isConnected,
  };
};
