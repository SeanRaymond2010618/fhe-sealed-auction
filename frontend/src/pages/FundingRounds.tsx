import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Tag,
  Space,
  Button,
  Progress,
  Statistic,
  Row,
  Col,
  Badge,
  Tabs,
  Timeline,
  Avatar,
  Tooltip,
} from 'antd';
import {
  ClockCircleOutlined,
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchRounds } from '../services/donation';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Countdown } = Statistic;

interface Round {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  matchingPool: string;
  totalRaised: string;
  totalDonors: number;
  projectsCount: number;
  status: 'upcoming' | 'active' | 'completed';
}

const FundingRounds: React.FC = () => {
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: fetchRounds,
  });

  const activeRound = rounds?.find((r: Round) => r.status === 'active');
  const deadline = activeRound ? Date.now() + 1000 * 60 * 60 * 24 * 5 : Date.now();

  const columns = [
    {
      title: 'Round',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Round) => (
        <Space>
          <Text strong>{text}</Text>
          {record.status === 'active' && (
            <Badge status="processing" text="Active" />
          )}
        </Space>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: Round) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{record.startDate}</Text>
          <Text style={{ fontSize: 12 }}>{record.endDate}</Text>
        </Space>
      ),
    },
    {
      title: 'Matching Pool',
      dataIndex: 'matchingPool',
      key: 'matchingPool',
      render: (amount: string) => (
        <Text strong style={{ color: 'var(--ant-color-primary)' }}>
          {amount}
        </Text>
      ),
    },
    {
      title: 'Total Raised',
      dataIndex: 'totalRaised',
      key: 'totalRaised',
    },
    {
      title: 'Projects',
      dataIndex: 'projectsCount',
      key: 'projectsCount',
      render: (count: number) => (
        <Tag color="blue">{count} projects</Tag>
      ),
    },
    {
      title: 'Donors',
      dataIndex: 'totalDonors',
      key: 'totalDonors',
      render: (count: number) => (
        <Space>
          <TeamOutlined />
          {count}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          upcoming: { color: 'default', text: 'Upcoming' },
          active: { color: 'success', text: 'Active' },
          completed: { color: 'default', text: 'Completed' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Round) => (
        <Button
          type="link"
          onClick={() => setSelectedRound(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Funding Rounds</Title>
      <Text type="secondary" style={{ fontSize: 16 }}>
        Participate in quadratic funding rounds to maximize your impact
      </Text>

      {/* Active Round Highlight */}
      {activeRound && (
        <Card
          className="gradient-bg"
          style={{ 
            marginTop: 24,
            marginBottom: 24,
            color: 'white',
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <Space direction="vertical" size={12}>
                <Badge
                  count="ACTIVE NOW"
                  style={{ 
                    backgroundColor: '#10B981',
                    fontSize: 11,
                    padding: '0 8px',
                  }}
                />
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {activeRound.name}
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                  Support innovative projects with quadratic funding. Your donations will be 
                  matched from a pool of {activeRound.matchingPool}.
                </Paragraph>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 8, display: 'block' }}>
                  Round ends in:
                </Text>
                <Countdown
                  value={deadline}
                  format="D[d] H[h] m[m] s[s]"
                  valueStyle={{ 
                    color: 'white', 
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    size="large"
                    ghost
                    style={{ borderColor: 'white', color: 'white' }}
                    onClick={() => setSelectedRound(activeRound)}
                  >
                    View Round Details
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Rounds"
              value={rounds?.length || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Distributed"
              value="$3.2M"
              prefix={<DollarOutlined />}
              valueStyle={{ color: 'var(--ant-color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Projects Funded"
              value={245}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: 'var(--ant-color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Donors"
              value="12.5K"
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Rounds Table */}
      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="All Rounds" key="all">
            <Table
              columns={columns}
              dataSource={rounds}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Active" key="active">
            <Table
              columns={columns}
              dataSource={rounds?.filter((r: Round) => r.status === 'active')}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Upcoming" key="upcoming">
            <Table
              columns={columns}
              dataSource={rounds?.filter((r: Round) => r.status === 'upcoming')}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Completed" key="completed">
            <Table
              columns={columns}
              dataSource={rounds?.filter((r: Round) => r.status === 'completed')}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* How QF Works Section */}
      <Card style={{ marginTop: 24 }} title="How Quadratic Funding Works">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={16}>
              <div>
                <Title level={4}>What is Quadratic Funding?</Title>
                <Paragraph>
                  Quadratic Funding (QF) is a democratic funding mechanism that amplifies 
                  the impact of small donations. The number of contributors matters more 
                  than the amount contributed.
                </Paragraph>
              </div>

              <Timeline
                items={[
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <Text strong>Donate to Projects</Text>
                        <br />
                        <Text type="secondary">
                          Choose projects you want to support
                        </Text>
                      </div>
                    ),
                  },
                  {
                    color: 'green',
                    children: (
                      <div>
                        <Text strong>Donations are Encrypted</Text>
                        <br />
                        <Text type="secondary">
                          FHE ensures privacy of individual amounts
                        </Text>
                      </div>
                    ),
                  },
                  {
                    color: 'orange',
                    children: (
                      <div>
                        <Text strong>QF Calculation</Text>
                        <br />
                        <Text type="secondary">
                          Matching funds distributed based on square root formula
                        </Text>
                      </div>
                    ),
                  },
                  {
                    color: 'purple',
                    children: (
                      <div>
                        <Text strong>Funds Distributed</Text>
                        <br />
                        <Text type="secondary">
                          Projects receive donations + matching funds
                        </Text>
                      </div>
                    ),
                  },
                ]}
              />
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Card
              style={{ 
                background: 'var(--ant-color-bg-layout)',
                border: '1px solid var(--ant-color-border)',
              }}
            >
              <Title level={5}>QF Formula Example</Title>
              <Paragraph>
                For a project with 100 donors contributing $10 each vs 10 donors 
                contributing $100 each:
              </Paragraph>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ 
                  padding: 12, 
                  background: 'var(--ant-color-bg-container)',
                  borderRadius: 8,
                }}>
                  <Text strong>Scenario 1: Many Small Donors</Text>
                  <br />
                  <Text>100 × $10 = $1,000 raised</Text>
                  <br />
                  <Text strong style={{ color: 'var(--ant-color-success)' }}>
                    Matching: ~$5,000
                  </Text>
                </div>
                <div style={{ 
                  padding: 12, 
                  background: 'var(--ant-color-bg-container)',
                  borderRadius: 8,
                }}>
                  <Text strong>Scenario 2: Few Large Donors</Text>
                  <br />
                  <Text>10 × $100 = $1,000 raised</Text>
                  <br />
                  <Text strong style={{ color: 'var(--ant-color-warning)' }}>
                    Matching: ~$500
                  </Text>
                </div>
              </Space>
              <Alert
                message="Democratic Funding"
                description="Projects with broader community support receive more matching funds"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FundingRounds;