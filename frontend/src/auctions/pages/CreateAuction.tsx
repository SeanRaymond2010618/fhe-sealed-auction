import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CreateAuction: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    auctionType: 'English',
    reservePrice: '',
    duration: '24', // hours
    itemType: 'NFT',
    imageUrl: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  const auctionTypes = [
    { value: 'English', label: 'English Auction', description: 'Open ascending price auction' },
    { value: 'Dutch', label: 'Dutch Auction', description: 'Descending price auction' },
    { value: 'SealedBid', label: 'Sealed Bid', description: 'Private bidding auction' },
    { value: 'Batch', label: 'Batch Auction', description: 'Multiple items auction' }
  ]

  const itemTypes = [
    { value: 'NFT', label: 'NFT', icon: '🎨' },
    { value: 'Token', label: 'Token', icon: '🪙' },
    { value: 'Domain', label: 'Domain', icon: '🌐' },
    { value: 'Art', label: 'Digital Art', icon: '🖼️' },
    { value: 'Game', label: 'Gaming Item', icon: '🎮' },
    { value: 'Other', label: 'Other', icon: '📦' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.reservePrice) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Auction created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to create auction')
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="auction-main">
      <div className="auction-panel" style={{ gridColumn: '1 / -1' }}>
        <h2>➕ Create New Auction</h2>
        <p style={{ color: 'var(--auction-muted)', marginBottom: '32px' }}>
          Set up a privacy-preserving auction with FHE encryption
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Basic Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Auction Title *
              </label>
              <input
                type="text"
                className="auction-input"
                placeholder="Enter auction title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Item Type
              </label>
              <select
                className="auction-input"
                value={formData.itemType}
                onChange={(e) => handleInputChange('itemType', e.target.value)}
              >
                {itemTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              className="auction-input"
              placeholder="Describe your auction item..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Auction Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Auction Type *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auctionTypes.map(type => (
                  <label key={type.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="auctionType"
                      value={type.value}
                      checked={formData.auctionType === type.value}
                      onChange={(e) => handleInputChange('auctionType', e.target.value)}
                      style={{ accentColor: 'var(--auction-primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{type.label}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--auction-muted)' }}>
                        {type.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Reserve Price (ETH) *
              </label>
              <input
                type="number"
                className="auction-input"
                placeholder="0.1"
                step="0.001"
                min="0"
                value={formData.reservePrice}
                onChange={(e) => handleInputChange('reservePrice', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Duration (Hours)
              </label>
              <select
                className="auction-input"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              >
                <option value="1">1 Hour</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">72 Hours</option>
                <option value="168">1 Week</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Image URL (Optional)
              </label>
              <input
                type="url"
                className="auction-input"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
            </div>
          </div>

          {/* FHE Privacy Settings */}
          <div className="auction-card" style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid var(--auction-primary)' }}>
            <h3 style={{ color: 'var(--auction-primary)', marginBottom: '12px' }}>
              🔒 FHE Privacy Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--auction-primary)' }} />
                <span>Encrypt bid amounts with FHE</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--auction-primary)' }} />
                <span>Hide bidder identities until settlement</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--auction-primary)' }} />
                <span>Use commit-reveal scheme for bid security</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button
              type="button"
              className="auction-btn-secondary"
              onClick={() => navigate('/')}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="auction-btn"
              disabled={isCreating}
              style={{ minWidth: '120px' }}
            >
              {isCreating ? 'Creating...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAuction


