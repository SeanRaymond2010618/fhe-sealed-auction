# FHE Confidential Auction Platform

## Overview
A privacy-preserving auction platform using fully homomorphic encryption to enable secure bidding without revealing bid amounts until auction completion. Supports multiple auction types with FHE-protected bid privacy.

## Key Features
- **English Auctions**: Open ascending price auctions with FHE bid privacy
- **Dutch Auctions**: Descending price auctions with instant purchase
- **Sealed Bid Auctions**: Private bidding with FHE-encrypted submissions
- **Batch Auctions**: Multiple items in single auction with FHE batch processing
- **Bid Privacy**: All bids encrypted using FHE until auction resolution
- **Fair Settlement**: Cryptographic proof of auction fairness

## Technical Architecture

### Smart Contracts
- **AuctionRegistry**: Manages auction creation and lifecycle
- **EnglishAuction**: Open ascending price auction implementation
- **DutchAuction**: Descending price auction implementation  
- **SealedBidAuction**: Private bidding auction implementation
- **BatchAuction**: Multi-item auction implementation
- **FHEBidManager**: Handles FHE bid encryption/decryption
- **AuctionSettlement**: Manages final settlement and winner determination

### Frontend
- **Auction Explorer**: Browse active and completed auctions
- **Create Auction**: Deploy new auctions with FHE privacy settings
- **Bid Interface**: Secure bidding with FHE encryption
- **Auction Dashboard**: Track your auctions and bids
- **Settlement Panel**: View auction results and claim winnings

## Project Structure (Auction-Specific)

### Contracts
- `contracts/src/auctions/`: Core auction implementations (English, Dutch, Sealed, Batch)
- `contracts/src/fhe/`: FHE bid management and encryption
- `contracts/src/registry/`: Auction registry and lifecycle management
- `contracts/src/settlement/`: Settlement and winner determination logic
- `contracts/interfaces/`: Auction-specific interfaces
- `contracts/scripts/`: Deployment and testing scripts
- `contracts/test/`: Comprehensive auction testing suite

### Frontend
- `frontend/src/auctions/`: Main auction application and routing
- `frontend/src/pages/auctions/`: Auction-specific pages (explore, create, bid, dashboard)
- `frontend/src/components/bidding/`: Bidding interface components
- `frontend/src/components/auction-types/`: Type-specific auction components
- `frontend/src/hooks/`: Auction-specific hooks (bidding, settlement, FHE)
- `frontend/src/config/`: Web3 and auction configurations
- `frontend/styles/`: Auction-themed CSS (bid panels, countdown timers, winner displays)

### Documentation
- `docs/auction-mechanics.md`: Detailed auction type explanations
- `docs/bidding-guide.md`: How to bid securely with FHE
- `docs/settlement-process.md`: Auction resolution and settlement
- `docs/fhe-bid-privacy.md`: Technical details on bid encryption
- `docs/runbooks/`: Operational guides (auction monitoring, dispute resolution)

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Sepolia testnet ETH

### Installation
```bash
# Install dependencies
cd fhe-auction/contracts && npm install
cd ../frontend && npm install

# Start development
cd contracts && npm run compile
cd ../frontend && npm run dev
```

### Usage
1. Connect MetaMask to Sepolia network
2. Browse active auctions in the Explorer
3. Create new auctions or place bids
4. Monitor auction progress in your Dashboard
5. Claim winnings after auction settlement

## Auction Types

### English Auction
- Open ascending price auction
- Bids visible but amounts encrypted with FHE
- Highest bidder wins at final price
- Automatic bid increments

### Dutch Auction  
- Descending price auction
- First bidder to accept current price wins
- Price decreases over time
- Instant settlement

### Sealed Bid Auction
- Private bidding with FHE encryption
- All bids submitted simultaneously
- Winner determined after bid reveal
- Maximum privacy protection

### Batch Auction
- Multiple items in single auction
- FHE batch processing for efficiency
- Complex winner determination
- Bulk settlement

## Security Features
- **FHE Bid Encryption**: All bids encrypted until auction end
- **Commit-Reveal Scheme**: Prevents front-running attacks
- **Settlement Proofs**: Cryptographic verification of fairness
- **Anti-Collusion**: Mechanisms to prevent bidder coordination
- **Timelock Protection**: Secure auction timing mechanisms

## Development

### Contract Development
```bash
cd contracts
npm run compile
npm run test
npm run deploy:sepolia
```

### Frontend Development
```bash
cd frontend
npm run dev
npm run build
npm run preview
```

### Testing
```bash
# Contract tests
cd contracts && npm run test

# Frontend tests  
cd frontend && npm run test

# Integration tests
npm run test:integration
```

## Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request

## License
MIT License - see LICENSE file for details

## Related Links
- [Zama Protocol Documentation](https://docs.zama.ai/)
- [FHE Solidity Developer Guide](https://docs.zama.ai/fhevm)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)