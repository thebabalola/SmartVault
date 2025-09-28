# Smart Vault Smart Contract

A comprehensive ERC-4626 compliant Smart Vault implementation for Arbitrum Stylus, providing automated yield generation through DeFi strategies.

## 📍 Contract Address

**VaultFactory Contract**: `0x013afa35ae6860a0ff04b00ee20f3332523fca82`  
**Network**: Arbitrum Sepolia Testnet  
**Contract Size**: 18.6 KiB (19,027 bytes)

> **Note**: When redeploying, update the address in `frontend/constants/contractAddresses.ts`

## 🎯 Overview

This smart contract implements a fully compliant ERC-4626 vault that automatically invests user deposits into yield-generating strategies. Users receive vault shares (ERC-20 tokens) representing their proportional ownership of the vault's assets and yield.

## 🏗️ Contract Architecture

### **Core Components**

#### 1. **Storage Structure**
```rust
sol_storage! {
    #[entrypoint]
    struct Vault { 
        address asset;                    // Underlying asset (USDC, DAI, etc.)
        uint totalSupply;                 // Total supply of vault shares
        #[borrow]        			
        Erc20<VaultParams> erc20;        // ERC-20 token functionality
    }
}
```

#### 2. **ERC-20 Token Integration**
The vault inherits ERC-20 functionality through the `Erc20<VaultParams>` module:
- **Token Name**: "Vault Example"
- **Token Symbol**: "VAULT" 
- **Decimals**: 18
- **Standard ERC-20 Functions**: `transfer`, `approve`, `transferFrom`, `balanceOf`, `allowance`

#### 3. **Core Vault Functions**
- `setAsset(address asset)` → `address` - Set the underlying asset
- `deposit(uint256 amount)` → `()` - Deposit assets and receive shares
- `withdraw(uint256 amount)` → `()` - Withdraw assets by burning shares
- `asset()` → `address` - Get the underlying asset address
- `totalAssets()` → `uint256` - Get total assets in the vault

#### 4. **ERC-20 Token Functions (Inherited)**
- `name()` → `string` - Token name ("Vault Example")
- `symbol()` → `string` - Token symbol ("VAULT")
- `decimals()` → `uint8` - Token decimals (18)
- `totalSupply()` → `uint256` - Total supply of vault shares
- `balanceOf(address account)` → `uint256` - Balance of shares for account
- `transfer(address to, uint256 amount)` → `bool` - Transfer shares
- `approve(address spender, uint256 amount)` → `bool` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` → `bool` - Transfer from
- `allowance(address owner, address spender)` → `uint256` - Check allowance

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