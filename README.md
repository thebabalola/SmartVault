# Smart Vault - Complete DeFi Platform

A comprehensive DeFi platform featuring a factory-based vault system with ERC-4626 compliance, multi-protocol yield generation, and a modern web interface. Built with Rust smart contracts on Arbitrum Stylus and a Next.js frontend.

## 📍 Contract Address

**VaultFactory Contract**: `0x4ba6482edb1d6a7a3b411a46b1573f427c81d0eb`  
**Network**: Arbitrum Sepolia Testnet  
**Contract Size**: 18.6 KiB (19,027 bytes)

> **Note**: Contract addresses are centrally managed in `frontend/constants/contractAddresses.ts`

## 🎯 Platform Overview

Smart Vault is a complete DeFi platform that allows users to:
- **Create Personal Vaults**: Each user gets their own ERC-4626 compliant vault
- **Deploy to DeFi Protocols**: Automatically invest in Aave, Compound, and Uniswap
- **Manage Allocations**: Configure how assets are distributed across protocols
- **Earn Automated Yield**: Passive income generation without manual management
- **Transfer Vault Shares**: ERC-20 compliant share tokens for maximum composability

## 🎯 The Problem Smart Vaults Solve

In traditional finance and basic DeFi, users face several challenges:

- **Idle Assets**: Tokens sitting in wallets earn nothing, losing value to inflation
- **Complex Yield Farming**: Manually managing multiple DeFi protocols is time-consuming and risky
- **Fragmented Experience**: Each DeFi protocol has different interfaces and standards
- **High Gas Costs**: Frequent manual rebalancing and strategy adjustments are expensive
- **Technical Barriers**: Average users can't easily access advanced DeFi strategies

Traditional asset management forces users to choose between:
1. Keeping assets idle (no returns, inflation risk)
2. Manually managing complex DeFi strategies (time-consuming, risky, expensive)

## 🚀 What Smart Vaults Do

Smart Vaults automatically invest your deposited assets using pre-programmed strategies to generate yield while maintaining liquidity and standardization.

**Think of it as**: Instead of manually managing a complex investment portfolio, you deposit your tokens into an automated robo-advisor that handles all the technical DeFi operations for you.

### How the Smart Vault Works

#### 1. **Accepts Deposits**
Users can deposit tokens (like ETH, USDC, or any ERC20 token) into the vault.

#### 2. **Issues Vault Shares**
In return, the vault gives users "shares" that represent their ownership of the vault. (If you own 10% of the shares, you own 10% of the vault's assets.)

These shares are ERC-20 tokens, meaning you can:
- Transfer them to others (they become part-owners of the vault)
- Use them in any DeFi protocol that accepts ERC-20 tokens
- Check your balance using standard `balanceOf` calls

#### 3. **Deploys Strategies**
Instead of letting assets just sit idle, the vault can allocate them into strategies like:

- **Lending protocols** (Aave, Compound) to earn interest
- **Liquidity pools** (Uniswap, Curve) to earn fees
- **Yield farming strategies** (Yearn-style optimizations) to earn rewards
  - Vault stakes assets in protocols that give out governance/reward tokens (like COMP, CRV, or farm incentives)
  - Auto-sells or compounds those rewards back into the vault to boost returns

#### 4. **Accrues Yield Automatically**
As the strategies generate yield, the value of each share in the vault increases. So users earn passively without doing the complex DeFi interactions themselves.

#### 5. **Withdrawals**
At any time, users can redeem their shares back for the underlying assets + the yield they've earned.

## 📊 Real-World Scenarios

### 🔹 Scenario A: Traditional Piggy Bank (No Returns)

**Alice has 100 DAI sitting in her wallet.**

- Her DAI earns 0% interest
- Over time, inflation reduces its purchasing power
- She has to manually find and manage yield opportunities
- **Result**: Alice's money loses value over time

### 🔹 Scenario B: Smart Vault (Automated Yield Generation)

**Alice deposits 100 DAI into a Smart Vault.**

- The vault automatically lends her DAI to Aave at 5% APY
- Additionally, it stakes a portion in other yield-generating protocols
- After 1 year, her 100 DAI becomes ~105 DAI automatically
- **Result**: Alice earns passive income without any manual work

### 🔹 Scenario C: Diversified Investment Strategy

**Bob deposits 1000 USDC into an Index Smart Vault.**

- The vault spreads his USDC across multiple strategies:
  - 40% to Aave lending (4% APY)
  - 30% to Compound lending (3.5% APY)
  - 20% to liquidity pools (8% APY)
  - 10% to staking protocols (6% APY)
- Bob gets diversified exposure with a single deposit
- **Result**: Bob achieves portfolio diversification and risk management automatically

## 🏛️ Why ERC-4626 Standard Matters

ERC-4626 is the universal standard for tokenized vaults, ensuring:

- **Interoperability**: All ERC-4626 vaults work the same way across different platforms
- **Composability**: DeFi protocols can easily integrate with any ERC-4626 vault
- **User Experience**: Wallets and dApps can display vault balances consistently
- **Developer Experience**: One standard interface for all vault operations

### ERC-4626 Key Features

- **Standardized Deposits/Withdrawals**: Same interface across all vaults
- **Share Tokens**: Receive ERC-20 tokens representing your vault ownership
- **Automatic Accounting**: Vault handles all the complex math for you
- **Universal Compatibility**: Works with any DeFi application that supports ERC-4626

### Why ERC-4626 Extends ERC-20

**At its core, a Vault behaves like an ERC20 token contract.**

Why? Because when you deposit assets, the Vault issues you shares, and those shares are just ERC20 tokens.

That means you can:

- **Transfer them**: Send your shares to a friend, now they own part of the vault
- **Check balances**: Use standard ERC20 calls (`balanceOf`) to see your share balance
- **Use them in DeFi**: Trade, lend, or use your vault shares like any other token

### How ERC-4626 Works in Practice

1. **Deposit Process**: Users deposit underlying assets (ETH, USDC, etc.) and receive vault shares
2. **Share Representation**: Each share represents a proportional ownership of the vault's total assets
3. **Yield Distribution**: As the vault earns yield, the value of each share increases automatically
4. **Withdrawal Process**: Users redeem shares for their proportional share of the vault's current value
5. **Standardized Interface**: All ERC-4626 vaults use the same functions (`deposit`, `withdraw`, `mint`, `redeem`)
6. **ERC-20 Compatibility**: Vault shares are fully compatible with all ERC-20 functions and can be used in any DeFi protocol

## ✅ Key Benefits

- **Automated Yield Generation**: Your assets work for you 24/7
- **Standardized Interface**: Same experience across all ERC-4626 vaults
- **Risk Management**: Diversified strategies reduce single-point-of-failure risk
- **Gas Efficiency**: Batch operations reduce transaction costs
- **User-Friendly**: No technical knowledge required to earn DeFi yields
- **Composable**: Works seamlessly with other DeFi protocols
- **Transparent**: All operations are on-chain and verifiable

## 🎯 Perfect For

- **DeFi Beginners**: Easy entry into yield farming without complexity
- **Passive Investors**: Set-and-forget investment strategies
- **Institutional Users**: Professional asset management with DeFi yields
- **DAO Treasuries**: Automated treasury management for organizations
- **Retail Savers**: Better returns than traditional savings accounts
- **DeFi Developers**: Building on standardized vault infrastructure

## 🏗️ System Architecture

### **Smart Contract Layer**
- **VaultFactory**: Lightweight factory that deploys individual UserVault contracts
- **UserVault**: ERC-4626 compliant vault with direct DeFi protocol integration
- **Admin System**: Multi-admin management with protocol address configuration
- **User Registration**: On-chain user profiles with username and bio

### **Frontend Layer**
- **User Dashboard**: Complete vault management interface with 5 main tabs
- **Admin Panel**: Protocol management and platform monitoring
- **Real-time Integration**: Live data from smart contracts
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
SmartVault/
├── README.md                    # This comprehensive project overview
├── smartvault-contract/         # Rust smart contracts for Arbitrum Stylus
│   ├── README.md               # Contract documentation and deployment
│   ├── src/                    # Rust source code
│   │   ├── lib.rs             # Main contract exports
│   │   ├── vault_factory.rs   # Factory contract for deploying vaults
│   │   ├── user_vault.rs      # Individual user vault implementation
│   │   └── tests.rs           # Test suite
│   ├── Cargo.toml             # Rust dependencies
│   ├── gig1.json              # Deployed contract ABI
│   └── user_vault_abi.json    # UserVault contract ABI
└── frontend/                   # Next.js frontend application
    ├── README.md              # Frontend documentation
    ├── app/                   # Next.js app directory
    │   ├── page.tsx           # Landing page
    │   ├── user-acct/         # User dashboard
    │   └── admin/             # Admin panel
    ├── components/            # React components
    │   ├── useracct-comp/     # User account components
    │   ├── admin-comp/        # Admin components
    │   ├── Header/            # Navigation
    │   └── Footer/            # Site footer
    ├── hooks/                 # Custom React hooks
    │   ├── useVaultFactory.ts # VaultFactory integration
    │   └── useUserVault.ts    # UserVault integration
    ├── constants/             # Contract ABIs and addresses
    └── package.json           # Node.js dependencies
```

## 🚀 Quick Start

### 1. Smart Contract Deployment
```bash
cd smartvault-contract
cargo check
source .env 
cargo stylus deploy -e $(TESTNET_RPC_URL) --no-verify --private-key $(PRIVATE_KEY)
cargo stylus export-abi --json --output gig1.json
```

### 2. Initialize Contract
```bash
cast send --rpc-url $(TESTNET_RPC_URL) --private-key $(PRIVATE_KEY) 0x4ba6482edb1d6a7a3b411a46b1573f427c81d0eb "init()"
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Platform
- **User Dashboard**: Navigate to `/user-acct` after connecting wallet
- **Admin Panel**: Click "SmartVault" in footer (admin access required)

## 🔧 Technology Stack

### Smart Contract
- **Language**: Rust
- **Platform**: Arbitrum Stylus
- **Standard**: ERC-4626 compliant
- **Features**: Gas-optimized, modular architecture, automated yield strategies

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2 + Viem
- **State Management**: React hooks

## 🧑‍🦱 Alice's Smart Vault Journey

### Scene 1: The Old Piggy Bank
Alice has 100 DAI sitting in her wallet. She remembers her childhood piggy bank - it kept her money safe but never made it grow. If she put in $100, she'd only ever get $100 back.

### Scene 2: Discovering the Smart Vault
Alice finds a DeFi Smart Vault that promises: "Deposit your 100 DAI here. I won't just keep it safe - I'll put it to work." Curious, she deposits her DAI.

### Scene 3: What Happens Inside
The vault automatically:
- Lends Alice's DAI to Aave, earning 5% interest
- Stakes a portion in other yield-generating protocols
- Manages all operations without Alice lifting a finger

### Scene 4: ERC-4626 in Action
When Alice deposits 100 DAI:
- She receives 100 VaultShares (ERC-20 tokens representing her ownership)
- If the vault grows, each share becomes worth more
- A year later, her 100 VaultShares are worth 105 DAI
- She can redeem her shares anytime for the current value

### Scene 5: Why ERC-4626 Matters
Without ERC-4626, every vault would be different and confusing. With ERC-4626:
- Alice can use any vault the same way
- Wallet apps easily show her balance and returns
- It's like having one universal ATM card that works everywhere

## 📖 Documentation

- **[Smart Contract README](./smart-contract/README.md)**: Technical implementation details, API reference, and deployment guide
- **[Frontend README](./frontend/README.md)**: Frontend setup, component documentation, and user interface guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see individual component READMEs for specific licensing information.

## 🆘 Support

- **Documentation**: Check the component-specific READMEs
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join project discussions for questions

---

**Smart Vault** - Your Digital Piggy Bank That Actually Grows Your Money 🏦💰
