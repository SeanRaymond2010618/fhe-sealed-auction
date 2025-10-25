import React, { useState } from 'react';
import { Layout, Tabs, Card, Table, Tag, Space, Button, Typography, Empty, Avatar, Badge, Statistic, Row, Col, Tooltip } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserBids, useUserAuctions } from '@/hooks/useAuction';
import { formatEther, formatAddress, formatTimestamp, formatAuctionType, formatStatus } from '@/utils/format';
import { AuctionStatus } from '@/types/auction';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const MyAuctions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bids');
  
  // Mock user address - in real app, get from wallet
  const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7';
  
  const { data: userBids, isLoading: bidsLoading } = useUserBids(userAddress);
  const { data: userAuctions, isLoading: auctionsLoading } = useUserAuctions(userAddress);

  // Calculate stats
  const stats = {
    totalBids: userBids?.length || 0,
    wonAuctions: userBids?.filter(b => b.isWinning).length || 0,
    activeBids: userBids?.filter(b => !b.isWinning && !b.refundable).length || 0,
    totalSpent: userBids?.filter(b => b.isWinning)
      .reduce((sum, b) => sum + parseFloat(formatEther(b.amount)), 0) || 0,
    activeAuctions: userAuctions?.filter(a => a.status === AuctionStatus.ACTIVE).length || 0,
    totalAuctions: userAuctions?.length || 0,
    totalEarned: userAuctions?.filter(a => a.status === AuctionStatus.SETTLED)
      .reduce((sum, a) => sum + parseFloat(formatEther(a.winningBid || '0')), 0) || 0,
  };

  const bidColumns = [
    {
      title: 'NFT',
      dataIndex: 'nftName',
      key: 'nft',
      render: (name: string, record: any) => (
        <Space>
          <Avatar shape="square" size={40} src={record.nftImage} icon={<UserOutlined />} />
          <div>
            <Text strong>{name || `Token #${record.tokenId}`}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatAddress(record.auctionContract)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'auctionType',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'sealed-bid' ? 'blue' : 'default'}>
          {type === 'sealed-bid' && <LockOutlined />}
          {formatAuctionType(type)}
        </Tag>
      ),
    },
    {
      title: 'Your Bid',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{formatEther(amount)} ETH</Text>
          {record.rank && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Rank #{record.rank}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => {
        if (record.isWinning) {
          return <Tag icon={<TrophyOutlined />} color="gold">Won</Tag>;
        }
        if (record.refundable) {
          return <Tag icon={<DollarOutlined />} color="warning">Refundable</Tag>;
        }
        if (record.auctionStatus === 'active') {
          return <Tag icon={<ClockCircleOutlined />} color="processing">Active</Tag>;
        }
        return <Tag icon={<CloseCircleOutlined />} color="error">Lost</Tag>;
      },
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTimestamp(timestamp),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/auction/${record.auctionId}`)}
          >
            View
          </Button>
          {record.refundable && (
            <Button size="small" type="primary">
              Claim Refund
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const auctionColumns = [
    {
      title: 'NFT',
      dataIndex: 'nftMetadata',
      key: 'nft',
      render: (metadata: any, record: any) => (
        <Space>
          <Avatar shape="square" size={40} src={metadata?.image} icon={<ShopOutlined />} />
          <div>
            <Text strong>{metadata?.name || `Token #${record.tokenId}`}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatAddress(record.nftContract)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag>{formatAuctionType(type)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = formatStatus(status);
        return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
      },
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'price',
      render: (price: string, record: any) => (
        <Text strong>{formatEther(price || record.startingPrice)} ETH</Text>
      ),
    },
    {
      title: 'Bids',
      dataIndex: 'totalBids',
      key: 'bids',
      render: (bids: number, record: any) => (
        <Space direction="vertical" size={0}>
          <Text>{bids} bids</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.uniqueBidders} bidders
          </Text>
        </Space>
      ),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: number, record: any) => {
        if (record.status === 'active') {
          return (
            <Space direction="vertical" size={0}>
              <Text>{formatTimestamp(endTime)}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(endTime) > new Date() ? 'Ends soon' : 'Ended'}
              </Text>
            </Space>
          );
        }
        return <Text type="secondary">-</Text>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/auction/${record.id}`)}
          >
            View
          </Button>
          {record.status === 'ended' && !record.winner && (
            <Button size="small" type="primary">
              Settle
            </Button>
          )}
          {record.status === 'active' && record.totalBids === 0 && (
            <Button size="small" danger>
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <Title level={2}>My Auctions</Title>
            <Text type="secondary">
              Manage your bids and auctions in one place
            </Text>
          </div>

          {/* Stats Cards */}
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Bids"
                  value={stats.totalBids}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Won Auctions"
                  value={stats.wonAuctions}
                  valueStyle={{ color: '#FFD700' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Bids"
                  value={stats.activeBids}
                  valueStyle={{ color: '#2563EB' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title={activeTab === 'bids' ? 'Total Spent' : 'Total Earned'}
                  value={activeTab === 'bids' ? stats.totalSpent : stats.totalEarned}
                  suffix="ETH"
                  precision={2}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabs */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={
                  <Space>
                    <UserOutlined />
                    My Bids
                    <Badge count={stats.activeBids} />
                  </Space>
                } 
                key="bids"
              >
                {userBids && userBids.length > 0 ? (
                  <Table
                    dataSource={userBids}
                    columns={bidColumns}
                    loading={bidsLoading}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} bids`,
                    }}
                  />
                ) : (
                  <Empty
                    description="You haven't placed any bids yet"
                    style={{ padding: '40px 0' }}
                  >
                    <Button type="primary" onClick={() => navigate('/marketplace')}>
                      Browse Auctions
                    </Button>
                  </Empty>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <Space>
                    <ShopOutlined />
                    My Listings
                    <Badge count={stats.activeAuctions} status="processing" />
                  </Space>
                } 
                key="listings"
              >
                {userAuctions && userAuctions.length > 0 ? (
                  <Table
                    dataSource={userAuctions}
                    columns={auctionColumns}
                    loading={auctionsLoading}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} auctions`,
                    }}
                  />
                ) : (
                  <Empty
                    description="You haven't created any auctions yet"
                    style={{ padding: '40px 0' }}
                  >
                    <Button type="primary" onClick={() => navigate('/create')}>
                      Create Auction
                    </Button>
                  </Empty>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};