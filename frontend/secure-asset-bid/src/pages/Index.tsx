import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedAuctions from '@/components/FeaturedAuctions';
import HowItWorks from '@/components/HowItWorks';
import AssetTypes from '@/components/AssetTypes';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedAuctions />
      <HowItWorks />
      <AssetTypes />
      <Footer />
    </div>
  );
};

export default Index;
