import AuctionCard from './AuctionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeaturedAuctions = () => {
  const auctions = [
    {
      id: 1,
      title: 'Aave Protocol Debt Claim #1234',
      type: 'DeFi Debt' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/12645/large/aave-token-round.png'
    },
    {
      id: 2,
      title: 'CryptoPunk NFT Rights',
      type: 'NFT' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/16785/large/cryptopunk.jpg'
    },
    {
      id: 3,
      title: 'Compound Liquidation Asset',
      type: 'DeFi Debt' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png'
    },
    {
      id: 4,
      title: 'Governance Token Package',
      type: 'Token' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg'
    },
    {
      id: 5,
      title: 'MakerDAO Vault Debt',
      type: 'DeFi Debt' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png'
    },
    {
      id: 6,
      title: 'Rare NFT Collection Bundle',
      type: 'NFT' as const,
      currentBid: '0.01 ETH',
      timeLeft: '89d 23h',
      status: 'active' as const,
      bidders: 0,
      imageUrl: 'https://assets.coingecko.com/coins/images/24383/large/apecoin.jpg'
    }
  ];

  const defiAuctions = auctions.filter(a => a.type === 'DeFi Debt');
  const nftAuctions = auctions.filter(a => a.type === 'NFT');
  const tokenAuctions = auctions.filter(a => a.type === 'Token');
  const endingSoon = auctions.filter(a => a.status === 'ending-soon');

  return (
    <section id="auctions" className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Live Now
            </div>
            <h2 className="text-4xl md:text-6xl font-bold">
              Active Auctions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore privacy-protected auctions across multiple asset classes
            </p>
          </div>

          {/* Tabs for filtering */}
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList className="bg-background border border-border">
              <TabsTrigger value="all">All Assets</TabsTrigger>
              <TabsTrigger value="defi">DeFi Debt</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="token">Tokens</TabsTrigger>
              <TabsTrigger value="ending">Ending Soon</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Asymmetric grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Large featured card */}
                <div className="md:col-span-8 md:row-span-2">
                  <div className="h-full">
                    <AuctionCard {...auctions[1]} />
                  </div>
                </div>
                
                {/* Smaller cards */}
                <div className="md:col-span-4">
                  <AuctionCard {...auctions[0]} />
                </div>
                <div className="md:col-span-4">
                  <AuctionCard {...auctions[2]} />
                </div>
                <div className="md:col-span-6">
                  <AuctionCard {...auctions[3]} />
                </div>
                <div className="md:col-span-6">
                  <AuctionCard {...auctions[4]} />
                </div>
                <div className="md:col-span-12">
                  <AuctionCard {...auctions[5]} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="defi" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defiAuctions.map((auction, index) => (
                  <AuctionCard key={index} {...auction} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nft" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nftAuctions.map((auction, index) => (
                  <AuctionCard key={index} {...auction} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="token" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenAuctions.map((auction, index) => (
                  <AuctionCard key={index} {...auction} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ending" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {endingSoon.map((auction, index) => (
                  <AuctionCard key={index} {...auction} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuctions;
