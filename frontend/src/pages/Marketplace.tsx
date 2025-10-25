import React, { useState } from 'react';
import { Layout, Row, Col, Card, Select, Input, Space, Typography, Segmented, Empty, Skeleton, Button, Badge, Statistic } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, FireOutlined, LockOutlined, FallOutlined, GroupOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuctionCard } from '@/components/AuctionCard';
import { useAuctions } from '@/hooks/useAuction';
import { AuctionType, AuctionStatus, AuctionFilters } from '@/types/auction';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AuctionFilters>({
    status: AuctionStatus.ACTIVE,
    sortBy: 'endTime',
    sortOrder: 'asc',
  });

  const { data: auctions, isLoading } = useAuctions(filters);

  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      setFilters(prev => ({ ...prev, type: undefined }));
    } else {
      setFilters(prev => ({ ...prev, type: type as AuctionType }));
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as AuctionStatus }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [any, any];
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handleSearch = (value: string) => {
    // In a real app, this would search by NFT name, contract, etc.
    console.log('Search:', value);
  };

  const typeOptions = [
    { label: 'All Types', value: 'all', icon: <FilterOutlined /> },
    { label: 'Sealed Bid', value: AuctionType.SEALED_BID, icon: <LockOutlined /> },
    { label: 'English', value: AuctionType.ENGLISH, icon: <FireOutlined /> },
    { label: 'Dutch', value: AuctionType.DUTCH, icon: <FallOutlined /> },
    { label: 'Batch', value: AuctionType.BATCH, icon: <GroupOutlined /> },
  ];

  const stats = {
    totalAuctions: auctions?.length || 0,
    activeAuctions: auctions?.filter(a => a.status === AuctionStatus.ACTIVE).length || 0,
    totalVolume: '1,234.56',
    totalBids: auctions?.reduce((sum, a) => sum + a.totalBids, 0) || 0,
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              NFT Auction Marketplace
            </Title>
            <Text type="secondary">
              Discover and bid on exclusive NFTs with privacy-preserving FHE technology
            </Text>
          </div>

          {/* Stats Cards */}
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Auctions"
                  value={stats.totalAuctions}
                  valueStyle={{ color: '#2563EB' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Now"
                  value={stats.activeAuctions}
                  valueStyle={{ color: '#10B981' }}
                  prefix={<Badge status="processing" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Volume"
                  value={stats.totalVolume}
                  suffix="ETH"
                  precision={2}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Bids"
                  value={stats.totalBids}
                  prefix={<FireOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters Bar */}
          <Card>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  <Search
                    placeholder="Search by NFT name, collection, or address"
                    onSearch={handleSearch}
                    size="large"
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate('/create')}
                  >
                    Create Auction
                  </Button>
                </Col>
              </Row>

              <Space size={16} wrap>
                <Segmented
                  options={typeOptions.map(opt => ({
                    label: (
                      <Space>
                        {opt.icon}
                        {opt.label}
                      </Space>
                    ),
                    value: opt.value,
                  }))}
                  value={filters.type || 'all'}
                  onChange={handleTypeChange}
                />

                <Select
                  value={filters.status}
                  onChange={handleStatusChange}
                  style={{ width: 120 }}
                  options={[
                    { label: 'Active', value: AuctionStatus.ACTIVE },
                    { label: 'Ended', value: AuctionStatus.ENDED },
                    { label: 'All Status', value: undefined },
                  ]}
                />

                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={handleSortChange}
                  style={{ width: 180 }}
                  options={[
                    { label: 'Ending Soon', value: 'endTime-asc' },
                    { label: 'Newly Listed', value: 'createdAt-desc' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                    { label: 'Most Bids', value: 'bids-desc' },
                  ]}
                />
              </Space>
            </Space>
          </Card>

          {/* Auction Grid */}
          {isLoading ? (
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Col key={i} xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Skeleton active />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : auctions && auctions.length > 0 ? (
            <Row gutter={[16, 16]}>
              {auctions.map(auction => (
                <Col key={auction.id} xs={24} sm={12} md={8} lg={6}>
                  <AuctionCard auction={auction} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card>
              <Empty
                description={
                  <Space direction="vertical">
                    <Text>No auctions found</Text>
                    <Button type="primary" onClick={() => navigate('/create')}>
                      Create First Auction
                    </Button>
                  </Space>
                }
              />
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
};