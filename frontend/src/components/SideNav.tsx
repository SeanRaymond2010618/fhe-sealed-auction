import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  HeartOutlined,
  SettingOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/projects',
      icon: <AppstoreOutlined />,
      label: 'Projects',
      tooltip: 'Discover Projects',
    },
    {
      key: '/create-project',
      icon: <PlusCircleOutlined />,
      label: 'Create',
      tooltip: 'Create Project',
    },
    {
      key: '/rounds',
      icon: <ClockCircleOutlined />,
      label: 'Rounds',
      tooltip: 'Funding Rounds',
    },
    {
      key: '/leaderboard',
      icon: <TrophyOutlined />,
      label: 'Leaderboard',
      tooltip: 'Leaderboard',
    },
    {
      key: '/my-donations',
      icon: <HeartOutlined />,
      label: 'Donations',
      tooltip: 'My Donations',
    },
    {
      key: '/admin',
      icon: <SettingOutlined />,
      label: 'Admin',
      tooltip: 'Admin Panel',
    },
  ];

  return (
    <Sider
      width={80}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        borderRight: '1px solid var(--ant-color-border)',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          height: '100%', 
          borderRight: 0,
          padding: '16px 0',
        }}
        items={menuItems.map(item => ({
          key: item.key,
          icon: (
            <Tooltip placement="right" title={item.tooltip}>
              <div style={{ 
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon}
              </div>
            </Tooltip>
          ),
          onClick: () => navigate(item.key),
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '4px 8px',
            borderRadius: 8,
          },
        }))}
      />
    </Sider>
  );
};

export default SideNav;