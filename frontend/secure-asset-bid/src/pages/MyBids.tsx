import { useAccount } from "wagmi";
import { useUserBids, useAuctionData, getAuctionState, AuctionData } from "@/hooks/useAuction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Trophy, AlertCircle, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEther } from "viem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AUCTION_STATES = ["Pending", "Active", "Ended", "Settled", "Cancelled"];

function AuctionBidCard({ auctionId }: { auctionId: number }) {
  const { auction, isLoading } = useAuctionData(auctionId);
  const { address } = useAccount();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!auction) {
    return null;
  }

  const state = getAuctionState(auction);
  const isWinner = address?.toLowerCase() === auction.highestBidder.toLowerCase() &&
    auction.highestBidder !== "0x0000000000000000000000000000000000000000";
  const isActive = state === 1;
  const hasEnded = state === 2 || state === 3;
  const timeRemaining = Number(auction.endTime) * 1000 - Date.now();

  const getStatusBadge = () => {
    if (auction.cancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (isWinner && hasEnded) {
      return <Badge className="bg-green-500 hover:bg-green-600">Winner!</Badge>;
    }
    if (hasEnded) {
      return <Badge variant="secondary">Ended</Badge>;
    }
    if (isActive && timeRemaining <= 3600000) {
      return <Badge variant="destructive">Ending Soon</Badge>;
    }
    if (isActive) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  const formatTimeRemaining = () => {
    if (timeRemaining <= 0) return "Ended";
    const hours = Math.floor(timeRemaining / 1000 / 60 / 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className={`hover:shadow-lg transition-smooth ${isWinner && hasEnded ? 'border-green-500 border-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Auction #{auctionId + 1}</h3>
            <p className="text-sm text-muted-foreground">
              Created by {auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Starting Price</span>
            <span className="font-medium">{formatEther(auction.startPrice)} ETH</span>
          </div>

          {isActive && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time Left
              </span>
              <span className="font-medium">{formatTimeRemaining()}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Bids</span>
            <span className="font-medium">{Number(auction.bidCount)}</span>
          </div>

          {hasEnded && auction.revealedHighestBid > 0n && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Winning Bid
              </span>
              <span className="font-semibold text-primary">
                {formatEther(auction.revealedHighestBid)} ETH
              </span>
            </div>
          )}

          {isWinner && hasEnded && (
            <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
              <p className="text-green-600 text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Congratulations! You won this auction!
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Your Bid
            </span>
            <span className="text-muted-foreground italic">Encrypted</span>
          </div>
        </div>

        <Link to={`/auction/${auctionId + 1}`}>
          <Button variant="outline" className="w-full mt-4">
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function MyBids() {
  const { address, isConnected } = useAccount();
  const { userBids, isLoading, error } = useUserBids(address);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
              <p className="text-muted-foreground">
                Please connect your wallet to view your bids
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bids</h1>
            <p className="text-muted-foreground">
              View all auctions where you've placed encrypted bids
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading your bids...</span>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Bids</h2>
                <p className="text-muted-foreground">{error.message}</p>
              </CardContent>
            </Card>
          ) : userBids.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No Bids Yet</h2>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any bids yet. Browse active auctions to get started!
                </p>
                <Link to="/auctions">
                  <Button>
                    Browse Auctions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {userBids.length} auction{userBids.length !== 1 ? 's' : ''} with your bids
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {userBids.map((auctionId) => (
                  <AuctionBidCard key={auctionId} auctionId={auctionId} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
