import React, { useState } from 'react';
import { Layout, Row, Col, Card, Statistic, Table, Typography, Space, Tag, Button, Progress, Select, DatePicker, Alert } from 'antd';
import { 
  DashboardOutlined, 
  RiseOutlined, 
  FallOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { useAuctions } from '@/hooks/useAuction';
import { formatEther, formatAddress, formatTimestamp } from '@/utils/format';
import { AuctionStatus } from '@/types/auction';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const { data: auctions } = useAuctions();

  // Calculate metrics
  const metrics = {
    totalAuctions: auctions?.length || 0,
    activeAuctions: auctions?.filter(a => a.status === AuctionStatus.ACTIVE).length || 0,
    totalVolume: auctions?.reduce((sum, a) => {
      const price = a.winningBid || a.currentPrice || a.startingPrice;
      return sum + parseFloat(formatEther(price));
    }, 0) || 0,
    totalUsers: new Set(auctions?.map(a => a.seller) || []).size,
    avgBidsPerAuction: auctions?.length ? 
      (auctions.reduce((sum, a) => sum + a.totalBids, 0) / auctions.length).toFixed(1) : 0,
    successRate: auctions?.length ?
      ((auctions.filter(a => a.winner).length / auctions.length) * 100).toFixed(1) : 0,
  };

  // Chart data
  const volumeData = [
    { date: '2024-01-01', volume: 120, auctions: 15 },
    { date: '2024-01-02', volume: 145, auctions: 18 },
    { date: '2024-01-03', volume: 98, auctions: 12 },
    { date: '2024-01-04', volume: 156, auctions: 20 },
    { date: '2024-01-05', volume: 189, auctions: 24 },
    { date: '2024-01-06', volume: 210, auctions: 28 },
    { date: '2024-01-07', volume: 178, auctions: 22 },
  ];

  const typeDistribution = [
    { type: 'English', value: 35, color: '#EF4444' },
    { type: 'Sealed Bid', value: 30, color: '#2563EB' },
    { type: 'Dutch', value: 20, color: '#F59E0B' },
    { type: 'Batch', value: 15, color: '#10B981' },
  ];

  const volumeConfig = {
    data: volumeData,
    xField: 'date',
    yField: 'volume',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    lineStyle: {
      lineWidth: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
  };

  const pieConfig = {
    data: typeDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const recentAuctionsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <Text copyable>{id.slice(0, 8)}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          active: 'processing',
          ended: 'warning',
          settled: 'success',
          cancelled: 'error',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Seller',
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: string) => formatAddress(seller),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'price',
      render: (price: string, record: any) => 
        `${formatEther(price || record.startingPrice)} ETH`,
    },
    {
      title: 'Bids',
      dataIndex: 'totalBids',
      key: 'bids',
    },
    {
      title: 'Created',
      dataIndex: 'startTime',
      key: 'created',
      render: (time: number) => formatTimestamp(time),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small" danger>Pause</Button>
        </Space>
      ),
    },
  ];

  const issuesData = [
    {
      id: '1',
      type: 'warning',
      message: 'Auction #234 has no bids and ends in 2 hours',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'error',
      message: 'Failed settlement for auction #189',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'info',
      message: 'New high-value auction created: 50 ETH starting price',
      time: '1 day ago',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* Header */}
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                <DashboardOutlined /> Admin Dashboard
              </Title>
              <Text type="secondary">
                Monitor and manage all auction activities
              </Text>
            </Col>
            <Col>
              <Space>
                <RangePicker onChange={setDateRange} />
                <Button icon={<SyncOutlined />}>Refresh</Button>
              </Space>
            </Col>
          </Row>

          {/* Metrics Cards */}
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Total Auctions"
                  value={metrics.totalAuctions}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Active Now"
                  value={metrics.activeAuctions}
                  valueStyle={{ color: '#10B981' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Total Volume"
                  value={metrics.totalVolume}
                  suffix="ETH"
                  precision={2}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={metrics.totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Avg Bids"
                  value={metrics.avgBidsPerAuction}
                  suffix="/auction"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="Success Rate"
                  value={metrics.successRate}
                  suffix="%"
                  prefix={
                    metrics.successRate > 70 ? 
                      <RiseOutlined style={{ color: '#10B981' }} /> : 
                      <FallOutlined style={{ color: '#EF4444' }} />
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Card title="Volume Trend" extra={<Select defaultValue="7d" options={[
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' },
                { label: 'Last 3 Months', value: '3m' },
              ]} />}>
                <Line {...volumeConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Auction Types Distribution">
                <Pie {...pieConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* System Health */}
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Card title="System Health" extra={<Tag color="success">Operational</Tag>}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text>FHE Service</Text>
                    <Progress percent={100} status="success" />
                  </div>
                  <div>
                    <Text>Smart Contracts</Text>
                    <Progress percent={100} status="success" />
                  </div>
                  <div>
                    <Text>IPFS Gateway</Text>
                    <Progress percent={95} status="active" />
                  </div>
                  <div>
                    <Text>Database</Text>
                    <Progress percent={98} status="active" />
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="Recent Issues & Alerts">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {issuesData.map(issue => (
                    <Alert
                      key={issue.id}
                      message={issue.message}
                      type={issue.type as any}
                      showIcon
                      closable
                      action={
                        <Button size="small" type="text">
                          View
                        </Button>
                      }
                    />
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Recent Auctions Table */}
          <Card 
            title="Recent Auctions" 
            extra={
              <Space>
                <Select defaultValue="all" style={{ width: 120 }} options={[
                  { label: 'All Types', value: 'all' },
                  { label: 'English', value: 'english' },
                  { label: 'Sealed Bid', value: 'sealed' },
                  { label: 'Dutch', value: 'dutch' },
                  { label: 'Batch', value: 'batch' },
                ]} />
                <Button type="primary">Export</Button>
              </Space>
            }
          >
            <Table
              dataSource={auctions?.slice(0, 10)}
              columns={recentAuctionsColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>

          {/* Privacy Metrics */}
          <Card title={<Space><SafetyOutlined /> Privacy & Security Metrics</Space>}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Encrypted Bids"
                  value={234}
                  suffix="total"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="FHE Operations"
                  value={1892}
                  suffix="today"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Gas Saved"
                  value={45.2}
                  suffix="ETH"
                  precision={1}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Privacy Score"
                  value={98}
                  suffix="/100"
                  valueStyle={{ color: '#10B981' }}
                />
              </Col>
            </Row>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};