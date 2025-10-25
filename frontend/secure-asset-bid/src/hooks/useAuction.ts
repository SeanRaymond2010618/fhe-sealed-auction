import { useAccount, useWriteContract, usePublicClient, useReadContract } from "wagmi";
import { parseEther, formatEther, parseUnits } from "ethers";
import { encryptBid, encryptReservePrice } from "@/lib/fhe";
import { AUCTION_CONTRACT_ADDRESS } from "@/lib/contracts/addresses";
import AuctionABI from "@/lib/contracts/FHESealedBidAuction.json";

export interface AuctionData {
  auctionId: number;
  seller: string;
  tokenContract: string;
  tokenId: bigint;
  startTime: bigint;
  endTime: bigint;
  highestBidder: string;
  state: number; // 0=Pending, 1=Active, 2=Ended, 3=Settled, 4=Cancelled
}

/**
 * Hook for interacting with FHE Sealed Bid Auction contract
 */
export function useAuction() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  /**
   * Place an encrypted bid on an auction
   * @param auctionId The auction ID to bid on
   * @param bidAmount The bid amount in ETH
   */
  const placeBid = async (auctionId: number, bidAmount: string) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Convert ETH to Gwei for encryption (1 ETH = 1e9 Gwei)
      // This keeps the value within 64-bit integer range
      const bidGwei = parseUnits(bidAmount, "gwei");
      const bidWei = parseEther(bidAmount);

      // Encrypt the bid using FHE (in Gwei)
      const { handle, proof } = await encryptBid(
        bidGwei,
        AUCTION_CONTRACT_ADDRESS,
        address
      );

      // Submit encrypted bid to contract (send actual ETH value in wei)
      const hash = await writeContractAsync({
        address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: AuctionABI.abi,
        functionName: "placeBid",
        args: [BigInt(auctionId), handle, proof],
        value: bidWei,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient?.waitForTransactionReceipt({ hash });

      return { hash, receipt };
    } catch (error) {
      console.error("Failed to place bid:", error);
      throw error;
    }
  };
  const createAuction = async (
    tokenContract: string,
    tokenId: string,
    startTime: number,
    endTime: number,
    reservePrice: string
  ) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Convert reserve price to wei
      const reserveWei = parseEther(reservePrice);
      const reserveNumber = Number(reserveWei);

      // Encrypt reserve price
      const { handle, proof } = await encryptReservePrice(
        reserveNumber,
        AUCTION_CONTRACT_ADDRESS,
        address
      );

      // Create auction
      const hash = await writeContractAsync({
        address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: AuctionABI.abi,
        functionName: "createAuction",
        args: [
          tokenContract,
          BigInt(tokenId),
          BigInt(startTime),
          BigInt(endTime),
          handle,
          proof,
        ],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash });

      return { hash, receipt };
    } catch (error) {
      console.error("Failed to create auction:", error);
      throw error;
    }
  };

  /**
   * Reveal the winner of an auction
   */
  const revealWinner = async (auctionId: number) => {
    try {
      const hash = await writeContractAsync({
        address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: AuctionABI.abi,
        functionName: "revealWinner",
        args: [BigInt(auctionId)],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      return { hash, receipt };
    } catch (error) {
      console.error("Failed to reveal winner:", error);
      throw error;
    }
  };

  /**
   * Claim the auction item as the winner
   */
  const claimItem = async (auctionId: number) => {
    try {
      const hash = await writeContractAsync({
        address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: AuctionABI.abi,
        functionName: "claimItem",
        args: [BigInt(auctionId)],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      return { hash, receipt };
    } catch (error) {
      console.error("Failed to claim item:", error);
      throw error;
    }
  };

  /**
   * Claim refund as a losing bidder
   */
  const claimRefund = async (auctionId: number) => {
    try {
      const hash = await writeContractAsync({
        address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: AuctionABI.abi,
        functionName: "claimRefund",
        args: [BigInt(auctionId)],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      return { hash, receipt };
    } catch (error) {
      console.error("Failed to claim refund:", error);
      throw error;
    }
  };

  return {
    placeBid,
    createAuction,
    revealWinner,
    claimItem,
    claimRefund,
  };
}

/**
 * Hook to read auction data from contract
 */
export function useAuctionData(auctionId: number) {
  const { data, isLoading, error } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: AuctionABI.abi,
    functionName: "getAuction",
    args: [BigInt(auctionId)],
  });

  return {
    auction: data as AuctionData | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to get total auction count
 */
export function useAuctionCount() {
  const { data, isLoading, error } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: AuctionABI.abi,
    functionName: "auctionCount",
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
  };
}
