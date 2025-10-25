import React from 'react'
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from 'wagmi'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { Toaster } from 'react-hot-toast'
import './styles.css'

// Import auction pages
import AuctionExplorer from './pages/AuctionExplorer'
import CreateAuction from './pages/CreateAuction'
import AuctionDashboard from './pages/AuctionDashboard'
import BidInterface from './pages/BidInterface'

const config = createConfig({
  chains: [sepolia],
  connectors: [injected({ target: 'metaMask' })],
  transports: { [sepolia.id]: http() },
})

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <BrowserRouter>
        <div className="auction-shell">
          <AuctionHeader />
          
          <div className="auction-nav">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
              <span className="nav-icon">🏛️</span>
              Explore
            </NavLink>
            <NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>
              <span className="nav-icon">➕</span>
              Create
            </NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
              <span className="nav-icon">📊</span>
              Dashboard
            </NavLink>
            <NavLink to="/bid" className={({isActive}) => isActive ? 'active' : ''}>
              <span className="nav-icon">💰</span>
              Bid
            </NavLink>
          </div>

          <main className="auction-main">
            <Routes>
              <Route path="/" element={<AuctionExplorer />} />
              <Route path="/create" element={<CreateAuction />} />
              <Route path="/dashboard" element={<AuctionDashboard />} />
              <Route path="/bid/:auctionId" element={<BidInterface />} />
            </Routes>
          </main>
        </div>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </WagmiProvider>
  )
}

const AuctionHeader: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    connect({ connector: injected({ target: 'metaMask' }) })
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <header className="auction-header">
      <div className="auction-brand">
        <div className="brand-logo">🏛️</div>
        <div className="brand-text">
          <h1>FHE Auction</h1>
          <span>Privacy-Preserving Bidding</span>
        </div>
      </div>
      
      <div className="auction-wallet">
        {isConnected ? (
          <div className="wallet-connected">
            <div className="wallet-address">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
            </div>
            <button className="wallet-disconnect" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="wallet-connect" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}

export default App


