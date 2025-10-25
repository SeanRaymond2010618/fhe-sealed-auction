import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Space,
  Progress,
  Tabs,
  Avatar,
  Tag,
  Timeline,
  List,
  Statistic,
  Badge,
  Tooltip,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LockOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  LinkOutlined,
  TwitterOutlined,
  GithubOutlined,
  GlobalOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import DonationForm from '../components/DonationForm';
import MatchingCalculator from '../components/MatchingCalculator';
import { fetchProjectDetail } from '../services/donation';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectDetail(id!),
    enabled: !!id,
  });

  if (isLoading || !project) {
    return <div>Loading...</div>;
  }

  const progress = (parseFloat(project.raised.replace(/[^0-9.-]+/g, '')) / 
                    parseFloat(project.goal.replace(/[^0-9.-]+/g, ''))) * 100;

  const updates = [
    {
      date: '2024-01-15',
      title: 'Milestone 2 Completed',
      description: 'Successfully implemented the core FHE encryption module.',
    },
    {
      date: '2024-01-10',
      title: 'Partnership Announcement',
      description: 'Partnered with leading privacy research lab.',
    },
    {
      date: '2024-01-05',
      title: 'Project Launch',
      description: 'Project officially launched on the platform.',
    },
  ];

  const team = [
    { name: 'Alice Johnson', role: 'Project Lead', avatar: 'A' },
    { name: 'Bob Smith', role: 'Tech Lead', avatar: 'B' },
    { name: 'Carol Davis', role: 'Community Manager', avatar: 'C' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/projects')}
          style={{ marginBottom: 16 }}
        >
          Back to Projects
        </Button>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              cover={
                <img
                  alt={project.name}
                  src={project.imageUrl || `https://via.placeholder.com/800x400?text=${project.name}`}
                  style={{ height: 400, objectFit: 'cover' }}
                />
              }
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <Title level={2} style={{ margin: 0 }}>{project.name}</Title>
                    {project.verified && (
                      <div className="verification-badge">
                        <CheckCircleOutlined />
                        <span>Verified</span>
                      </div>
                    )}
                  </Space>
                  <Space>
                    <Tag color="blue">{project.category}</Tag>
                    <Text type="secondary">
                      <ClockCircleOutlined /> Created {project.createdAt}
                    </Text>
                  </Space>
                </div>

                <Paragraph style={{ fontSize: 16 }}>
                  {project.description}
                </Paragraph>

                <Space size={16}>
                  <Button 
                    icon={<LinkOutlined />}
                    href={project.website}
                    target="_blank"
                  >
                    Website
                  </Button>
                  <Button 
                    icon={<TwitterOutlined />}
                    href={project.twitter}
                    target="_blank"
                  >
                    Twitter
                  </Button>
                  <Button 
                    icon={<GithubOutlined />}
                    href={project.github}
                    target="_blank"
                  >
                    GitHub
                  </Button>
                  <Button 
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      message.success('Link copied to clipboard!');
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    type={liked ? 'primary' : 'default'}
                    icon={liked ? <HeartFilled /> : <HeartOutlined />}
                    onClick={() => setLiked(!liked)}
                    danger={liked}
                  >
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                </Space>

                <Tabs defaultActiveKey="overview">
                  <TabPane tab="Overview" key="overview">
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                      <Card size="small" title="About This Project">
                        <Paragraph>
                          {project.longDescription || project.description}
                        </Paragraph>
                      </Card>

                      <Card size="small" title="Key Features">
                        <List
                          dataSource={project.features || [
                            'Fully homomorphic encryption for donation amounts',
                            'Quadratic funding mechanism implementation',
                            'Anti-sybil attack measures',
                            'Transparent fund distribution',
                          ]}
                          renderItem={(item: string) => (
                            <List.Item>
                              <Space>
                                <CheckCircleOutlined style={{ color: '#10B981' }} />
                                {item}
                              </Space>
                            </List.Item>
                          )}
                        />
                      </Card>

                      <Card size="small" title="Roadmap">
                        <Timeline
                          items={[
                            {
                              color: 'green',
                              children: 'Q1 2024: Project Launch',
                            },
                            {
                              color: 'green',
                              children: 'Q2 2024: FHE Integration',
                            },
                            {
                              color: 'blue',
                              children: 'Q3 2024: Mainnet Deployment',
                            },
                            {
                              color: 'gray',
                              children: 'Q4 2024: Ecosystem Expansion',
                            },
                          ]}
                        />
                      </Card>
                    </Space>
                  </TabPane>

                  <TabPane tab="Updates" key="updates">
                    <Timeline>
                      {updates.map((update, index) => (
                        <Timeline.Item key={index}>
                          <div>
                            <Text type="secondary">{update.date}</Text>
                            <Title level={5} style={{ margin: '4px 0' }}>
                              {update.title}
                            </Title>
                            <Paragraph>{update.description}</Paragraph>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </TabPane>

                  <TabPane tab="Team" key="team">
                    <List
                      grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                      dataSource={team}
                      renderItem={(member) => (
                        <List.Item>
                          <Card size="small">
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                              <Avatar size={64} style={{ backgroundColor: 'var(--ant-color-primary)' }}>
                                {member.avatar}
                              </Avatar>
                              <Text strong>{member.name}</Text>
                              <Text type="secondary">{member.role}</Text>
                            </Space>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>

                  <TabPane tab="Donors" key="donors">
                    <Card size="small">
                      <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <div style={{ 
                          padding: 16, 
                          background: 'var(--ant-color-bg-layout)',
                          borderRadius: 8,
                          textAlign: 'center',
                        }}>
                          <LockOutlined style={{ fontSize: 32, opacity: 0.4, marginBottom: 8 }} />
                          <Title level={4}>Privacy-Preserved Donations</Title>
                          <Text type="secondary">
                            Individual donation amounts are encrypted using FHE technology.
                            Only aggregated statistics are visible.
                          </Text>
                        </div>
                        
                        <Row gutter={16}>
                          <Col span={8}>
                            <Statistic title="Total Donors" value={project.donors} />
                          </Col>
                          <Col span={8}>
                            <Statistic title="Average Donation" value="Hidden" />
                          </Col>
                          <Col span={8}>
                            <Statistic title="Unique Contributors" value={project.uniqueContributors || project.donors} />
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </TabPane>
                </Tabs>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* Funding Progress Card */}
              <Card>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Raised</Text>
                    <Title level={2} style={{ margin: '4px 0' }}>
                      {project.raised}
                    </Title>
                    <Text type="secondary">of {project.goal} goal</Text>
                  </div>

                  <Progress 
                    percent={progress} 
                    strokeColor={{
                      '0%': '#2563EB',
                      '100%': '#10B981',
                    }}
                  />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Donors" 
                        value={project.donors}
                        prefix={<TeamOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Days Left" 
                        value={project.daysLeft || 15}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                  </Row>

                  <div className="matching-indicator">
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Space>
                        <RiseOutlined />
                        <Text strong>Quadratic Matching Pool</Text>
                      </Space>
                      <Title level={3} style={{ margin: 0, color: 'var(--ant-color-primary)' }}>
                        {project.matchingPool}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Your donation will be matched based on the quadratic funding formula
                      </Text>
                    </Space>
                  </div>

                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    onClick={() => setShowDonationModal(true)}
                  >
                    Donate Now
                  </Button>

                  <div style={{ 
                    padding: 8, 
                    background: 'var(--ant-color-bg-layout)',
                    borderRadius: 8,
                    textAlign: 'center',
                  }}>
                    <Space size={4}>
                      <LockOutlined style={{ fontSize: 12, opacity: 0.6 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Your donation amount will be encrypted
                      </Text>
                    </Space>
                  </div>
                </Space>
              </Card>

              {/* Matching Calculator */}
              <MatchingCalculator 
                projectId={project.id}
                currentRaised={project.raised}
                matchingPool={project.matchingPool}
              />

              {/* Round Info */}
              <Card size="small" title="Funding Round">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Round</Text>
                    <Text strong>Round #{project.roundId}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Status</Text>
                    <Badge status="success" text="Active" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Ends in</Text>
                    <Text strong>{project.daysLeft || 15} days</Text>
                  </div>
                </Space>
              </Card>

              {/* Project Owner */}
              <Card size="small" title="Project Owner">
                <Space>
                  <Avatar style={{ backgroundColor: 'var(--ant-color-primary)' }}>
                    {project.owner.slice(0, 2)}
                  </Avatar>
                  <div>
                    <Text strong>{project.owner}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Verified since Jan 2024
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Donation Modal */}
      <DonationForm
        visible={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
};

export default ProjectDetail;