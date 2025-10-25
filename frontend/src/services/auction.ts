import axios from 'axios';
import { Auction, Bid, UserBid, AuctionFilters, AuctionType } from '@/types/auction';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockAuctions: Auction[] = [
  {
    id: '1',
    type: AuctionType.SEALED_BID,
    status: 'active' as any,
    seller: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
    nftContract: '0x1234567890123456789012345678901234567890',
    tokenId: '1',
    nftMetadata: {
      name: 'Crypto Punk #1234',
      description: 'A rare digital collectible',
      image: 'https://via.placeholder.com/400x400/2563EB/FFFFFF?text=NFT',
      attributes: [
        { trait_type: 'Background', value: 'Blue' },
        { trait_type: 'Type', value: 'Alien' },
      ],
    },
    startingPrice: '1000000000000000000',
    reservePrice: '2000000000000000000',
    startTime: Date.now() - 86400000,
    endTime: Date.now() + 86400000,
    revealTime: Date.now() + 172800000,
    minDeposit: '100000000000000000',
    totalBids: 5,
    uniqueBidders: 3,
  },
  {
    id: '2',
    type: AuctionType.ENGLISH,
    status: 'active' as any,
    seller: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    nftContract: '0x2345678901234567890123456789012345678901',
    tokenId: '42',
    nftMetadata: {
      name: 'Bored Ape #42',
      description: 'Member of the Bored Ape Yacht Club',
      image: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=BAYC',
      attributes: [
        { trait_type: 'Fur', value: 'Golden' },
        { trait_type: 'Eyes', value: 'Laser' },
      ],
    },
    startingPrice: '5000000000000000000',
    currentPrice: '7500000000000000000',
    startTime: Date.now() - 43200000,
    endTime: Date.now() + 43200000,
    minDeposit: '500000000000000000',
    totalBids: 12,
    uniqueBidders: 7,
  },
  {
    id: '3',
    type: AuctionType.DUTCH,
    status: 'active' as any,
    seller: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    nftContract: '0x3456789012345678901234567890123456789012',
    tokenId: '99',
    nftMetadata: {
      name: 'Art Blocks #99',
      description: 'Generative art piece',
      image: 'https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=ART',
      attributes: [
        { trait_type: 'Algorithm', value: 'Fractal' },
        { trait_type: 'Palette', value: 'Sunset' },
      ],
    },
    startingPrice: '10000000000000000000',
    currentPrice: '8000000000000000000',
    priceDecrement: '100000000000000000',
    decrementInterval: 3600,
    startTime: Date.now() - 7200000,
    endTime: Date.now() + 79200000,
    minDeposit: '1000000000000000000',
    totalBids: 0,
    uniqueBidders: 0,
  },
];

export const auctionService = {
  // Fetch all auctions with filters
  async getAuctions(filters?: AuctionFilters): Promise<Auction[]> {
    try {
      const response = await api.get('/auctions', { params: filters });
      return response.data;
    } catch (error) {
      // Return mock data in development
      return mockAuctions;
    }
  },

  // Get single auction details
  async getAuction(auctionId: string): Promise<Auction> {
    try {
      const response = await api.get(`/auctions/${auctionId}`);
      return response.data;
    } catch (error) {
      const auction = mockAuctions.find(a => a.id === auctionId);
      if (!auction) throw new Error('Auction not found');
      return auction;
    }
  },

  // Create new auction
  async createAuction(data: Partial<Auction>): Promise<Auction> {
    try {
      const response = await api.post('/auctions', data);
      return response.data;
    } catch (error) {
      // Mock response
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending' as any,
        totalBids: 0,
        uniqueBidders: 0,
      } as Auction;
    }
  },

  // Place a bid (encrypted for sealed-bid auctions)
  async placeBid(auctionId: string, amount: string, encrypted?: boolean): Promise<Bid> {
    try {
      const response = await api.post(`/auctions/${auctionId}/bids`, {
        amount,
        encrypted,
      });
      return response.data;
    } catch (error) {
      // Mock response
      return {
        id: Math.random().toString(36).substr(2, 9),
        auctionId,
        bidder: '0x' + Math.random().toString(16).substr(2, 40),
        amount,
        timestamp: Date.now(),
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      };
    }
  },

  // Get user's bids
  async getUserBids(userAddress: string): Promise<UserBid[]> {
    try {
      const response = await api.get(`/users/${userAddress}/bids`);
      return response.data;
    } catch (error) {
      // Mock response
      return [];
    }
  },

  // Get user's auctions (as seller)
  async getUserAuctions(userAddress: string): Promise<Auction[]> {
    try {
      const response = await api.get(`/users/${userAddress}/auctions`);
      return response.data;
    } catch (error) {
      return mockAuctions.filter(a => a.seller === userAddress);
    }
  },

  // Reveal bid (for sealed-bid auctions)
  async revealBid(auctionId: string, bidId: string, actualAmount: string): Promise<void> {
    try {
      await api.post(`/auctions/${auctionId}/bids/${bidId}/reveal`, {
        actualAmount,
      });
    } catch (error) {
      console.error('Error revealing bid:', error);
    }
  },

  // Settle auction
  async settleAuction(auctionId: string): Promise<void> {
    try {
      await api.post(`/auctions/${auctionId}/settle`);
    } catch (error) {
      console.error('Error settling auction:', error);
    }
  },

  // Cancel auction (only by seller before bids)
  async cancelAuction(auctionId: string): Promise<void> {
    try {
      await api.post(`/auctions/${auctionId}/cancel`);
    } catch (error) {
      console.error('Error cancelling auction:', error);
    }
  },

  // Get bid history for an auction
  async getAuctionBids(auctionId: string): Promise<Bid[]> {
    try {
      const response = await api.get(`/auctions/${auctionId}/bids`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Subscribe to auction updates (WebSocket or polling)
  subscribeToAuction(auctionId: string, callback: (auction: Auction) => void): () => void {
    // For Dutch auctions, update price every interval
    const interval = setInterval(async () => {
      try {
        const auction = await this.getAuction(auctionId);
        callback(auction);
      } catch (error) {
        console.error('Error fetching auction updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  },
};