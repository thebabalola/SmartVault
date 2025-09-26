use alloc::{vec::Vec, string::{String, ToString}};
use stylus_sdk::{
    alloy_primitives::{U256, Address},
    alloy_sol_types::sol,
    prelude::*,
    call::RawCall,
    function_selector,
};

sol_storage! {
    pub struct UserVault {
        /// Vault owner
        address owner;
        /// Underlying asset (USDC, USDT, ETH, etc.)
        address asset;
        /// Vault factory address (to get protocol addresses)
        address factory;
        /// Total assets in vault
        uint256 total_assets;
        /// Total shares issued
        uint256 total_supply;
        /// User's share balance
        mapping(address => uint256) balances;
        /// User's allowances
        mapping(address => mapping(address => uint256)) allowances;
        /// Vault metadata
        bytes32 username_hash;
        bytes32 bio_hash;
        uint256 created_at;
        /// Whether vault is paused
        bool paused;
        /// Vault name (configurable) - stored as hash
        bytes32 vault_name_hash;
        /// Vault symbol (configurable) - stored as hash
        bytes32 vault_symbol_hash;
        /// Vault decimals (configurable)
        uint8 vault_decimals;
        /// Username length limit (configurable)
        uint256 username_limit;
        /// Bio length limit (configurable)
        uint256 bio_limit;
        /// Whether vault is initialized
        bool initialized;
        
        /// Protocol allocations (user-defined)
        /// How much is allocated to each protocol
        mapping(string => uint256) protocol_allocations;
        /// Protocol addresses (cached from factory)
        mapping(string => address) protocol_addresses;
    }
}

sol! {
    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);
    event ProtocolAllocationChanged(string protocol, uint256 old_amount, uint256 new_amount);
    event VaultPaused(address indexed vault);
    event VaultUnpaused(address indexed vault);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ProtocolDeployed(string protocol, uint256 amount);
    event ProtocolHarvested(string protocol, uint256 rewards);
}

#[public]
impl UserVault {
    /// Initializes the vault
    pub fn initialize(
        &mut self,
        owner: Address,
        asset: Address,
        factory: Address,
        username: String,
        bio: String,
        vault_name: String,
        vault_symbol: String,
        vault_decimals: u8,
        username_limit: U256,
        bio_limit: U256,
    ) -> Result<(), Vec<u8>> {
        if owner == Address::ZERO || asset == Address::ZERO || factory == Address::ZERO {
            return Err("Invalid addresses".into());
        }

        if self.initialized.get() {
            return Err("Already initialized".into());
        }

        if username.len() > username_limit.as_limbs()[0] as usize {
            return Err("Username too long".into());
        }

        if bio.len() > bio_limit.as_limbs()[0] as usize {
            return Err("Bio too long".into());
        }

        self.owner.set(owner);
        self.asset.set(asset);
        self.factory.set(factory);
        
        // Store vault name and symbol as hashes
        let vault_name_hash = _hash_string(&vault_name).into();
        let vault_symbol_hash = _hash_string(&vault_symbol).into();
        self.vault_name_hash.set(vault_name_hash);
        self.vault_symbol_hash.set(vault_symbol_hash);
        
        self.vault_decimals.set(alloy_primitives::Uint::from(vault_decimals));
        self.username_limit.set(username_limit);
        self.bio_limit.set(bio_limit);
        
        // Store username and bio as hashes
        let username_hash = _hash_string(&username).into();
        let bio_hash = _hash_string(&bio).into();
        self.username_hash.set(username_hash);
        self.bio_hash.set(bio_hash);
        self.created_at.set(U256::from(self.vm().block_timestamp()));
        self.paused.set(false);
        self.initialized.set(true);

        // Cache protocol addresses from factory
        self._cache_protocol_addresses()?;

        Ok(())
    }

