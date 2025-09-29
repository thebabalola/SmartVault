# Smart Vault Smart Contracts

A comprehensive DeFi platform with factory-based vault deployment, ERC-4626 compliance, and direct DeFi protocol integration. Built with Rust for Arbitrum Stylus.

## 📍 Contract Address

**VaultFactory Contract**: `0x4ba6482edb1d6a7a3b411a46b1573f427c81d0eb`  
**Network**: Arbitrum Sepolia Testnet  
**Contract Size**: 18.6 KiB (19,027 bytes)

> **Note**: When redeploying, update the address in `frontend/constants/contractAddresses.ts`

## 🎯 Overview

This smart contract system implements a complete DeFi platform featuring:
- **VaultFactory**: Lightweight factory for deploying individual user vaults
- **UserVault**: ERC-4626 compliant vaults with direct DeFi protocol integration
- **Admin System**: Multi-admin management with protocol address configuration
- **User Registration**: On-chain user profiles and vault management

## 🏗️ Contract Architecture

### **1. VaultFactory Contract** (`vault_factory.rs`)

**Purpose**: Lightweight factory that deploys individual UserVault contracts and manages global settings.

**Key Features**:
- **Vault Deployment**: Creates new UserVault contracts for each user
- **Protocol Management**: Stores addresses of DeFi protocols (Aave, Compound, Uniswap, WETH)
- **Admin System**: Multi-admin management with deployer as initial admin
- **User Registration**: Manages user profiles (username, bio, registration timestamp)

**Core Functions**:
```rust
// Admin Functions
createVault() -> deploys new UserVault
setAaveAddress(address) -> sets Aave protocol address
addAdmin(address) -> adds new admin
removeAdmin(address) -> removes admin

// User Functions  
registerUser(username, bio) -> registers user profile
getUserVaults(user) -> returns user's vault addresses
```

**Storage Structure**:
```rust
sol_storage! {
    pub struct VaultFactory {
        address deployer_admin;                    // Deployer admin address
        mapping(address => bool) admin_list;       // Admin addresses
        uint256 admin_count;                       // Total admin count
        mapping(address => address[]) user_vaults; // User's vault addresses
        mapping(string => address) protocol_addresses; // DeFi protocol addresses
        mapping(address => bool) registered_users; // Registered users
        mapping(address => bytes32) user_username_hashes; // Username hashes
        mapping(address => bytes32) user_bio_hashes; // Bio hashes
        mapping(address => uint256) user_registration_timestamps; // Registration times
    }
}
```

### **2. UserVault Contract** (`user_vault.rs`)

**Purpose**: Individual vault for each user that implements ERC-4626 standard and integrates with DeFi protocols.

**Key Features**:
- **ERC-4626 Compliance**: Standard vault interface for deposits/withdrawals
- **ERC-20 Shares**: Vault shares as transferable tokens
- **DeFi Integration**: Direct calls to Aave, Compound, Uniswap
- **Protocol Allocations**: User-defined asset distribution across protocols
- **Vault Management**: Pause/unpause, configuration updates

**Core Functions**:
```rust
// ERC-4626 Functions
deposit(amount) -> deposits assets, mints shares
withdraw(amount) -> burns shares, withdraws assets
totalAssets() -> returns total assets in vault
convertToShares(assets) -> converts assets to shares

// DeFi Integration
deployToAave(amount) -> deploys assets to Aave
deployToCompound(amount) -> deploys assets to Compound  
harvestFromProtocol(protocol) -> harvests rewards

// Vault Management
setProtocolAllocation(protocol, amount) -> sets allocation
pause() / unpause() -> controls vault operations
```

**Storage Structure**:
```rust
sol_storage! {
    pub struct UserVault {
        address owner;                              // Vault owner
        address asset;                              // Underlying asset
        address factory;                            // Vault factory address
        uint256 total_assets;                       // Total assets in vault
        uint256 total_supply;                       // Total shares issued
        mapping(address => uint256) balances;       // User share balances
        mapping(string => uint256) protocol_allocations; // Protocol allocations
        mapping(string => address) protocol_addresses; // Cached protocol addresses
        bool paused;                                // Vault pause status
        bytes32 vault_name_hash;                    // Vault name
        bytes32 vault_symbol_hash;                  // Vault symbol
        uint8 vault_decimals;                       // Vault decimals
    }
}
```

## 🔧 Implementation Details

### **ERC-20 Module**
The vault uses a modular ERC-20 implementation (`erc20.rs`) that provides:
- **Token Parameters**: Configurable name, symbol, and decimals
- **Balance Management**: Mint, burn, and transfer functionality
- **Allowance System**: Standard ERC-20 approval mechanism
- **Event Logging**: Transfer and Approval events
- **Error Handling**: Insufficient balance and allowance errors

### **Vault Logic**
The main vault contract (`lib.rs`) implements:
- **Asset Management**: Setting and tracking underlying assets
- **Share Calculation**: Proportional share minting/burning
- **Deposit/Withdraw**: Core vault functionality
- **Integration**: Seamless ERC-20 token integration

## 📁 Project Structure

```
smart-contract/
├── src/
│   ├── lib.rs              # Main Smart Vault contract
│   ├── main.rs             # Entry point for Stylus
│   ├── erc20.rs            # ERC-20 token implementation
│   └── tests.rs            # Test suite
├── examples/
│   └── counter.txt         # Example usage
├── licenses/               # License files
│   ├── Apache-2.0
│   ├── MIT
│   └── COPYRIGHT.md
├── target/                 # Build artifacts
├── Cargo.toml              # Dependencies and configuration
├── rust-toolchain.toml     # Rust toolchain version
├── header.png              # Project header image
└── README.md               # This file
```

