export enum AuctionType {
  SEALED_BID = 'sealed-bid',
  ENGLISH = 'english',
  DUTCH = 'dutch',
  BATCH = 'batch'
}

export enum AuctionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  SETTLED = 'settled'
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Auction {
  id: string;
  type: AuctionType;
  status: AuctionStatus;
  seller: string;
  nftContract: string;
  tokenId: string;
  nftMetadata?: NFTMetadata;
  
  // Pricing
  startingPrice: string;
  reservePrice?: string;
  currentPrice?: string;
  priceDecrement?: string; // For Dutch auctions
  decrementInterval?: number; // For Dutch auctions
  
  // Timing
  startTime: number;
  endTime: number;
  revealTime?: number; // For sealed-bid auctions
  
  // Participation
  minDeposit: string;
  totalBids: number;
  uniqueBidders: number;
  
  // Winner info (after auction ends)
  winner?: string;
  winningBid?: string;
  
  // Batch auction specific
  supply?: number;
  minBidPerUnit?: string;
  allocations?: Array<{
    bidder: string;
    quantity: number;
    pricePerUnit: string;
  }>;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: string; // Encrypted for sealed-bid
  timestamp: number;
  isRevealed?: boolean;
  quantity?: number; // For batch auctions
  transactionHash: string;
}

export interface UserBid extends Bid {
  isWinning?: boolean;
  rank?: number;
  refundable?: boolean;
  refundAmount?: string;
}

export interface AuctionFilters {
  type?: AuctionType;
  status?: AuctionStatus;
  minPrice?: string;
  maxPrice?: string;
  seller?: string;
  nftContract?: string;
  sortBy?: 'price' | 'endTime' | 'bids' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}