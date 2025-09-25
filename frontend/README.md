# Smart Vault Frontend - DeFi Yield Generation Platform

A modern Next.js application for the Smart Vault platform, enabling users to deposit assets and earn automated yield through ERC-4626 compliant vaults on Arbitrum Stylus. This frontend provides an intuitive interface for interacting with the deployed Smart Vault contract.

## 🚀 Features

### Core Functionality
- **Asset Deposits**: Deposit ERC-20 tokens into Smart Vaults
- **Automated Yield**: Earn passive returns through automated DeFi strategies
- **Vault Shares**: Receive ERC-20 tokens representing vault ownership
- **Multi-wallet Support**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- **Network Integration**: Optimized for Arbitrum Sepolia testnet

### User Experience
- **Fixed Header Navigation**: Always accessible wallet connection and navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Clean, modern interface with Smart Vault brand colors
- **Transaction Feedback**: Real-time status updates and success confirmations
- **Yield Tracking**: Monitor your vault performance and returns

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
│   ├── user-profile/      # User dashboard and vault management
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Header/           # Navigation and wallet connection
│   │   ├── Header.tsx
│   │   ├── NetworkSwitcher.tsx
│   │   └── WalletOptions.tsx
│   └── Footer/           # Site footer
├── constants/            # Contract ABIs and helpers
│   └── ABIs/            # Smart contract ABIs
├── hooks/               # Custom React hooks
├── modals/              # Modal components
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
- **Contract**: SmartVault (ERC-4626 compliant)
- **Address**: `0x89a2c29b55fb31e5739682f5b9ae3a004e7a1a54`
- **Explorer**: [Arbiscan](https://sepolia.arbiscan.io/address/0x89a2c29b55fb31e5739682f5b9ae3a004e7a1a54)

### Key Functions
- `deposit(amount)`: Deposit assets and receive vault shares
- `withdraw(amount)`: Withdraw assets by burning shares
- `balanceOf(address)`: Check vault share balance
- `totalAssets()`: Get total assets managed by vault
- `convertToShares(assets)`: Convert assets to shares
- `convertToAssets(shares)`: Convert shares to assets

## 💰 How to Use

### For Users
1. **Connect Wallet**: Use the header to connect your Web3 wallet
2. **Switch Network**: Ensure you're on Arbitrum Sepolia testnet
3. **Deposit Assets**: Choose amount and deposit ERC-20 tokens
4. **Earn Yield**: Your assets automatically generate returns
5. **Withdraw**: Redeem shares for assets + yield anytime

### For Vault Managers
1. **Monitor Performance**: Track vault performance and yield generation
2. **Manage Strategies**: Configure automated yield strategies
3. **Harvest Yield**: Collect and distribute generated returns

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x89a2c29b55fb31e5739682f5b9ae3a004e7a1a54
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_RPC_URL=https://arbitrum-sepolia-rpc.publicnode.com
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