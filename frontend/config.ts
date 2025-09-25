import { http, createConfig, fallback } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

declare module 'wagmi' {
    interface Register {
      config: typeof config
    }
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Define Kaia testnet chain
const kaiaTestnet = {
  id: 1001,
  name: 'Kaia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Kaia',
    symbol: 'KAIA',
  },
  rpcUrls: {
    default: { http: ['https://public-en-kairos.node.kaia.io'] },
    public: { http: ['https://public-en-kairos.node.kaia.io'] },
  },
  blockExplorers: {
    default: { name: 'Kaia Explorer', url: 'https://explorer.kaia.io' },
  },
  testnet: true,
} as const;

export const supportedNetworks = [kaiaTestnet] as const;

export const config = createConfig({
  chains: supportedNetworks,
  connectors: [
    walletConnect({ projectId : projectId ?? ''}),
  ],
  transports: {
    [kaiaTestnet.id]: fallback([
      http('https://public-en-kairos.node.kaia.io'),
    ]),
  },
});