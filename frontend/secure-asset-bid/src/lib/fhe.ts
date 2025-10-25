import { hexlify } from "ethers";

let fheInstance: any = null;

/**
 * Initialize FHE instance with proper network provider support
 * Supports both MetaMask and OKX Wallet
 */
export async function initializeFHE(): Promise<any> {
  if (fheInstance) {
    return fheInstance;
  }

  // Check if any Ethereum provider is available (MetaMask, OKX, etc.)
  if (typeof window === 'undefined') {
    throw new Error('Window object not available');
  }

  // Support multiple wallet providers - OKX has multiple possible access paths
  let provider = null;

  // Try OKX wallet first (multiple possible locations)
  if ((window as any).okxwallet) {
    provider = (window as any).okxwallet.provider || (window as any).okxwallet;
    console.log('[FHE] Using OKX Wallet provider');
  }
  // Try Ethereum provider (MetaMask, injected wallets)
  else if ((window as any).ethereum) {
    provider = (window as any).ethereum;
    console.log('[FHE] Using Ethereum provider (MetaMask/injected)');
  }

  if (!provider) {
    console.error('[FHE] Available providers:', {
      okxwallet: (window as any).okxwallet,
      ethereum: (window as any).ethereum,
      windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('wallet') || k.toLowerCase().includes('ethereum'))
    });
    throw new Error('Ethereum provider not found. Please install MetaMask, OKX Wallet or connect your wallet.');
  }

  console.log('[FHE] Provider found:', provider);

  try {
    console.log('[FHE] Loading SDK from CDN...');

    // Dynamic import from Zama CDN
    const sdk = await import('https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js' as any);
    const { initSDK, createInstance, SepoliaConfig } = sdk as any;

    console.log('[FHE] Initializing WASM...');
    await initSDK();

    console.log('[FHE] Creating instance with network provider...');
    fheInstance = await createInstance({
      ...SepoliaConfig,
      network: provider,
      gatewayUrl: 'https://gateway.zama.ai'
    });

    console.log('[FHE] ✅ SDK initialized successfully');
    return fheInstance;
  } catch (error) {
    console.error('[FHE] ❌ Failed to initialize FHE SDK:', error);
    fheInstance = null;
    throw new Error(`FHE initialization failed: ${error}`);
  }
}

/**
 * Encrypt a bid amount for submission to the auction contract
 * @param bidAmountGwei The bid amount in Gwei (as bigint) - 1 ETH = 1e9 Gwei
 * @param contractAddress The auction contract address
 * @param userAddress The bidder's wallet address
 * @returns Object containing encrypted handle and input proof
 */
export async function encryptBid(
  bidAmountGwei: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: string; proof: string }> {
  try {
    const fhe = await initializeFHE();

    // Create encrypted input for the contract
    const input = fhe.createEncryptedInput(contractAddress, userAddress);

    // Add the bid amount as euint64 (in Gwei to fit in 64 bits)
    // Max value: 2^64-1 = ~18.4 billion ETH in Gwei units
    input.add64(bidAmountGwei);

    // Encrypt and get handles + proof
    const { handles, inputProof } = await input.encrypt();

    if (!handles || handles.length === 0) {
      throw new Error("Encryption failed: No handles returned");
    }

    return {
      handle: hexlify(handles[0]),
      proof: hexlify(inputProof),
    };
  } catch (error) {
    console.error("❌ Bid encryption failed:", error);
    throw new Error(`Failed to encrypt bid: ${error}`);
  }
}

/**
 * Encrypt a reserve price for auction creation
 * @param reservePrice The reserve price in wei (as number)
 * @param contractAddress The auction contract address
 * @param userAddress The seller's wallet address
 * @returns Object containing encrypted handle and input proof
 */
export async function encryptReservePrice(
  reservePrice: number,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: string; proof: string }> {
  try {
    const fhe = await initializeFHE();

    const input = fhe.createEncryptedInput(contractAddress, userAddress);
    input.add32(reservePrice);

    const { handles, inputProof } = await input.encrypt();

    if (!handles || handles.length === 0) {
      throw new Error("Encryption failed: No handles returned");
    }

    return {
      handle: hexlify(handles[0]),
      proof: hexlify(inputProof),
    };
  } catch (error) {
    console.error("❌ Reserve price encryption failed:", error);
    throw new Error(`Failed to encrypt reserve price: ${error}`);
  }
}

/**
 * Check if FHE SDK is available
 */
export function isFHEAvailable(): boolean {
  const w = window as any;
  return typeof w.relayerSDK !== "undefined";
}

/**
 * Get FHE instance (will initialize if not already done)
 */
export async function getFHEInstance(): Promise<any> {
  return initializeFHE();
}
