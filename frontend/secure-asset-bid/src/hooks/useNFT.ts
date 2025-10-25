import { useAccount, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { AUCTION_CONTRACT_ADDRESS } from "@/lib/contracts/addresses";

// Standard ERC721 ABI (minimal)
const ERC721_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useNFT(nftContractAddress?: string) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  /**
   * Check if auction contract is approved to transfer user's NFTs
   */
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: nftContractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "isApprovedForAll",
    args: address && nftContractAddress ? [address, AUCTION_CONTRACT_ADDRESS as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!nftContractAddress,
    },
  });

  /**
   * Approve auction contract to transfer all user's NFTs
   */
  const approveAuctionContract = async () => {
    if (!nftContractAddress || !address) {
      throw new Error("NFT contract address and wallet connection required");
    }

    const hash = await writeContractAsync({
      address: nftContractAddress as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "setApprovalForAll",
      args: [AUCTION_CONTRACT_ADDRESS as `0x${string}`, true],
    });

    await publicClient?.waitForTransactionReceipt({ hash });
    await refetchApproval();

    return hash;
  };

  /**
   * Check who owns a specific NFT
   */
  const { data: owner } = useReadContract({
    address: nftContractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "ownerOf",
    args: nftContractAddress ? [BigInt(0)] : undefined, // Default to token 0
    query: {
      enabled: !!nftContractAddress,
    },
  });

  /**
   * Get NFT metadata URI
   */
  const { data: tokenURI } = useReadContract({
    address: nftContractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "tokenURI",
    args: nftContractAddress ? [BigInt(0)] : undefined,
    query: {
      enabled: !!nftContractAddress,
    },
  });

  /**
   * Get user's NFT balance
   */
  const { data: balance } = useReadContract({
    address: nftContractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: address && nftContractAddress ? [address] : undefined,
    query: {
      enabled: !!address && !!nftContractAddress,
    },
  });

  return {
    isApproved: isApproved ?? false,
    approveAuctionContract,
    owner,
    tokenURI,
    balance: balance ? Number(balance) : 0,
    refetchApproval,
  };
}

/**
 * Hook to check ownership of a specific NFT token
 */
export function useNFTOwnership(nftContractAddress: string, tokenId: string) {
  const { address } = useAccount();

  const { data: owner, isLoading } = useReadContract({
    address: nftContractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
    query: {
      enabled: !!nftContractAddress && !!tokenId,
    },
  });

  const isOwner = address && owner ? address.toLowerCase() === owner.toLowerCase() : false;

  return {
    owner,
    isOwner,
    isLoading,
  };
}
