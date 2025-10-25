import React from 'react';
import { Layout, Button, Space, Typography, Badge, Avatar, Dropdown, MenuProps } from 'antd';
import { 
  MoonOutlined, 
  SunOutlined, 
  WalletOutlined,
  BellOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface AppHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const [connected, setConnected] = React.useState(false);
  const [address, setAddress] = React.useState<string>('');

  const handleConnect = async () => {
    // Simulate wallet connection
    setConnected(true);
    setAddress('0x1234...5678');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'disconnect',
      icon: <LogoutOutlined />,
      label: 'Disconnect',
      onClick: () => {
        setConnected(false);
        setAddress('');
      },
    },
  ];

  return (
    <Header 
      style={{ 
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        width: '100%',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--ant-color-border)',
        backdropFilter: 'blur(10px)',
        background: isDarkMode 
          ? 'rgba(11, 15, 20, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LockOutlined style={{ fontSize: 20, color: 'var(--ant-color-primary)' }} />
          <Text strong style={{ fontSize: 18 }}>
            FHE Donations
          </Text>
        </div>
        <Badge 
          count="QF" 
          style={{ 
            backgroundColor: '#10B981',
            fontSize: 10,
            height: 18,
            lineHeight: '18px',
            padding: '0 6px',
          }} 
        />
      </div>

      <Space size={16}>
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ position: 'relative' }}
        >
          <Badge 
            dot 
            offset={[-4, 4]}
            style={{ 
              boxShadow: '0 0 0 2px var(--ant-color-bg-container)',
            }}
          />
        </Button>

        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />

        {connected ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="small" 
                style={{ 
                  backgroundColor: 'var(--ant-color-primary)',
                }}
              >
                {address.slice(0, 2)}
              </Avatar>
              <Text style={{ fontSize: 13 }}>{address}</Text>
            </Space>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<WalletOutlined />}
            onClick={handleConnect}
          >
            Connect Wallet
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;