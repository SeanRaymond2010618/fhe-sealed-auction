import React, { useState } from 'react';
import {
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Card,
  Space,
  Steps,
  Result,
  Alert,
  Row,
  Col,
  Checkbox,
  message,
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  LinkOutlined,
  TwitterOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/donation';

const { Title, Text, TextArea, Paragraph } = Typography;
const { Step } = Steps;
const { Dragger } = Upload;

const CreateProject: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<any>({});

  const categories = [
    { value: 'defi', label: 'DeFi' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'social', label: 'Social Impact' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'art', label: 'Art & Culture' },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setProjectData({ ...projectData, ...values });
      
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit project
        await createProject({ ...projectData, ...values });
        setCurrentStep(3);
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: 'Basic Info',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Details',
      icon: <TeamOutlined />,
    },
    {
      title: 'Review',
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div>
      <Title level={2}>Create New Project</Title>
      <Text type="secondary" style={{ fontSize: 16 }}>
        Launch your project and receive quadratic funding support
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        {currentStep === 0 && (
          <Form form={form} layout="vertical" size="large">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Project Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter project name' }]}
                >
                  <Input placeholder="Enter your project name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Please select a category' }]}
                >
                  <Select placeholder="Select category" options={categories} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Short Description"
              name="description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea
                rows={3}
                placeholder="Brief description of your project (shown in project cards)"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="Detailed Description"
              name="longDescription"
              rules={[{ required: true, message: 'Please enter detailed description' }]}
            >
              <TextArea
                rows={6}
                placeholder="Detailed description of your project, its goals, and impact"
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Funding Goal (ETH)"
                  name="goal"
                  rules={[{ required: true, message: 'Please enter funding goal' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.1}
                    step={0.1}
                    placeholder="10.0"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Project Duration (days)"
                  name="duration"
                  rules={[{ required: true, message: 'Please enter duration' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={7}
                    max={90}
                    placeholder="30"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Project Image"
              name="image"
              valuePropName="fileList"
            >
              <Dragger
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to upload</p>
                <p className="ant-upload-hint">
                  Support for PNG, JPG. Max size 5MB.
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <Form form={form} layout="vertical" size="large">
            <Title level={4} style={{ marginBottom: 24 }}>Project Links</Title>
            
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <LinkOutlined />
                      Website
                    </Space>
                  }
                  name="website"
                >
                  <Input placeholder="https://yourproject.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <TwitterOutlined />
                      Twitter
                    </Space>
                  }
                  name="twitter"
                >
                  <Input placeholder="https://twitter.com/yourproject" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <GithubOutlined />
                      GitHub
                    </Space>
                  }
                  name="github"
                >
                  <Input placeholder="https://github.com/yourproject" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginBottom: 24 }}>Team Members</Title>
            
            <Form.Item
              label="Team Description"
              name="teamDescription"
            >
              <TextArea
                rows={4}
                placeholder="Describe your team and their expertise"
              />
            </Form.Item>

            <Title level={4} style={{ marginBottom: 24 }}>Roadmap & Milestones</Title>
            
            <Form.Item
              label="Project Roadmap"
              name="roadmap"
            >
              <TextArea
                rows={6}
                placeholder="Describe your project roadmap and key milestones"
              />
            </Form.Item>

            <Title level={4} style={{ marginBottom: 24 }}>Verification</Title>
            
            <Alert
              message="Project Verification"
              description="To get verified badge, you'll need to provide additional documentation after project creation."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item name="agreeTerms" valuePropName="checked">
              <Checkbox>
                I agree to the platform terms and conditions
              </Checkbox>
            </Form.Item>

            <Form.Item name="agreeFHE" valuePropName="checked">
              <Checkbox>
                I understand that donation amounts will be encrypted using FHE
              </Checkbox>
            </Form.Item>
          </Form>
        )}

        {currentStep === 2 && (
          <div>
            <Title level={4}>Review Your Project</Title>
            <Paragraph type="secondary">
              Please review your project details before submission
            </Paragraph>

            <Card style={{ marginTop: 24 }}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Project Name</Text>
                  <Title level={4} style={{ margin: '4px 0' }}>
                    {projectData.name || 'Your Project Name'}
                  </Title>
                </div>

                <div>
                  <Text type="secondary">Category</Text>
                  <div>{projectData.category || 'Not specified'}</div>
                </div>

                <div>
                  <Text type="secondary">Description</Text>
                  <Paragraph>{projectData.description || 'No description provided'}</Paragraph>
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Text type="secondary">Funding Goal</Text>
                    <div>{projectData.goal} ETH</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Duration</Text>
                    <div>{projectData.duration} days</div>
                  </Col>
                </Row>

                <Alert
                  message="Ready to Launch"
                  description="Once submitted, your project will be reviewed and made available for donations."
                  type="success"
                  showIcon
                />
              </Space>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <Result
            status="success"
            title="Project Created Successfully!"
            subTitle="Your project has been submitted and will be available for donations soon."
            extra={[
              <Button 
                type="primary" 
                key="view"
                onClick={() => navigate('/projects')}
              >
                View Projects
              </Button>,
              <Button key="create" onClick={() => {
                setCurrentStep(0);
                setProjectData({});
                form.resetFields();
              }}>
                Create Another
              </Button>,
            ]}
          />
        )}

        {currentStep < 3 && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 0 && (
              <Button size="large" onClick={handlePrev}>
                Previous
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              style={{ marginLeft: 'auto' }}
            >
              {currentStep === 2 ? 'Submit Project' : 'Next'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreateProject;