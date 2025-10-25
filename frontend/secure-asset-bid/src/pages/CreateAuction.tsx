import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuction } from "@/hooks/useAuction";
import { useNFT, useNFTOwnership } from "@/hooks/useNFT";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function CreateAuction() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { createAuction } = useAuction();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tokenContract: "",
    tokenId: "",
    startTime: "",
    endTime: "",
    reservePrice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "approve" | "create">("form");

  // Check NFT ownership
  const { isOwner, isLoading: checkingOwnership } = useNFTOwnership(
    formData.tokenContract,
    formData.tokenId
  );

  // Check NFT approval status
  const { isApproved, approveAuctionContract, refetchApproval } = useNFT(
    formData.tokenContract
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.tokenContract || !formData.tokenId) {
      toast({
        title: "Missing NFT information",
        description: "Please provide NFT contract address and token ID",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.startTime || !formData.endTime) {
      toast({
        title: "Missing time information",
        description: "Please set auction start and end times",
        variant: "destructive",
      });
      return false;
    }

    const start = new Date(formData.startTime).getTime();
    const end = new Date(formData.endTime).getTime();
    const now = Date.now();

    if (start < now) {
      toast({
        title: "Invalid start time",
        description: "Start time must be in the future",
        variant: "destructive",
      });
      return false;
    }

    if (end <= start) {
      toast({
        title: "Invalid end time",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.reservePrice || parseFloat(formData.reservePrice) <= 0) {
      toast({
        title: "Invalid reserve price",
        description: "Reserve price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (!isOwner) {
      toast({
        title: "Not NFT owner",
        description: "You must own this NFT to create an auction",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveAuctionContract();
      toast({
        title: "NFT approved!",
        description: "Auction contract can now transfer your NFT",
      });
      await refetchApproval();
      setStep("create");
    } catch (error: any) {
      toast({
        title: "Approval failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAuction = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000);

      const result = await createAuction(
        formData.tokenContract,
        formData.tokenId,
        startTimestamp,
        endTimestamp,
        formData.reservePrice
      );

      toast({
        title: "Auction created!",
        description: "Your sealed-bid auction is now live",
      });

      // Navigate to auction list
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      toast({
        title: "Failed to create auction",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!isApproved) {
      setStep("approve");
      await handleApprove();
    } else {
      await handleCreateAuction();
    }
  };

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Please connect your wallet to create an auction</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Create Sealed-Bid Auction</h1>
          <p className="text-muted-foreground">
            Auction your NFT with privacy-preserving FHE encryption
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>NFT Information</CardTitle>
            <CardDescription>Specify the NFT you want to auction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tokenContract">NFT Contract Address</Label>
              <Input
                id="tokenContract"
                placeholder="0x..."
                value={formData.tokenContract}
                onChange={(e) => handleInputChange("tokenContract", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tokenId">Token ID</Label>
              <Input
                id="tokenId"
                type="number"
                placeholder="0"
                value={formData.tokenId}
                onChange={(e) => handleInputChange("tokenId", e.target.value)}
                className="mt-2"
              />
              {checkingOwnership && (
                <p className="text-sm text-muted-foreground mt-1">Checking ownership...</p>
              )}
              {formData.tokenContract && formData.tokenId && !checkingOwnership && (
                <p className={`text-sm mt-1 flex items-center gap-1 ${isOwner ? "text-green-600" : "text-red-600"}`}>
                  {isOwner ? (
                    <>
                      <CheckCircle className="h-3 w-3" /> You own this NFT
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" /> You don't own this NFT
                    </>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auction Timeline</CardTitle>
            <CardDescription>Set when bidding starts and ends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Encrypted Reserve Price
            </CardTitle>
            <CardDescription>
              Minimum bid amount (encrypted with FHE, remains private)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="reservePrice">Reserve Price (ETH)</Label>
              <Input
                id="reservePrice"
                type="number"
                step="0.01"
                placeholder="0.1"
                value={formData.reservePrice}
                onChange={(e) => handleInputChange("reservePrice", e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be encrypted and only revealed after the auction ends
              </p>
            </div>
          </CardContent>
        </Card>

        {step === "approve" && !isApproved && (
          <Card className="border-yellow-500">
            <CardHeader>
              <CardTitle>Step 1: Approve NFT Transfer</CardTitle>
              <CardDescription>
                Allow the auction contract to transfer your NFT when the auction starts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve NFT"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !isOwner || checkingOwnership}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {step === "approve" ? "Approving NFT..." : "Creating Auction..."}
            </>
          ) : (
            "Create Encrypted Auction"
          )}
        </Button>
      </div>
    </div>
  );
}
