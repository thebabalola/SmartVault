# Smart Vault Smart Contract

A comprehensive ERC-4626 compliant Smart Vault implementation for Arbitrum Stylus, providing automated yield generation through multiple DeFi strategies.

## 🎯 Overview

This smart contract implements a fully compliant ERC-4626 vault that automatically invests user deposits across multiple yield-generating strategies. Users receive vault shares (ERC-20 tokens) representing their proportional ownership of the vault's assets and yield.

## 🏗️ Contract Architecture

### **Core Components**

#### 1. **Storage Structure**
```rust
sol_storage! {
    #[entrypoint]
    pub struct SmartVault {
        // ERC-20 Token Properties
        string name;
        string symbol;
        uint8 decimals;
        uint256 total_supply;
        mapping(address => uint256) balance_of;
        mapping(address => mapping(address => uint256)) allowance;
        
        // ERC-4626 Vault Properties
        address asset;                    // Underlying asset (USDC, DAI, etc.)
        uint256 total_assets;            // Total assets in vault
        uint256 total_shares;              // Total shares issued
        
        // Vault Management
        address owner;                   // Vault administrator
        bool paused;                     // Emergency pause
        uint256 max_deposit;             // Max deposit limit
        uint256 max_mint;                // Max mint limit
        
        // Yield Strategy Management
        mapping(uint256 => address) strategies;  // Strategy contracts
        mapping(uint256 => uint256) strategy_weights; // Allocation weights
        uint256 active_strategies;       // Number of active strategies
        
        // Fee Management
        uint256 management_fee;          // Annual management fee (basis points)
        uint256 performance_fee;         // Performance fee (basis points)
        uint256 last_fee_collection;     // Last fee collection timestamp
        
        // Emergency Controls
        bool emergency_mode;             // Emergency withdrawal mode
        uint256 emergency_withdrawal_fee; // Fee for emergency withdrawals
    }
}
```

#### 2. **ERC-4626 Standard Functions**
- `deposit(uint256 assets, address receiver)` → `uint256 shares`
- `mint(uint256 shares, address receiver)` → `uint256 assets`
- `withdraw(uint256 assets, address receiver, address owner)` → `uint256 shares`
- `redeem(uint256 shares, address receiver, address owner)` → `uint256 assets`
- `totalAssets()` → `uint256`
- `convertToShares(uint256 assets)` → `uint256 shares`
- `convertToAssets(uint256 shares)` → `uint256 assets`
- `previewDeposit(uint256 assets)` → `uint256 shares`
- `previewMint(uint256 shares)` → `uint256 assets`
- `previewWithdraw(uint256 assets)` → `uint256 shares`
- `previewRedeem(uint256 shares)` → `uint256 assets`

#### 3. **ERC-20 Token Functions**
- `name()` → `string`
- `symbol()` → `string`
- `decimals()` → `uint8`
- `totalSupply()` → `uint256`
- `balanceOf(address account)` → `uint256`
- `transfer(address to, uint256 amount)` → `bool`
- `approve(address spender, uint256 amount)` → `bool`
- `transferFrom(address from, address to, uint256 amount)` → `bool`
- `allowance(address owner, address spender)` → `uint256`

#### 4. **Strategy Management Functions**
- `addStrategy(address strategy, uint256 weight)` → `bool`
- `removeStrategy(uint256 strategy_id)` → `bool`
- `rebalanceStrategies()` → `bool`
- `harvestRewards()` → `bool`
- `emergencyWithdrawFromStrategy(uint256 strategy_id)` → `bool`

#### 5. **Administrative Functions**
- `setManagementFee(uint256 fee)` → `bool`
- `setPerformanceFee(uint256 fee)` → `bool`
- `setMaxDeposit(uint256 max)` → `bool`
- `setMaxMint(uint256 max)` → `bool`
- `pauseVault()` → `bool`
- `unpauseVault()` → `bool`
- `emergencyMode()` → `bool`

#### 6. **Fee Collection Functions**
- `collectFees()` → `bool`
- `distributeFees()` → `bool`

## 🔧 Strategy Interface

### **Yield Strategy Trait**
```rust
pub trait YieldStrategy {
    fn deposit(&mut self, amount: U256) -> Result<U256, String>;
    fn withdraw(&mut self, amount: U256) -> Result<U256, String>;
    fn harvest(&mut self) -> Result<U256, String>;
    fn get_balance(&self) -> U256;
    fn get_apy(&self) -> U256;
}
```

