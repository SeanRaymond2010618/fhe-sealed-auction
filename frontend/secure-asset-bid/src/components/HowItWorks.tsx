import { Shield, Eye, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Shield,
      title: 'Connect Wallet',
      description: 'Securely connect your Web3 wallet to access the platform',
      detail: 'Support for MetaMask, WalletConnect, and all major wallets'
    },
    {
      icon: Eye,
      title: 'Browse Assets',
      description: 'Explore auctions for DeFi debt, NFTs, and more with privacy protection',
      detail: 'Filter by asset type, price range, and time remaining'
    },
    {
      icon: Zap,
      title: 'Place Private Bids',
      description: 'Submit encrypted bids using zero-knowledge proofs',
      detail: 'Your bid amount remains hidden from all other participants'
    },
    {
      icon: CheckCircle,
      title: 'Win & Claim',
      description: 'Winners are determined securely without revealing bid amounts',
      detail: 'Instant on-chain settlement upon auction completion'
    }
  ];

  return (
    <section id="how-it-works" className="py-32 gradient-subtle relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Split layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left - Title */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                Simple Process
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                How Privacy
                <br />
                Auctions Work
              </h2>
              <p className="text-xl text-muted-foreground">
                Four simple steps to secure, anonymous bidding with complete transparency where it matters
              </p>
            </div>

            {/* Right - Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-smooth hover:border-primary/50"
                  >
                    <div className="flex gap-6">
                      {/* Step number and icon */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shadow-md">
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-xl">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        <p className="text-sm text-muted-foreground/70 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-accent" />
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    {/* Connecting line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-[2.75rem] top-[5rem] w-0.5 h-6 bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security features showcase */}
          <div className="grid md:grid-cols-3 gap-8 pt-16 border-t border-border">
            <div className="space-y-3">
              <div className="text-4xl">🔐</div>
              <h4 className="font-semibold text-lg">Zero-Knowledge Proofs</h4>
              <p className="text-sm text-muted-foreground">
                Cryptographic verification without revealing sensitive information
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">⚡</div>
              <h4 className="font-semibold text-lg">Instant Settlement</h4>
              <p className="text-sm text-muted-foreground">
                Automated smart contract execution upon auction completion
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🛡️</div>
              <h4 className="font-semibold text-lg">Verifiable Fairness</h4>
              <p className="text-sm text-muted-foreground">
                All auction results are publicly auditable on-chain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
