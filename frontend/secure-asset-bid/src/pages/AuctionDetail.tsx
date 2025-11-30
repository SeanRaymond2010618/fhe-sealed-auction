import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuction, useAuctionData } from "@/hooks/useAuction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { txToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Loader2, Clock, Trophy, Lock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AUCTION_STATES = ["Pending", "Active", "Ended", "Settled", "Cancelled"];

// Mock auction data for demo purposes
const mockAuctions = [
  {
    id: 1,
    title: 'Aave Protocol Debt Claim #1234',
    type: 'DeFi Debt',
    tokenContract: '0xAave0000000000000000000000000000DebtClaim',
    tokenId: 1234n,
    seller: '0x1234567890123456789012345678901234567890',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 86400),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 172800),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/12645/large/aave-token-round.png'
  },
  {
    id: 2,
    title: 'CryptoPunk NFT Rights',
    type: 'NFT',
    tokenContract: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    tokenId: 8348n,
    seller: '0x2345678901234567890123456789012345678901',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 43200),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 19800),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/16785/large/cryptopunk.jpg'
  },
  {
    id: 3,
    title: 'Compound Liquidation Asset',
    type: 'DeFi Debt',
    tokenContract: '0xComp0000000000000000000000000000Liquidate',
    tokenId: 5678n,
    seller: '0x3456789012345678901234567890123456789012',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 28800),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 115200),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png'
  },
  {
    id: 4,
    title: 'Governance Token Package',
    type: 'Token',
    tokenContract: '0xUni00000000000000000000000000000Governance',
    tokenId: 9012n,
    seller: '0x4567890123456789012345678901234567890123',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 14400),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 259200),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg'
  },
  {
    id: 5,
    title: 'MakerDAO Vault Debt',
    type: 'DeFi Debt',
    tokenContract: '0xMaker000000000000000000000000000VaultDebt',
    tokenId: 3456n,
    seller: '0x5678901234567890123456789012345678901234',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 7200),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 15300),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png'
  },
  {
    id: 6,
    title: 'Rare NFT Collection Bundle',
    type: 'NFT',
    tokenContract: '0xApeCoin000000000000000000000000Collection',
    tokenId: 7890n,
    seller: '0x6789012345678901234567890123456789012345',
    startTime: BigInt(Math.floor(Date.now() / 1000) - 21600),
    endTime: BigInt(Math.floor(Date.now() / 1000) + 241200),
    highestBidder: '0x0000000000000000000000000000000000000000',
    state: 1,
    imageUrl: 'https://assets.coingecko.com/coins/images/24383/large/apecoin.jpg'
  }
];

export default function AuctionDetail() {
  const { id } = useParams();
  const auctionId = Number(id);
  const { address } = useAccount();
  const { auction: chainAuction, isLoading } = useAuctionData(auctionId);
  const { placeBid, endAuction } = useAuction();

  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use mock data if chain auction not found
  const mockAuction = mockAuctions.find(a => a.id === auctionId);
  const auction = chainAuction || mockAuction;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Auction not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const isActive = auction.state === 1;
  const hasEnded = auction.state === 2;
  const isSettled = auction.state === 3;
  const isSeller = address?.toLowerCase() === auction.seller.toLowerCase();
  const isWinner =
    address?.toLowerCase() === auction.highestBidder.toLowerCase() &&
    auction.highestBidder !== "0x0000000000000000000000000000000000000000";

  const timeRemaining = Number(auction.endTime) * 1000 - Date.now();

  const handlePlaceBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      sonnerToast.error("Invalid bid amount", {
        description: "Please enter a valid bid amount",
      });
      return;
    }

    setIsSubmitting(true);
    const toastId = txToast.pending("Encrypting and submitting bid...");

    try {
      const result = await placeBid(auctionId, bidAmount);
      txToast.dismiss(toastId);
      txToast.success(result.hash, "Bid placed successfully!");
      setBidAmount("");
    } catch (error: any) {
      txToast.dismiss(toastId);
      txToast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndAuction = async () => {
    setIsSubmitting(true);
    const toastId = txToast.pending("Ending auction...");

    try {
      const result = await endAuction(auctionId);
      txToast.dismiss(toastId);
      txToast.success(result.hash, "Auction ended successfully!");
    } catch (error: any) {
      txToast.dismiss(toastId);
      txToast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{(auction as any).title || `Auction #${auctionId}`}</h1>
              <p className="text-muted-foreground">
                Sealed-bid auction with FHE privacy protection
              </p>
            </div>
          <Badge
            variant={isActive ? "default" : hasEnded ? "secondary" : "outline"}
            className="text-lg px-4 py-2"
          >
            {AUCTION_STATES[auction.state]}
          </Badge>
        </div>

        {/* Auction Image Card */}
        {(auction as any).imageUrl && (
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                <img
                  src={(auction as any).imageUrl}
                  alt={(auction as any).title}
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
            <CardDescription>Item and timeline information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Token Contract</Label>
                <p className="font-mono text-sm mt-1">{auction.tokenContract}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Token ID</Label>
                <p className="font-mono text-sm mt-1">{auction.tokenId.toString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Seller</Label>
                <p className="font-mono text-sm mt-1">{auction.seller}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="text-sm mt-1">
                  {new Date(Number(auction.startTime) * 1000).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">End Time</Label>
                <p className="text-sm mt-1">
                  {new Date(Number(auction.endTime) * 1000).toLocaleString()}
                </p>
              </div>
              {isActive && timeRemaining > 0 && (
                <div>
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Time Remaining
                  </Label>
                  <p className="text-sm mt-1 font-semibold">
                    {Math.floor(timeRemaining / 1000 / 60 / 60)}h{" "}
                    {Math.floor((timeRemaining / 1000 / 60) % 60)}m
                  </p>
                </div>
              )}
            </div>

            {auction.highestBidder !== "0x0000000000000000000000000000000000000000" && (
              <div className="pt-4 border-t">
                <Label className="text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-4 w-4" /> Current Leader
                </Label>
                <p className="font-mono text-sm mt-1">{auction.highestBidder}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {isActive && !isSeller && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Place Encrypted Bid
              </CardTitle>
              <CardDescription>
                Your bid amount is encrypted using FHE and remains private until auction end
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bid-amount">Bid Amount (ETH)</Label>
                <Input
                  id="bid-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                className="w-full"
                onClick={handlePlaceBid}
                disabled={isSubmitting || !bidAmount}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Encrypting & Submitting...
                  </>
                ) : (
                  "Place Encrypted Bid"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {isActive && timeRemaining <= 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Auction Time Expired</CardTitle>
              <CardDescription>End the auction to reveal the winner</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleEndAuction} disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ending Auction...
                  </>
                ) : (
                  "End Auction & Reveal Winner"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {hasEnded && isWinner && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" /> You Won!
              </CardTitle>
              <CardDescription>Congratulations! You are the highest bidder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The auction has ended and you are the winner.
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
