import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Form, 
  Modal, 
  message, 
  Tag, 
  Space, 
  Popconfirm, 
  Card,
  Tooltip,
  Badge,
  Drawer,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import {debounce} from '/src/utils'
import moment from 'moment';
import {
  getTagsAdminAPI,
  getTagByIdAdminAPI,
  addTagAdminAPI,
  updateTagAdminAPI,
  deleteTagAdminAPI,
  reviewTagAdminAPI
} from '/src/apis/articles_platform/admin/tag';
import styles from './index.module.scss';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const TagManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    status: '',
    createdBy: ''
  });
  const [sorter, setSorter] = useState('createdAt_DESC');
  
  // 模态框状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();

  // 初始化加载数据
  useEffect(() => {
    fetchTags();
  }, [pagination.current, pagination.pageSize, filters, sorter]);

  // 获取标签列表
  const fetchTags = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
        orderBy: sorter
      };

      // 过滤掉空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getTagsAdminAPI(params);
      if (response?.data) {
        setTags(response.data.tags);
        setPagination({
          ...pagination,
          total: response.data.pagination.total
        });
      }
    } catch (error) {
      message.error('获取标签列表失败');
      console.error('获取标签列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理表格变化
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });

    if (sorter && sorter.field && sorter.order) {
      const order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
      setSorter(`${sorter.field}_${order}`);
    }
  };

  // 搜索名称防抖
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, name: value }));
      setPagination(prev => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  // 处理搜索输入
  const handleSearchInput = (e) => {
    debouncedSearch(e.target.value);
  };

  // 处理筛选变化
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      name: '',
      type: '',
      status: '',
      createdBy: ''
    });
    setSorter('createdAt_DESC');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 添加标签
  const handleAddTag = async (values) => {
    try {
      setLoading(true);
      await addTagAdminAPI(values);
      message.success('标签添加成功');
      setAddModalVisible(false);
      form.resetFields();
      fetchTags();
    } catch (error) {
      message.error('添加标签失败');
      console.error('添加标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 编辑标签
  const handleEditTag = async (values) => {
    try {
      if (!currentTag) return;
      setLoading(true);
      await updateTagAdminAPI(currentTag.id, values);
      message.success('标签更新成功');
      setEditModalVisible(false);
      form.resetFields();
      fetchTags();
    } catch (error) {
      message.error('更新标签失败');
      console.error('更新标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除标签
  const handleDeleteTag = async (id) => {
    try {
      setLoading(true);
      await deleteTagAdminAPI(id);
      message.success('标签删除成功');
      fetchTags();
    } catch (error) {
      message.error('删除标签失败');
      console.error('删除标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 审核标签
  const handleReviewTag = async (values) => {
    try {
      if (!currentTag) return;
      setLoading(true);
      await reviewTagAdminAPI(currentTag.id, values);
      message.success(`标签已${values.status === 'approved' ? '通过' : '拒绝'}`);
      setReviewModalVisible(false);
      reviewForm.resetFields();
      fetchTags();
    } catch (error) {
      message.error('审核标签失败');
      console.error('审核标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 查看标签详情
  const viewTagDetails = async (tagId) => {
    try {
      setLoading(true);
      const response = await getTagByIdAdminAPI(tagId);
      if (response?.data) {
        setCurrentTag(response.data.tag);
        setDetailDrawerVisible(true);
      }
    } catch (error) {
      message.error('获取标签详情失败');
      console.error('获取标签详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 打开编辑模态框
  const openEditModal = (tag) => {
    setCurrentTag(tag);
    form.setFieldsValue({
      name: tag.name,
      type: tag.type,
      status: tag.status
    });
    setEditModalVisible(true);
  };

  // 打开审核模态框
  const openReviewModal = (tag) => {
    setCurrentTag(tag);
    reviewForm.resetFields();
    setReviewModalVisible(true);
  };

  // 获取标签状态展示
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge status="success" text="已通过" />;
      case 'rejected':
        return <Badge status="error" text="已拒绝" />;
      case 'pending':
        return <Badge status="processing" text="待审核" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <Typography.Link onClick={() => viewTagDetails(id)}>
          {id}
        </Typography.Link>
      )
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (name, record) => (
        <Tooltip title="点击查看详情">
          <Tag
            color={record.type === 'public' ? 'blue' : 'green'}
            style={{ cursor: 'pointer' }}
            onClick={() => viewTagDetails(record.id)}
          >
            {name}
          </Tag>
        </Tooltip>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        type === 'public' ? 
        <Tag color="blue">公共</Tag> : 
        <Tag color="green">私人</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusBadge(status)
    },
    {
      title: '使用次数',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      sorter: true
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: (creator) => (
        creator ? (
          <span>
            <UserOutlined /> {creator.username}
          </span>
        ) : '未知'
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: true,
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              icon={<ExclamationCircleOutlined />} 
              size="small"
              onClick={() => openReviewModal(record)}
            >
              审核
            </Button>
          )}
          
          <Popconfirm
            title="确定要删除此标签吗？"
            description="删除后将无法恢复，且会移除所有文章的此标签关联"
            onConfirm={() => handleDeleteTag(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.tagManagement}>
      <Card title="标签管理" extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            form.resetFields();
            setAddModalVisible(true);
          }}
        >
          添加标签
        </Button>
      }>
        {/* 筛选栏 */}
        <div className={styles.filterBar}>
          <Form layout="inline">
            <Form.Item label="标签名称">
              <Input 
                placeholder="搜索标签" 
                prefix={<SearchOutlined />} 
                onChange={handleSearchInput}
                allowClear
              />
            </Form.Item>
            
            <Form.Item label="类型">
              <Select 
                placeholder="选择类型" 
                style={{ width: 120 }} 
                onChange={(value) => handleFilterChange('type', value)}
                value={filters.type}
                allowClear
              >
                <Option value="public">公共</Option>
                <Option value="private">私人</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="状态">
              <Select 
                placeholder="选择状态" 
                style={{ width: 120 }} 
                onChange={(value) => handleFilterChange('status', value)}
                value={filters.status}
                allowClear
              >
                <Option value="approved">已通过</Option>
                <Option value="pending">待审核</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button onClick={resetFilters}>重置筛选</Button>
            </Form.Item>
          </Form>
        </div>
        
        {/* 标签列表 */}
        <Table 
          columns={columns} 
          dataSource={tags} 
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1100 }}
        />
      </Card>
      
      {/* 添加标签模态框 */}
      <Modal
        title="添加标签"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTag}
        >
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="输入标签名称" maxLength={50} />
          </Form.Item>
          
          <Form.Item
            label="标签类型"
            name="type"
            initialValue="public"
            rules={[{ required: true, message: '请选择标签类型' }]}
          >
            <Select>
              <Option value="public">公共标签</Option>
              <Option value="private">私人标签</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="标签状态"
            name="status"
            initialValue="approved"
            rules={[{ required: true, message: '请选择标签状态' }]}
          >
            <Select>
              <Option value="approved">已通过</Option>
              <Option value="pending">待审核</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认添加
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 编辑标签模态框 */}
      <Modal
        title="编辑标签"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditTag}
        >
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="输入标签名称" maxLength={50} />
          </Form.Item>
          
          <Form.Item
            label="标签类型"
            name="type"
            rules={[{ required: true, message: '请选择标签类型' }]}
          >
            <Select>
              <Option value="public">公共标签</Option>
              <Option value="private">私人标签</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="标签状态"
            name="status"
            rules={[{ required: true, message: '请选择标签状态' }]}
          >
            <Select>
              <Option value="approved">已通过</Option>
              <Option value="pending">待审核</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 审核标签模态框 */}
      <Modal
        title="审核标签"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        {currentTag && (
          <div className={styles.reviewInfo}>
            <p><strong>标签名称:</strong> {currentTag.name}</p>
            <p><strong>标签类型:</strong> {currentTag.type === 'public' ? '公共' : '私人'}</p>
            <p><strong>创建者:</strong> {currentTag.creator?.username || '未知'}</p>
            <p><strong>申请时间:</strong> {moment(currentTag.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        )}
        
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleReviewTag}
        >
          <Form.Item
            label="审核结果"
            name="status"
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Select>
              <Option value="approved">通过</Option>
              <Option value="rejected">拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="审核意见"
            name="reason"
            rules={[
              { 
                required: (reviewForm.getFieldValue('status') === 'rejected'), 
                message: '拒绝时请提供原因' 
              }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入审核意见，拒绝时必填"
              maxLength={200}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交审核
              </Button>
              <Button onClick={() => setReviewModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 标签详情抽屉 */}
      <Drawer
        title="标签详情"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          currentTag && (
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => {
                  setDetailDrawerVisible(false);
                  openEditModal(currentTag);
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除此标签吗？"
                description="删除后将无法恢复，且会移除所有文章的此标签关联"
                onConfirm={() => {
                  handleDeleteTag(currentTag.id);
                  setDetailDrawerVisible(false);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )
        }
      >
        {currentTag && (
          <div className={styles.tagDetail}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Title level={4}>基本信息</Title>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>ID:</Text></Col>
                  <Col span={18}>{currentTag.id}</Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>标签名称:</Text></Col>
                  <Col span={18}>
                    <Tag color={currentTag.type === 'public' ? 'blue' : 'green'}>
                      {currentTag.name}
                    </Tag>
                  </Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>类型:</Text></Col>
                  <Col span={18}>
                    {currentTag.type === 'public' ? '公共标签' : '私人标签'}
                  </Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>状态:</Text></Col>
                  <Col span={18}>{getStatusBadge(currentTag.status)}</Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>使用次数:</Text></Col>
                  <Col span={18}>{currentTag.count || 0}</Col>
                </Row>
              </Col>
              
              <Divider />
              
              <Col span={24}>
                <Title level={4}>创建信息</Title>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>创建者:</Text></Col>
                  <Col span={18}>
                    <span>
                      <UserOutlined /> {currentTag.creator?.username || '未知'}
                      {currentTag.creator?.email && ` (${currentTag.creator.email})`}
                    </span>
                  </Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>创建时间:</Text></Col>
                  <Col span={18}>
                    <ClockCircleOutlined /> {moment(currentTag.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Col>
                </Row>
              </Col>
              
              <Col span={24}>
                <Row>
                  <Col span={6}><Text strong>更新时间:</Text></Col>
                  <Col span={18}>
                    <ClockCircleOutlined /> {moment(currentTag.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Col>
                </Row>
              </Col>
              
              {currentTag.status === 'rejected' && currentTag.reviewReason && (
                <>
                  <Divider />
                  <Col span={24}>
                    <Title level={4}>拒绝原因</Title>
                    <Paragraph>
                      {currentTag.reviewReason}
                    </Paragraph>
                  </Col>
                </>
              )}
              
              {currentTag.status === 'pending' && (
                <Col span={24} style={{ marginTop: 24 }}>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      setDetailDrawerVisible(false);
                      openReviewModal(currentTag);
                    }}
                  >
                    审核此标签
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TagManagement;