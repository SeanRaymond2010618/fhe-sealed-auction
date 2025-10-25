import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Card, Typography, Space, Tag, Button, Tabs, Table, Timeline, Avatar, Divider, Alert, Skeleton, Badge, Descriptions, Empty, Statistic } from 'antd';
import { 
  ArrowLeftOutlined, 
  LockOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  TrophyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useAuction, useAuctionBids, useRevealBid } from '@/hooks/useAuction';
import { BidForm } from '@/components/BidForm';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AuctionType, AuctionStatus } from '@/types/auction';
import { formatEther, formatAddress, formatTimestamp, formatAuctionType, formatStatus } from '@/utils/format';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  
  const { data: auction, isLoading: auctionLoading } = useAuction(id!);
  const { data: bids, isLoading: bidsLoading } = useAuctionBids(id!);
  const revealBidMutation = useRevealBid();

  // Mock user address - in real app, get from wallet
  const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7';

  if (auctionLoading || !auction) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
        <Content style={{ padding: '24px 48px' }}>
          <Card>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </Content>
      </Layout>
    );
  }

  const isSealed = auction.type === AuctionType.SEALED_BID;
  const status = formatStatus(auction.status);
  const isRevealPhase = isSealed && Date.now() > auction.endTime && auction.revealTime && Date.now() < auction.revealTime;
  const canReveal = isRevealPhase && userAddress;

  const bidColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => {
        if (rank === 1) return <TrophyOutlined style={{ color: '#FFD700', fontSize: 18 }} />;
        return `#${rank}`;
      },
    },
    {
      title: 'Bidder',
      dataIndex: 'bidder',
      key: 'bidder',
      render: (bidder: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{formatAddress(bidder)}</Text>
          {bidder === userAddress && <Tag color="blue">You</Tag>}
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: any) => {
        if (isSealed && !record.isRevealed) {
          return (
            <Space>
              <EyeInvisibleOutlined />
              <Text type="secondary">Hidden</Text>
            </Space>
          );
        }
        return <Text strong>{formatEther(amount)} ETH</Text>;
      },
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTimestamp(timestamp),
    },
    {
      title: 'Status',
      dataIndex: 'isRevealed',
      key: 'status',
      render: (isRevealed: boolean, record: any) => {
        if (!isSealed) return null;
        if (isRevealed) {
          return <Tag icon={<CheckCircleOutlined />} color="success">Revealed</Tag>;
        }
        if (canReveal && record.bidder === userAddress) {
          return (
            <Button 
              size="small" 
              type="primary"
              onClick={() => {
                // In real app, prompt for actual bid amount
                revealBidMutation.mutate({
                  auctionId: auction.id,
                  bidId: record.id,
                  actualAmount: record.amount,
                });
              }}
            >
              Reveal Bid
            </Button>
          );
        }
        return <Tag icon={<LockOutlined />}>Encrypted</Tag>;
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* Back Button */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/marketplace')}
          >
            Back to Marketplace
          </Button>

          {/* Main Content */}
          <Row gutter={24}>
            {/* Left Column - NFT Details */}
            <Col xs={24} lg={14}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {/* NFT Image Card */}
                <Card>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {auction.nftMetadata?.image && (
                      <div style={{ 
                        position: 'relative', 
                        paddingTop: '100%', 
                        backgroundColor: '#F7F9FC',
                        borderRadius: 8,
                        overflow: 'hidden'
                      }}>
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
                      </div>
                    )}
                    
                    <div>
                      <Space align="center" style={{ marginBottom: 8 }}>
                        <Title level={3} style={{ margin: 0 }}>
                          {auction.nftMetadata?.name || `Token #${auction.tokenId}`}
                        </Title>
                        <Tag color={status.color}>{status.text}</Tag>
                        <Badge
                          count={formatAuctionType(auction.type)}
                          style={{ backgroundColor: '#2563EB' }}
                        />
                      </Space>
                      <Paragraph type="secondary">
                        {auction.nftMetadata?.description || 'No description available'}
                      </Paragraph>
                    </div>

                    {/* Auction Info */}
                    <Descriptions bordered column={2}>
                      <Descriptions.Item label="Contract" span={2}>
                        <Text copyable>{auction.nftContract}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Token ID">
                        {auction.tokenId}
                      </Descriptions.Item>
                      <Descriptions.Item label="Seller">
                        {formatAddress(auction.seller)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Starting Price">
                        {formatEther(auction.startingPrice)} ETH
                      </Descriptions.Item>
                      {auction.reservePrice && (
                        <Descriptions.Item label="Reserve Price">
                          {formatEther(auction.reservePrice)} ETH
                        </Descriptions.Item>
                      )}
                      <Descriptions.Item label="Min Deposit">
                        {formatEther(auction.minDeposit)} ETH
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Bids">
                        {auction.totalBids}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Attributes */}
                    {auction.nftMetadata?.attributes && (
                      <>
                        <Divider>Attributes</Divider>
                        <Row gutter={[12, 12]}>
                          {auction.nftMetadata.attributes.map((attr, index) => (
                            <Col key={index} span={8}>
                              <Card size="small">
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {attr.trait_type}
                                </Text>
                                <br />
                                <Text strong>{attr.value}</Text>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  </Space>
                </Card>

                {/* Tabs */}
                <Card>
                  <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Bid History" key="1">
                      {bidsLoading ? (
                        <Skeleton active />
                      ) : bids && bids.length > 0 ? (
                        <Table
                          dataSource={bids.map((bid, index) => ({ 
                            ...bid, 
                            rank: index + 1,
                            key: bid.id 
                          }))}
                          columns={bidColumns}
                          pagination={false}
                        />
                      ) : (
                        <Empty description="No bids yet" />
                      )}
                    </TabPane>
                    <TabPane tab="Timeline" key="2">
                      <Timeline>
                        <Timeline.Item color="green">
                          Auction Created - {formatTimestamp(auction.startTime)}
                        </Timeline.Item>
                        {auction.status === 'active' && (
                          <Timeline.Item color="blue" dot={<LoadingOutlined />}>
                            Auction Active - Accepting Bids
                          </Timeline.Item>
                        )}
                        {auction.endTime > Date.now() && (
                          <Timeline.Item color="gray">
                            Auction Ends - {formatTimestamp(auction.endTime)}
                          </Timeline.Item>
                        )}
                        {isSealed && auction.revealTime && (
                          <Timeline.Item color="gray">
                            Reveal Phase - {formatTimestamp(auction.revealTime)}
                          </Timeline.Item>
                        )}
                      </Timeline>
                    </TabPane>
                  </Tabs>
                </Card>
              </Space>
            </Col>

            {/* Right Column - Bidding Interface */}
            <Col xs={24} lg={10}>
              <Space direction="vertical" size={16} style={{ width: '100%', position: 'sticky', top: 24 }}>
                {/* Countdown */}
                {auction.status === 'active' && (
                  <Card>
                    <Space direction="vertical" size={16} style={{ width: '100%', textAlign: 'center' }}>
                      <ClockCircleOutlined style={{ fontSize: 32, color: '#2563EB' }} />
                      <CountdownTimer
                        endTime={auction.endTime}
                        size="large"
                        showIcon={false}
                        prefix="Auction ends in"
                      />
                    </Space>
                  </Card>
                )}

                {/* Reveal Phase Alert */}
                {isRevealPhase && (
                  <Alert
                    message="Reveal Phase Active"
                    description="Bidders must reveal their encrypted bids before the reveal deadline."
                    type="warning"
                    showIcon
                    icon={<EyeOutlined />}
                  />
                )}

                {/* Current Price */}
                <Card>
                  <Statistic
                    title={auction.type === AuctionType.ENGLISH ? "Current Highest Bid" : "Current Price"}
                    value={formatEther(auction.currentPrice || auction.startingPrice)}
                    suffix="ETH"
                    valueStyle={{ fontSize: 32, color: '#2563EB' }}
                  />
                  {auction.winner && (
                    <Space style={{ marginTop: 16 }}>
                      <TrophyOutlined style={{ color: '#FFD700' }} />
                      <Text>Winner: {formatAddress(auction.winner)}</Text>
                    </Space>
                  )}
                </Card>

                {/* Bid Form */}
                {auction.status === 'active' && !isRevealPhase && (
                  <BidForm
                    auction={auction}
                    userAddress={userAddress}
                    onSuccess={() => setActiveTab('1')}
                  />
                )}

                {/* Privacy Notice for Sealed Bid */}
                {isSealed && (
                  <Alert
                    message="Privacy-Preserving Sealed Bid Auction"
                    description={
                      <Space direction="vertical">
                        <Text>This auction uses FHE encryption to protect bid privacy:</Text>
                        <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                          <li>Bids are encrypted and hidden from all participants</li>
                          <li>Only revealed after the auction ends</li>
                          <li>Winner determined after all bids are revealed</li>
                          <li>Ensures fair and transparent bidding</li>
                        </ul>
                      </Space>
                    }
                    type="info"
                    icon={<LockOutlined />}
                  />
                )}
              </Space>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};