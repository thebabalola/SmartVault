import { http, createConfig, fallback } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

declare module 'wagmi' {
    interface Register {
      config: typeof config
    }
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Define Arbitrum Sepolia testnet chain
const arbitrumSepolia = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://arbitrum-sepolia-rpc.publicnode.com'] },
    public: { http: ['https://arbitrum-sepolia-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
  testnet: true,
} as const;

export const supportedNetworks = [arbitrumSepolia] as const;

export const config = createConfig({
  chains: supportedNetworks,
  connectors: [
    walletConnect({ projectId : projectId ?? ''}),
  ],
  transports: {
    [arbitrumSepolia.id]: fallback([
      http('https://arbitrum-sepolia-rpc.publicnode.com'),
    ]),
  },
});