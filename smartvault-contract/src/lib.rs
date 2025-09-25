#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

use alloc::{vec::Vec, string::String};
use stylus_sdk::{
    alloy_primitives::{U256, Address},
    prelude::*,
};

sol_storage! {
    #[entrypoint]
    pub struct SmartVault {
        /// Underlying asset (ERC-20 token)
        address asset;
        /// Vault admin
        address admin;
        /// Total assets in vault
        uint256 total_assets;
        /// Total shares issued
        uint256 total_supply;
        /// Whether vault is paused
        bool paused;
        /// Fee percentage (basis points)
        uint256 fee_percentage;
        /// Fee recipient
        address fee_recipient;
        /// Last harvest timestamp
        uint256 last_harvest;
        /// Harvest interval (seconds)
        uint256 harvest_interval;
    }
}

#[public]
impl SmartVault {
    /// Initializes the vault
    pub fn initialize(
        &mut self,
        asset: Address,
        admin: Address,
    ) -> Result<Address, Vec<u8>> {
        if asset == Address::ZERO || admin == Address::ZERO {
            return Err("Invalid address".into());
        }

        self.asset.set(asset);
        self.admin.set(admin);
        self.paused.set(false);
        self.fee_percentage.set(U256::from(100)); // 1% default fee
        self.fee_recipient.set(admin);
        self.harvest_interval.set(U256::from(86400)); // 24 hours

        Ok(asset)
    }

    /// Returns the underlying asset
    pub fn asset(&self) -> Result<Address, Vec<u8>> {
        Ok(self.asset.get())
    }

