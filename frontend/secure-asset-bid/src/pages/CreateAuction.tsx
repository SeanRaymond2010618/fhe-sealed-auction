import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuction } from "@/hooks/useAuction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { txToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CreateAuction() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { createAuction } = useAuction();

  const [formData, setFormData] = useState({
    startPrice: "",
    duration: "3600", // Default 1 hour
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      sonnerToast.error("Invalid start price", {
        description: "Start price must be greater than 0",
      });
      return false;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      sonnerToast.error("Invalid duration", {
        description: "Duration must be greater than 0",
      });
      return false;
    }

    return true;
  };

  const handleCreateAuction = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = txToast.pending("Creating auction...");

    try {
      const result = await createAuction(
        formData.startPrice,
        parseInt(formData.duration)
      );

      txToast.dismiss(toastId);
      txToast.success(result.hash, "Auction created successfully!");

      // Navigate to auction list after a short delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      txToast.dismiss(toastId);
      txToast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Please connect your wallet to create an auction</p>
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
        <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Create Sealed-Bid Auction</h1>
          <p className="text-muted-foreground">
            Create a new auction with FHE-encrypted bids
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Auction Settings
            </CardTitle>
            <CardDescription>
              Configure your sealed-bid auction parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startPrice">Starting Price (ETH)</Label>
              <Input
                id="startPrice"
                type="number"
                step="0.001"
                placeholder="0.1"
                value={formData.startPrice}
                onChange={(e) => handleInputChange("startPrice", e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum bid amount for this auction
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-2"
              >
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
                <option value="7200">2 hours</option>
                <option value="21600">6 hours</option>
                <option value="43200">12 hours</option>
                <option value="86400">1 day</option>
                <option value="172800">2 days</option>
                <option value="604800">1 week</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                How long the auction will accept bids
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary">Privacy Protected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All bids are encrypted using Fully Homomorphic Encryption (FHE).
                  Bid amounts remain private until the auction ends and the winner is determined.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleCreateAuction}
          disabled={isSubmitting || !formData.startPrice}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Auction...
            </>
          ) : (
            "Create Sealed-Bid Auction"
          )}
        </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
