# Smart Vault Frontend - Complete DeFi Platform

A comprehensive Next.js application for the Smart Vault platform, featuring user vault management, admin controls, and real-time DeFi integration. Built with modern web technologies and optimized for Arbitrum Stylus.

## 🚀 Features

### User Dashboard (`/user-acct`)
- **Profile Management**: User registration with username and bio
- **Vault Creation**: Create personal ERC-4626 compliant vaults
- **Asset Management**: Deposit, withdraw, mint, and redeem vault shares
- **Strategy Configuration**: Set protocol allocations (Aave, Compound, Uniswap)
- **Vault Operations**: Complete vault management and monitoring
- **Share Trading**: Transfer and approve vault share transactions

### Admin Panel (`/admin`)
- **Protocol Management**: Configure DeFi protocol addresses
- **Admin System**: Multi-admin management and access control
- **Platform Monitoring**: Real-time platform statistics and health
- **User Management**: Monitor registered users and vault activity
- **System Settings**: Contract configuration and network management

### Core Functionality
- **Real-time Data**: Live integration with smart contracts
- **Multi-wallet Support**: MetaMask, WalletConnect, and other Web3 wallets
- **Network Integration**: Optimized for Arbitrum Sepolia testnet
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Transaction Feedback**: Real-time status updates and confirmations

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#144489` - Trust, stability, finance
- **Accent Gold**: `#EFAC20` - Growth, prosperity, yield
- **Neutral White**: `#FFFFFF` - Clean, minimal backgrounds

### Typography
- **Headings**: Bold, blue text for hierarchy
- **Body Text**: Clean, readable gray text
- **Interactive Elements**: Clear hover states and transitions

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: Wagmi v2 + Viem
- **Icons**: Lucide React
- **State Management**: React hooks

### Project Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Smart Vault landing page
│   ├── user-acct/         # User dashboard and vault management
│   │   └── page.tsx       # Main user interface with 5 tabs
│   ├── admin/             # Admin panel
│   │   └── page.tsx       # Admin dashboard with 6 tabs
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── useracct-comp/     # User account components
│   │   ├── ProfileCard.tsx
│   │   ├── UserProfileSetup.tsx
│   │   ├── VaultCard.tsx
│   │   ├── VaultManagement.tsx
│   │   ├── VaultOperations.tsx
│   │   ├── ProtocolAllocationManager.tsx
│   │   ├── ShareTransfer.tsx
│   │   └── VaultInfo.tsx
│   ├── admin-comp/        # Admin components
│   │   ├── ProtocolManager.tsx
│   │   └── SystemSettings.tsx
│   ├── Header/           # Navigation and wallet connection
│   │   ├── Header.tsx
│   │   ├── NetworkSwitcher.tsx
│   │   └── WalletOptions.tsx
│   └── Footer/           # Site footer
├── hooks/                # Custom React hooks
│   ├── useVaultFactory.ts # VaultFactory contract integration
│   └── useUserVault.ts   # UserVault contract integration
├── constants/            # Contract ABIs and helpers
│   ├── contractAddresses.ts # Centralized contract addresses
│   └── ABIs/            # Smart contract ABIs
├── public/              # Static assets
├── config.ts            # Wagmi configuration
└── provider.tsx         # Web3 provider setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Arbitrum Sepolia testnet wallet (MetaMask, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebabalola/SmartVault.git
   cd SmartVault/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔗 Smart Contract Integration

### Contract Details
- **Network**: Arbitrum Sepolia Testnet (Chain ID: 421614)
- **VaultFactory**: `0x013afa35ae6860a0ff04b00ee20f3332523fca82`
- **Explorer**: [Arbiscan](https://sepolia.arbiscan.io/address/0x013afa35ae6860a0ff04b00ee20f3332523fca82)

### VaultFactory Functions
- `createVault()`: Deploy new UserVault for user
- `registerUser(username, bio)`: Register user profile
- `setAaveAddress(address)`: Configure Aave protocol
- `addAdmin(address)`: Add new admin
- `getUserVaults(user)`: Get user's vault addresses

### UserVault Functions (ERC-4626)
- `deposit(amount)`: Deposit assets and receive vault shares
- `withdraw(amount)`: Withdraw assets by burning shares
- `mint(shares)`: Mint shares for assets
- `redeem(shares)`: Redeem shares for assets
- `deployToAave(amount)`: Deploy assets to Aave
- `setProtocolAllocation(protocol, amount)`: Set protocol allocation

## 💰 How to Use

### For Users
1. **Connect Wallet**: Use the header to connect your Web3 wallet
2. **Register Profile**: Set username and bio (one-time setup)
3. **Create Vault**: Deploy your personal ERC-4626 vault
4. **Deposit Assets**: Choose amount and deposit ERC-20 tokens
5. **Configure Strategy**: Set allocations for Aave, Compound, Uniswap
6. **Monitor Performance**: Track vault performance and yield generation
7. **Manage Vault**: Pause/unpause, update settings, transfer shares

### For Admins
1. **Access Admin Panel**: Click "SmartVault" in footer (admin access required)
2. **Configure Protocols**: Set addresses for DeFi protocols
3. **Manage Admins**: Add/remove administrators
4. **Monitor Platform**: Track total vaults, users, and platform health
5. **System Settings**: Manage contract configuration and network settings

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_VAULT_FACTORY_ADDRESS=0x013afa35ae6860a0ff04b00ee20f3332523fca82
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_RPC_URL=https://arbitrum-sepolia-rpc.publicnode.com
```

### Contract Address Management
Contract addresses are centrally managed in `constants/contractAddresses.ts`:
```typescript
export const VAULT_FACTORY_ADDRESS = "0x013afa35ae6860a0ff04b00ee20f3332523fca82" as `0x${string}`;
```

### Network Configuration
The app is configured for Arbitrum Sepolia testnet by default. To switch networks:
1. Use the network switcher in the header
2. Add Arbitrum Sepolia to your wallet manually
3. Ensure you have testnet ETH for gas fees

## 🧪 Testing

### Testnet Tokens
- **ETH**: For gas fees (get from [faucet](https://faucet.quicknode.com/arbitrum/sepolia))
- **Test Tokens**: For vault deposits (use testnet ERC-20 tokens)

### Testing Flow
1. Deploy the Smart Vault contract to testnet
2. Get testnet ETH and ERC-20 tokens
3. Test deposit/withdraw functionality
4. Verify yield generation and share calculations

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Smart Vault platform. See the main repository for licensing information.

## 🆘 Support

- **Documentation**: Check the main project README
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join project discussions for questions

---

**Smart Vault Frontend** - Your Gateway to Automated DeFi Yield Generation 🚀💰