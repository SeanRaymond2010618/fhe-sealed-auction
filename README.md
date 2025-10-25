# FHE Sealed-Bid Auction Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A privacy-preserving sealed-bid auction platform powered by Zama's Fully Homomorphic Encryption (FHE) technology. This platform enables completely confidential bidding where bid amounts remain encrypted on-chain throughout the entire auction lifecycle, ensuring bidder privacy and preventing bid sniping.

## 🌟 Live Demo

**Production**: [https://fhe-auction-demo.vercel.app](https://fhe-auction-demo.vercel.app)

**Contract Address** (Sepolia): `0xe84eEe3A82f2D8a492723bBD225a4C8356bb99C9`

## 📋 Table of Contents

- [Overview](#overview)
- [Current Features (Phase 1)](#current-features-phase-1)
- [Upcoming Features (Phase 2)](#upcoming-features-phase-2)
- [How FHE Works in This Platform](#how-fhe-works-in-this-platform)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Smart Contract Details](#smart-contract-details)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Traditional blockchain auctions suffer from a critical privacy problem: all bids are publicly visible on-chain, allowing competitors to strategically outbid others at the last moment (bid sniping) or collude to manipulate prices. This platform solves these issues using **Fully Homomorphic Encryption (FHE)** from Zama's fhEVM.

### What Makes This Different?

- **Complete Bid Privacy**: Bid amounts are encrypted client-side and remain encrypted on-chain
- **No Trust Required**: Cryptographic guarantees instead of trusted third parties
- **On-Chain Privacy**: Computations on encrypted data without decryption
- **Anti-Sniping**: Encrypted bids prevent last-minute strategic bidding
- **Verifiable Fairness**: Auction results are deterministic and auditable

### Use Cases

- **NFT Auctions**: Private bidding for high-value digital collectibles
- **DeFi Debt Claims**: Confidential trading of protocol debt positions
- **Real-World Assets**: Sealed-bid auctions for tokenized assets
- **Procurement**: Private B2B procurement and tendering

## ✅ Current Features (Phase 1)

### Implemented Functionality

✅ **Auction Browsing**
- View active auctions with real-time countdown timers
- Filter by asset type (NFT, DeFi Debt, RWA)
- Display auction metadata and current status

✅ **Wallet Integration**
- Support for OKX Wallet, MetaMask, WalletConnect
- Seamless connection with Sepolia testnet
- Transaction status tracking and error handling

✅ **FHE-Encrypted Bidding**
- Client-side bid encryption using Zama fhEVM SDK
- Gwei-based encryption for 64-bit euint64 support
- Zero-knowledge proof generation for bid validity
- On-chain encrypted bid storage

✅ **Real-Time Feedback**
- Transaction confirmation notifications
- Bid submission success/failure alerts
- Gas estimation and optimization

✅ **Modern UI/UX**
- Responsive design with Ant Design 5.0
- Dark/light theme support
- Interactive demo video player
- Linear design system aesthetics

### Technical Achievements

- **FHE Integration**: Successfully integrated @fhevm/solidity 0.8.0 for encrypted computations
- **Gwei Encoding**: Solved 64-bit integer limits by encoding ETH values as Gwei
- **Wallet Provider Detection**: Enhanced multi-wallet support with fallback mechanisms
- **Type-Safe Development**: Full TypeScript implementation with strict typing

## 🚀 Upcoming Features (Phase 2)

### Planned Functionality

🔲 **Auction Creation Interface**
- User-friendly auction deployment wizard
- Asset upload and metadata management
- Customizable auction duration (up to 90 days)
- Starting price configuration

🔲 **Winner Determination & Settlement**
- Automated winner selection using FHE comparison
- Claim mechanism for auction winners
- Refund system for non-winning bidders
- Settlement proof generation

🔲 **Bid History & Analytics**
- Personal bid history dashboard
- Auction participation analytics
- Encrypted bid count display (without revealing amounts)
- Historical auction archive

🔲 **Multi-Asset Support**
- ERC-721 (NFT) integration
- ERC-1155 (multi-token) support
- Custom debt token standards
- Real-world asset tokenization

🔲 **Advanced Auction Types**
- Dutch auctions (descending price)
- English auctions (ascending price with encrypted increments)
- Multi-item batch auctions
- Reserve price mechanisms

## 🔐 How FHE Works in This Platform

### What is Fully Homomorphic Encryption?

FHE allows computations to be performed directly on encrypted data without decryption. In the context of this auction platform:

1. **Encryption**: Bidders encrypt their bid amounts client-side using the FHE SDK
2. **On-Chain Storage**: Encrypted bids (euint64) are stored on-chain
3. **Encrypted Comparison**: Smart contract compares encrypted bids using FHE operations
4. **Winner Determination**: Highest bid is determined without decrypting any individual bids
5. **Selective Decryption**: Only the winning bid amount is revealed (if needed)

### Technical Implementation

```solidity
// Encrypted bid type
euint64 encryptedBidAmount;

// FHE comparison (happens on encrypted data)
ebool isHigher = FHE.gt(newBid, currentHighestBid);

// Update highest bid without decryption
auction.highestBid = FHE.select(isHigher, newBid, currentHighestBid);
```

### Advantages Over Traditional Approaches

| Feature | Traditional Sealed-Bid | Commit-Reveal | FHE-Based |
|---------|------------------------|---------------|-----------|
| Privacy During Auction | ❌ | ✅ | ✅ |
| No Reveal Phase Needed | ❌ | ❌ | ✅ |
| On-Chain Computation | ❌ | ❌ | ✅ |
| Trustless | ✅ | ✅ | ✅ |
| Gas Efficient | ✅ | ⚠️ | ⚠️ |

### Gwei-Based Encoding

To fit bid amounts into euint64 (max: 2^64 - 1), we encode ETH values as Gwei:

```typescript
// 1 ETH = 1,000,000,000 Gwei (fits in 64-bit)
// Max encodable: ~18.4 billion ETH

const bidInGwei = parseUnits(bidAmount, "gwei");  // Client-side
const encrypted = await fhe.encrypt(bidInGwei);    // FHE encryption
```

## 🏗️ Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  React + TypeScript + Vite + Ant Design + TailwindCSS      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auction    │  │     Bid      │  │   Wallet     │     │
│  │   Explorer   │  │   Interface  │  │  Connection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Zama fhEVM SDK                          │
│         Client-side FHE encryption/decryption                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Ethereum Sepolia Testnet                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         SimpleFHEAuction.sol Contract                 │  │
│  │                                                        │  │
│  │  • createAuction()  - Deploy new auction             │  │
│  │  • placeBid()       - Submit encrypted bid           │  │
│  │  • endAuction()     - Finalize and determine winner  │  │
│  │  • getAuction()     - Query auction state            │  │
│  │                                                        │  │
│  │  Storage: euint64 encrypted bids + metadata          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Smart Contracts**
- Solidity 0.8.20
- @fhevm/solidity 0.8.0 (Zama FHE library)
- Hardhat for development and deployment

**Frontend**
- React 18.3 with TypeScript 5.0
- Vite 6.0 (build tool)
- Ant Design 5.0 (UI components)
- TailwindCSS 3.4 (styling)
- Wagmi 2.x (Ethereum interactions)
- Viem 2.x (Ethereum utilities)
- @fhevm/web 0.8.0 (FHE SDK)

**Infrastructure**
- Vercel (frontend hosting)
- Sepolia Testnet (blockchain)
- GitHub (version control)

## 📁 Project Structure

```
fhe-auction/
├── contracts/                    # Smart contract code
│   ├── src/
│   │   └── SimpleFHEAuction.sol # Main auction contract
│   ├── scripts/
│   │   ├── deploy.js            # Deployment script
│   │   └── create-auctions.js   # Test auction creation
│   ├── hardhat.config.js
│   └── package.json
│
└── frontend/secure-asset-bid/   # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── AuctionCard.tsx      # Individual auction display
    │   │   ├── FeaturedAuctions.tsx # Homepage auction grid
    │   │   ├── Header.tsx           # Navigation bar
    │   │   ├── HowItWorks.tsx       # Explainer section
    │   │   └── ui/                  # Shadcn UI components
    │   ├── hooks/
    │   │   └── useAuction.ts        # Bidding logic hook
    │   ├── lib/
    │   │   ├── fhe.ts               # FHE SDK wrapper
    │   │   └── contracts/           # Contract ABIs
    │   ├── pages/
    │   │   ├── Index.tsx            # Homepage
    │   │   └── AuctionExplorer.tsx  # Auction browser
    │   ├── config/
    │   │   └── wagmi.ts             # Wallet configuration
    │   └── main.tsx                 # App entry point
    ├── public/
    │   └── demo.mp4                 # Bidding demo video
    ├── .env.local                   # Environment config
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **MetaMask** or **OKX Wallet** browser extension
- **Sepolia ETH** for gas fees ([Get testnet ETH](https://sepoliafaucet.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/SeanRaymond2010618/fhe-sealed-auction.git
cd fhe-sealed-auction
```

#### 2. Install Contract Dependencies

```bash
cd contracts
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend/secure-asset-bid
npm install
```

### Configuration

#### Smart Contract Setup

Create `contracts/.env`:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

#### Frontend Setup

Create `frontend/secure-asset-bid/.env.local`:

```env
VITE_AUCTION_CONTRACT_ADDRESS=0xe84eEe3A82f2D8a492723bBD225a4C8356bb99C9
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### Running the Application

#### Option 1: Use Deployed Contract (Recommended)

The contract is already deployed on Sepolia at `0xe84eEe3A82f2D8a492723bBD225a4C8356bb99C9`.

```bash
cd frontend/secure-asset-bid
npm run dev
```

Visit `http://localhost:5173`

#### Option 2: Deploy Your Own Contract

```bash
# Compile contracts
cd contracts
npm run compile

# Deploy to Sepolia
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/deploy.js --network sepolia

# Update .env.local with your contract address
# Then start frontend
cd ../frontend/secure-asset-bid
npm run dev
```

## 📖 Usage Guide

### Connecting Your Wallet

1. Install OKX Wallet or MetaMask browser extension
2. Switch to Sepolia testnet in your wallet
3. Get testnet ETH from [Sepolia faucet](https://sepoliafaucet.com/)
4. Click "Connect Wallet" button on the platform
5. Approve the connection request

### Browsing Auctions

1. Homepage displays featured auctions
2. Each card shows:
   - Auction title and asset type
   - Current minimum bid (0.01 ETH starting price)
   - Time remaining (countdown timer)
   - Number of bidders

### Placing a Bid

1. Click "Place Bid" button on any auction card
2. Modal dialog opens with bid input
3. Enter your bid amount (in ETH)
4. Click "Place Encrypted Bid"
5. Approve two transactions:
   - FHE encryption proof generation
   - Encrypted bid submission
6. Wait for confirmation (typically 10-15 seconds)
7. Success notification confirms bid placement

**Important**: Your bid amount is encrypted before submission and remains private on-chain.

### Monitoring Your Bids

Currently: Check transaction history in your wallet
Coming Soon: Personal bid dashboard with history and analytics

## 🛠️ Development

### Contract Development

```bash
cd contracts

# Compile contracts
npm run compile

# Run tests (coming soon)
npm run test

# Deploy to Sepolia
SEPOLIA_RPC_URL="your_rpc_url" npx hardhat run scripts/deploy.js --network sepolia

# Create test auctions
SEPOLIA_RPC_URL="your_rpc_url" npx hardhat run scripts/create-auctions.js --network sepolia
```

### Frontend Development

```bash
cd frontend/secure-asset-bid

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Auction Types

1. Define auction struct in Solidity
2. Implement auction logic in contract
3. Create React component in `src/components/`
4. Add hook for auction interaction in `src/hooks/`
5. Update routing in `src/App.tsx`

## 📜 Smart Contract Details

### SimpleFHEAuction.sol

**Key Functions**

```solidity
// Create a new auction
function createAuction(
    uint256 startPrice,    // Starting price in wei
    uint256 duration       // Duration in seconds (max 90 days)
) external returns (uint256 auctionId)

// Place encrypted bid
function placeBid(
    uint256 auctionId,
    bytes calldata encryptedBid,   // FHE-encrypted bid amount
    bytes calldata bidProof         // Zero-knowledge proof
) external payable

// End auction and determine winner
function endAuction(uint256 auctionId) external

// Query auction state
function getAuction(uint256 auctionId)
    external view returns (
        address seller,
        uint256 startPrice,
        uint256 endTime,
        address highestBidder,
        bool ended
    )
```

**Storage Structure**

```solidity
struct Auction {
    address seller;
    uint256 startPrice;
    uint256 startTime;
    uint256 endTime;
    address highestBidder;
    euint64 highestBid;      // Encrypted highest bid
    bool ended;
    bool cancelled;
}

struct Bid {
    address bidder;
    euint64 encryptedAmount;  // FHE-encrypted bid
    uint256 timestamp;
}
```

### Gas Costs (Approximate)

| Operation | Gas Cost | USD (50 gwei, $3000 ETH) |
|-----------|----------|--------------------------|
| Create Auction | ~200,000 | $30 |
| Place Bid | ~180,000 | $27 |
| End Auction | ~150,000 | $22.50 |

*Note: FHE operations are gas-intensive due to cryptographic computations*

## 🔒 Security Considerations

### Current Security Features

✅ **Encrypted Storage**: All bids stored as euint64 encrypted integers
✅ **Access Control**: Only auction seller can end auction
✅ **Reentrancy Protection**: State updates before external calls
✅ **Time Validation**: Auction duration limits (max 90 days)
✅ **Price Validation**: Minimum starting price requirements

### Known Limitations

⚠️ **No Winner Claim Yet**: Winner determination pending Phase 2
⚠️ **No Refund Mechanism**: Non-winning bid refunds coming in Phase 2
⚠️ **Basic Access Control**: More sophisticated role management planned
⚠️ **Gas Costs**: FHE operations expensive on mainnet

### Future Security Enhancements

🔲 Formal verification of FHE operations
🔲 Multi-signature auction cancellation
🔲 Emergency pause mechanism
🔲 Auction dispute resolution
🔲 Professional security audit

### Best Practices for Users

1. **Test on Sepolia First**: Never use mainnet without thorough testing
2. **Verify Contract Address**: Always check the contract address matches official documentation
3. **Check Auction Details**: Verify end time and starting price before bidding
4. **Secure Your Wallet**: Use hardware wallet for production deployments
5. **Monitor Gas Prices**: FHE operations are expensive during high congestion

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use ESLint and Prettier configurations
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features (when test suite is implemented)

### Areas for Contribution

- [ ] Unit tests for smart contracts
- [ ] Integration tests for frontend
- [ ] Additional auction types (Dutch, English)
- [ ] Improved UI/UX designs
- [ ] Documentation improvements
- [ ] Gas optimization research
- [ ] Security analysis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

### Zama Resources
- [Zama Official Website](https://www.zama.ai/)
- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [fhEVM Solidity Library](https://github.com/zama-ai/fhevm)

### Ethereum Resources
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)

### Development Tools
- [Hardhat Documentation](https://hardhat.org/docs)
- [Vite Documentation](https://vite.dev/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Ant Design Components](https://ant.design/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SeanRaymond2010618/fhe-sealed-auction/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SeanRaymond2010618/fhe-sealed-auction/discussions)
- **Email**: 04_attempt_upsurge@icloud.com

## 🙏 Acknowledgments

- **Zama Team**: For pioneering FHE technology and the fhEVM framework
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **Open Source Community**: For the amazing tools and libraries

---

**Built with ❤️ using Zama FHE Technology**

*Last Updated: October 26, 2025*
