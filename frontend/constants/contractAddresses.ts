// Smart Vault Contract Addresses
export const CONTRACT_ADDRESSES = {
  // VaultFactory Contract on Arbitrum Sepolia Testnet
  VAULT_FACTORY: "0x013afa35ae6860a0ff04b00ee20f3332523fca82" as `0x${string}`,
  
  // Add other contract addresses here as needed
  // USER_VAULT: "0x..." as `0x${string}`,
} as const;

// Helper function to get contract address
export const getContractAddress = (contract: keyof typeof CONTRACT_ADDRESSES) => {
  return CONTRACT_ADDRESSES[contract];
};

// Export individual addresses for convenience
export const VAULT_FACTORY_ADDRESS = CONTRACT_ADDRESSES.VAULT_FACTORY;