## 🚀 Deployment Information

### **Live Contract Details**
- **Contract Address**: `0xfb8b95b90c19990ebe64741e35eacdbe0fd30bcf`
- **Deployment TX**: `0x9480b49dd46075512237a8d534deb8ffd628df0657198a95e9a4fc148d52fb62`
- **Activation TX**: `0x8f791f163c2965e2ea9486035de24d8095207bf09b33c34445ce1314d95dd8c0`
- **Network**: Arbitrum Sepolia Testnet
- **Explorer**: [View on Arbiscan](https://sepolia.arbiscan.io/address/0xfb8b95b90c19990ebe64741e35eacdbe0fd30bcf)

## 🚀 Quick Start

### Prerequisites
- Rust 1.70+
- Arbitrum Stylus SDK 0.9.0
- Cargo

### Dependencies
The project uses the following key dependencies:
- `stylus-sdk = "0.9.0"` - Arbitrum Stylus SDK
- `alloy-primitives = "0.8.20"` - Ethereum primitives
- `alloy-sol-types = "0.8.20"` - Solidity type support
- `wee_alloc = "0.4.5"` - Memory allocator for no_std
- `rustlearn = "0.5.0"` - Machine learning capabilities

### Build the Contract
```bash
# Check compilation
cargo check

# Build for Stylus
cargo stylus check

# Export ABI
cargo stylus export-abi

# Run tests
cargo test
```

### Deploy to Arbitrum Stylus
```bash
# Deploy with private key
cargo stylus deploy --private-key-path=./private_key.txt

# Deploy to specific endpoint
cargo stylus deploy --private-key-path=./private_key.txt --endpoint <RPC_URL>
```

## 🧪 Testing

### Run All Tests
```bash
cargo test
```

### Test Structure
The test suite (`tests.rs`) includes:
- **Vault Initialization**: Basic contract setup
- **Asset Management**: Setting and retrieving assets
- **Deposit/Withdraw**: Core vault functionality
- **ERC-20 Integration**: Token operations
- **Error Handling**: Edge cases and error conditions

### Test Coverage
- **ERC-4626 Compliance**: Core vault functions tested
- **ERC-20 Compliance**: Token functionality verified
- **Integration**: Vault and ERC-20 module interaction
- **Edge Cases**: Error conditions and boundary testing

## 🔒 Security Features

### **ERC-4626 Compliance**
- Standard vault interface implementation
- Proper share calculation and minting/burning
- Asset management following ERC-4626 specifications

### **ERC-20 Security**
- Standard token functionality
- Proper balance and allowance management
- Event logging for all transfers and approvals
- Error handling for insufficient balances and allowances

### **Code Quality**
- Modular design with separation of concerns
- Comprehensive error handling
- Memory-efficient implementation with `wee_alloc`
- No-std environment compatibility

## 📊 Gas Optimization

### **Efficient Storage Layout**
- Optimized storage structure with `sol_storage!` macro
- Minimal state variables
- Efficient mapping usage for ERC-20 balances and allowances

### **Memory Management**
- `wee_alloc` for memory-efficient allocation
- No-std environment for reduced overhead
- Optimized data structures for blockchain environment

## 🎯 Key Features

### **For Users**
- **Easy Deposits**: Simple deposit interface with asset approval
- **Vault Shares**: Receive ERC-20 tokens representing vault ownership
- **Flexible Withdrawals**: Withdraw assets by burning shares
- **Standard Interface**: ERC-4626 compliant for interoperability

### **For Developers**
- **ERC-4626 Compliant**: Standard vault interface
- **ERC-20 Integration**: Seamless token functionality
- **Modular Design**: Clean separation of vault and token logic
- **Stylus Compatible**: Built for Arbitrum Stylus platform

### **For Integrators**
- **Standard Compliance**: Works with any ERC-4626 compatible interface
- **Event Logging**: Comprehensive event system for monitoring
- **Error Handling**: Robust error management
- **Gas Efficient**: Optimized for blockchain deployment

## 🔄 Workflow

### **Deposit Flow**
1. User approves asset spending to vault
2. User calls `deposit(amount)` with assets
3. Vault transfers assets from user via `transferFrom`
4. Vault calculates shares based on current total supply
5. Vault mints shares to user
6. User receives ERC-20 vault shares

### **Withdrawal Flow**
1. User calls `withdraw(amount)` with desired asset amount
2. Vault calculates shares to burn based on user's proportion
3. Vault burns user's shares
4. Vault transfers assets back to user
5. User receives underlying assets

### **Share Management**
1. Vault shares are ERC-20 tokens
2. Users can transfer shares to other addresses
3. Share holders can approve spending for other contracts
4. Share values represent proportional ownership of vault assets

## 📈 Technical Specifications

### **Contract Details**
- **Name**: Smart Vault
- **Symbol**: VAULT
- **Decimals**: 18
- **Standard**: ERC-4626 compliant
- **Platform**: Arbitrum Stylus

### **Implementation Features**
- **Asset Management**: Single underlying asset support
- **Share Calculation**: Proportional share minting/burning
- **ERC-20 Integration**: Full token functionality
- **Event Logging**: Transfer and Approval events
- **Error Handling**: Comprehensive error management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join project discussions for questions
- **Security**: Report security issues privately

## 🔗 Links

- **Repository**: [https://github.com/thebabalola/SmartVault](https://github.com/thebabalola/SmartVault)
- **Stylus SDK**: [Arbitrum Stylus Documentation](https://docs.arbitrum.io/stylus)
- **ERC-4626 Standard**: [EIP-4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)

---

**Smart Vault Contract** - ERC-4626 Compliant Vault for Arbitrum Stylus 🚀💰