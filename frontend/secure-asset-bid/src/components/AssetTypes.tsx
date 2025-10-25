import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Image, TrendingDown, ArrowRight } from 'lucide-react';

const AssetTypes = () => {
  const assets = [
    {
      icon: TrendingDown,
      title: 'DeFi Debt Claims',
      description: 'Liquidated positions and debt claims from major DeFi protocols including Aave, Compound, and MakerDAO',
      features: ['Verified on-chain', 'Instant settlement', 'High liquidity'],
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      icon: Image,
      title: 'NFT Assets',
      description: 'Digital collectibles, art pieces, and tokenized rights with complete ownership transfer',
      features: ['Authentic verification', 'Metadata preserved', 'Cross-marketplace'],
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      icon: Coins,
      title: 'Token Bundles',
      description: 'Governance tokens, utility tokens, and curated token packages from various protocols',
      features: ['Diversified portfolio', 'Batch transfer', 'Gas optimized'],
      gradient: 'from-amber-500/10 to-orange-500/10',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <section id="assets" className="py-32 bg-background relative">
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Offset header layout */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Asset Classes
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                What You Can
                <br />
                Auction
              </h2>
            </div>
            <div>
              <p className="text-xl text-muted-foreground">
                Trade diverse blockchain assets with military-grade privacy across multiple categories
              </p>
            </div>
          </div>

          {/* Staggered card layout */}
          <div className="space-y-8">
            {assets.map((asset, index) => {
              const Icon = asset.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`flex ${isEven ? 'lg:pr-32' : 'lg:pl-32'}`}
                >
                  <Card className="w-full group hover:shadow-xl transition-smooth border border-border overflow-hidden">
                    <div className={`bg-gradient-to-br ${asset.gradient} p-8 md:p-12`}>
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-20 h-20 rounded-2xl ${asset.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-10 h-10 ${asset.iconColor}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <h3 className="font-bold text-2xl md:text-3xl">{asset.title}</h3>
                          <p className="text-muted-foreground text-lg">{asset.description}</p>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-3 pt-2">
                            {asset.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-sm font-medium"
                              >
                                {feature}
                              </div>
                            ))}
                          </div>

                          {/* CTA */}
                          <Button 
                            variant="outline" 
                            className="group/btn mt-4"
                          >
                            Explore {asset.title}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-muted/50 border border-border">
              <p className="text-lg font-medium">Can't find what you're looking for?</p>
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                Request Custom Asset Type
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetTypes;
