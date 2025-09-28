"use client";

import { useReadContract, useWriteContract, useAccount } from "wagmi";
// Removed unused imports: parseUnits, formatUnits
import VaultFactoryABI from "../constants/ABIs/smartvault.json";
import { VAULT_FACTORY_ADDRESS } from "../constants/contractAddresses";

export const useVaultFactory = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, data: writeData } = useWriteContract();

  // Read functions
  const { data: totalVaults } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getTotalVaults',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: userVaults, refetch: refetchUserVaults } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getUserVaults',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: aaveAddress } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getAaveAddress',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: compoundAddress } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getCompoundAddress',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: uniswapAddress } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getUniswapAddress',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: wethAddress } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getWethAddress',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: deployerAdmin } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getDeployerAdmin',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: adminCount } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getAdminCount',
    query: {
      enabled: !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: isCurrentUserAdmin } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'checkIsAdmin',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: isUserRegistered } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'isUserRegistered',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!VAULT_FACTORY_ADDRESS,
    },
  });

  const { data: userRegistrationTimestamp } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VaultFactoryABI,
    functionName: 'getUserRegistrationTimestamp',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!VAULT_FACTORY_ADDRESS && !!isUserRegistered,
    },
  });

  // Note: We'll use localStorage for username/bio since Stylus doesn't support string storage
  // The contract stores hashes for verification, but we need localStorage for display

  // Write functions
  const registerUser = async (username: string, bio: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (username.length > 20) {
      throw new Error("Username too long (max 20 characters)");
    }

    if (bio.length > 30) {
      throw new Error("Bio too long (max 30 characters)");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'registerUser',
        args: [username, bio],
      });
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const createVault = async () => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'createVault',
        args: [],
      });
    } catch (error) {
      console.error("Error creating vault:", error);
      throw error;
    }
  };

  const setAaveAddress = async (newAddress: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (newAddress.length !== 42 || !newAddress.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'setAaveAddress',
        args: [newAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Error setting Aave address:", error);
      throw error;
    }
  };

  const setCompoundAddress = async (newAddress: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (newAddress.length !== 42 || !newAddress.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'setCompoundAddress',
        args: [newAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Error setting Compound address:", error);
      throw error;
    }
  };

  const setUniswapAddress = async (newAddress: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (newAddress.length !== 42 || !newAddress.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'setUniswapAddress',
        args: [newAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Error setting Uniswap address:", error);
      throw error;
    }
  };

  const setWethAddress = async (newAddress: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (newAddress.length !== 42 || !newAddress.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'setWethAddress',
        args: [newAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Error setting WETH address:", error);
      throw error;
    }
  };

  const addAdmin = async (newAdminAddress: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (newAdminAddress.length !== 42 || !newAdminAddress.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'addAdmin',
        args: [newAdminAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      throw error;
    }
  };

  const removeAdmin = async (adminToRemove: string) => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (adminToRemove.length !== 42 || !adminToRemove.startsWith('0x')) {
      throw new Error("Invalid address format");
    }

    try {
      writeContract({
        address: VAULT_FACTORY_ADDRESS,
        abi: VaultFactoryABI,
        functionName: 'removeAdmin',
        args: [adminToRemove as `0x${string}`],
      });
    } catch (error) {
      console.error("Error removing admin:", error);
      throw error;
    }
  };

  return {
    // Contract address
    contractAddress: VAULT_FACTORY_ADDRESS,
    
    // Read data
    totalVaults: totalVaults ? Number(totalVaults) : 0,
    userVaults: userVaults as `0x${string}`[] || [],
    protocolAddresses: {
      aave: aaveAddress as `0x${string}` || "0x0000000000000000000000000000000000000000",
      compound: compoundAddress as `0x${string}` || "0x0000000000000000000000000000000000000000",
      uniswap: uniswapAddress as `0x${string}` || "0x0000000000000000000000000000000000000000",
      weth: wethAddress as `0x${string}` || "0x0000000000000000000000000000000000000000",
    },
    // Admin system
    deployerAdmin: deployerAdmin as `0x${string}` || "0x0000000000000000000000000000000000000000",
    adminCount: adminCount ? Number(adminCount) : 0,
    isCurrentUserAdmin: isCurrentUserAdmin || false,
    
    // User registration
    isUserRegistered: isUserRegistered || false,
    userRegistrationTimestamp: userRegistrationTimestamp ? Number(userRegistrationTimestamp) : 0,
    
    // Write functions
    registerUser,
    createVault,
    setAaveAddress,
    setCompoundAddress,
    setUniswapAddress,
    setWethAddress,
    addAdmin,
    removeAdmin,
    
    // State
    isConnected,
    isPending,
    writeData,
    
    // Refetch functions
    refetchUserVaults,
  };
};
