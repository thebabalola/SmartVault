use alloc::{vec::Vec, string::{String, ToString}};
use stylus_sdk::{
    alloy_primitives::{U256, Address},
    alloy_sol_types::sol,
    prelude::*,
};

sol_storage! {
    #[entrypoint]
    pub struct VaultFactory {
        /// Mapping of user to their vaults
        mapping(address => address[]) user_vaults;
        /// Vault owners
        mapping(address => address) vault_owners;
        /// Vault creation timestamps
        mapping(address => uint256) vault_created_at;
        /// Vault IDs
        mapping(address => uint256) vault_ids;
        /// Vault balances
        mapping(address => uint256) vault_balances;
        /// Vault usernames (as hashes)
        mapping(address => bytes32) vault_username_hashes;
        /// Vault bios (as hashes)
        mapping(address => bytes32) vault_bio_hashes;
        
        /// Protocol allocations for each vault
        mapping(address => uint256) vault_aave_allocation;
        mapping(address => uint256) vault_compound_allocation;
        mapping(address => uint256) vault_uniswap_allocation;
        /// Total number of vaults created
        uint256 total_vaults;
        
        /// Protocol addresses (set by admin)
        address aave_lending_pool;
        address compound_comptroller;
        address uniswap_router;
        address weth_address;
        
        /// Admin system
        address deployer_admin;
        mapping(address => bool) admin_list;
        uint256 admin_count;
        
        /// User registration system
        mapping(address => bool) registered_users;
        mapping(address => bytes32) user_username_hashes;
        mapping(address => bytes32) user_bio_hashes;
        mapping(address => uint256) user_registration_timestamps;
    }
}

sol! {
    event VaultCreated(
        address indexed owner,
        address indexed vault,
        uint256 timestamp
    );
    event ProtocolAddressSet(
        string protocol,
        address indexed newAddress
    );
    event AdminAdded(
        address indexed admin,
        address indexed addedBy
    );
    event AdminRemoved(
        address indexed admin,
        address indexed removedBy
    );
    event UserRegistered(
        address indexed user,
        uint256 timestamp
    );
    event VaultDeposit(
        address indexed vault,
        address indexed user,
        uint256 amount
    );
    event VaultWithdraw(
        address indexed vault,
        address indexed user,
        uint256 amount
    );
    event ProtocolAllocationSet(
        address indexed vault,
        address indexed user,
        string protocol,
        uint256 allocation
    );
}

#[public]
impl VaultFactory {
    /// Constructor - automatically sets deployer as admin
    pub fn init(&mut self) -> Result<(), Vec<u8>> {
        let deployer = self.vm().msg_sender();
        self.deployer_admin.set(deployer);
        self.admin_list.insert(deployer, true);
        self.admin_count.set(U256::from(1));
        Ok(())
    }

    /// Registers a new user (username + bio + timestamp)
    pub fn register_user(
        &mut self,
        username: String,
        bio: String,
    ) -> Result<(), Vec<u8>> {
        if username.len() > 20 {
            return Err("Username too long".into());
        }

        if bio.len() > 30 {
            return Err("Bio too long".into());
        }

        let user = self.vm().msg_sender();
        
        // Check if user is already registered
        if self.registered_users.get(user) {
            return Err("User already registered".into());
        }

        // Store user profile data
        let username_hash = _hash_string(&username).into();
        let bio_hash = _hash_string(&bio).into();
        let timestamp = U256::from(self.vm().block_timestamp());
        
        self.registered_users.insert(user, true);
        self.user_username_hashes.insert(user, username_hash);
        self.user_bio_hashes.insert(user, bio_hash);
        self.user_registration_timestamps.insert(user, timestamp);
        
        log(self.vm(), UserRegistered {
            user,
            timestamp,
        });
        
        Ok(())
    }

    /// Creates a new vault for a registered user
    /// Note: This creates a vault entry in the factory, not a separate contract
    /// The vault functionality is handled by the factory itself
    pub fn create_vault(&mut self) -> Result<Address, Vec<u8>> {
        let user = self.vm().msg_sender();
        
        // Check if user is registered
        if !self.registered_users.get(user) {
            return Err("User not registered".into());
        }

        // Generate a unique vault ID for this user
        let vault_id = self.total_vaults.get() + U256::ONE;
        let vault_address = self._generate_vault_address(user, vault_id);
        
        // Store vault info
        let timestamp = U256::from(self.vm().block_timestamp());
        
        self.vault_owners.setter(vault_address).set(user);
        self.vault_created_at.setter(vault_address).set(timestamp);
        self.vault_ids.setter(vault_address).set(vault_id);
        
        // Get user's profile data from registration
        let username_hash = self.user_username_hashes.get(user);
        let bio_hash = self.user_bio_hashes.get(user);
        self.vault_username_hashes.setter(vault_address).set(username_hash);
        self.vault_bio_hashes.setter(vault_address).set(bio_hash);
        
        // Add to user's vault list
        let mut vaults = self.user_vaults.setter(user);
        vaults.push(vault_address);
        
        // Update total vaults
        self.total_vaults.set(vault_id);
        
        // Emit event
        log(self.vm(), VaultCreated {
            owner: user,
            vault: vault_address,
            timestamp,
        });

        Ok(vault_address)
    }

