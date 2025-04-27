import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Button, Popconfirm, message, Input, Breadcrumb, Form, Select } from 'antd';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

import {
  getChannelsAdminAPI,
  addChannelAdminAPI,
  updateChannelAdminAPI,
  deleteChannelAdminAPI,
} from '/src/apis/articles_platform/channel';


const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  // 新增分类
  const [isAdding, setIsAdding] = useState(false);
  // const [newChannel, setNewChannel] = useState({ name: '', code: '', rank: '' });
  // 更改分类
  const [editingId, setEditingId] = useState(null); // 当前正在编辑的分类 ID
  const [editingChannel, setEditingChannel] = useState({ name: '', code: '', rank: '' })
  // 新增分类按钮禁用
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false)
  // 筛选 & 排序条件
  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({});


  /* GET */
  // 获取分类列表
  const fetchChannels = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getChannelsAdminAPI({
        currentPage: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        filters: params.filters || filters, // 传递筛选条件
        sorter: params.sorter || sorter, // 传递排序条件
      });
      console.log(res);
      setChannels(res.data.channels);
      setPagination({
        ...pagination,
        total: res.data.pagination.total,
        current: res.data.pagination.currentPage,
        pageSize: res.data.pagination.pageSize,
      });
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载分类列表
  useEffect(() => {
    fetchChannels();
  }, []);

  // 分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchChannels({ ...pagination });
  };

  // 筛选表单提交
  const handleFilterSubmit = (values) => {
    setFilters(values);
    fetchChannels({ current: 1, filters: values, sorter });
  };

  // 排序表单提交
  const handleSorterChange = (value) => {
    setSorter(value);
    fetchChannels({ current: 1, filters, sorter: value });
  };


  /* POST */
  // 新增分类
  const handleAdd = async () => {
    try {
      setIsAddButtonDisabled(true)
      setIsAdding(true); // 显示新增输入框
      const res = await addChannelAdminAPI();
      console.log(res);
      const newChannel = res.data; // 后端返回的新增分类数据

      // 将新增分类插入列表的第一行，并进入编辑模式
      setChannels([newChannel, ...channels]);
      setEditingId(newChannel.id); // 设置编辑状态
      setEditingChannel({ name: newChannel.name, code: newChannel.code, rank: newChannel.rank }); // 设置编辑数据

      message.success('预创建成功，请完善信息');
    } catch (error) {
      message.error('新增分类失败: ' + error.response.data.errors[0]);
      setIsAddButtonDisabled(false)
      setIsAdding(false)
      setEditingId(null)
    }
  };

  // 提交新增分类
  const handleCreateSubmit = async () => {
    try {
      console.log('!!!!!!!!');
      await updateChannelAdminAPI(editingId, editingChannel);
      message.success('创建分类成功');
      fetchChannels(); // 重新加载分类列表
      setIsAdding(false); // 隐藏新增输入框
      setEditingId(null); // 清空编辑状态
      setIsAddButtonDisabled(false)
    } catch (error) {
      message.error('新增分类失败: ' + error.response.data.errors[0]);
    }
  };

  // 取消新增分类
  const handleCancelAdd = async () => {
    setIsAddButtonDisabled(false)
    setIsAdding(false); // 隐藏新增输入框
    // setNewChannel({ name: '', code: '', rank: '' }); // 清空输入框
    console.log(channels);
    await deleteChannelAdminAPI(channels[0].id);
    message.success('取消创建分类成功');
    fetchChannels(); // 重新加载分类列表
  };


  /* UPDATE */
  // 修改分类
  const handleEdit = (record) => {
    setEditingId(record.id); // 设置当前正在编辑的分类 ID
    setEditingChannel({ name: record.name, code: record.code, rank: record.rank }); // 设置当前正在编辑的分类数据
  };

  // 提交修改分类
  const handleUpdateSubmit = async () => {
    try {
      // 调用修改分类接口
      console.log(editingId);
      await updateChannelAdminAPI(editingId, editingChannel);
      message.success('修改分类成功');
      setEditingId(null); // 清空编辑状态
      fetchChannels(); // 重新加载分类列表
    } catch (error) {
      message.error('修改分类失败: ' + error.response.data.errors[0]);
    }
  };

  // 取消修改
  const handleCancelEdit = () => {
    setEditingId(null); // 清空编辑状态
  };


  /* DELETE */
  // 删除分类
  const handleDelete = async (id) => {
    try {
      await deleteChannelAdminAPI(id);
      message.success('删除分类成功');
      fetchChannels(); // 重新加载分类列表
    } catch (error) {
      message.error('删除分类失败: ' + error.response.data.errors[0]);
    }
  };


  // 表格列定义
  const columns = [
    {
      title: '分类 ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '分类名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record, index) => {
        if (record.id === editingId) {
          return (
            <Input
              value={editingChannel.name}
              onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
              placeholder="请输入分类名"
            />
          );
        }
        return text;
      },
    },
    {
      title: '分类编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code, record, index) => {
        if (record.id === editingId) {
          return (
            <Input
              value={editingChannel.code}
              onChange={(e) => setEditingChannel({ ...editingChannel, code: e.target.value })}
              placeholder="请输入分类编码"
            />
          );
        }
        return code;
      },
    },
    {
      title: '优先级',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      render: (rank, record, index) => {
        if (record.id === editingId) {
          return (
            <Input
              value={editingChannel.rank}
              onChange={(e) => setEditingChannel({ ...editingChannel, rank: e.target.value })}
              placeholder="请输入优先级"
            />
          );
        }
        return rank;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record, index) => {
        if (isAdding && record.id === editingId) {
          return (
            <>
              <Button type="link" icon={<PlusOutlined />} onClick={handleCreateSubmit}>
                提交
              </Button>
              <Button type="link" icon={<CloseOutlined />} onClick={handleCancelAdd}>
                取消
              </Button>
            </>
          );
        }
        if (record.id === editingId) {
          return (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={handleUpdateSubmit}>
                提交
              </Button>
              <Button type="link" icon={<CloseOutlined />} onClick={handleCancelEdit}>
                取消
              </Button>
            </>
          );
        }
        return (
          <>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              修改
            </Button>
            <Popconfirm
              title="确定要删除该分类吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      }
    },
  ];

  return (
    <div className={styles.attachmentsPage}>
      {/* */}
      <Card
        title={
          <div className={`${styles.title} flex justify-between align-center`}>
            <Breadcrumb items={[
              { title: <Link to={'/admin'}>首页</Link> },
              { title: '分类列表' },
            ]} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={isAddButtonDisabled}>
              新增分类
            </Button>
          </div>
        }
        style={{ marginBottom: 10 }}
      >
        <Form onFinish={handleFilterSubmit} layout="inline">
          {/* 筛选区域 */}
          <section className={styles.filterFillinArea}>
            <Form.Item name="name" label="分类名" style={{ width: '14rem' }}>
              <Input placeholder="搜索分类名" style={{ width: '10rem' }} />
            </Form.Item>
            <Form.Item name="code" label="分类编码" style={{ width: '9rem' }}>
              <Input style={{ width: '4rem' }} />
            </Form.Item>
            <Form.Item name="rank" label="优先级" style={{ width: '8rem' }}>
              <Input style={{ width: '4rem' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
            </Form.Item>
          </section>

          {/* 排序 */}
          <section className={styles.sorterFillinArea}>
            <Form.Item label="排序" style={{ width: '12rem' }}>
              <Select
                defaultValue='id_desc'
                onChange={handleSorterChange}
                options={[
                  { value: 'id_desc', label: <span>默 认</span> },
                  { value: 'name_asc', label: <span>名称（A-Z）</span> },
                  { value: 'name_desc', label: <span>名称（Z-A）</span> },
                  { value: 'code_asc', label: <span>分类编码（升序）</span> },
                  { value: 'code_desc', label: <span>分类编码（降序）</span> },
                  { value: 'rank_desc', label: <span>优先级（高到低）</span> },
                  { value: 'rank_asc', label: <span>优先级（低到高）</span> },
                  { value: 'createdAt_desc', label: <span>创建时间（最新）</span> },
                  { value: 'createdAt_asc', label: <span>创建时间（最早）</span> },
                  { value: 'updatedAt_desc', label: <span>修改时间（最新）</span> },
                  { value: 'updatedAt_asc', label: <span>修改时间（最早）</span> },
                ]} />
            </Form.Item>
          </section>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={channels}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Channels;