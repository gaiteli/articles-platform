import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Popconfirm, message, Input } from 'antd';
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
  const [newChannel, setNewChannel] = useState({ name: '', code: '', rank: '' });
  // 更改分类
  const [editingId, setEditingId] = useState(null); // 当前正在编辑的分类 ID
  const [editingChannel, setEditingChannel] = useState({ name: '', code: '', rank: '' })


  /* GET */
  // 获取分类列表
  const fetchChannels = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getChannelsAdminAPI({
        currentPage: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
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
    fetchChannels(pagination);
  };


  /* POST */
  // 新增分类
  const handleAdd = () => {
    setIsAdding(true); // 显示新增输入框
  };

  // 提交新增分类
  const handleSubmit = async () => {
    try {
      // 调用新增分类接口
      const res = await addChannelAdminAPI(newChannel);
      message.success('新增分类成功');
      console.log(res);
      setIsAdding(false); // 隐藏新增输入框
      setNewChannel({ name: '', code: '', rank: '' }); // 清空输入框
      fetchChannels()
    } catch (error) {
      message.error('新增分类失败:' + error);
    }
  };

  // 更新表格数据，呈现输入行
  const dataSource = isAdding
    ? [{ id: '自动分配', isAdding: true, ...newChannel }, ...channels] // 首行新增输入框
    : channels
    ;

  // 取消新增分类
  const handleCancelAdd = () => {
    setIsAdding(false); // 隐藏新增输入框
    setNewChannel({ name: '', code: '', rank: '' }); // 清空输入框
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
      message.error('修改分类失败:' + error);
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
      message.error('删除分类失败:' + error);
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
      render: (text, record) => {
        if (record.isAdding) {
          return (
            <Input
              value={newChannel.name}
              onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
              placeholder="请输入分类名"
            />
          );
        }
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
      render: (code, record) => {
        if (record.isAdding) {
          return (
            <Input
              value={newChannel.code}
              onChange={(e) => setNewChannel({ ...newChannel, code: e.target.value })}
              placeholder="请输入分类编码"
            />
          );
        }
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
      render: (rank, record) => {
        if (record.isAdding) {
          return (
            <Input
              value={newChannel.rank}
              onChange={(e) => setNewChannel({ ...newChannel, rank: e.target.value })}
              placeholder="请输入优先级"
            />
          );
        }
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
      render: (text, record) => {
        if (record.isAdding) {
          return '系统自动填写'
        } else {
          return new Date(text).toLocaleString()
        }
      }
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text, record) => {
        if (record.isAdding) {
          return '系统自动填写'
        } else {
          return new Date(text).toLocaleString()
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => {
        if (record.isAdding) {
          return (
            <>
              <Button type="link" icon={<PlusOutlined />} onClick={handleSubmit}>
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
      {/* 新增按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>
      {/* 表格区域 */}
      <Card >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Channels;