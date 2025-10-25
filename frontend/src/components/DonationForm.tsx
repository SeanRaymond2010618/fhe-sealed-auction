import React, { useState } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Space,
  Typography,
  Alert,
  Steps,
  Card,
  Checkbox,
  Result,
  Spin,
  message,
} from 'antd';
import {
  LockOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useDonation } from '../hooks/useDonation';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface DonationFormProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const DonationForm: React.FC<DonationFormProps> = ({
  visible,
  onClose,
  projectId,
  projectName,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [txHash, setTxHash] = useState<string>('');
  const { donate, isLoading, estimateMatching } = useDonation();

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = async () => {
    try {
      setCurrentStep(1);
      
      // Simulate donation process
      const result = await donate({
        projectId,
        amount,
        isAnonymous,
      });
      
      setTxHash(result.txHash);
      setCurrentStep(2);
      message.success('Donation successful!');
    } catch (error) {
      message.error('Donation failed. Please try again.');
      setCurrentStep(0);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAmount(0);
    setTxHash('');
    form.resetFields();
    onClose();
  };

  const matchingEstimate = amount ? estimateMatching(amount) : 0;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
    >
      <div style={{ padding: '24px 0' }}>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          <Step title="Amount" icon={<WalletOutlined />} />
          <Step title="Encrypt" icon={<LockOutlined />} />
          <Step title="Complete" icon={<CheckCircleOutlined />} />
        </Steps>

        {currentStep === 0 && (
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3}>Support {projectName}</Title>
              <Text type="secondary">
                Your donation will be encrypted and matched through quadratic funding
              </Text>
            </div>

            <Form form={form} layout="vertical">
              <Form.Item label="Donation Amount (ETH)">
                <InputNumber
                  value={amount}
                  onChange={(value) => setAmount(value || 0)}
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                  step={0.01}
                  precision={4}
                  className="donation-input"
                  placeholder="0.0000"
                />
                
                <Space wrap style={{ marginTop: 16 }}>
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset}
                      onClick={() => setAmount(preset / 1000)}
                      type={amount === preset / 1000 ? 'primary' : 'default'}
                    >
                      {preset / 1000} ETH
                    </Button>
                  ))}
                </Space>
              </Form.Item>

              {amount > 0 && (
                <Card 
                  className="matching-indicator" 
                  style={{ marginBottom: 16 }}
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text strong>Estimated Matching</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>Your Donation:</Text>
                      <Text strong>{amount} ETH</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>QF Matching:</Text>
                      <Text strong style={{ color: 'var(--ant-color-success)' }}>
                        +{matchingEstimate} ETH
                      </Text>
                    </div>
                    <div style={{ 
                      borderTop: '1px solid var(--ant-color-border)', 
                      paddingTop: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text strong>Total Impact:</Text>
                      <Title level={4} style={{ margin: 0, color: 'var(--ant-color-primary)' }}>
                        {(amount + matchingEstimate).toFixed(4)} ETH
                      </Title>
                    </div>
                  </Space>
                </Card>
              )}

              <Alert
                message="Privacy Protection"
                description="Your donation amount will be encrypted using Fully Homomorphic Encryption (FHE). Only the total raised amount will be visible publicly."
                type="info"
                icon={<LockOutlined />}
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item>
                <Checkbox 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                >
                  Donate anonymously (your address won't be shown publicly)
                </Checkbox>
              </Form.Item>

              <Button
                type="primary"
                size="large"
                block
                disabled={amount <= 0}
                onClick={handleDonate}
              >
                Continue to Encryption
              </Button>
            </Form>
          </Space>
        )}

        {currentStep === 1 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              size="large"
            />
            <Title level={4} style={{ marginTop: 24 }}>
              Encrypting Your Donation
            </Title>
            <Paragraph type="secondary">
              We're using FHE technology to encrypt your donation amount.
              This ensures complete privacy while maintaining transparency.
            </Paragraph>
            <Space direction="vertical" size={16} style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: 'var(--ant-color-success)' }} />
                <Text>Generating encryption keys...</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: 'var(--ant-color-success)' }} />
                <Text>Encrypting donation amount...</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LoadingOutlined />
                <Text>Submitting to blockchain...</Text>
              </div>
            </Space>
          </div>
        )}

        {currentStep === 2 && (
          <Result
            status="success"
            title="Donation Successful!"
            subTitle={
              <Space direction="vertical" size={8}>
                <Text>
                  Your encrypted donation of {amount} ETH has been submitted.
                </Text>
                <Text type="secondary">
                  Transaction Hash: {txHash || '0x123...abc'}
                </Text>
              </Space>
            }
            extra={[
              <Button type="primary" key="close" onClick={handleClose}>
                Close
              </Button>,
              <Button key="view" onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}>
                View Transaction
              </Button>,
            ]}
          >
            <Card style={{ marginTop: 24, background: 'var(--ant-color-bg-layout)' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Your Donation:</Text>
                  <Text strong>{amount} ETH</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Estimated QF Match:</Text>
                  <Text strong style={{ color: 'var(--ant-color-success)' }}>
                    +{matchingEstimate} ETH
                  </Text>
                </div>
                <div style={{ 
                  borderTop: '1px solid var(--ant-color-border)', 
                  paddingTop: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Text strong>Total Impact:</Text>
                  <Text strong style={{ color: 'var(--ant-color-primary)' }}>
                    {(amount + matchingEstimate).toFixed(4)} ETH
                  </Text>
                </div>
              </Space>
            </Card>
          </Result>
        )}
      </div>
    </Modal>
  );
};

export default DonationForm;