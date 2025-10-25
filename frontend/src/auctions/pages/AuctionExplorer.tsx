import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

// Mock auction data
const mockAuctions = [
  {
    id: 1,
    title: "Rare NFT Collection #1",
    type: "English",
    currentBid: "2.5",
    reservePrice: "1.0",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: "Active",
    bidCount: 15,
    image: "🎨"
  },
  {
    id: 2,
    title: "Digital Art Piece",
    type: "Dutch",
    currentBid: "0.8",
    reservePrice: "0.5",
    endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    status: "Active",
    bidCount: 8,
    image: "🖼️"
  },
  {
    id: 3,
    title: "Crypto Domain",
    type: "SealedBid",
    currentBid: "5.2",
    reservePrice: "3.0",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: "Active",
    bidCount: 23,
    image: "🌐"
  },
  {
    id: 4,
    title: "Gaming Items Bundle",
    type: "Batch",
    currentBid: "1.8",
    reservePrice: "1.2",
    endTime: new Date(Date.now() - 60 * 60 * 1000), // Ended 1 hour ago
    status: "Ended",
    bidCount: 12,
    image: "🎮"
  }
]

const AuctionExplorer: React.FC = () => {
  const [auctions, setAuctions] = useState(mockAuctions)
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAuctions = auctions.filter(auction => {
    const matchesFilter = filter === 'All' || auction.type === filter
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active'
      case 'Ended': return 'status-ended'
      case 'Settled': return 'status-settled'
      default: return 'status-ended'
    }
  }

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date()
    if (endTime <= now) return 'Ended'
    return formatDistanceToNow(endTime, { addSuffix: true })
  }

  const isUrgent = (endTime: Date) => {
    const now = new Date()
    const timeLeft = endTime.getTime() - now.getTime()
    return timeLeft < 60 * 60 * 1000 && timeLeft > 0 // Less than 1 hour
  }

  return (
    <div className="auction-main">
      <div className="auction-panel">
        <h2>🏛️ Auction Explorer</h2>
        <p style={{ color: 'var(--auction-muted)', marginBottom: '24px' }}>
          Discover and participate in privacy-preserving auctions
        </p>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search auctions..."
            className="auction-input"
            style={{ flex: '1', minWidth: '200px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'English', 'Dutch', 'SealedBid', 'Batch'].map(type => (
              <button
                key={type}
                className={`auction-btn ${filter === type ? '' : 'auction-btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Auction Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredAuctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '2rem' }}>{auction.image}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{auction.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`tag ${auction.type.toLowerCase()}`}>{auction.type}</span>
                    <span className={getStatusColor(auction.status)}>{auction.status}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--auction-muted)' }}>Current Bid:</span>
                  <span style={{ fontWeight: '600', color: 'var(--auction-primary)' }}>
                    {auction.currentBid} ETH
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--auction-muted)' }}>Reserve:</span>
                  <span>{auction.reservePrice} ETH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--auction-muted)' }}>Bids:</span>
                  <span>{auction.bidCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--auction-muted)' }}>Time Left:</span>
                  <span className={`countdown-timer ${isUrgent(auction.endTime) ? 'warning' : ''}`}>
                    {getTimeRemaining(auction.endTime)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to={`/bid/${auction.id}`}
                  className="auction-btn"
                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                >
                  {auction.status === 'Active' ? 'Place Bid' : 'View Details'}
                </Link>
                <button
                  className="auction-btn-secondary"
                  onClick={() => toast.success(`Watching ${auction.title}`)}
                >
                  👁️
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--auction-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h3>No auctions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="auction-panel">
        <h3>📊 Market Stats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="auction-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--auction-muted)' }}>Active Auctions</span>
              <span style={{ fontWeight: '600', color: 'var(--auction-success)' }}>
                {auctions.filter(a => a.status === 'Active').length}
              </span>
            </div>
          </div>
          
          <div className="auction-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--auction-muted)' }}>Total Volume</span>
              <span style={{ fontWeight: '600', color: 'var(--auction-primary)' }}>
                47.2 ETH
              </span>
            </div>
          </div>
          
          <div className="auction-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--auction-muted)' }}>Avg. Bid</span>
              <span style={{ fontWeight: '600', color: 'var(--auction-secondary)' }}>
                2.1 ETH
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: '24px' }}>🔥 Trending</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {auctions.slice(0, 3).map(auction => (
            <div key={auction.id} className="auction-card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{auction.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{auction.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--auction-muted)' }}>
                    {auction.currentBid} ETH • {auction.bidCount} bids
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default AuctionExplorer