### **Supported Strategies**
1. **Aave Lending Strategy** - Lend assets to Aave protocol for interest
2. **Compound Lending Strategy** - Lend assets to Compound protocol for interest
3. **Uniswap V3 Liquidity Strategy** - Provide liquidity for trading fees
4. **Curve Pool Strategy** - Provide liquidity to Curve pools
5. **Staking Strategy** - Stake assets for staking rewards

## 📁 Project Structure

```
Smart-Vault/
├── src/
│   ├── lib.rs              # Main Smart Vault contract
│   ├── main.rs             # Entry point
│   ├── strategies/         # Strategy implementations
│   │   ├── mod.rs
│   │   ├── aave.rs
│   │   ├── compound.rs
│   │   ├── uniswap.rs
│   │   └── curve.rs
│   ├── interfaces/         # Contract interfaces
│   │   ├── mod.rs
│   │   └── yield_strategy.rs
│   └── utils/              # Utility functions
│       ├── mod.rs
│       └── math.rs
├── tests/
│   ├── integration_tests.rs
│   ├── strategy_tests.rs
│   └── vault_tests.rs
├── Cargo.toml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Rust 1.70+
- Arbitrum Stylus SDK
- Cargo

### Build the Contract
```bash
# Build for Stylus
cargo build --target wasm32-unknown-unknown

# Export ABI
cargo stylus export-abi

# Run tests
cargo test
```

### Deploy to Arbitrum Stylus
```bash
# Deploy to testnet
cargo stylus deploy --private-key <PRIVATE_KEY> --rpc-url <RPC_URL>

# Deploy to mainnet
cargo stylus deploy --private-key <PRIVATE_KEY> --rpc-url <RPC_URL> --chain-id 42161
```

## 🧪 Testing

### Run All Tests
```bash
cargo test
```

### Run Specific Test Suites
```bash
# Vault functionality tests
cargo test vault_tests

# Strategy tests
cargo test strategy_tests

# Integration tests
cargo test integration_tests
```

### Test Coverage
- **ERC-4626 Compliance**: All standard functions tested
- **ERC-20 Compliance**: Token functionality verified
- **Strategy Integration**: Each strategy thoroughly tested
- **Edge Cases**: Emergency scenarios and error conditions
- **Gas Optimization**: Efficiency benchmarks

## 🔒 Security Features

### **Access Control**
- Owner-only administrative functions
- Pausable vault operations
- Emergency withdrawal mechanisms

### **Risk Management**
- Maximum deposit limits
- Strategy diversification
- Emergency mode for crisis situations
- Fee collection and distribution

### **Audit Considerations**
- ERC-4626 standard compliance
- Reentrancy protection
- Integer overflow/underflow protection
- Access control validation

## 📊 Gas Optimization

### **Efficient Storage Layout**
- Packed storage variables
- Optimized mapping usage
- Minimal state changes

### **Batch Operations**
- Batch strategy rebalancing
- Efficient fee collection
- Optimized yield harvesting

## 🎯 Key Features

### **For Users**
- **Easy Deposits**: Simple deposit interface
- **Automatic Yield**: Passive income generation
- **Liquidity**: Withdraw anytime
- **Transparency**: On-chain operations

### **For Developers**
- **ERC-4626 Compliant**: Standard interface
- **Composable**: Works with any DeFi protocol
- **Extensible**: Easy to add new strategies
- **Well-Tested**: Comprehensive test coverage

### **For Administrators**
- **Strategy Management**: Add/remove strategies
- **Fee Control**: Configurable fee structure
- **Emergency Controls**: Crisis management
- **Monitoring**: Real-time vault metrics

## 🔄 Workflow

### **Deposit Flow**
1. User approves asset spending
2. User calls `deposit()` with assets
3. Vault mints shares to user
4. Vault allocates assets to strategies
5. Strategies generate yield automatically

### **Withdrawal Flow**
1. User calls `withdraw()` or `redeem()`
2. Vault calculates user's share of total assets
3. Vault withdraws from strategies if needed
4. Vault transfers assets to user
5. Vault burns user's shares

### **Yield Generation**
1. Strategies automatically generate yield
2. Vault harvests rewards periodically
3. Yield compounds back into vault
4. Share values increase over time

## 📈 Performance Metrics

### **Expected Returns**
- **Aave Lending**: 3-8% APY
- **Compound Lending**: 2-6% APY
- **Uniswap V3**: 5-15% APY (variable)
- **Curve Pools**: 2-10% APY
- **Combined Portfolio**: 4-12% APY (diversified)

### **Fee Structure**
- **Management Fee**: 0.5-2% annually
- **Performance Fee**: 10-20% of profits
- **Withdrawal Fee**: 0% (standard), 0.1% (emergency)

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

---

**Smart Vault Contract** - Automated Yield Generation for DeFi 🚀💰