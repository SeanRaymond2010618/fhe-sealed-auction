import React, { useState } from 'react';
import { Form, InputNumber, Button, Space, Typography, Alert, Card, Tooltip, Switch, Divider, Statistic } from 'antd';
import { LockOutlined, SendOutlined, InfoCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { Auction, AuctionType } from '@/types/auction';
import { formatEther } from '@/utils/format';
import { usePlaceBid } from '@/hooks/useAuction';

const { Text, Title } = Typography;

interface BidFormProps {
  auction: Auction;
  userAddress?: string;
  onSuccess?: () => void;
}

export const BidForm: React.FC<BidFormProps> = ({ auction, userAddress, onSuccess }) => {
  const [form] = Form.useForm();
  const [encrypting, setEncrypting] = useState(false);
  const placeBidMutation = usePlaceBid();

  const isSealed = auction.type === AuctionType.SEALED_BID;
  const isDutch = auction.type === AuctionType.DUTCH;
  const isBatch = auction.type === AuctionType.BATCH;
  const isEnglish = auction.type === AuctionType.ENGLISH;

  const handleSubmit = async (values: any) => {
    if (!userAddress) {
      return;
    }

    try {
      setEncrypting(isSealed);
      
      // Convert ETH to Wei
      const amountWei = (values.amount * 1e18).toString();
      
      await placeBidMutation.mutateAsync({
        auctionId: auction.id,
        amount: amountWei,
        encrypted: isSealed,
      });

      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setEncrypting(false);
    }
  };

  const getMinBidAmount = () => {
    if (isDutch) {
      return parseFloat(formatEther(auction.currentPrice || auction.startingPrice));
    }
    if (isEnglish && auction.currentPrice) {
      return parseFloat(formatEther(auction.currentPrice)) * 1.05; // 5% increment
    }
    return parseFloat(formatEther(auction.startingPrice));
  };

  const getPlaceholder = () => {
    if (isDutch) return 'Accept current price';
    if (isEnglish) return 'Enter bid amount (min 5% increment)';
    if (isBatch) return 'Enter bid per unit';
    return 'Enter your bid amount';
  };

  return (
    <Card>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Title level={4}>Place Your Bid</Title>
          <Text type="secondary">
            {isSealed && 'Your bid will be encrypted and hidden until the reveal phase'}
            {isDutch && 'Accept the current price or wait for it to decrease'}
            {isEnglish && 'Outbid others to win this auction'}
            {isBatch && 'Bid for units in this batch auction'}
          </Text>
        </div>

        {isSealed && (
          <Alert
            message="Privacy-Preserving Auction"
            description="Your bid amount will be encrypted using FHE technology. Other bidders cannot see your bid until the reveal phase."
            type="info"
            icon={<LockOutlined />}
            showIcon
          />
        )}

        <div>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Statistic 
              title="Current Price" 
              value={formatEther(auction.currentPrice || auction.startingPrice)} 
              suffix="ETH"
              valueStyle={{ fontSize: 24 }}
            />
            {auction.reservePrice && (
              <Text type="secondary">
                Reserve Price: {formatEther(auction.reservePrice)} ETH
              </Text>
            )}
            <Text type="secondary">
              Min Deposit: {formatEther(auction.minDeposit)} ETH
            </Text>
          </Space>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="amount"
            label={
              <Space>
                <Text>Bid Amount (ETH)</Text>
                <Tooltip title={getPlaceholder()}>
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[
              { required: true, message: 'Please enter bid amount' },
              { 
                type: 'number', 
                min: getMinBidAmount(),
                message: `Minimum bid is ${getMinBidAmount()} ETH` 
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={getPlaceholder()}
              min={getMinBidAmount()}
              step={0.01}
              precision={4}
              disabled={isDutch}
              value={isDutch ? parseFloat(formatEther(auction.currentPrice || auction.startingPrice)) : undefined}
              addonAfter="ETH"
            />
          </Form.Item>

          {isBatch && (
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: 'Please enter quantity' },
                { type: 'number', min: 1, message: 'Minimum quantity is 1' },
                { type: 'number', max: auction.supply, message: `Maximum quantity is ${auction.supply}` },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Number of units"
                min={1}
                max={auction.supply}
              />
            </Form.Item>
          )}

          {isSealed && (
            <Alert
              message={
                <Space>
                  <SafetyOutlined />
                  <Text>Your bid will be encrypted before submission</Text>
                </Space>
              }
              type="success"
              style={{ marginBottom: 16 }}
            />
          )}

          <Space size={12} style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={placeBidMutation.isPending || encrypting}
              icon={isSealed ? <LockOutlined /> : <SendOutlined />}
              size="large"
              block
              disabled={!userAddress || auction.status !== 'active'}
            >
              {encrypting ? 'Encrypting Bid...' : 
               isDutch ? 'Accept Price' :
               isSealed ? 'Place Encrypted Bid' : 
               'Place Bid'}
            </Button>
          </Space>
        </Form>

        {!userAddress && (
          <Alert
            message="Connect your wallet to place a bid"
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};