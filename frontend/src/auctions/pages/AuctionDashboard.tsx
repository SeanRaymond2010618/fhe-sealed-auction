import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

// Mock user auction data
const mockUserAuctions = [
  {
    id: 1,
    title: "My NFT Collection",
    type: "English",
    status: "Active",
    currentBid: "3.2",
    reservePrice: "2.0",
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    bidCount: 8,
    totalBids: "12.5"
  },
  {
    id: 2,
    title: "Digital Art Piece",
    type: "Dutch",
    status: "Ended",
    currentBid: "1.8",
    reservePrice: "1.5",
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    bidCount: 5,
    totalBids: "8.2"
  },
  {
    id: 3,
    title: "Crypto Domain",
    type: "SealedBid",
    status: "Settled",
    currentBid: "5.5",
    reservePrice: "3.0",
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    bidCount: 12,
    totalBids: "15.8"
  }
]

const mockUserBids = [
  {
    id: 101,
    auctionId: 4,
    auctionTitle: "Rare Gaming Item",
    bidAmount: "2.1",
    status: "Outbid",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 102,
    auctionId: 5,
    auctionTitle: "Digital Collectible",
    bidAmount: "0.8",
    status: "Leading",
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 103,
    auctionId: 6,
    auctionTitle: "Art NFT",
    bidAmount: "1.5",
    status: "Won",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
]

const AuctionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('auctions')
  const [auctions] = useState(mockUserAuctions)
  const [bids] = useState(mockUserBids)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active'
      case 'Ended': return 'status-ended'
      case 'Settled': return 'status-settled'
      case 'Leading': return 'status-active'
      case 'Outbid': return 'status-ended'
      case 'Won': return 'status-settled'
      default: return 'status-ended'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return '🟢'
      case 'Ended': return '🔴'
      case 'Settled': return '✅'
      case 'Leading': return '👑'
      case 'Outbid': return '📉'
      case 'Won': return '🏆'
      default: return '❓'
    }
  }

  const handleSettleAuction = (auctionId: number) => {
    toast.success(`Settling auction #${auctionId}...`)
  }

  const handleClaimWinnings = (bidId: number) => {
    toast.success(`Claiming winnings for bid #${bidId}...`)
  }

  return (
    <div className="auction-main">
      <div className="auction-panel" style={{ gridColumn: '1 / -1' }}>
        <h2>📊 My Auction Dashboard</h2>
        <p style={{ color: 'var(--auction-muted)', marginBottom: '32px' }}>
          Manage your auctions and track your bidding activity
        </p>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'auctions', label: 'My Auctions', icon: '🏛️' },
            { id: 'bids', label: 'My Bids', icon: '💰' },
            { id: 'stats', label: 'Statistics', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`auction-btn ${activeTab === tab.id ? '' : 'auction-btn-secondary'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* My Auctions Tab */}
        {activeTab === 'auctions' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Your Auctions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {auctions.map(auction => (
                <div key={auction.id} className="auction-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0 }}>{auction.title}</h4>
                        <span className={`tag ${auction.type.toLowerCase()}`}>{auction.type}</span>
                        <span className={getStatusColor(auction.status)}>
                          {getStatusIcon(auction.status)} {auction.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Current Bid</div>
                          <div style={{ fontWeight: '600', color: 'var(--auction-primary)' }}>
                            {auction.currentBid} ETH
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Reserve Price</div>
                          <div>{auction.reservePrice} ETH</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Total Bids</div>
                          <div>{auction.bidCount}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Volume</div>
                          <div>{auction.totalBids} ETH</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      {auction.status === 'Active' && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Time Left</div>
                          <div className="countdown-timer">
                            {formatDistanceToNow(auction.endTime, { addSuffix: true })}
                          </div>
                        </div>
                      )}
                      
                      {auction.status === 'Ended' && (
                        <button
                          className="auction-btn"
                          onClick={() => handleSettleAuction(auction.id)}
                        >
                          Settle Auction
                        </button>
                      )}
                      
                      {auction.status === 'Settled' && (
                        <div className="winner-badge">
                          Settled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'bids' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Your Bids</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bids.map(bid => (
                <div key={bid.id} className="auction-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0 }}>{bid.auctionTitle}</h4>
                        <span className={getStatusColor(bid.status)}>
                          {getStatusIcon(bid.status)} {bid.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Bid Amount</div>
                          <div style={{ fontWeight: '600', color: 'var(--auction-primary)' }}>
                            {bid.bidAmount} ETH
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Placed</div>
                          <div>{formatDistanceToNow(bid.timestamp, { addSuffix: true })}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {bid.status === 'Won' && (
                        <button
                          className="auction-btn-success"
                          onClick={() => handleClaimWinnings(bid.id)}
                        >
                          Claim Winnings
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Your Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="auction-card">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏛️</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--auction-primary)' }}>
                    {auctions.length}
                  </div>
                  <div style={{ color: 'var(--auction-muted)' }}>Auctions Created</div>
                </div>
              </div>
              
              <div className="auction-card">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--auction-secondary)' }}>
                    {bids.length}
                  </div>
                  <div style={{ color: 'var(--auction-muted)' }}>Bids Placed</div>
                </div>
              </div>
              
              <div className="auction-card">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--auction-success)' }}>
                    {bids.filter(b => b.status === 'Won').length}
                  </div>
                  <div style={{ color: 'var(--auction-muted)' }}>Auctions Won</div>
                </div>
              </div>
              
              <div className="auction-card">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--auction-accent)' }}>
                    {auctions.reduce((sum, a) => sum + parseFloat(a.totalBids), 0).toFixed(1)}
                  </div>
                  <div style={{ color: 'var(--auction-muted)' }}>Total Volume (ETH)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionDashboard










