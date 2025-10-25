import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Tag, Button, Statistic, Avatar, Tooltip, Row, Col, Badge } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  LockOutlined,
  FireOutlined,
  FallOutlined,
  GroupOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Auction, AuctionType } from '@/types/auction';
import { formatEther, formatAddress, formatAuctionType, formatStatus, calculateDutchPrice } from '@/utils/format';
import { CountdownTimer } from './CountdownTimer';

const { Text, Title, Paragraph } = Typography;

interface AuctionCardProps {
  auction: Auction;
  onClick?: () => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onClick }) => {
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState(auction.currentPrice || auction.startingPrice);

  // Update Dutch auction price
  useEffect(() => {
    if (auction.type === AuctionType.DUTCH && auction.priceDecrement && auction.decrementInterval) {
      const interval = setInterval(() => {
        const newPrice = calculateDutchPrice(
          auction.startingPrice,
          auction.priceDecrement!,
          auction.decrementInterval!,
          auction.startTime
        );
        setCurrentPrice(newPrice);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [auction]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/auction/${auction.id}`);
    }
  };

  const getTypeIcon = () => {
    switch (auction.type) {
      case AuctionType.SEALED_BID:
        return <LockOutlined />;
      case AuctionType.ENGLISH:
        return <FireOutlined />;
      case AuctionType.DUTCH:
        return <FallOutlined />;
      case AuctionType.BATCH:
        return <GroupOutlined />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (auction.type) {
      case AuctionType.SEALED_BID:
        return '#2563EB';
      case AuctionType.ENGLISH:
        return '#EF4444';
      case AuctionType.DUTCH:
        return '#F59E0B';
      case AuctionType.BATCH:
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const status = formatStatus(auction.status);

  return (
    <Badge.Ribbon 
      text={formatAuctionType(auction.type)} 
      color={getTypeColor()}
      style={{ display: auction.status === 'active' ? 'block' : 'none' }}
    >
      <Card
        hoverable
        onClick={handleClick}
        cover={
          auction.nftMetadata?.image && (
            <div style={{ position: 'relative', paddingTop: '100%', backgroundColor: '#F7F9FC' }}>
              <img
                alt={auction.nftMetadata.name}
                src={auction.nftMetadata.image}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {auction.type === AuctionType.SEALED_BID && (
                <Tag
                  icon={<LockOutlined />}
                  color="blue"
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                  }}
                >
                  Encrypted Bids
                </Tag>
              )}
            </div>
          )
        }
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%', flex: 1 }}>
          {/* NFT Info */}
          <div>
            <Title level={5} style={{ marginBottom: 4 }}>
              {auction.nftMetadata?.name || `Token #${auction.tokenId}`}
            </Title>
            <Paragraph 
              type="secondary" 
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0 }}
            >
              {auction.nftMetadata?.description || 'No description available'}
            </Paragraph>
          </div>

          {/* Status and Type */}
          <Space size={8}>
            <Tag color={status.color}>{status.text}</Tag>
            {auction.status === 'active' && (
              <CountdownTimer 
                endTime={auction.endTime} 
                size="small"
                showIcon={false}
              />
            )}
          </Space>

          {/* Price Information */}
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {auction.type === AuctionType.DUTCH ? 'Current Price' : 
               auction.type === AuctionType.ENGLISH && auction.currentPrice ? 'Current Bid' :
               'Starting Price'}
            </Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Text strong style={{ fontSize: 20 }}>
                {formatEther(currentPrice)} ETH
              </Text>
              {auction.type === AuctionType.DUTCH && auction.priceDecrement && (
                <Text type="danger" style={{ fontSize: 12 }}>
                  <FallOutlined /> -{formatEther(auction.priceDecrement)} ETH/hr
                </Text>
              )}
            </div>
            {auction.reservePrice && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Reserve: {formatEther(auction.reservePrice)} ETH
              </Text>
            )}
          </div>

          {/* Stats */}
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Total Bids"
                value={auction.totalBids}
                prefix={auction.type === AuctionType.SEALED_BID ? <LockOutlined /> : null}
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Bidders"
                value={auction.uniqueBidders}
                prefix={<UserOutlined />}
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
          </Row>

          {/* Seller Info */}
          <Space size={8} style={{ marginTop: 'auto' }}>
            <Avatar size={20} icon={<UserOutlined />} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Seller: {formatAddress(auction.seller)}
            </Text>
          </Space>

          {/* Action Button */}
          <Button 
            type="primary" 
            block
            icon={<EyeOutlined />}
            style={{ marginTop: 8 }}
          >
            View Details
          </Button>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};