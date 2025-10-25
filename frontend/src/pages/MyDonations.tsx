import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Space,
  Tag,
  Button,
  Row,
  Col,
  Statistic,
  Timeline,
  Avatar,
  Empty,
  Tabs,
  Progress,
  Badge,
  Tooltip,
  message,
} from 'antd';
import {
  HeartOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchMyDonations } from '../services/donation';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Donation {
  id: string;
  projectId: string;
  projectName: string;
  amount: string;
  encryptedAmount: boolean;
  matchingReceived: string;
  timestamp: string;
  txHash: string;
  roundId: string;
  status: 'pending' | 'confirmed' | 'matched';
}

const MyDonations: React.FC = () => {
  const [showAmounts, setShowAmounts] = useState(false);

  const { data: donations, isLoading } = useQuery({
    queryKey: ['myDonations'],
    queryFn: fetchMyDonations,
  });

  const stats = {
    totalDonated: '$1,234',
    projectsSupported: 15,
    matchingReceived: '$456',
    impactScore: 87,
  };

  const columns = [
    {
      title: 'Project',
      key: 'project',
      render: (record: Donation) => (
        <Space>
          <Avatar style={{ backgroundColor: 'var(--ant-color-primary)' }}>
            {record.projectName[0]}
          </Avatar>
          <div>
            <Text strong>{record.projectName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Round #{record.roundId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: Donation) => (
        <Space>
          {showAmounts ? (
            <Text strong>{amount}</Text>
          ) : (
            <>
              <EyeInvisibleOutlined style={{ opacity: 0.5 }} />
              <Text type="secondary">Encrypted</Text>
            </>
          )}
          {record.encryptedAmount && (
            <Tooltip title="Amount encrypted with FHE">
              <LockOutlined style={{ color: 'var(--ant-color-primary)', fontSize: 12 }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'QF Match',
      dataIndex: 'matchingReceived',
      key: 'matchingReceived',
      render: (amount: string) => (
        <Space>
          <RiseOutlined style={{ color: 'var(--ant-color-success)' }} />
          <Text strong style={{ color: 'var(--ant-color-success)' }}>
            +{amount}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Text type="secondary">{timestamp}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
          confirmed: { color: 'success', text: 'Confirmed', icon: <CheckCircleOutlined /> },
          matched: { color: 'blue', text: 'Matched', icon: <TrophyOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Donation) => (
        <Space>
          <Tooltip title="View on Explorer">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => window.open(`https://etherscan.io/tx/${record.txHash}`, '_blank')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const impactData = [
    { month: 'Jan', amount: 120, matching: 45 },
    { month: 'Feb', amount: 200, matching: 78 },
    { month: 'Mar', amount: 150, matching: 62 },
    { month: 'Apr', amount: 300, matching: 125 },
    { month: 'May', amount: 180, matching: 72 },
    { month: 'Jun', amount: 250, matching: 98 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2}>My Donations</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Track your contributions and impact across all funding rounds
          </Text>
        </div>
        <Space>
          <Button
            icon={showAmounts ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => {
              setShowAmounts(!showAmounts);
              message.info(showAmounts ? 'Amounts hidden' : 'Amounts revealed');
            }}
          >
            {showAmounts ? 'Hide' : 'Show'} Amounts
          </Button>
          <Button icon={<DownloadOutlined />}>
            Export History
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Donated"
              value={showAmounts ? stats.totalDonated : '••••'}
              prefix={<HeartOutlined />}
              valueStyle={{ color: 'var(--ant-color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Projects Supported"
              value={stats.projectsSupported}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total QF Matching"
              value={stats.matchingReceived}
              prefix={<RiseOutlined />}
              valueStyle={{ color: 'var(--ant-color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div>
              <Text type="secondary">Impact Score</Text>
              <div style={{ marginTop: 8 }}>
                <Progress
                  type="circle"
                  percent={stats.impactScore}
                  width={80}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="donations">
          <TabPane tab="All Donations" key="donations">
            {donations && donations.length > 0 ? (
              <Table
                columns={columns}
                dataSource={donations}
                loading={isLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <Empty
                description="No donations yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => window.location.href = '/projects'}>
                  Explore Projects
                </Button>
              </Empty>
            )}
          </TabPane>

          <TabPane tab="Impact Timeline" key="timeline">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card title="Donation History">
                  <Timeline mode="left">
                    {donations?.slice(0, 5).map((donation: Donation) => (
                      <Timeline.Item
                        key={donation.id}
                        color={donation.status === 'matched' ? 'green' : 'blue'}
                        label={donation.timestamp}
                      >
                        <Space direction="vertical" size={4}>
                          <Text strong>{donation.projectName}</Text>
                          <Space>
                            <Text>{showAmounts ? donation.amount : '••••'}</Text>
                            {donation.matchingReceived && (
                              <Text type="success">+{donation.matchingReceived} matched</Text>
                            )}
                          </Space>
                        </Space>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card title="Monthly Impact">
                  {impactData.map((data) => (
                    <div key={data.month} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>{data.month}</Text>
                        <Text strong>
                          {showAmounts ? `$${data.amount}` : '••••'}
                        </Text>
                      </div>
                      <Progress
                        percent={(data.amount / 300) * 100}
                        showInfo={false}
                        strokeColor={{
                          '0%': '#2563EB',
                          '100%': '#10B981',
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        +${data.matching} matched
                      </Text>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Achievements" key="achievements">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable className="hover-card">
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Badge
                      count={
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
                      }
                    >
                      <Avatar size={64} style={{ backgroundColor: '#f0f0f0' }}>
                        <HeartOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                      </Avatar>
                    </Badge>
                    <Text strong>First Donation</Text>
                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                      Made your first donation to a project
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable className="hover-card">
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Badge
                      count={
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
                      }
                    >
                      <Avatar size={64} style={{ backgroundColor: '#f0f0f0' }}>
                        <TrophyOutlined style={{ fontSize: 32, color: '#faad14' }} />
                      </Avatar>
                    </Badge>
                    <Text strong>Project Supporter</Text>
                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                      Supported 10+ projects
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable className="hover-card" style={{ opacity: 0.6 }}>
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Avatar size={64} style={{ backgroundColor: '#f0f0f0' }}>
                      <RiseOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                    </Avatar>
                    <Text strong>QF Champion</Text>
                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                      Received $1000+ in matching
                    </Text>
                    <Progress percent={45} size="small" />
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable className="hover-card" style={{ opacity: 0.6 }}>
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Avatar size={64} style={{ backgroundColor: '#f0f0f0' }}>
                      <LockOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                    </Avatar>
                    <Text strong>Privacy Pioneer</Text>
                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                      100% encrypted donations
                    </Text>
                    <Progress percent={80} size="small" />
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MyDonations;