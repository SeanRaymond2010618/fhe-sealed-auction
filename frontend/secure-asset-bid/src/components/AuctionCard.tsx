import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { txToast } from '@/hooks/use-toast';
import { useAuction } from '@/hooks/useAuction';
import { useAccount } from 'wagmi';
import { toast as sonnerToast } from 'sonner';

interface AuctionCardProps {
  id?: number;
  title: string;
  type: 'DeFi Debt' | 'NFT' | 'Token';
  currentBid: string;
  timeLeft: string;
  status: 'active' | 'ending-soon';
  bidders: number;
  imageUrl?: string;
}

const AuctionCard = ({ id, title, type, currentBid, timeLeft, status, bidders, imageUrl }: AuctionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { placeBid } = useAuction();
  const { address, isConnected } = useAccount();
  return (
    <Card className="shadow-card hover:shadow-lg transition-smooth overflow-hidden border border-border">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl opacity-20">🔒</div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge 
            variant={status === 'active' ? 'default' : 'destructive'}
            className={status === 'active' ? 'bg-success' : 'bg-warning'}
          >
            {status === 'active' ? 'Active' : 'Ending Soon'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Asset Type</span>
            <span className="font-medium">{type}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Bid</span>
            <span className="font-semibold text-primary">{currentBid}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time Left
            </span>
            <span className="font-medium">{timeLeft}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bidders</span>
            <span className="font-medium">{bidders}</span>
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary-hover transition-base"
          onClick={() => setIsOpen(true)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Place Bid
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Enter your encrypted bid amount. Your bid will remain private until the auction ends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Bid Amount (ETH)</Label>
              <Input
                id="bid-amount"
                type="number"
                step="0.01"
                placeholder="Enter amount (e.g., 25.5)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Starting price: {currentBid}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                if (!isConnected || !address) {
                  sonnerToast.error("Wallet not connected", {
                    description: "Please connect your wallet to place a bid",
                  });
                  return;
                }

                if (!id) {
                  sonnerToast.error("Invalid auction", {
                    description: "Auction ID not found",
                  });
                  return;
                }

                if (!bidAmount || parseFloat(bidAmount) <= 0) {
                  sonnerToast.error("Invalid bid amount", {
                    description: "Please enter a valid bid amount",
                  });
                  return;
                }

                setIsSubmitting(true);
                const toastId = txToast.pending("Encrypting and submitting bid...");

                try {
                  const result = await placeBid(id - 1, bidAmount); // Convert to 0-based index
                  txToast.dismiss(toastId);
                  txToast.success(result.hash, "Bid placed successfully!");
                  setBidAmount('');
                  setIsOpen(false);
                } catch (error: any) {
                  txToast.dismiss(toastId);
                  txToast.error(error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
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
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AuctionCard;
