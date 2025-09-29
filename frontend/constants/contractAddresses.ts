// Smart Vault Contract Addresses
export const CONTRACT_ADDRESSES = {
  // VaultFactory Contract on Arbitrum Sepolia Testnet
  VAULT_FACTORY: "0x797d8cccc849588032d4490dad4ec9e4fde09c53" as `0x${string}`,
  
  // Add other contract addresses here as needed
  // USER_VAULT: "0x..." as `0x${string}`,
} as const;

// Helper function to get contract address
export const getContractAddress = (contract: keyof typeof CONTRACT_ADDRESSES) => {
  return CONTRACT_ADDRESSES[contract];
};

// Export individual addresses for convenience
export const VAULT_FACTORY_ADDRESS = CONTRACT_ADDRESSES.VAULT_FACTORY;