    /// Gets all vaults for a user
    pub fn get_user_vaults(&self, user: Address) -> Result<Vec<Address>, Vec<u8>> {
        let vaults = self.user_vaults.get(user);
        let mut result = Vec::new();
        for i in 0..vaults.len() {
            if let Some(vault) = vaults.get(i) {
                result.push(vault);
            }
        }
        Ok(result)
    }

    /// Gets vault owner
    pub fn get_vault_owner(&self, vault: Address) -> Result<Address, Vec<u8>> {
        let owner = self.vault_owners.get(vault);
        if owner == Address::ZERO {
            return Err("Vault not found".into());
        }
        Ok(owner)
    }

    /// Gets the total number of vaults created
    pub fn get_total_vaults(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_vaults.get())
    }

    /// Gets vault creation timestamp
    pub fn get_vault_created_at(&self, vault: Address) -> Result<U256, Vec<u8>> {
        Ok(self.vault_created_at.get(vault))
    }

    /// Gets vault username hash
    pub fn get_vault_username_hash(&self, vault: Address) -> Result<[u8; 32], Vec<u8>> {
        Ok(self.vault_username_hashes.get(vault).into())
    }

    /// Gets vault bio hash
    pub fn get_vault_bio_hash(&self, vault: Address) -> Result<[u8; 32], Vec<u8>> {
        Ok(self.vault_bio_hashes.get(vault).into())
    }

    // ===== ADMIN FUNCTIONS =====

    /// Check if address is admin
    fn is_admin(&self, addr: Address) -> bool {
        self.admin_list.get(addr)
    }

    /// Add admin to admin list
    pub fn add_admin(&mut self, new_admin: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        
        if self.is_admin(new_admin) {
            return Err("Already an admin".into());
        }
        
        self.admin_list.insert(new_admin, true);
        self.admin_count.set(self.admin_count.get() + U256::from(1));
        
        log(self.vm(), AdminAdded {
            admin: new_admin,
            addedBy: self.vm().msg_sender(),
        });
        
        Ok(())
    }

    /// Remove admin from admin list
    pub fn remove_admin(&mut self, admin_to_remove: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        
        if admin_to_remove == self.deployer_admin.get() {
            return Err("Cannot remove deployer admin".into());
        }
        
        if !self.is_admin(admin_to_remove) {
            return Err("Not an admin".into());
        }
        
        self.admin_list.insert(admin_to_remove, false);
        self.admin_count.set(self.admin_count.get() - U256::from(1));
        
        log(self.vm(), AdminRemoved {
            admin: admin_to_remove,
            removedBy: self.vm().msg_sender(),
        });
        
        Ok(())
    }

    /// Sets Aave lending pool address
    pub fn set_aave_address(&mut self, aave_address: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        self.aave_lending_pool.set(aave_address);
        log(self.vm(), ProtocolAddressSet {
            protocol: "aave".to_string(),
            newAddress: aave_address,
        });
        Ok(())
    }

    /// Sets Compound comptroller address
    pub fn set_compound_address(&mut self, compound_address: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        self.compound_comptroller.set(compound_address);
        log(self.vm(), ProtocolAddressSet {
            protocol: "compound".to_string(),
            newAddress: compound_address,
        });
        Ok(())
    }

    /// Sets Uniswap router address
    pub fn set_uniswap_address(&mut self, uniswap_address: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        self.uniswap_router.set(uniswap_address);
        log(self.vm(), ProtocolAddressSet {
            protocol: "uniswap".to_string(),
            newAddress: uniswap_address,
        });
        Ok(())
    }

    /// Sets WETH address
    pub fn set_weth_address(&mut self, weth_address: Address) -> Result<(), Vec<u8>> {
        if !self.is_admin(self.vm().msg_sender()) {
            return Err("Not authorized".into());
        }
        self.weth_address.set(weth_address);
        log(self.vm(), ProtocolAddressSet {
            protocol: "weth".to_string(),
            newAddress: weth_address,
        });
        Ok(())
    }

    /// Gets protocol addresses
    pub fn get_aave_address(&self) -> Result<Address, Vec<u8>> {
        Ok(self.aave_lending_pool.get())
    }

    pub fn get_compound_address(&self) -> Result<Address, Vec<u8>> {
        Ok(self.compound_comptroller.get())
    }

    pub fn get_uniswap_address(&self) -> Result<Address, Vec<u8>> {
        Ok(self.uniswap_router.get())
    }

    pub fn get_weth_address(&self) -> Result<Address, Vec<u8>> {
        Ok(self.weth_address.get())
    }

    /// Gets deployer admin address
    pub fn get_deployer_admin(&self) -> Result<Address, Vec<u8>> {
        Ok(self.deployer_admin.get())
    }

    // ===== VAULT MANAGEMENT FUNCTIONS =====

    /// Deposits assets into a vault
    pub fn deposit_to_vault(&mut self, vault_address: Address, amount: U256) -> Result<U256, Vec<u8>> {
        let user = self.vm().msg_sender();
        
        // Check if user owns this vault
        if self.vault_owners.get(vault_address) != user {
            return Err("Not vault owner".into());
        }

        // For now, we'll implement a simplified deposit that just tracks the amount
        // In a real implementation, this would interact with the actual vault contract
        let current_balance = self.vault_balances.getter(vault_address).get();
        self.vault_balances.setter(vault_address).set(current_balance + amount);
        
        // Emit deposit event
        log(self.vm(), VaultDeposit {
            vault: vault_address,
            user,
            amount,
        });

        Ok(amount)
    }

    /// Withdraws assets from a vault
    pub fn withdraw_from_vault(&mut self, vault_address: Address, amount: U256) -> Result<U256, Vec<u8>> {
        let user = self.vm().msg_sender();
        
        // Check if user owns this vault
        if self.vault_owners.get(vault_address) != user {
            return Err("Not vault owner".into());
        }

        let current_balance = self.vault_balances.getter(vault_address).get();
        if current_balance < amount {
            return Err("Insufficient balance".into());
        }

        self.vault_balances.setter(vault_address).set(current_balance - amount);
        
        // Emit withdraw event
        log(self.vm(), VaultWithdraw {
            vault: vault_address,
            user,
            amount,
        });

        Ok(amount)
    }

    /// Gets vault balance
    pub fn get_vault_balance(&self, vault_address: Address) -> Result<U256, Vec<u8>> {
        Ok(self.vault_balances.getter(vault_address).get())
    }

    /// Check if address is admin
    pub fn check_is_admin(&self, addr: Address) -> Result<bool, Vec<u8>> {
        Ok(self.is_admin(addr))
    }

    /// Get admin count
    pub fn get_admin_count(&self) -> Result<U256, Vec<u8>> {
        Ok(self.admin_count.get())
    }

    // ===== USER REGISTRATION FUNCTIONS =====

    /// Check if user is registered
    pub fn is_user_registered(&self, user: Address) -> Result<bool, Vec<u8>> {
        Ok(self.registered_users.get(user))
    }

    /// Get user registration timestamp
    pub fn get_user_registration_timestamp(&self, user: Address) -> Result<U256, Vec<u8>> {
        if !self.registered_users.get(user) {
            return Err("User not registered".into());
        }
        Ok(self.user_registration_timestamps.get(user))
    }

    /// Get user username hash
    pub fn get_user_username_hash(&self, user: Address) -> Result<[u8; 32], Vec<u8>> {
        if !self.registered_users.get(user) {
            return Err("User not registered".into());
        }
        Ok(self.user_username_hashes.get(user).into())
    }

    /// Get user bio hash
    pub fn get_user_bio_hash(&self, user: Address) -> Result<[u8; 32], Vec<u8>> {
        if !self.registered_users.get(user) {
            return Err("User not registered".into());
        }
        Ok(self.user_bio_hashes.get(user).into())
    }

    // ===== INTERNAL FUNCTIONS =====

    /// Generates a deterministic vault address for a user
    fn _generate_vault_address(&self, user: Address, vault_id: U256) -> Address {
        let mut data = Vec::new();
        data.extend_from_slice(user.as_slice());
        data.extend_from_slice(&vault_id.to_be_bytes::<32>());
        data.extend_from_slice(&self.vm().block_timestamp().to_be_bytes());
        data.extend_from_slice(b"UserVault");
        
        use stylus_sdk::crypto::keccak;
        let hash = keccak(&data);
        
        let mut addr_bytes = [0u8; 20];
        addr_bytes.copy_from_slice(&hash[12..32]);
        Address::from(addr_bytes)
    }
}

/// Internal function to hash strings
fn _hash_string(input: &str) -> [u8; 32] {
    use stylus_sdk::crypto::keccak;
    let bytes = input.as_bytes();
    *keccak(bytes)
}


