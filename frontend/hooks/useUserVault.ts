"use client";

import { useReadContract, useWriteContract, useAccount } from "wagmi";
import UserVaultABI from "../constants/ABIs/userVault.json";
import { formatUnits, parseUnits } from "viem";

export const useUserVault = (vaultAddress: `0x${string}` | undefined) => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  // Vault Information
  const { data: vaultInfo } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'getVaultInfo',
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: name } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'name',
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: symbol } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'symbol',
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: decimals } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'decimals',
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Financial Data
  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'totalAssets',
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: userBalance } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!vaultAddress && !!address,
    },
  });

  const { data: asset } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'asset',
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Protocol Allocations
  const { data: aaveAllocation } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'getProtocolAllocation',
    args: ["aave"],
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: compoundAllocation } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'getProtocolAllocation',
    args: ["compound"],
    query: {
      enabled: !!vaultAddress,
    },
  });

  const { data: uniswapAllocation } = useReadContract({
    address: vaultAddress,
    abi: UserVaultABI,
    functionName: 'getProtocolAllocation',
    args: ["uniswap"],
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Write Functions
  const deposit = async (amount: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'deposit',
      args: [amountWei],
    });
  };

  const withdraw = async (amount: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'withdraw',
      args: [amountWei],
    });
  };

  const mint = async (shares: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const sharesWei = parseUnits(shares, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'mint',
      args: [sharesWei, address as `0x${string}`],
    });
  };

  const redeem = async (shares: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const sharesWei = parseUnits(shares, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'redeem',
      args: [sharesWei, address as `0x${string}`, address as `0x${string}`],
    });
  };

  // DeFi Strategy Functions
  const deployToAave = async (amount: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'deployToAave',
      args: [amountWei],
    });
  };

  const deployToCompound = async (amount: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    const decimalsValue = decimals ? Number(decimals) : 18;
    const amountWei = parseUnits(amount, decimalsValue);

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'deployToCompound',
      args: [amountWei],
    });
  };

  const harvestFromProtocol = async (protocol: string) => {
    if (!isConnected || !vaultAddress) {
      throw new Error("Please connect your wallet first");
    }

    return writeContract({
      address: vaultAddress,
      abi: UserVaultABI,
      functionName: 'harvestFromProtocol',
      args: [protocol],
    });
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
    vaultInfo,
    name: name as string || "Vault",
    symbol: symbol as string || "VAULT",
    decimals: decimals ? Number(decimals) : 18,
    
    // Financial Data
    totalAssets: formatVaultValue(totalAssets),
    totalSupply: formatVaultValue(totalSupply),
    userBalance: formatVaultValue(userBalance),
    userValue: calculateUserValue(),
    asset: asset as `0x${string}` || "0x0000000000000000000000000000000000000000",
    
    // Protocol Allocations
    aaveAllocation: formatVaultValue(aaveAllocation),
    compoundAllocation: formatVaultValue(compoundAllocation),
    uniswapAllocation: formatVaultValue(uniswapAllocation),
    
    // Calculated Values
    apy: calculateAPY(),
    
    // Write Functions
    deposit,
    withdraw,
    mint,
    redeem,
    deployToAave,
    deployToCompound,
    harvestFromProtocol,
    
    // State
    isPending,
    isConnected,
  };
};
