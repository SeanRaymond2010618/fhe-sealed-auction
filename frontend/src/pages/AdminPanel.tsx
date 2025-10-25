import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Switch,
  Row,
  Col,
  Statistic,
  Alert,
  Tabs,
  Badge,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAdminData, createRound, updateRound } from '../services/donation';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AdminPanel: React.FC = () => {
  const [isRoundModalVisible, setIsRoundModalVisible] = useState(false);
  const [editingRound, setEditingRound] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: adminData, isLoading, refetch } = useQuery({
    queryKey: ['adminData'],
    queryFn: fetchAdminData,
  });

  const createRoundMutation = useMutation({
    mutationFn: createRound,
    onSuccess: () => {
      message.success('Round created successfully');
      setIsRoundModalVisible(false);
      form.resetFields();
      refetch();
    },
  });

  const handleCreateRound = async () => {
    try {
      const values = await form.validateFields();
      createRoundMutation.mutate(values);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const roundColumns = [
    {
      title: 'Round',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.status === 'active' && (
            <Badge status="processing" text="Active" />
          )}
        </Space>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: any) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>Start: {record.startDate}</Text>
          <Text style={{ fontSize: 12 }}>End: {record.endDate}</Text>
        </Space>
      ),
    },
    {
      title: 'Matching Pool',
      dataIndex: 'matchingPool',
      key: 'matchingPool',
      render: (amount: string) => (
        <Text strong style={{ color: 'var(--ant-color-primary)' }}>
          {amount}
        </Text>
      ),
    },
    {
      title: 'Projects',
      dataIndex: 'projectsCount',
      key: 'projectsCount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          upcoming: { color: 'default', text: 'Upcoming' },
          active: { color: 'success', text: 'Active' },
          completed: { color: 'default', text: 'Completed' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRound(record);
              form.setFieldsValue(record);
              setIsRoundModalVisible(true);
            }}
          />
          {record.status === 'upcoming' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => message.info('Round started')}
            />
          )}
          {record.status === 'active' && (
            <Button
              type="text"
              icon={<PauseCircleOutlined />}
              onClick={() => message.info('Round paused')}
            />
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.warning('Delete functionality disabled for demo')}
          />
        </Space>
      ),
    },
  ];

  const projectColumns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.verified && (
            <CheckCircleOutlined style={{ color: '#10B981' }} />
          )}
        </Space>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (address: string) => <Text code>{address}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Pending Review' },
          approved: { color: 'success', text: 'Approved' },
          rejected: { color: 'error', text: 'Rejected' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Verification',
      key: 'verification',
      render: (record: any) => (
        <Switch
          checked={record.verified}
          onChange={(checked) => {
            message.success(`Project ${checked ? 'verified' : 'unverified'}`);
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2}>Admin Panel</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Manage funding rounds, projects, and platform settings
          </Text>
        </div>
        <Badge dot>
          <Button icon={<SettingOutlined />}>Settings</Button>
        </Badge>
      </div>

      {/* Warning Alert */}
      <Alert
        message="Admin Access Required"
        description="This panel is only accessible to platform administrators. All actions are logged and audited."
        type="warning"
        icon={<WarningOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Rounds"
              value={adminData?.activeRounds || 1}
              valueStyle={{ color: 'var(--ant-color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Projects"
              value={adminData?.pendingProjects || 5}
              valueStyle={{ color: 'var(--ant-color-warning)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Matching Pools"
              value="$1.5M"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Platform Fee"
              value="2.5"
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="rounds">
          <TabPane tab="Funding Rounds" key="rounds">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRound(null);
                  form.resetFields();
                  setIsRoundModalVisible(true);
                }}
              >
                Create New Round
              </Button>
            </div>
            <Table
              columns={roundColumns}
              dataSource={adminData?.rounds}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="Projects" key="projects">
            <Alert
              message="Project Review Queue"
              description={`${adminData?.pendingProjects || 5} projects pending review`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={projectColumns}
              dataSource={adminData?.projects}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="Settings" key="settings">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card title="Platform Settings">
                  <Form layout="vertical">
                    <Form.Item label="Platform Fee (%)">
                      <InputNumber
                        min={0}
                        max={10}
                        step={0.1}
                        defaultValue={2.5}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item label="Minimum Donation (ETH)">
                      <InputNumber
                        min={0}
                        step={0.001}
                        defaultValue={0.001}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item label="Maximum Projects per Round">
                      <InputNumber
                        min={1}
                        defaultValue={100}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Save Settings</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="FHE Configuration">
                  <Form layout="vertical">
                    <Form.Item label="Encryption Scheme">
                      <Select defaultValue="tfhe">
                        <Select.Option value="tfhe">TFHE</Select.Option>
                        <Select.Option value="ckks">CKKS</Select.Option>
                        <Select.Option value="bfv">BFV</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Key Size (bits)">
                      <Select defaultValue="2048">
                        <Select.Option value="1024">1024</Select.Option>
                        <Select.Option value="2048">2048</Select.Option>
                        <Select.Option value="4096">4096</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Privacy Mode">
                      <Switch defaultChecked />
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        Enforce encryption for all donations
                      </Text>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Update Configuration</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Round Modal */}
      <Modal
        title={editingRound ? 'Edit Round' : 'Create New Round'}
        open={isRoundModalVisible}
        onOk={handleCreateRound}
        onCancel={() => {
          setIsRoundModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Round Name"
            name="name"
            rules={[{ required: true, message: 'Please enter round name' }]}
          >
            <Input placeholder="e.g., Round 13 - DeFi Focus" />
          </Form.Item>
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: 'Please select duration' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Matching Pool (ETH)"
            name="matchingPool"
            rules={[{ required: true, message: 'Please enter matching pool amount' }]}
          >
            <InputNumber
              min={0}
              step={10}
              style={{ width: '100%' }}
              placeholder="100"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe the focus and goals of this round"
            />
          </Form.Item>
          <Form.Item
            label="Eligible Categories"
            name="categories"
          >
            <Select
              mode="multiple"
              placeholder="Select eligible categories"
              defaultValue={['all']}
            >
              <Select.Option value="all">All Categories</Select.Option>
              <Select.Option value="defi">DeFi</Select.Option>
              <Select.Option value="infrastructure">Infrastructure</Select.Option>
              <Select.Option value="social">Social Impact</Select.Option>
              <Select.Option value="education">Education</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;