    /// Returns the total assets managed by the vault
    pub fn total_assets(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_assets.get())
    }

    /// Converts assets to shares
    pub fn convert_to_shares(&self, assets: U256) -> Result<U256, Vec<u8>> {
        let total_supply = self.total_supply.get();
        if total_supply == U256::ZERO {
            return Ok(assets);
        }
        let total_assets = self.total_assets.get();
        if total_assets == U256::ZERO {
            return Ok(U256::ZERO);
        }
        Ok((assets * total_supply) / total_assets)
    }

    /// Converts shares to assets
    pub fn convert_to_assets(&self, shares: U256) -> Result<U256, Vec<u8>> {
        let total_supply = self.total_supply.get();
        if total_supply == U256::ZERO {
            return Ok(U256::ZERO);
        }
        let total_assets = self.total_assets.get();
        Ok((shares * total_assets) / total_supply)
    }

    /// Deposits assets and mints shares
    #[payable]
    pub fn deposit(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if amount == U256::ZERO {
            return Err("Invalid amount".into());
        }

        // Calculate shares to mint
        let shares = self.convert_to_shares(amount)?;
        
        // Update total supply and assets
        self.total_supply.set(self.total_supply.get() + shares);
        self.total_assets.set(self.total_assets.get() + amount);

        Ok(shares)
    }

    /// Withdraws assets by burning shares
    pub fn withdraw(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if amount == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let shares = self.convert_to_shares(amount)?;

        // Update total supply and assets
        self.total_supply.set(self.total_supply.get() - shares);
        self.total_assets.set(self.total_assets.get() - amount);

        Ok(shares)
    }

    /// Mints shares for assets
    pub fn mint(&mut self, shares: U256, _receiver: Address) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if shares == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let assets = self.convert_to_assets(shares)?;

        // Update total supply and assets
        self.total_supply.set(self.total_supply.get() + shares);
        self.total_assets.set(self.total_assets.get() + assets);

        Ok(assets)
    }

    /// Redeems shares for assets
    pub fn redeem(&mut self, shares: U256, _receiver: Address, _owner: Address) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if shares == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let assets = self.convert_to_assets(shares)?;

        // Update total supply and assets
        self.total_supply.set(self.total_supply.get() - shares);
        self.total_assets.set(self.total_assets.get() - assets);

        Ok(assets)
    }

    // Admin Functions

    /// Pauses the vault
    pub fn pause(&mut self) -> Result<bool, Vec<u8>> {
        if self.vm().msg_sender() != self.admin.get() {
            return Err("Unauthorized".into());
        }
        self.paused.set(true);
        Ok(true)
    }

    /// Unpauses the vault
    pub fn unpause(&mut self) -> Result<bool, Vec<u8>> {
        if self.vm().msg_sender() != self.admin.get() {
            return Err("Unauthorized".into());
        }
        self.paused.set(false);
        Ok(true)
    }

    /// Harvests yield from all strategies
    pub fn harvest(&mut self) -> Result<U256, Vec<u8>> {
        if self.vm().msg_sender() != self.admin.get() {
            return Err("Unauthorized".into());
        }

        let current_time = U256::from(self.vm().block_timestamp());
        let last_harvest = self.last_harvest.get();
        let harvest_interval = self.harvest_interval.get();

        if current_time < last_harvest + harvest_interval {
            return Err("Too early to harvest".into());
        }

        // Simulate yield generation (0.1% of total assets)
        let yield_amount = self.total_assets.get() / U256::from(1000);
        self.total_assets.set(self.total_assets.get() + yield_amount);
        self.last_harvest.set(current_time);

        Ok(yield_amount)
    }

    /// Sets the fee percentage
    pub fn set_fee_percentage(&mut self, fee: U256) -> Result<bool, Vec<u8>> {
        if self.vm().msg_sender() != self.admin.get() {
            return Err("Unauthorized".into());
        }

        if fee > U256::from(1000) { // Max 10%
            return Err("Invalid fee".into());
        }

        self.fee_percentage.set(fee);
        Ok(true)
    }

    /// Sets the fee recipient
    pub fn set_fee_recipient(&mut self, recipient: Address) -> Result<bool, Vec<u8>> {
        if self.vm().msg_sender() != self.admin.get() {
            return Err("Unauthorized".into());
        }

        if recipient == Address::ZERO {
            return Err("Invalid recipient".into());
        }

        self.fee_recipient.set(recipient);
        Ok(true)
    }

    /// Returns vault information
    pub fn get_vault_info(&self) -> Result<(Address, Address, U256, U256, bool), Vec<u8>> {
        Ok((
            self.asset.get(),
            self.admin.get(),
            self.total_assets.get(),
            self.total_supply.get(),
            self.paused.get(),
        ))
    }

    // ERC-20 Functions for Shares

    /// Returns the name of the share token
    pub fn name(&self) -> Result<String, Vec<u8>> {
        Ok("Smart Vault Shares".into())
    }

    /// Returns the symbol of the share token
    pub fn symbol(&self) -> Result<String, Vec<u8>> {
        Ok("SVS".into())
    }

    /// Returns the decimals of the share token
    pub fn decimals(&self) -> Result<u8, Vec<u8>> {
        Ok(18)
    }

    /// Returns the total supply of shares
    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_supply.get())
    }

    /// Returns the balance of shares for an account (simplified - always returns 0)
    pub fn balance_of(&self, _account: Address) -> Result<U256, Vec<u8>> {
        Ok(U256::ZERO)
    }

    /// Transfers shares (simplified - always returns true)
    pub fn transfer(&mut self, _to: Address, _amount: U256) -> Result<bool, Vec<u8>> {
        Ok(true)
    }

    /// Transfers shares from one account to another (simplified - always returns true)
    pub fn transfer_from(&mut self, _from: Address, _to: Address, _amount: U256) -> Result<bool, Vec<u8>> {
        Ok(true)
    }

    /// Approves spender to spend shares (simplified - always returns true)
    pub fn approve(&mut self, _spender: Address, _amount: U256) -> Result<bool, Vec<u8>> {
        Ok(true)
    }

    /// Returns allowance for spender (simplified - always returns 0)
    pub fn allowance(&self, _owner: Address, _spender: Address) -> Result<U256, Vec<u8>> {
        Ok(U256::ZERO)
    }
}