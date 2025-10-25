import React from 'react';
import { Card, Typography, Progress, Space, Tag, Avatar, Badge } from 'antd';
import { 
  CheckCircleOutlined, 
  TeamOutlined,
  LockOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

interface ProjectProps {
  project: {
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
  };
  viewMode: 'grid' | 'list';
}

const ProjectCard: React.FC<ProjectProps> = ({ project, viewMode }) => {
  const navigate = useNavigate();
  
  const progress = (parseFloat(project.raised.replace(/[^0-9.-]+/g, '')) / 
                    parseFloat(project.goal.replace(/[^0-9.-]+/g, ''))) * 100;

  const categoryColors: Record<string, string> = {
    defi: '#2563EB',
    infrastructure: '#10B981',
    social: '#F59E0B',
    education: '#8B5CF6',
    environment: '#059669',
    healthcare: '#EF4444',
    art: '#EC4899',
  };

  if (viewMode === 'list') {
    return (
      <Card
        className="hover-card"
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ marginBottom: 16 }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <img
            src={project.imageUrl || `https://via.placeholder.com/200x150?text=${project.name}`}
            alt={project.name}
            style={{ 
              width: 200, 
              height: 150, 
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Text strong style={{ fontSize: 18 }}>{project.name}</Text>
              {project.verified && (
                <div className="verification-badge">
                  <CheckCircleOutlined />
                  <span>Verified</span>
                </div>
              )}
              <Tag color={categoryColors[project.category.toLowerCase()]}>
                {project.category}
              </Tag>
            </div>
            
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              type="secondary"
              style={{ marginBottom: 16 }}
            >
              {project.description}
            </Paragraph>

            <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Raised</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{project.raised}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Goal</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{project.goal}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Matching</Text>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ant-color-primary)' }}>
                  {project.matchingPool}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Donors</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{project.donors}</div>
              </div>
            </div>

            <Progress 
              percent={progress} 
              strokeColor={{
                '0%': '#2563EB',
                '100%': '#10B981',
              }}
              showInfo={false}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      hoverable
      className="hover-card"
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={project.name}
            src={project.imageUrl || `https://via.placeholder.com/300x200?text=${project.name}`}
            style={{ height: 200, objectFit: 'cover' }}
          />
          {project.verified && (
            <Badge
              count={
                <div style={{
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <CheckCircleOutlined />
                  Verified
                </div>
              }
              style={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
          <Tag 
            color={categoryColors[project.category.toLowerCase()]}
            style={{ position: 'absolute', top: 12, left: 12 }}
          >
            {project.category}
          </Tag>
        </div>
      }
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Text strong style={{ fontSize: 16 }}>{project.name}</Text>
        
        <Paragraph 
          ellipsis={{ rows: 2 }} 
          type="secondary"
          style={{ marginBottom: 0, minHeight: 44 }}
        >
          {project.description}
        </Paragraph>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '8px 0',
          borderTop: '1px solid var(--ant-color-border)',
          borderBottom: '1px solid var(--ant-color-border)',
        }}>
          <Space size={4}>
            <LockOutlined style={{ fontSize: 12, opacity: 0.6 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Private
            </Text>
          </Space>
          <Space size={4}>
            <TeamOutlined style={{ fontSize: 12, opacity: 0.6 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {project.donors} donors
            </Text>
          </Space>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>{project.raised}</Text>
            <Text type="secondary">{project.goal}</Text>
          </div>
          <Progress 
            percent={progress} 
            strokeColor={{
              '0%': '#2563EB',
              '100%': '#10B981',
            }}
            showInfo={false}
            style={{ marginBottom: 8 }}
          />
          <div className="matching-indicator" style={{ 
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Space size={4}>
              <RiseOutlined />
              <Text style={{ fontSize: 12, fontWeight: 500 }}>Matching</Text>
            </Space>
            <Text strong style={{ color: 'var(--ant-color-primary)' }}>
              {project.matchingPool}
            </Text>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default ProjectCard;