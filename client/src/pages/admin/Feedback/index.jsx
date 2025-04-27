import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  Breadcrumb,
  Form,
  Tag,
  Button,
  Radio,
  Input,
  Space,
  message,
  Tooltip,
  Popconfirm,
  Modal
} from 'antd';
import { CheckCircleOutlined, StopOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { 
  getFeedbacksAdminAPI, 
  updateFeedbackStatusAPI, 
  deleteFeedbackAPI 
} from '/src/apis/articles_platform/admin/feedback';

const Feedback = () => {
  // 准备列数据
  const STATUS = {
    pending: <Tag color='warning'>待处理</Tag>,
    processed: <Tag color='success'>已处理</Tag>,
  };

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 150,
      render: (nickname) => nickname || '匿名用户'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
      render: (content) => (
        <>
          {content.length > 50 ? content.substring(0, 50) + '...' : content}
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => STATUS[status]
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 175,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 175,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => showFeedbackDetail(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' ? (
            <Tooltip title="标记为已处理">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'processed')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="标记为待处理">
              <Button
                type="primary"
                shape="circle"
                icon={<StopOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'pending')}
                style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
              />
            </Tooltip>
          )}
          
          <Popconfirm
            title="确定要删除这条反馈吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Tooltip title="删除">
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 查看详情
  const showFeedbackDetail = (feedback) => {
    setCurrentFeedback(feedback);
    setViewModalVisible(true);
  };

  // 反馈表获取
  const [list, setFeedbackList] = useState([]);
  const [count, setCount] = useState(0);
  const loadFeedbacks = async () => {
    try {
      const res = await getFeedbacksAdminAPI(reqData);
      setFeedbackList(res.data.feedbacks);
      setCount(res.data.pagination.total);
    } catch (error) {
      message.error('获取反馈列表失败');
    }
  };

  // 更新状态
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateFeedbackStatusAPI(id, { status });
      message.success(`状态更新成功`);
      loadFeedbacks();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 删除操作
  const handleDelete = async (id) => {
    try {
      await deleteFeedbackAPI(id);
      message.success('反馈删除成功');
      loadFeedbacks();
    } catch (error) {
      message.error('反馈删除失败');
    }
  };

  // 筛选功能
  // 1. 准备参数
  const [reqData, setReqData] = useState({
    content: '',
    status: '9',
    currentPage: 1,
    pageSize: 10
  });

  useEffect(() => {
    // 调用反馈列表获取
    loadFeedbacks();
  }, [reqData]);

  // 2. 获取筛选数据
  const onFinish = (formValue) => {
    // 3. 把表单收集到数据放到参数中(不可变的方式)
    setReqData({
      ...reqData,
      content: formValue.content,
      status: formValue.status,
      currentPage: 1 // 重置为第一页
    });
  };

  // 分页
  const onPageChange = (currentPage, pageSize) => {
    setReqData({
      ...reqData,
      currentPage,
      pageSize
    });
  };

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/admin'}>首页</Link> },
            { title: '留言管理' }
          ]} />
        }
        style={{ marginBottom: 10 }}
      >
        <Form
          initialValues={{ status: '9' }}
          layout='inline'
          onFinish={onFinish}
        >
          <Form.Item label="内容" name="content">
            <Input placeholder="请输入要查询的留言内容" style={{ width: 250 }} />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value="9">全部</Radio>
              <Radio value="0">待处理</Radio>
              <Radio value="1">已处理</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className='search-button'>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={list} 
          pagination={{
            total: count,
            onChange: onPageChange,
            showSizeChanger: true
          }} 
        />
      </Card>

      {/* 查看详情模态框 */}
      <Modal
        title="留言详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentFeedback && (
          <div>
            <p><strong>ID:</strong> {currentFeedback.id}</p>
            <p><strong>昵称:</strong> {currentFeedback.nickname || '匿名用户'}</p>
            <p><strong>状态:</strong> {currentFeedback.status === 'pending' ? '待处理' : '已处理'}</p>
            <p><strong>提交时间:</strong> {moment(currentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p><strong>内容:</strong></p>
            <div style={{ 
              border: '1px solid #f0f0f0', 
              borderRadius: '4px', 
              padding: '8px 12px',
              backgroundColor: '#fafafa',
              whiteSpace: 'pre-wrap'
            }}>
              {currentFeedback.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Feedback;