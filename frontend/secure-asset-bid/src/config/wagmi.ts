import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'FHE Sealed Bid Auction',
  projectId: '21fce48a2a4e23aca51d70a4e5849414', // WalletConnect Cloud
  chains: [sepolia],
  ssr: false,
});
