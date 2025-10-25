# FHE Donations Platform - Frontend

A modern, privacy-preserving donation platform with quadratic funding built with React, TypeScript, and Ant Design 5.0, leveraging Fully Homomorphic Encryption (FHE) for private donations.

## Features

### Core Functionality
- **Privacy-Preserving Donations**: All donation amounts are encrypted using FHE
- **Quadratic Funding**: Democratic funding that amplifies small donations
- **Project Discovery**: Browse and search projects across categories
- **Real-time Matching**: See how QF multiplies your impact
- **Funding Rounds**: Time-limited rounds with matching pools
- **Leaderboard**: Privacy-preserved rankings and metrics

### Key Capabilities
- 🔐 **FHE Encryption**: Privacy-preserving donation amounts
- 🎨 **Modern UI**: Linear-style design with Ant Design 5.0
- 🌓 **Dark Mode**: Full theme support
- 📱 **Responsive**: Mobile-first design
- ⚡ **Real-time Updates**: Live funding progress and matching
- 📊 **Admin Dashboard**: Round and project management

## Tech Stack

- **React 18** with TypeScript
- **Ant Design 5.0** with Token System
- **Vite** for build tooling
- **React Query** for data fetching
- **fhevmjs** for FHE operations
- **ethers.js** for blockchain interaction

## Installation

```bash
# Navigate to frontend directory
cd /Users/songsu/Desktop/zama/fhe-auction/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ProjectCard.tsx
│   │   ├── DonationForm.tsx
│   │   ├── MatchingCalculator.tsx
│   │   ├── AppHeader.tsx
│   │   └── SideNav.tsx
│   ├── pages/           # Application pages
│   │   ├── ProjectsDiscovery.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── CreateProject.tsx
│   │   ├── FundingRounds.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── MyDonations.tsx
│   │   └── AdminPanel.tsx
│   ├── services/        # API and blockchain services
│   │   └── donation.ts
│   ├── hooks/           # Custom React hooks
│   │   └── useDonation.ts
│   ├── App.tsx          # Main application component
│   ├── App.css          # Global styles
│   └── main.tsx         # Application entry point
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_FHE_PUBLIC_KEY=your_fhe_public_key
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=8009
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Type checking
npm run type-check   # Run TypeScript type checking
```

## Pages Overview

### Projects Discovery (`/projects`)
- Browse all active projects with filters
- Search by project name or description
- Filter by category (DeFi, Infrastructure, Social, etc.)
- Sort by trending, recent, funding, or matching
- Real-time funding progress

### Project Detail (`/projects/:id`)
- Detailed project information
- Make encrypted donations
- View QF matching estimates
- Track project updates
- Team information and roadmap

### Create Project (`/create-project`)
- Multi-step project creation
- Upload images and documentation
- Set funding goals and duration
- Apply for verification badge
- Team and milestone information

### Funding Rounds (`/rounds`)
- View active, upcoming, and completed rounds
- Understand quadratic funding mechanics
- Track round-specific statistics
- Countdown timers for active rounds
- Matching pool information

### Leaderboard (`/leaderboard`)
- Privacy-preserved project rankings
- Top donors (with encrypted amounts)
- Trending projects with momentum
- Category-specific leaderboards
- Impact scores and metrics

### My Donations (`/my-donations`)
- Personal donation history
- Impact metrics and achievements
- Export donation records
- Toggle visibility of amounts
- Track QF matching received

### Admin Panel (`/admin`)
- Create and manage funding rounds
- Review and verify projects
- Configure platform settings
- Manage FHE encryption parameters
- Platform analytics

## FHE Integration

The platform uses Fully Homomorphic Encryption for private donations:

1. **Donation Encryption**: Amounts are encrypted client-side before submission
2. **Privacy Preservation**: Individual donations remain private
3. **Quadratic Funding**: QF calculations on encrypted values
4. **Aggregated Totals**: Only total raised amounts are visible publicly

## Design System

The UI follows Linear-style design principles:
- **Colors**: Blue primary (#2563EB), neutral grays
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Minimal, clean aesthetics
- **Animations**: Smooth 150-220ms transitions

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Deployment

```bash
# Build for production
npm run build

# The build output will be in the 'dist' directory
# Deploy to your preferred hosting service
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT