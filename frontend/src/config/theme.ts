import { ThemeConfig, theme } from 'antd';

export const lightTheme: ThemeConfig = {
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
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      headerHeight: 64,
      siderBg: '#FFFFFF',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#F0F6FF',
      itemHoverBg: '#F7F9FC',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#F7F9FC',
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#2563EB',
    colorInfo: '#2563EB',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorBgBase: '#0B0F14',
    colorBgContainer: '#141922',
    colorBgLayout: '#0B0F14',
    colorTextBase: '#E5E7EB',
    colorBorder: '#2A3441',
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Layout: {
      headerBg: '#141922',
      headerHeight: 64,
      siderBg: '#141922',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#1E293B',
      itemHoverBg: '#1E293B',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#1E293B',
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
  },
};