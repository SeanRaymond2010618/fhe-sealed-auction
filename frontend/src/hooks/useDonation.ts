import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { submitDonation } from '../services/donation';
// import { getInstance } from 'fhevmjs';
// import { ethers } from 'ethers';

interface DonationParams {
  projectId: string;
  amount: number;
  isAnonymous: boolean;
}

interface DonationResult {
  txHash: string;
  encryptedAmount: string;
  matchingEstimate: number;
}

export const useDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Initialize FHE instance
  // const initializeFHE = async () => {
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const network = await provider.getNetwork();
  //     const instance = await getInstance({
  //       chainId: network.chainId,
  //       publicKey: process.env.REACT_APP_FHE_PUBLIC_KEY,
  //     });
  //     return instance;
  //   } catch (error) {
  //     console.error('Failed to initialize FHE:', error);
  //     throw error;
  //   }
  // };

  // Encrypt donation amount using FHE
  const encryptAmount = async (amount: number): Promise<string> => {
    try {
      // const fheInstance = await initializeFHE();
      // const encryptedAmount = await fheInstance.encrypt32(Math.floor(amount * 1e18));
      // return encryptedAmount.toString();
      
      // Simulated encryption for demo
      const simulatedEncrypted = btoa(amount.toString());
      return simulatedEncrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  };

  // Calculate quadratic funding matching
  const estimateMatching = useCallback((amount: number): number => {
    // Simplified QF calculation
    // In production, this would query the contract for accurate matching
    const sqrtAmount = Math.sqrt(amount);
    const baseMatching = sqrtAmount * 0.5;
    const cappedMatching = Math.min(baseMatching, amount * 1.5);
    return Number(cappedMatching.toFixed(4));
  }, []);

  // Submit donation mutation
  const donationMutation = useMutation({
    mutationFn: async (params: DonationParams): Promise<DonationResult> => {
      setIsLoading(true);
      try {
        // Encrypt the donation amount
        const encryptedAmount = await encryptAmount(params.amount);
        
        // Submit to blockchain
        const result = await submitDonation({
          ...params,
          encryptedAmount,
        });
        
        return {
          txHash: result.txHash,
          encryptedAmount,
          matchingEstimate: estimateMatching(params.amount),
        };
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      message.success('Donation submitted successfully!');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['myDonations'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Donation failed. Please try again.');
    },
  });

  const donate = useCallback(async (params: DonationParams) => {
    return donationMutation.mutateAsync(params);
  }, [donationMutation]);

  return {
    donate,
    isLoading: isLoading || donationMutation.isPending,
    estimateMatching,
  };
};

// Hook for streaming donations
export const useStreamingDonation = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);

  const startStream = useCallback(async (
    projectId: string,
    amountPerSecond: number,
    duration: number
  ) => {
    setIsStreaming(true);
    try {
      // Initialize streaming contract interaction
      // const streamId = await startDonationStream(projectId, amountPerSecond, duration);
      const simulatedStreamId = `stream_${Date.now()}`;
      setStreamId(simulatedStreamId);
      
      message.success('Donation stream started');
      return simulatedStreamId;
    } catch (error) {
      setIsStreaming(false);
      message.error('Failed to start donation stream');
      throw error;
    }
  }, []);

  const stopStream = useCallback(async () => {
    if (!streamId) return;
    
    try {
      // Stop the stream on-chain
      // await stopDonationStream(streamId);
      setIsStreaming(false);
      setStreamId(null);
      message.success('Donation stream stopped');
    } catch (error) {
      message.error('Failed to stop donation stream');
      throw error;
    }
  }, [streamId]);

  return {
    isStreaming,
    streamId,
    startStream,
    stopStream,
  };
};

// Hook for batch donations
export const useBatchDonation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const submitBatch = useCallback(async (
    donations: Array<{ projectId: string; amount: number }>
  ) => {
    setIsProcessing(true);
    try {
      // Encrypt all amounts
      const encryptedDonations = await Promise.all(
        donations.map(async (d) => ({
          projectId: d.projectId,
          encryptedAmount: await encryptAmount(d.amount),
          originalAmount: d.amount,
        }))
      );

      // Submit batch to contract
      // const txHash = await submitBatchDonation(encryptedDonations);
      const simulatedTxHash = `0x${Date.now().toString(16)}`;
      
      message.success(`Batch donation submitted: ${donations.length} projects supported`);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['myDonations'] });
      
      return {
        txHash: simulatedTxHash,
        donations: encryptedDonations,
      };
    } catch (error) {
      message.error('Batch donation failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [queryClient]);

  return {
    submitBatch,
    isProcessing,
  };
};

// Simulated helper function for demo
const encryptAmount = async (amount: number): Promise<string> => {
  // Simulate FHE encryption
  return btoa(amount.toString());
};