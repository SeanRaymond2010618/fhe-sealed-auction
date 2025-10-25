import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme, Button, Space } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

// Pages
import ProjectsDiscovery from './pages/ProjectsDiscovery';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import FundingRounds from './pages/FundingRounds';
import Leaderboard from './pages/Leaderboard';
import MyDonations from './pages/MyDonations';
import AdminPanel from './pages/AdminPanel';

// Components
import AppHeader from './components/AppHeader';
import SideNav from './components/SideNav';

// Styles
import './App.css';

const { Content } = Layout;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#2563EB',
      colorInfo: '#2563EB',
      colorSuccess: '#10B981',
      colorWarning: '#F59E0B',
      colorError: '#EF4444',
      colorBgLayout: '#F7F9FC',
      colorBgContainer: '#FFFFFF',
      colorTextBase: '#0F172A',
      colorBorder: '#E5E7EB',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      borderRadius: 8,
      fontSize: 14,
    },
  };

  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#2563EB',
      colorInfo: '#2563EB',
      colorSuccess: '#10B981',
      colorWarning: '#F59E0B',
      colorError: '#EF4444',
      colorBgBase: '#0B0F14',
      colorBgLayout: '#0B0F14',
      colorBgContainer: '#1A1F2E',
      colorTextBase: '#E5E7EB',
      colorBorder: '#2D3748',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      borderRadius: 8,
      fontSize: 14,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
            <Layout>
              <SideNav />
              <Layout style={{ marginLeft: 80 }}>
                <Content style={{ 
                  padding: '24px',
                  minHeight: 'calc(100vh - 64px)',
                  marginTop: 64,
                }}>
                  <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/projects" replace />} />
                      <Route path="/projects" element={<ProjectsDiscovery />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/create-project" element={<CreateProject />} />
                      <Route path="/rounds" element={<FundingRounds />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/my-donations" element={<MyDonations />} />
                      <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;