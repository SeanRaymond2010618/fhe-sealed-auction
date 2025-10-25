import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

// Mock auction data
const mockAuction = {
  id: 1,
  title: "Rare NFT Collection #1",
  description: "A unique collection of digital art pieces with FHE privacy protection",
  type: "English",
  currentBid: "2.5",
  reservePrice: "1.0",
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  status: "Active",
  bidCount: 15,
  image: "🎨",
  creator: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  fheEnabled: true
}

const mockBids = [
  { id: 1, bidder: "0x1234...5678", amount: "2.5", timestamp: new Date(Date.now() - 30 * 60 * 1000), isEncrypted: true },
  { id: 2, bidder: "0x8765...4321", amount: "2.3", timestamp: new Date(Date.now() - 45 * 60 * 1000), isEncrypted: true },
  { id: 3, bidder: "0xabcd...efgh", amount: "2.1", timestamp: new Date(Date.now() - 60 * 60 * 1000), isEncrypted: true }
]

const BidInterface: React.FC = () => {
  const { auctionId } = useParams()
  const navigate = useNavigate()
  const [auction] = useState(mockAuction)
  const [bids] = useState(mockBids)
  const [bidAmount, setBidAmount] = useState('')
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      if (auction.endTime <= now) {
        setTimeLeft('Auction Ended')
        return
      }
      setTimeLeft(formatDistanceToNow(auction.endTime, { addSuffix: true }))
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [auction.endTime])

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.currentBid)) {
      toast.error('Bid amount must be higher than current bid')
      return
    }

    setIsPlacingBid(true)
    try {
      // Simulate FHE bid encryption and contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('Bid placed successfully with FHE encryption!')
      setBidAmount('')
    } catch (error) {
      toast.error('Failed to place bid')
    } finally {
      setIsPlacingBid(false)
    }
  }

  const getMinBid = () => {
    const current = parseFloat(auction.currentBid)
    return (current + 0.1).toFixed(1)
  }

  const isUrgent = () => {
    const now = new Date()
    const timeLeft = auction.endTime.getTime() - now.getTime()
    return timeLeft < 60 * 60 * 1000 && timeLeft > 0
  }

  return (
    <div className="auction-main">
      <div className="auction-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button
            className="auction-btn-secondary"
            onClick={() => navigate('/')}
            style={{ padding: '8px 12px' }}
          >
            ← Back
          </button>
          <h2>💰 Bid on Auction</h2>
        </div>

        {/* Auction Details */}
        <div className="auction-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '3rem' }}>{auction.image}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, marginBottom: '8px' }}>{auction.title}</h3>
              <p style={{ color: 'var(--auction-muted)', margin: 0 }}>{auction.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={`tag ${auction.type.toLowerCase()}`}>{auction.type}</div>
              <div style={{ marginTop: '8px' }}>
                <span className={auction.status === 'Active' ? 'status-active' : 'status-ended'}>
                  {auction.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Current Bid</div>
              <div style={{ fontWeight: '600', fontSize: '1.2rem', color: 'var(--auction-primary)' }}>
                {auction.currentBid} ETH
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Reserve Price</div>
              <div style={{ fontWeight: '600' }}>{auction.reservePrice} ETH</div>
            </div>
            <div>
              <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Total Bids</div>
              <div style={{ fontWeight: '600' }}>{auction.bidCount}</div>
            </div>
            <div>
              <div style={{ color: 'var(--auction-muted)', fontSize: '0.9rem' }}>Time Left</div>
              <div className={`countdown-timer ${isUrgent() ? 'warning' : ''}`}>
                {timeLeft}
              </div>
            </div>
          </div>
        </div>

        {/* FHE Privacy Notice */}
        {auction.fheEnabled && (
          <div className="auction-card" style={{ 
            background: 'rgba(255, 107, 53, 0.1)', 
            border: '1px solid var(--auction-primary)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.5rem' }}>🔒</div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--auction-primary)' }}>FHE Privacy Protection</h4>
                <p style={{ margin: 0, color: 'var(--auction-muted)', fontSize: '0.9rem' }}>
                  Your bid amount is encrypted using Fully Homomorphic Encryption. 
                  It will remain private until auction settlement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bid Form */}
        {auction.status === 'Active' && (
          <form onSubmit={handlePlaceBid} className="auction-card">
            <h3 style={{ marginBottom: '16px' }}>Place Your Bid</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Bid Amount (ETH) *
              </label>
              <input
                type="number"
                className="auction-input"
                placeholder={getMinBid()}
                step="0.1"
                min={getMinBid()}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
              <div style={{ fontSize: '0.9rem', color: 'var(--auction-muted)', marginTop: '4px' }}>
                Minimum bid: {getMinBid()} ETH
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--auction-primary)' }} />
                <span style={{ fontSize: '0.9rem' }}>
                  I agree to the auction terms and FHE privacy policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auction-btn"
              disabled={isPlacingBid}
              style={{ width: '100%' }}
            >
              {isPlacingBid ? 'Encrypting & Placing Bid...' : 'Place Bid with FHE'}
            </button>
          </form>
        )}

        {/* Recent Bids */}
        <div className="auction-card">
          <h3 style={{ marginBottom: '16px' }}>Recent Bids</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bids.map(bid => (
              <div key={bid.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--auction-border)'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>
                    {bid.isEncrypted ? '🔒 Encrypted Bid' : `${bid.amount} ETH`}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--auction-muted)' }}>
                    {bid.bidder} • {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {bid.isEncrypted ? (
                    <div style={{ color: 'var(--auction-primary)', fontSize: '0.9rem' }}>
                      🔐 FHE Protected
                    </div>
                  ) : (
                    <div style={{ fontWeight: '600', color: 'var(--auction-primary)' }}>
                      {bid.amount} ETH
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="auction-panel">
        <h3>📊 Auction Info</h3>
        
        <div className="auction-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--auction-muted)' }}>Creator</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {auction.creator.slice(0, 6)}...{auction.creator.slice(-4)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--auction-muted)' }}>Auction ID</span>
            <span>#{auction.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--auction-muted)' }}>FHE Enabled</span>
            <span style={{ color: 'var(--auction-success)' }}>✅ Yes</span>
          </div>
        </div>

        <h3 style={{ marginTop: '24px' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="auction-btn-secondary">
            👁️ Watch Auction
          </button>
          <button className="auction-btn-secondary">
            📤 Share
          </button>
          <button className="auction-btn-secondary">
            📋 Copy Link
          </button>
        </div>
      </aside>
    </div>
  )
}

export default BidInterface






