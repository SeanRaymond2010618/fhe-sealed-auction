import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Space,
  Avatar,
  Tag,
  Progress,
  Tabs,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Alert,
} from 'antd';
import {
  TrophyOutlined,
  CrownOutlined,
  FireOutlined,
  RiseOutlined,
  TeamOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../services/donation';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface LeaderboardEntry {
  rank: number;
  projectId: string;
  projectName: string;
  category: string;
  totalRaised: string;
  donorsCount: number;
  matchingReceived: string;
  verified: boolean;
  momentum: number;
}

const Leaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('current');
  const [category, setCategory] = useState('all');

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', timeRange, category],
    queryFn: () => fetchLeaderboard({ timeRange, category }),
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <CrownOutlined style={{ color: '#FFD700', fontSize: 20 }} />;
    if (rank === 2) return <CrownOutlined style={{ color: '#C0C0C0', fontSize: 18 }} />;
    if (rank === 3) return <CrownOutlined style={{ color: '#CD7F32', fontSize: 16 }} />;
    return null;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <Space>
          <div className={`leaderboard-rank ${getRankClass(rank)}`}>
            {rank <= 3 ? getRankIcon(rank) : rank}
          </div>
        </Space>
      ),
    },
    {
      title: 'Project',
      key: 'project',
      render: (record: LeaderboardEntry) => (
        <Space>
          <Avatar style={{ backgroundColor: 'var(--ant-color-primary)' }}>
            {record.projectName[0]}
          </Avatar>
          <div>
            <Space>
              <Text strong>{record.projectName}</Text>
              {record.verified && (
                <Tooltip title="Verified Project">
                  <CheckCircleOutlined style={{ color: '#10B981' }} />
                </Tooltip>
              )}
              {record.momentum > 50 && (
                <Tooltip title="Trending">
                  <FireOutlined style={{ color: '#F59E0B' }} />
                </Tooltip>
              )}
            </Space>
            <br />
            <Tag color="blue" style={{ marginTop: 4 }}>{record.category}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Total Raised',
      dataIndex: 'totalRaised',
      key: 'totalRaised',
      render: (amount: string) => (
        <Text strong style={{ fontSize: 16 }}>
          {amount}
        </Text>
      ),
    },
    {
      title: 'QF Matching',
      dataIndex: 'matchingReceived',
      key: 'matchingReceived',
      render: (amount: string) => (
        <Space>
          <RiseOutlined style={{ color: 'var(--ant-color-success)' }} />
          <Text strong style={{ color: 'var(--ant-color-success)' }}>
            {amount}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Donors',
      dataIndex: 'donorsCount',
      key: 'donorsCount',
      render: (count: number) => (
        <Space>
          <TeamOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: 'Momentum',
      dataIndex: 'momentum',
      key: 'momentum',
      width: 150,
      render: (momentum: number) => (
        <div>
          <Progress 
            percent={momentum} 
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      ),
    },
  ];

  const topDonorsColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <div className={`leaderboard-rank ${getRankClass(rank)}`}>
          {rank <= 3 ? getRankIcon(rank) : rank}
        </div>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Space>
          <Avatar style={{ backgroundColor: 'var(--ant-color-primary)' }}>
            {address.slice(2, 4)}
          </Avatar>
          <Text code>{address}</Text>
        </Space>
      ),
    },
    {
      title: 'Total Donated',
      dataIndex: 'totalDonated',
      key: 'totalDonated',
      render: () => (
        <Space>
          <EyeInvisibleOutlined style={{ opacity: 0.5 }} />
          <Text type="secondary">Hidden</Text>
        </Space>
      ),
    },
    {
      title: 'Projects Supported',
      dataIndex: 'projectsCount',
      key: 'projectsCount',
      render: (count: number) => <Tag color="blue">{count} projects</Tag>,
    },
    {
      title: 'Impact Score',
      dataIndex: 'impactScore',
      key: 'impactScore',
      render: (score: number) => (
        <Progress
          type="circle"
          percent={score}
          width={50}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      ),
    },
  ];

  const topDonors = [
    { rank: 1, address: '0x1234...5678', projectsCount: 25, impactScore: 95 },
    { rank: 2, address: '0xabcd...efgh', projectsCount: 18, impactScore: 88 },
    { rank: 3, address: '0x9876...5432', projectsCount: 15, impactScore: 82 },
    { rank: 4, address: '0xfedc...ba98', projectsCount: 12, impactScore: 75 },
    { rank: 5, address: '0x1357...2468', projectsCount: 10, impactScore: 68 },
  ];

  return (
    <div>
      <Title level={2}>Leaderboard</Title>
      <Text type="secondary" style={{ fontSize: 16 }}>
        Top performing projects and contributors with privacy-preserved metrics
      </Text>

      {/* Privacy Notice */}
      <Alert
        message="Privacy-Preserved Rankings"
        description="Individual donation amounts are encrypted. Rankings are based on aggregated and anonymized metrics."
        type="info"
        icon={<LockOutlined />}
        showIcon
        style={{ marginTop: 24, marginBottom: 24 }}
      />

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={leaderboard?.length || 0}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Round"
              value="Round 12"
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Raised"
              value="$2.4M"
              prefix="~"
              valueStyle={{ color: 'var(--ant-color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="QF Matched"
              value="$500K"
              valueStyle={{ color: 'var(--ant-color-primary)' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 150 }}
              options={[
                { value: 'current', label: 'Current Round' },
                { value: 'all', label: 'All Time' },
                { value: 'month', label: 'This Month' },
                { value: 'week', label: 'This Week' },
              ]}
            />
            <Select
              value={category}
              onChange={setCategory}
              style={{ width: 150 }}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'defi', label: 'DeFi' },
                { value: 'infrastructure', label: 'Infrastructure' },
                { value: 'social', label: 'Social Impact' },
                { value: 'education', label: 'Education' },
              ]}
            />
          </Space>
        </div>

        <Tabs defaultActiveKey="projects">
          <TabPane 
            tab={
              <span>
                <TrophyOutlined />
                Top Projects
              </span>
            } 
            key="projects"
          >
            <Table
              columns={columns}
              dataSource={leaderboard}
              loading={isLoading}
              rowKey="projectId"
              pagination={{ pageSize: 20 }}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Top Donors
              </span>
            } 
            key="donors"
          >
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="Donor Privacy"
                description="Individual donation amounts are encrypted and not visible. Only aggregated metrics are shown."
                type="warning"
                icon={<EyeInvisibleOutlined />}
                showIcon
              />
            </div>
            <Table
              columns={topDonorsColumns}
              dataSource={topDonors}
              rowKey="address"
              pagination={false}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <FireOutlined />
                Trending
              </span>
            } 
            key="trending"
          >
            <Row gutter={[16, 16]}>
              {leaderboard?.slice(0, 6).map((project: LeaderboardEntry) => (
                <Col xs={24} sm={12} md={8} key={project.projectId}>
                  <Card
                    hoverable
                    className="hover-card"
                  >
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Space>
                        <Avatar style={{ backgroundColor: 'var(--ant-color-primary)' }}>
                          {project.projectName[0]}
                        </Avatar>
                        <div>
                          <Text strong>{project.projectName}</Text>
                          <br />
                          <Tag color="blue" style={{ marginTop: 4 }}>
                            {project.category}
                          </Tag>
                        </div>
                      </Space>
                      
                      <div>
                        <Text type="secondary">24h Change</Text>
                        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ant-color-success)' }}>
                          <RiseOutlined /> +{Math.floor(Math.random() * 50 + 10)}%
                        </div>
                      </div>

                      <Progress
                        percent={project.momentum}
                        strokeColor={{
                          '0%': '#F59E0B',
                          '100%': '#EF4444',
                        }}
                        showInfo={false}
                      />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Raised</Text>
                        <Text strong>{project.totalRaised}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Leaderboard;