import { useState } from "react";
import { useAuctionCount, useAuctionData } from "@/hooks/useAuction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const AUCTION_STATES = ["Pending", "Active", "Ended", "Settled", "Cancelled"];

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

  const isActive = auction.state === 1;
  const hasEnded = auction.state === 2;
  const timeRemaining = Number(auction.endTime) * 1000 - Date.now();
  const hasStarted = Date.now() >= Number(auction.startTime) * 1000;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Auction #{auctionId}</CardTitle>
            <CardDescription className="mt-1">
              Token ID: {auction.tokenId.toString()}
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : hasEnded ? "secondary" : "outline"}>
            {AUCTION_STATES[auction.state]}
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
            {auction.highestBidder !== "0x0000000000000000000000000000000000000000" && (
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Current Leader
                </p>
                <p className="font-mono text-xs mt-1">
                  {auction.highestBidder.substring(0, 6)}...
                  {auction.highestBidder.substring(38)}
                </p>
              </div>
            )}
          </div>

          {isActive && timeRemaining > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Ends in {Math.floor(timeRemaining / 1000 / 60 / 60)}h{" "}
                {Math.floor((timeRemaining / 1000 / 60) % 60)}m
              </span>
            </div>
          )}

          <Link to={`/auction/${auctionId}`}>
            <Button className="w-full" variant={isActive ? "default" : "outline"}>
              {isActive ? "Place Bid" : "View Details"}
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const auctionIds = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Auctions</h1>
        <p className="text-muted-foreground">
          Browse privacy-preserving sealed-bid auctions powered by FHE encryption
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Auctions
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
  );
}
