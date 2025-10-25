import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Form, Input, InputNumber, Select, DatePicker, Button, Space, Typography, Alert, Steps, Row, Col, Upload, Radio, Switch, Divider, message } from 'antd';
import { 
  PlusOutlined, 
  LockOutlined, 
  FireOutlined, 
  FallOutlined, 
  GroupOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCreateAuction } from '@/hooks/useAuction';
import { AuctionType } from '@/types/auction';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export const CreateAuction: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [auctionType, setAuctionType] = useState<AuctionType>(AuctionType.ENGLISH);
  const createAuctionMutation = useCreateAuction();

  const handleTypeChange = (type: AuctionType) => {
    setAuctionType(type);
    form.setFieldValue('type', type);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Convert prices to Wei
      const data = {
        ...values,
        type: auctionType,
        startingPrice: (values.startingPrice * 1e18).toString(),
        reservePrice: values.reservePrice ? (values.reservePrice * 1e18).toString() : undefined,
        minDeposit: (values.minDeposit * 1e18).toString(),
        priceDecrement: values.priceDecrement ? (values.priceDecrement * 1e18).toString() : undefined,
        startTime: values.auctionDates[0].valueOf(),
        endTime: values.auctionDates[1].valueOf(),
        revealTime: values.revealTime?.valueOf(),
      };

      const auction = await createAuctionMutation.mutateAsync(data);
      message.success('Auction created successfully!');
      navigate(`/auction/${auction.id}`);
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  const auctionTypes = [
    {
      type: AuctionType.ENGLISH,
      icon: <FireOutlined style={{ fontSize: 24 }} />,
      title: 'English Auction',
      description: 'Traditional ascending price auction where highest bidder wins',
      features: ['Open bidding', 'Price increases', 'Real-time competition'],
    },
    {
      type: AuctionType.SEALED_BID,
      icon: <LockOutlined style={{ fontSize: 24 }} />,
      title: 'Sealed-Bid Auction',
      description: 'Private encrypted bids revealed after auction ends',
      features: ['FHE encryption', 'Hidden bids', 'Fair price discovery'],
    },
    {
      type: AuctionType.DUTCH,
      icon: <FallOutlined style={{ fontSize: 24 }} />,
      title: 'Dutch Auction',
      description: 'Descending price auction, first to accept wins',
      features: ['Decreasing price', 'Quick sales', 'No bidding wars'],
    },
    {
      type: AuctionType.BATCH,
      icon: <GroupOutlined style={{ fontSize: 24 }} />,
      title: 'Batch Auction',
      description: 'Multiple units sold to multiple winners',
      features: ['Multiple winners', 'Bulk sales', 'Fair distribution'],
    },
  ];

  const steps = [
    {
      title: 'Auction Type',
      description: 'Choose auction mechanism',
    },
    {
      title: 'NFT Details',
      description: 'Select NFT to auction',
    },
    {
      title: 'Pricing',
      description: 'Set prices and rules',
    },
    {
      title: 'Review',
      description: 'Confirm and create',
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={4}>Select Auction Type</Title>
              <Paragraph type="secondary">
                Choose the auction mechanism that best suits your NFT and selling strategy
              </Paragraph>
            </div>

            <Row gutter={16}>
              {auctionTypes.map(type => (
                <Col key={type.type} xs={24} md={12}>
                  <Card
                    hoverable
                    className={auctionType === type.type ? 'ant-card-active' : ''}
                    onClick={() => handleTypeChange(type.type)}
                    style={{
                      borderColor: auctionType === type.type ? '#2563EB' : undefined,
                      borderWidth: 2,
                    }}
                  >
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Space>
                        {type.icon}
                        <Title level={5} style={{ margin: 0 }}>{type.title}</Title>
                      </Space>
                      <Text type="secondary">{type.description}</Text>
                      <Space direction="vertical" size={4}>
                        {type.features.map((feature, index) => (
                          <Text key={index} style={{ fontSize: 12 }}>
                            <CheckCircleOutlined style={{ color: '#10B981', marginRight: 4 }} />
                            {feature}
                          </Text>
                        ))}
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            {auctionType === AuctionType.SEALED_BID && (
              <Alert
                message="Privacy-First Auction"
                description="Sealed-bid auctions use FHE encryption to keep all bids private until the reveal phase, ensuring fair competition without information leakage."
                type="info"
                showIcon
                icon={<LockOutlined />}
              />
            )}
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={4}>NFT Information</Title>
              <Paragraph type="secondary">
                Select the NFT you want to auction from your wallet
              </Paragraph>
            </div>

            <Form.Item
              name="nftContract"
              label="NFT Contract Address"
              rules={[{ required: true, message: 'Please enter NFT contract address' }]}
            >
              <Input placeholder="0x..." />
            </Form.Item>

            <Form.Item
              name="tokenId"
              label="Token ID"
              rules={[{ required: true, message: 'Please enter token ID' }]}
            >
              <Input placeholder="Enter token ID" />
            </Form.Item>

            <Form.Item
              name="nftName"
              label="NFT Name"
              rules={[{ required: true, message: 'Please enter NFT name' }]}
            >
              <Input placeholder="e.g., Bored Ape #1234" />
            </Form.Item>

            <Form.Item
              name="nftDescription"
              label="Description"
            >
              <TextArea 
                rows={4} 
                placeholder="Describe your NFT and what makes it special"
              />
            </Form.Item>

            <Form.Item
              name="nftImage"
              label="NFT Image"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={4}>Auction Configuration</Title>
              <Paragraph type="secondary">
                Set pricing parameters and auction duration
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startingPrice"
                  label="Starting Price (ETH)"
                  rules={[{ required: true, message: 'Please enter starting price' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reservePrice"
                  label="Reserve Price (ETH)"
                  tooltip="Minimum acceptable price"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
            </Row>

            {auctionType === AuctionType.DUTCH && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="priceDecrement"
                    label="Price Decrease (ETH)"
                    rules={[{ required: true, message: 'Please enter price decrement' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={0.001}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="decrementInterval"
                    label="Decrease Interval (hours)"
                    rules={[{ required: true, message: 'Please enter interval' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      placeholder="1"
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {auctionType === AuctionType.BATCH && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="supply"
                    label="Total Supply"
                    rules={[{ required: true, message: 'Please enter supply' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      placeholder="Number of units"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="minBidPerUnit"
                    label="Min Bid Per Unit (ETH)"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Form.Item
              name="minDeposit"
              label="Minimum Deposit (ETH)"
              tooltip="Required deposit to participate"
              rules={[{ required: true, message: 'Please enter minimum deposit' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              name="auctionDates"
              label="Auction Duration"
              rules={[{ required: true, message: 'Please select auction dates' }]}
            >
              <RangePicker
                showTime
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            {auctionType === AuctionType.SEALED_BID && (
              <Form.Item
                name="revealTime"
                label="Reveal Deadline"
                tooltip="Time limit for bidders to reveal their bids"
                rules={[{ required: true, message: 'Please select reveal deadline' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const endTime = form.getFieldValue('auctionDates')?.[1];
                    return current && (!endTime || current < endTime);
                  }}
                />
              </Form.Item>
            )}
          </Space>
        );

      case 3:
        const values = form.getFieldsValue();
        return (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={4}>Review Auction Details</Title>
              <Paragraph type="secondary">
                Please review your auction configuration before creating
              </Paragraph>
            </div>

            <Card>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Auction Type</Text>
                  <br />
                  <Text strong>{auctionTypes.find(t => t.type === auctionType)?.title}</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">NFT</Text>
                  <br />
                  <Text strong>{values.nftName || 'Not specified'}</Text>
                  <br />
                  <Text style={{ fontSize: 12 }}>{values.nftContract}</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">Starting Price</Text>
                    <br />
                    <Text strong>{values.startingPrice || 0} ETH</Text>
                  </Col>
                  {values.reservePrice && (
                    <Col span={12}>
                      <Text type="secondary">Reserve Price</Text>
                      <br />
                      <Text strong>{values.reservePrice} ETH</Text>
                    </Col>
                  )}
                </Row>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">Duration</Text>
                  <br />
                  <Text strong>
                    {values.auctionDates?.[0]?.format('MMM DD, YYYY HH:mm')} - {values.auctionDates?.[1]?.format('MMM DD, YYYY HH:mm')}
                  </Text>
                </div>
              </Space>
            </Card>

            <Alert
              message="Ready to Create Auction"
              description="Once created, the auction cannot be modified. Make sure all details are correct."
              type="warning"
              showIcon
            />
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Content style={{ padding: '24px 48px' }}>
        <Card>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div>
              <Title level={2}>Create New Auction</Title>
              <Paragraph type="secondary">
                List your NFT for auction with privacy-preserving FHE technology
              </Paragraph>
            </div>

            <Steps current={currentStep} items={steps} />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              {renderStepContent()}

              <Divider />

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
                <Space>
                  <Button onClick={() => navigate('/marketplace')}>
                    Cancel
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="primary"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={createAuctionMutation.isPending}
                    >
                      Create Auction
                    </Button>
                  )}
                </Space>
              </Space>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};