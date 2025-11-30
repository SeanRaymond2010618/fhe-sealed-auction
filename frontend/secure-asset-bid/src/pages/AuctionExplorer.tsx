import { useState } from "react";
import { useAuctionCount, useAuctionData, getAuctionState, AuctionData } from "@/hooks/useAuction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Trophy, Users, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEther } from "viem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AUCTION_STATES = ["Pending", "Active", "Ended", "Settled", "Cancelled"];
const STATE_COLORS: Record<number, "default" | "secondary" | "outline" | "destructive"> = {
  0: "outline",
  1: "default",
  2: "secondary",
  3: "secondary",
  4: "destructive",
};

function AuctionCard({ auctionId }: { auctionId: number }) {
  const { auction, isLoading } = useAuctionData(auctionId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!auction) return null;

  const state = getAuctionState(auction);
  const isActive = state === 1;
  const timeRemaining = Number(auction.endTime) * 1000 - Date.now();

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "Ended";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Auction #{auctionId}</CardTitle>
            <CardDescription className="mt-1">
              Starting Price: {formatEther(auction.startPrice)} ETH
            </CardDescription>
          </div>
          <Badge variant={STATE_COLORS[state]}>
            {AUCTION_STATES[state]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Seller</p>
              <p className="font-mono text-xs mt-1">
                {auction.seller.substring(0, 6)}...{auction.seller.substring(38)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Bids
              </p>
              <p className="font-semibold mt-1">
                {Number(auction.bidCount)} sealed bids
              </p>
            </div>
          </div>

          {auction.highestBidder !== "0x0000000000000000000000000000000000000000" && (
            <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Current Leader:</span>
              <span className="font-mono text-xs">
                {auction.highestBidder.substring(0, 6)}...{auction.highestBidder.substring(38)}
              </span>
            </div>
          )}

          {isActive && timeRemaining > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Ends in {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          )}

          {auction.revealedHighestBid > 0n && (
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-green-500" />
              <span>
                Winning Bid: {formatEther(auction.revealedHighestBid)} ETH
              </span>
            </div>
          )}

          <Link to={`/auction/${auctionId}`}>
            <Button className="w-full" variant={isActive ? "default" : "outline"}>
              {isActive ? "Place Sealed Bid" : "View Details"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuctionExplorer() {
  const { count, isLoading } = useAuctionCount();
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all");

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

  const auctionIds = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Auctions</h1>
        <p className="text-muted-foreground">
          Browse privacy-preserving sealed-bid auctions powered by FHE encryption
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Contract: <code className="bg-muted px-2 py-1 rounded text-xs">0xbF2A26Bad75721e80332455191D435e194382276</code>
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Auctions ({count})
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "ended" ? "default" : "outline"}
          onClick={() => setFilter("ended")}
        >
          Ended
        </Button>
      </div>

      {count === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No auctions found</p>
            <Link to="/create">
              <Button>Create First Auction</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionIds.map((id) => (
            <AuctionCard key={id} auctionId={id} />
          ))}
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}
