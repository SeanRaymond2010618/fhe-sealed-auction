import React, { useState, useEffect } from 'react';
import { Typography, Space, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getTimeRemaining } from '@/utils/format';

const { Text } = Typography;

interface CountdownTimerProps {
  endTime: number;
  onExpire?: () => void;
  size?: 'small' | 'default' | 'large';
  showIcon?: boolean;
  prefix?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
  size = 'default',
  showIcon = true,
  prefix = 'Ends in',
}) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeRemaining(remaining);

      if (remaining.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (timeRemaining.expired) {
    return (
      <Tag color="error">
        {showIcon && <ClockCircleOutlined />} Expired
      </Tag>
    );
  }

  const fontSize = size === 'large' ? 18 : size === 'small' ? 12 : 14;
  const spacing = size === 'large' ? 16 : size === 'small' ? 4 : 8;

  const formatTimeUnit = (value: number, unit: string) => (
    <Space size={4} direction="vertical" align="center">
      <Text strong style={{ fontSize: fontSize + 2 }}>
        {value.toString().padStart(2, '0')}
      </Text>
      <Text type="secondary" style={{ fontSize: fontSize - 2 }}>
        {unit}
      </Text>
    </Space>
  );

  return (
    <Space size={spacing} align="center">
      {showIcon && <ClockCircleOutlined style={{ fontSize }} />}
      {prefix && <Text style={{ fontSize }}>{prefix}</Text>}
      <Space size={spacing}>
        {timeRemaining.days > 0 && formatTimeUnit(timeRemaining.days, 'days')}
        {formatTimeUnit(timeRemaining.hours, 'hrs')}
        {formatTimeUnit(timeRemaining.minutes, 'min')}
        {formatTimeUnit(timeRemaining.seconds, 'sec')}
      </Space>
    </Space>
  );
};