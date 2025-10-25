import { Shield, Eye, Zap, CheckCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { useState } from 'react';

const HowItWorks = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      icon: Shield,
      title: 'Connect Wallet',
      description: 'Securely connect your Web3 wallet to access the platform',
      detail: 'Support for OKX Wallet, MetaMask, WalletConnect, and all major wallets',
      status: 'completed'
    },
    {
      icon: Eye,
      title: 'Browse Assets',
      description: 'Explore auctions for DeFi debt, NFTs, and more with privacy protection',
      detail: 'Filter by asset type, price range, and time remaining',
      status: 'completed'
    },
    {
      icon: Zap,
      title: 'Place Private Bids',
      description: 'Submit encrypted bids using Zama FHE technology',
      detail: 'Your bid amount remains encrypted on-chain using homomorphic encryption',
      status: 'completed'
    },
    {
      icon: CheckCircle,
      title: 'Create & Manage Auctions',
      description: 'Create your own auctions and manage bid settlements',
      detail: 'Auction creation UI and winner claim features coming soon',
      status: 'in-progress'
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
                FHE-Powered Auctions
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                How Privacy
                <br />
                Auctions Work
              </h2>
              <p className="text-xl text-muted-foreground">
                Fully homomorphic encryption enables secure, anonymous bidding with complete on-chain privacy
              </p>

              {/* Demo Video */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl mt-8">
                <video
                  id="demo-video"
                  className="w-full aspect-video object-cover"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
                    onClick={() => {
                      const video = document.getElementById('demo-video') as HTMLVideoElement;
                      if (video) {
                        video.play();
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <div className="text-center space-y-4 pointer-events-none">
                      <PlayCircle className="w-20 h-20 text-white mx-auto opacity-90" />
                      <p className="text-white font-semibold text-lg">Watch Bidding Demo</p>
                    </div>
                  </div>
                )}
              </div>
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
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-smooth ${
                            step.status === 'completed' ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon className={`w-8 h-8 ${step.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                            step.status === 'completed' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.status === 'completed' ? '✓' : index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-xl">{step.title}</h3>
                          {step.status === 'in-progress' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
                              In Progress
                            </span>
                          )}
                        </div>
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

          {/* Current Status & Roadmap */}
          <div className="bg-card border border-border rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold mb-6">Development Status & Roadmap</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Phase 1: Bidding (Completed)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Browse and filter auctions by type</li>
                      <li>• FHE-encrypted bid submission (Zama fhEVM)</li>
                      <li>• Gwei-based encryption for 64-bit support</li>
                      <li>• Real-time transaction feedback</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Phase 2: Full Platform (In Progress)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Auction creation interface with asset upload</li>
                      <li>• Winner determination and claim mechanism</li>
                      <li>• Bid history and auction analytics dashboard</li>
                      <li>• Multi-asset support (ERC-721, ERC-1155, debt tokens)</li>
                      <li>• Advanced auction types (Dutch, English, sealed-bid)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security features showcase */}
          <div className="grid md:grid-cols-3 gap-8 pt-16 border-t border-border">
            <div className="space-y-3">
              <div className="text-4xl">🔐</div>
              <h4 className="font-semibold text-lg">Fully Homomorphic Encryption</h4>
              <p className="text-sm text-muted-foreground">
                Powered by Zama's fhEVM - bid amounts stay encrypted on-chain throughout the entire auction lifecycle
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">⚡</div>
              <h4 className="font-semibold text-lg">On-Chain Privacy</h4>
              <p className="text-sm text-muted-foreground">
                Computations on encrypted data without decryption, ensuring complete bid confidentiality
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🛡️</div>
              <h4 className="font-semibold text-lg">Verifiable Fairness</h4>
              <p className="text-sm text-muted-foreground">
                All auction results are deterministic and auditable without compromising bidder privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
