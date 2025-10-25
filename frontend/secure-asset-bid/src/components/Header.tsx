import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PrivacyAuction</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#auctions" className="text-sm font-medium hover:text-primary transition-base">
              Auctions
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-base">
              How It Works
            </a>
            <a href="#assets" className="text-sm font-medium hover:text-primary transition-base">
              Assets
            </a>
          </nav>

          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
