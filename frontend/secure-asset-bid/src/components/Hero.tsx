import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-sm font-medium backdrop-blur-sm">
              <Lock className="w-4 h-4" />
              Zero-Knowledge Privacy Protocol
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Private
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                Asset Auctions
              </span>
              <br />
              Redefined
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Trade DeFi debt claims, NFTs, and digital assets with military-grade privacy. 
              Your bids, your identity—completely anonymous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground transition-smooth group"
                onClick={() => navigate('/create')}
              >
                Start Bidding
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-smooth"
                onClick={() => navigate('/auctions')}
              >
                View Live Auctions
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">$24M+</div>
                <div className="text-sm text-muted-foreground">Volume</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">150+</div>
                <div className="text-sm text-muted-foreground">Auctions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">5K+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual showcase */}
          <div className="relative lg:block hidden">
            <div className="relative space-y-6">
              {/* Floating cards */}
              <div className="absolute -top-10 right-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm w-64">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Active Bid</div>
                      <div className="text-xs text-muted-foreground">Encrypted</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">45.2 ETH</div>
                  <div className="text-xs text-success">+12.5% from floor</div>
                </div>
              </div>

              <div className="absolute top-32 right-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm w-72">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Privacy Level</span>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      Maximum
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs">Zero-Knowledge Proofs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs">Encrypted Transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs">Anonymous Bidding</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-40 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-card border border-border rounded-2xl p-5 shadow-lg backdrop-blur-sm w-56">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-warning" />
                    <span className="text-sm font-medium">Fast Settlement</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">~2s</div>
                  <div className="text-xs text-muted-foreground">Average claim time</div>
                </div>
              </div>

              {/* Large central card */}
              <div className="relative ml-20 mt-20 animate-scale-in">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-24 h-24 text-primary/40" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl font-bold">Aave Debt Claim #1234</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Bid</span>
                      <span className="text-lg font-bold text-primary">25.5 ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
