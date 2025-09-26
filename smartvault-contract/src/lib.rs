#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

// Main contract entry point

// Import modules
mod vault_factory;
mod user_vault;

#[cfg(test)]
mod tests;

// Re-export the VaultFactory as the main contract
pub use vault_factory::VaultFactory;

// The VaultFactory is now the main contract
// All functionality is implemented in the vault_factory module