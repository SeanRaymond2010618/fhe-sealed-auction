/**
 * Smart contract addresses configuration
 * Update these after deploying contracts to Sepolia
 */

export const AUCTION_CONTRACT_ADDRESS =
  (import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS as string) ||
  "0x0000000000000000000000000000000000000000"; // Update after deployment

export const NFT_CONTRACT_ADDRESS =
  (import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string) ||
  "0x0000000000000000000000000000000000000000"; // For testing with NFTs

// Chain configuration
export const SEPOLIA_CHAIN_ID = 11155111;

// Block explorer
export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