    /// Updates vault name (owner only)
    pub fn set_vault_name(&mut self, new_name: String) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        let vault_name_hash = _hash_string(&new_name).into();
        self.vault_name_hash.set(vault_name_hash);
        Ok(())
    }

    /// Updates vault symbol (owner only)
    pub fn set_vault_symbol(&mut self, new_symbol: String) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        let vault_symbol_hash = _hash_string(&new_symbol).into();
        self.vault_symbol_hash.set(vault_symbol_hash);
        Ok(())
    }

    /// Updates vault decimals (owner only)
    pub fn set_vault_decimals(&mut self, new_decimals: u8) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        self.vault_decimals.set(alloy_primitives::Uint::from(new_decimals));
        Ok(())
    }

    /// Deposits assets and mints shares
    pub fn deposit(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if amount == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let user = self.vm().msg_sender();
        
        // Calculate shares to mint
        let shares = self._calculate_shares(amount)?;
        
        // Update balances
        let mut user_balance = self.balances.setter(user);
        let current_balance = user_balance.get();
        user_balance.set(current_balance + shares);
        
        // Update totals
        self.total_assets.set(self.total_assets.get() + amount);
        self.total_supply.set(self.total_supply.get() + shares);

        // Emit event
        log(self.vm(), Deposit {
            user,
            assets: amount,
            shares,
        });

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

        let user = self.vm().msg_sender();
        let user_balance = self.balances.get(user);
        
        if user_balance == U256::ZERO {
            return Err("No shares to withdraw".into());
        }

        // Calculate shares to burn based on amount
        let shares_to_burn = self._calculate_shares(amount)?;
        
        if shares_to_burn > user_balance {
            return Err("Insufficient shares".into());
        }

        // Update balances
        let mut user_balance_setter = self.balances.setter(user);
        user_balance_setter.set(user_balance - shares_to_burn);
        
        // Update totals
        self.total_assets.set(self.total_assets.get() - amount);
        self.total_supply.set(self.total_supply.get() - shares_to_burn);

        // Emit event
        log(self.vm(), Withdraw {
            user,
            assets: amount,
            shares: shares_to_burn,
        });

        Ok(shares_to_burn)
    }

    /// Sets allocation for a specific protocol (owner only)
    pub fn set_protocol_allocation(&mut self, protocol: String, amount: U256) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        if amount > self.total_assets.get() {
            return Err("Insufficient assets".into());
        }

        let old_amount = self.protocol_allocations.get(protocol.clone());
        self.protocol_allocations.setter(protocol.clone()).set(amount);

        // Emit event
        log(self.vm(), ProtocolAllocationChanged {
            protocol: protocol.clone(),
            old_amount,
            new_amount: amount,
        });

        Ok(())
    }

    /// Pauses the vault (owner only)
    pub fn pause(&mut self) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        self.paused.set(true);
        log(self.vm(), VaultPaused {
            vault: self.vm().contract_address(),
        });

        Ok(())
    }

    /// Unpauses the vault (owner only)
    pub fn unpause(&mut self) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        self.paused.set(false);
        log(self.vm(), VaultUnpaused {
            vault: self.vm().contract_address(),
        });

        Ok(())
    }

    /// Gets vault information
    pub fn get_vault_info(&self) -> Result<(Address, Address, Address, U256, U256, [u8; 32], [u8; 32], U256, bool), Vec<u8>> {
        Ok((
            self.owner.get(),
            self.asset.get(),
            self.factory.get(),
            self.total_assets.get(),
            self.total_supply.get(),
            self.username_hash.get().into(),
            self.bio_hash.get().into(),
            self.created_at.get(),
            self.paused.get(),
        ))
    }

    /// Gets user's share balance
    pub fn balance_of(&self, user: Address) -> Result<U256, Vec<u8>> {
        Ok(self.balances.get(user))
    }

    // ERC-4626 Standard Functions

    /// Returns the address of the underlying asset
    pub fn asset(&self) -> Result<Address, Vec<u8>> {
        Ok(self.asset.get())
    }

    /// Returns the total amount of the underlying asset that is "managed" by this vault
    pub fn total_assets(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_assets.get())
    }

    /// Returns the amount of shares that the vault would exchange for the amount of assets provided
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

    /// Returns the amount of assets that the vault would exchange for the amount of shares provided
    pub fn convert_to_assets(&self, shares: U256) -> Result<U256, Vec<u8>> {
        let total_supply = self.total_supply.get();
        if total_supply == U256::ZERO {
            return Ok(U256::ZERO);
        }
        let total_assets = self.total_assets.get();
        Ok((shares * total_assets) / total_supply)
    }

    /// Returns the maximum amount of the underlying asset that can be deposited into the vault for the receiver
    pub fn max_deposit(&self, _receiver: Address) -> Result<U256, Vec<u8>> {
        // For now, return a large number (no limit)
        Ok(U256::from(2).pow(U256::from(256)) - U256::ONE)
    }

    /// Returns the maximum amount of shares that can be minted for the receiver
    pub fn max_mint(&self, _receiver: Address) -> Result<U256, Vec<u8>> {
        // For now, return a large number (no limit)
        Ok(U256::from(2).pow(U256::from(256)) - U256::ONE)
    }

    /// Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance
    pub fn max_withdraw(&self, owner: Address) -> Result<U256, Vec<u8>> {
        let shares = self.balances.get(owner);
        self.convert_to_assets(shares)
    }

    /// Returns the maximum amount of shares that can be redeemed from the owner balance
    pub fn max_redeem(&self, owner: Address) -> Result<U256, Vec<u8>> {
        Ok(self.balances.get(owner))
    }

    /// Mints exactly amount of vault shares to receiver by depositing assets
    pub fn mint(&mut self, shares: U256, receiver: Address) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if shares == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let assets = self.convert_to_assets(shares)?;
        
        // Update balances
        let mut receiver_balance = self.balances.setter(receiver);
        let current_balance = receiver_balance.get();
        receiver_balance.set(current_balance + shares);
        
        // Update totals
        self.total_assets.set(self.total_assets.get() + assets);
        self.total_supply.set(self.total_supply.get() + shares);

        // Emit event
        log(self.vm(), Deposit {
            user: receiver,
            assets,
            shares,
        });

        Ok(assets)
    }

    /// Redeems a specific amount of shares for assets
    pub fn redeem(&mut self, shares: U256, receiver: Address, owner: Address) -> Result<U256, Vec<u8>> {
        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if shares == U256::ZERO {
            return Err("Invalid amount".into());
        }

        let owner_balance = self.balances.get(owner);
        if shares > owner_balance {
            return Err("Insufficient shares".into());
        }

        let assets = self.convert_to_assets(shares)?;
        
        // Update balances
        let mut owner_balance_setter = self.balances.setter(owner);
        owner_balance_setter.set(owner_balance - shares);
        
        // Update totals
        self.total_assets.set(self.total_assets.get() - assets);
        self.total_supply.set(self.total_supply.get() - shares);

        // Emit event
        log(self.vm(), Withdraw {
            user: receiver,
            assets,
            shares,
        });

        Ok(assets)
    }

    // ERC-20 Functions for Vault Shares

    /// Returns the name of the vault share token
    pub fn name(&self) -> Result<String, Vec<u8>> {
        // For now, return a default name since we store as hash
        // In production, you might want to store the actual string or use a mapping
        Ok("Vault Shares".into())
    }

    /// Returns the symbol of the vault share token
    pub fn symbol(&self) -> Result<String, Vec<u8>> {
        // For now, return a default symbol since we store as hash
        // In production, you might want to store the actual string or use a mapping
        Ok("VS".into())
    }

    /// Returns the decimals of the vault share token
    pub fn decimals(&self) -> Result<u8, Vec<u8>> {
        Ok(self.vault_decimals.get().as_limbs()[0] as u8)
    }

    /// Returns the total supply of vault shares
    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_supply.get())
    }

    /// Transfers vault shares from caller to recipient
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let from = self.vm().msg_sender();
        self._transfer_shares(from, to, amount)?;
        Ok(true)
    }

    /// Transfers vault shares from one account to another
    pub fn transfer_from(&mut self, from: Address, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let spender = self.vm().msg_sender();
        
        // Check allowance
        let allowance = self.allowances.getter(from).get(spender);
        if allowance < amount {
            return Err("Insufficient allowance".into());
        }
        
        // Update allowance
        let mut from_allowances = self.allowances.setter(from);
        let mut spender_allowance = from_allowances.setter(spender);
        spender_allowance.set(allowance - amount);
        
        // Transfer shares
        self._transfer_shares(from, to, amount)?;
        
        Ok(true)
    }

    /// Approves spender to spend vault shares
    pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let owner = self.vm().msg_sender();
        self.allowances.setter(owner).setter(spender).set(amount);
        
        // Emit Approval event
        log(self.vm(), Approval {
            owner,
            spender,
            value: amount,
        });
        
        Ok(true)
    }

    /// Returns the allowance for spender
    pub fn allowance(&self, owner: Address, spender: Address) -> Result<U256, Vec<u8>> {
        Ok(self.allowances.getter(owner).get(spender))
    }

    // ===== PROTOCOL INTEGRATION FUNCTIONS =====

    /// Deploys assets to Aave lending protocol
    pub fn deploy_to_aave(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if amount > self.total_assets.get() {
            return Err("Insufficient assets".into());
        }

        let aave_address = self.protocol_addresses.get("aave".to_string());
        if aave_address == Address::ZERO {
            return Err("Aave address not set".into());
        }

        // Approve Aave to spend our assets
        self._approve_protocol(aave_address, amount)?;

        // Call Aave supply function
        let selector = function_selector!("supply(address,uint256,address,uint16)");
        let data = [
            &selector[..],
            &self.asset.get().into_array(),
            &amount.to_be_bytes::<32>(),
            &self.vm().contract_address().into_array(),
            &U256::ZERO.to_be_bytes::<32>(), // referral code
        ].concat();

        unsafe {
            let _ = RawCall::new().call(aave_address, &data);
        }

        // Update allocation
        self.protocol_allocations.setter("aave".to_string()).set(amount);

        // Emit event
        log(self.vm(), ProtocolDeployed {
            protocol: "aave".to_string(),
            amount,
        });

        Ok(())
    }

    /// Deploys assets to Compound protocol
    pub fn deploy_to_compound(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        if self.paused.get() {
            return Err("Vault is paused".into());
        }

        if amount > self.total_assets.get() {
            return Err("Insufficient assets".into());
        }

        let compound_address = self.protocol_addresses.get("compound".to_string());
        if compound_address == Address::ZERO {
            return Err("Compound address not set".into());
        }

        // Approve Compound to spend our assets
        self._approve_protocol(compound_address, amount)?;

        // Call Compound supply function
        let selector = function_selector!("supply(address,uint256)");
        let data = [
            &selector[..],
            &self.asset.get().into_array(),
            &amount.to_be_bytes::<32>(),
        ].concat();

        unsafe {
            let _ = RawCall::new().call(compound_address, &data);
        }

        // Update allocation
        self.protocol_allocations.setter("compound".to_string()).set(amount);

        // Emit event
        log(self.vm(), ProtocolDeployed {
            protocol: "compound".to_string(),
            amount,
        });

        Ok(())
    }

    /// Harvests rewards from a protocol
    pub fn harvest_from_protocol(&mut self, protocol: String) -> Result<U256, Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        let protocol_address = self.protocol_addresses.get(protocol.clone());
        if protocol_address == Address::ZERO {
            return Err("Protocol address not set".into());
        }

        // This is a simplified implementation
        // In practice, you'd call the specific harvest function for each protocol
        let rewards = U256::ZERO; // Placeholder - would calculate actual rewards

        // Emit event
        log(self.vm(), ProtocolHarvested {
            protocol: protocol.clone(),
            rewards,
        });

        Ok(rewards)
    }

    /// Gets protocol allocation
    pub fn get_protocol_allocation(&self, protocol: String) -> Result<U256, Vec<u8>> {
        Ok(self.protocol_allocations.get(protocol.clone()))
    }

    /// Gets protocol address
    pub fn get_protocol_address(&self, protocol: String) -> Result<Address, Vec<u8>> {
        Ok(self.protocol_addresses.get(protocol.clone()))
    }

    /// Internal function to transfer shares
    fn _transfer_shares(&mut self, from: Address, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        if from == to {
            return Ok(());
        }
        
        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return Err("Insufficient balance".into());
        }
        
        // Update balances
        let mut from_balance_setter = self.balances.setter(from);
        from_balance_setter.set(from_balance - amount);
        
        let mut to_balance = self.balances.setter(to);
        let to_current = to_balance.get();
        to_balance.set(to_current + amount);
        
        // Emit Transfer event
        log(self.vm(), Transfer {
            from,
            to,
            value: amount,
        });
        
        Ok(())
    }

    /// Internal function to calculate shares
    fn _calculate_shares(&self, assets: U256) -> Result<U256, Vec<u8>> {
        let total_supply = self.total_supply.get();
        
        if total_supply == U256::ZERO {
            // First deposit - 1:1 ratio
            return Ok(assets);
        }

        let total_assets = self.total_assets.get();
        if total_assets == U256::ZERO {
            return Ok(U256::ZERO);
        }

        // Calculate shares: (assets * total_supply) / total_assets
        Ok((assets * total_supply) / total_assets)
    }

    /// Internal function to cache protocol addresses from factory
    fn _cache_protocol_addresses(&mut self) -> Result<(), Vec<u8>> {
        let factory = self.factory.get();
        
        // Call factory to get protocol addresses
        // This is a simplified implementation - in practice you'd call specific getter functions
        let aave_address = Address::ZERO; // Would call factory.get_aave_address()
        let compound_address = Address::ZERO; // Would call factory.get_compound_address()
        let uniswap_address = Address::ZERO; // Would call factory.get_uniswap_address()
        let weth_address = Address::ZERO; // Would call factory.get_weth_address()
        
        self.protocol_addresses.setter("aave".to_string()).set(aave_address);
        self.protocol_addresses.setter("compound".to_string()).set(compound_address);
        self.protocol_addresses.setter("uniswap".to_string()).set(uniswap_address);
        self.protocol_addresses.setter("weth".to_string()).set(weth_address);
        
        Ok(())
    }

    /// Internal function to approve protocol to spend assets
    fn _approve_protocol(&mut self, protocol: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Call asset's approve function
        let selector = function_selector!("approve(address,uint256)");
        let data = [
            &selector[..],
            &protocol.into_array(),
            &amount.to_be_bytes::<32>(),
        ].concat();

        unsafe {
            let _ = RawCall::new().call(self.asset.get(), &data);
        }

        Ok(())
    }

}

/// Internal function to hash strings
fn _hash_string(input: &str) -> [u8; 32] {
    use stylus_sdk::crypto::keccak;
    let bytes = input.as_bytes();
    *keccak(bytes)
}
