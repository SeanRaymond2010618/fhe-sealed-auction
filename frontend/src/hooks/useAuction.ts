import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionService } from '@/services/auction';
import { Auction, AuctionFilters, Bid } from '@/types/auction';
import { useEffect } from 'react';
import { message } from 'antd';

export const useAuctions = (filters?: AuctionFilters) => {
  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: () => auctionService.getAuctions(filters),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useAuction = (auctionId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => auctionService.getAuction(auctionId),
    enabled: !!auctionId,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!auctionId) return;

    const unsubscribe = auctionService.subscribeToAuction(auctionId, (auction) => {
      queryClient.setQueryData(['auction', auctionId], auction);
    });

    return unsubscribe;
  }, [auctionId, queryClient]);

  return query;
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionService.createAuction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      message.success('Auction created successfully!');
      return data;
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create auction');
    },
  });
};

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, amount, encrypted }: { 
      auctionId: string; 
      amount: string; 
      encrypted?: boolean;
    }) => auctionService.placeBid(auctionId, amount, encrypted),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auction-bids', variables.auctionId] });
      message.success('Bid placed successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to place bid');
    },
  });
};

export const useAuctionBids = (auctionId: string) => {
  return useQuery({
    queryKey: ['auction-bids', auctionId],
    queryFn: () => auctionService.getAuctionBids(auctionId),
    enabled: !!auctionId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

export const useUserBids = (userAddress: string) => {
  return useQuery({
    queryKey: ['user-bids', userAddress],
    queryFn: () => auctionService.getUserBids(userAddress),
    enabled: !!userAddress,
  });
};

export const useUserAuctions = (userAddress: string) => {
  return useQuery({
    queryKey: ['user-auctions', userAddress],
    queryFn: () => auctionService.getUserAuctions(userAddress),
    enabled: !!userAddress,
  });
};

export const useRevealBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, bidId, actualAmount }: {
      auctionId: string;
      bidId: string;
      actualAmount: string;
    }) => auctionService.revealBid(auctionId, bidId, actualAmount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      message.success('Bid revealed successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to reveal bid');
    },
  });
};

export const useSettleAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionService.settleAuction,
    onSuccess: (_, auctionId) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      message.success('Auction settled successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to settle auction');
    },
  });
};

export const useCancelAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionService.cancelAuction,
    onSuccess: (_, auctionId) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      message.success('Auction cancelled successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to cancel auction');
    },
  });
};