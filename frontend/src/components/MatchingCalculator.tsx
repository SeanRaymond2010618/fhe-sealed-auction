import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Space, Tooltip, Row, Col } from 'antd';
import { InfoCircleOutlined, RiseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MatchingCalculatorProps {
  projectId: string;
  currentRaised: string;
  matchingPool: string;
}

const MatchingCalculator: React.FC<MatchingCalculatorProps> = ({
  projectId,
  currentRaised,
  matchingPool,
}) => {
  const [donationAmount, setDonationAmount] = useState(0.01);
  const [matchingAmount, setMatchingAmount] = useState(0);

  // Quadratic funding formula calculation
  const calculateMatching = (amount: number) => {
    // Simplified QF formula for demonstration
    // In reality, this would consider all donations and use the actual QF formula
    const sqrtAmount = Math.sqrt(amount);
    const totalSqrt = 10; // Simulated total of all sqrt donations
    const poolAmount = parseFloat(matchingPool.replace(/[^0-9.-]+/g, ''));
    
    const matching = (sqrtAmount / (totalSqrt + sqrtAmount)) * poolAmount * 0.1;
    return Math.min(matching, amount * 2); // Cap at 2x matching
  };

  useEffect(() => {
    setMatchingAmount(calculateMatching(donationAmount));
  }, [donationAmount]);

  const marks = {
    0.01: '0.01',
    0.1: '0.1',
    0.5: '0.5',
    1: '1 ETH',
  };

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <RiseOutlined />
          <span>Matching Calculator</span>
          <Tooltip title="See how quadratic funding amplifies your donation">
            <InfoCircleOutlined style={{ fontSize: 14, opacity: 0.6 }} />
          </Tooltip>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Text type="secondary">Simulate your donation impact</Text>
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>
            <Text>Donation Amount: </Text>
            <Text strong>{donationAmount.toFixed(3)} ETH</Text>
          </div>
          <Slider
            min={0.01}
            max={1}
            step={0.01}
            value={donationAmount}
            onChange={setDonationAmount}
            marks={marks}
            tooltip={{ formatter: (value) => `${value} ETH` }}
          />
        </div>

        <div className="gradient-bg-subtle" style={{ 
          padding: 16, 
          borderRadius: 8,
          border: '1px solid var(--ant-color-primary-border)',
        }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 12 }}>Your Donation</Text>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {donationAmount.toFixed(3)} ETH
              </div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 12 }}>QF Match</Text>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ant-color-success)' }}>
                +{matchingAmount.toFixed(3)} ETH
              </div>
            </Col>
          </Row>
          <div style={{ 
            marginTop: 16, 
            paddingTop: 16, 
            borderTop: '1px solid var(--ant-color-border)',
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Total Impact</Text>
            <Title level={3} style={{ margin: '4px 0', color: 'var(--ant-color-primary)' }}>
              {(donationAmount + matchingAmount).toFixed(3)} ETH
            </Title>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {((matchingAmount / donationAmount) * 100).toFixed(0)}% matching bonus
            </Text>
          </div>
        </div>

        <div style={{ 
          padding: 8, 
          background: 'var(--ant-color-info-bg)',
          borderRadius: 6,
        }}>
          <Text style={{ fontSize: 12 }}>
            <InfoCircleOutlined /> Quadratic funding rewards smaller donations from more people,
            democratizing the funding process
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default MatchingCalculator;