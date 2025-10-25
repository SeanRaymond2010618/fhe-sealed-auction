import React, { useState } from 'react';
import { 
  Typography, 
  Input, 
  Select, 
  Space, 
  Row, 
  Col, 
  Segmented,
  Button,
  Tag,
  Empty,
  Spin,
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects } from '../services/donation';

const { Title, Text } = Typography;
const { Search } = Input;

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  goal: string;
  raised: string;
  donors: number;
  matchingPool: string;
  verified: boolean;
  imageUrl: string;
  owner: string;
  createdAt: string;
  roundId: string;
}

const ProjectsDiscovery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', searchTerm, category, sortBy],
    queryFn: () => fetchProjects({ search: searchTerm, category, sort: sortBy }),
    staleTime: 1000 * 60 * 5,
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'defi', label: 'DeFi' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'social', label: 'Social Impact' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'art', label: 'Art & Culture' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: <FireOutlined /> },
    { value: 'recent', label: 'Recently Added', icon: <ClockCircleOutlined /> },
    { value: 'funding', label: 'Most Funded', icon: <RiseOutlined /> },
    { value: 'matching', label: 'Highest Match', icon: <RiseOutlined /> },
  ];

  const stats = {
    totalProjects: projects?.length || 0,
    totalRaised: '$2,456,789',
    activeDonors: '12,345',
    matchingPool: '$500,000',
  };

  return (
    <div>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Discover Projects
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Support innovative projects with privacy-preserving donations and quadratic funding
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <div className="gradient-bg-subtle" style={{ 
            padding: 16, 
            borderRadius: 8,
            border: '1px solid var(--ant-color-border)',
          }}>
            <Text type="secondary">Total Projects</Text>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
              {stats.totalProjects}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ 
            padding: 16, 
            borderRadius: 8,
            background: 'var(--ant-color-bg-container)',
            border: '1px solid var(--ant-color-border)',
          }}>
            <Text type="secondary">Total Raised</Text>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
              {stats.totalRaised}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ 
            padding: 16, 
            borderRadius: 8,
            background: 'var(--ant-color-bg-container)',
            border: '1px solid var(--ant-color-border)',
          }}>
            <Text type="secondary">Active Donors</Text>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
              {stats.activeDonors}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="matching-indicator">
            <Text type="secondary">Matching Pool</Text>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4, color: 'var(--ant-color-primary)' }}>
              {stats.matchingPool}
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters Section */}
      <div style={{ 
        marginBottom: 24,
        padding: 16,
        background: 'var(--ant-color-bg-container)',
        borderRadius: 8,
        border: '1px solid var(--ant-color-border)',
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="1">
            <Search
              placeholder="Search projects..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Space size={12}>
              <Select
                value={category}
                onChange={setCategory}
                options={categories}
                style={{ width: 160 }}
                size="large"
              />
              <Segmented
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions.map(opt => ({
                  value: opt.value,
                  label: (
                    <Space size={4}>
                      {opt.icon}
                      <span>{opt.label}</span>
                    </Space>
                  ),
                }))}
              />
              <Segmented
                value={viewMode}
                onChange={setViewMode as any}
                options={[
                  { value: 'grid', icon: <AppstoreOutlined /> },
                  { value: 'list', icon: <BarsOutlined /> },
                ]}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Active Round Banner */}
      <div className="gradient-bg" style={{ 
        padding: 16, 
        borderRadius: 8,
        marginBottom: 24,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Space>
          <ClockCircleOutlined style={{ fontSize: 20 }} />
          <div>
            <Text strong style={{ color: 'white', fontSize: 16 }}>
              Round 12 is Active
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', marginLeft: 16 }}>
              Ends in 5 days 12 hours
            </Text>
          </div>
        </Space>
        <Button type="primary" ghost style={{ borderColor: 'white', color: 'white' }}>
          View Round Details
        </Button>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Empty description="Failed to load projects" />
      ) : projects && projects.length > 0 ? (
        <Row gutter={[16, 16]}>
          {projects.map((project: Project) => (
            <Col 
              key={project.id} 
              xs={24} 
              sm={viewMode === 'grid' ? 12 : 24} 
              md={viewMode === 'grid' ? 8 : 24}
              lg={viewMode === 'grid' ? 6 : 24}
            >
              <ProjectCard project={project} viewMode={viewMode} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No projects found" />
      )}
    </div>
  );
};

export default ProjectsDiscovery;